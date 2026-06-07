import { z } from 'zod';

export const HttpResponseSchema = <T extends z.ZodTypeAny>(schema: T) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: schema,
    }),
    z.object({
      success: z.literal(false),
      error: z.string(),
    }),
  ]);

export type HttpResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
