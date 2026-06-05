import * as z from "zod";
import type { Prisma } from "@prisma/client";

const makeSchema = () =>
  z
    .object({
      email: z.string(),
      name: z.string(),
    })
    .strict();
export const UserCreateInputObjectSchema: z.ZodType<Prisma.UserCreateInput> =
  makeSchema() as unknown as z.ZodType<Prisma.UserCreateInput>;
export const UserCreateInputObjectZodSchema = makeSchema();
