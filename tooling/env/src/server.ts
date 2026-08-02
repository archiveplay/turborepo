import { z } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

export const serverEnvSchema = z.object({
  DATABASE_URL: z.url().min(1),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  REDIS_URL: z.string().default("redis://localhost:6379"),
  CACHE_TTL: z.coerce.number().default(60000),
  CORS_ORIGINS: z.string().default("*"),
});

export const env = serverEnvSchema.parse(process.env);

// NOTE: app-only secrets do NOT belong in the schema above, because
// `packages/db/prisma.config.ts` imports it and every prisma CLI command would
// then require them. Add them as `serverEnvSchema.extend({...})` parsed from
// the app instead 
