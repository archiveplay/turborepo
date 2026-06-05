import * as z from "zod";
// prettier-ignore
export const UserModelSchema = z.object({
    id: z.number().int(),
    email: z.string(),
    name: z.string()
}).strict();

export type UserPureType = z.infer<typeof UserModelSchema>;
