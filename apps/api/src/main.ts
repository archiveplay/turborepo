import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from '@tooling/env/server';
import { makeSwagger } from './common/utils/swagger.utils';
import { ZodValidationPipe } from 'nestjs-zod';
import { HttpExceptionFilter } from './common/filters/http.exception.filter';
import { setupCors } from './common/utils/cors.utils';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ZodValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());

  setupCors(app);
  makeSwagger(app);

  await app.listen(env.PORT);
}
bootstrap().catch(console.error);
