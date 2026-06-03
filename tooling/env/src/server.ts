import { z } from "zod";
import { configDotenv } from "dotenv";

configDotenv();

export const serverEnvSchema = z.object({
  DATABASE_URL: z.url().min(1),
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

export const env = serverEnvSchema.parse(process.env);
