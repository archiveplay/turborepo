import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

type HttpResponse = {
  status: (code: number) => HttpResponse;
  json: (body: unknown) => unknown;
};

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const response = ctx.getResponse<HttpResponse>();

    const status = exception.getStatus();

    response.status(status).json({
      success: false,
      error: exception.message,
    });
  }
}
