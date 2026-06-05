import * as z from "zod";
export const UserCreateResultSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  name: z.string(),
});
