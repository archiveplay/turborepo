import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { HttpResponse } from '../schemas/http.response.schema';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  HttpResponse<T>
> {
  intercept(
    _: ExecutionContext,
    next: CallHandler,
  ): Observable<HttpResponse<T>> {
    return next.handle().pipe(
      map((data: T): HttpResponse<T> => ({
        success: true,
        data,
      })),
    );
  }
}
