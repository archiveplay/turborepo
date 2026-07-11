import { configDotenv } from "dotenv";
import z from "zod";

configDotenv();

export const prismaEnvSchema = z.object({
  DATABASE_URL: z.url().min(1),
});

export const env = prismaEnvSchema.parse(process.env);
