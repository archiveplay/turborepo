import { z } from "zod";

export const viteEnvSchema = z.object({
  VITE_API_URL: z.url(),
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

// @ts-ignore
export const env = viteEnvSchema.parse(import.meta.env);
