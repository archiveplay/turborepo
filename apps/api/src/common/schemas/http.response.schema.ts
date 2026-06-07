import { z } from 'zod';

export const HttpResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.object({
    success: z.boolean(),
    data: schema.optional(),
    error: z.string().optional(),
  });
