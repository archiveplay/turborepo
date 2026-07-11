import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export const TgInitDataZodSchema = z
  .object({
    initData: z.string(),
  })
  .strict();

export class TgInitDataZodDto extends createZodDto(TgInitDataZodSchema) {}
