import * as z from "zod";

export const UserScalarFieldEnumSchema = z.enum(["id", "email", "name"]);

export type UserScalarFieldEnum = z.infer<typeof UserScalarFieldEnumSchema>;
