import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { from, of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CACHE_CLIENT } from 'src/common/constants/cache.contants';
import { hash } from 'src/common/utils/hash.utils';

const CACHEABLE_FIELDS = [
  'where',
  'select',
  'include',
  'orderBy',
  'take',
  'skip',
] as const;

type CacheableField = (typeof CACHEABLE_FIELDS)[number];

type CacheBody = Partial<Record<CacheableField, unknown>>;

interface CacheClient {
  get<T = unknown>(key: string): Promise<T | null | undefined>;
  set<T = unknown>(key: string, value: T, ttl?: number): Promise<void>;
}

interface HttpRequest<TBody = unknown> {
  body?: TBody;
  route?: { path?: string };
  url?: string;
  originalUrl?: string;
}

@Injectable()
export class QueryCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_CLIENT)
    private readonly cache: CacheClient,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest<HttpRequest<CacheBody>>();

    const key = this.buildKey(req);

    return from(this.cache.get<unknown>(key)).pipe(
      switchMap((cached) => {
        if (cached != null) {
          return of(cached);
        }

        return next.handle().pipe(
          switchMap((result: unknown) => {
            if (result == null) return of(result);

            return from(this.cache.set(key, result)).pipe(
              switchMap(() => of(result)),
            );
          }),
        );
      }),
    );
  }

  private buildKey(req: HttpRequest<CacheBody>): string {
    const normalized = this.normalize(req.body);

    const hashed = hash(normalized);

    const route = req.route?.path ?? req.url ?? req.originalUrl ?? 'unknown';

    return `qcache:${route}:${hashed}`;
  }

  private normalize(body?: CacheBody): Record<string, unknown> {
    if (!body) return {};

    return Object.fromEntries(
      CACHEABLE_FIELDS.filter((k) => body[k] !== undefined).map((k) => [
        k,
        body[k],
      ]),
    );
  }
}

export const QueryCacheInterceptorProvider = {
  provide: APP_INTERCEPTOR,
  useClass: QueryCacheInterceptor,
};
