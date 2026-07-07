import { INestApplication } from '@nestjs/common';
import { env } from '@tooling/env/server';

const CORS_ORIGINS = env.CORS_ORIGINS;

const origin = Array.isArray(CORS_ORIGINS)
  ? (CORS_ORIGINS?.split(',').map((item) => item.trim()) ?? [])
  : CORS_ORIGINS;

export const setupCors = (app: INestApplication) => {
  app.enableCors({
    origin,
    methods: 'GET,POST,PUT,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Authorization',
  });
};
