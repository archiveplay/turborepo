import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from '@tooling/env/server';
import { makeSwagger } from './common/utils/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  makeSwagger(app);
  await app.listen(env.PORT);
}
bootstrap().catch(console.error);
