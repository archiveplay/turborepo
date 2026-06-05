import * as z from "zod";
export const UserFindUniqueResultSchema = z.nullable(
  z.object({
    id: z.number().int(),
    email: z.string(),
    name: z.string(),
  }),
);
