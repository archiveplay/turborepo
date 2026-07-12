import { createZodDto } from 'nestjs-zod';
import { UserFindUniqueZodSchema, UserSchema } from '@pkg/db/schemas';
import z from 'zod';

const UserPublicSchema = UserSchema.pick({
  id: true,
  first_name: true,
  last_name: true,
  username: true,
  photo_url: true,
  allows_write_to_pm: true,
  language_code: true,
});

export type User = z.infer<typeof UserPublicSchema>;

export const UserUpdateSchema = UserSchema.omit({
  id: true,
});

export class UserFindUniqueReqDto extends createZodDto(
  UserFindUniqueZodSchema,
) {}
export class UserFindUniqueResDto extends createZodDto(UserPublicSchema) {}
