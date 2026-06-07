import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { from, of } from 'rxjs';
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

@Injectable()
export class QueryCacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_CLIENT)
    private readonly cache: {
      get: (key: string) => Promise<any>;
      set: (key: string, value: any, ttl?: number) => Promise<any>;
    },
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();

    const key = this.buildKey(req);

    return from(this.cache.get(key)).pipe(
      switchMap((cached) => {
        if (cached !== undefined && cached !== null) {
          return of(cached);
        }

        return next.handle().pipe(
          switchMap(async (result) => {
            if (result === undefined || result === null) return result;

            await this.cache.set(key, result);
            return result;
          }),
        );
      }),
    );
  }

  private buildKey(req: any): string {
    const normalized = this.normalize(req.body);

    const hashed = hash(normalized);

    // route-level isolation is critical
    const route = req.route?.path || req.url || req.originalUrl || 'unknown';

    const key = `qcache:${route}:${hashed}`;

    return key;
  }

  private normalize(body: any) {
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
