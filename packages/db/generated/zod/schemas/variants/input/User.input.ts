import * as z from "zod";
// prettier-ignore
export const UserInputSchema = z.object({
    id: z.number().int(),
    email: z.string(),
    name: z.string()
}).strict();

export type UserInputType = z.infer<typeof UserInputSchema>;
