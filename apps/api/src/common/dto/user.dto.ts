import { createZodDto } from 'nestjs-zod';
import { UserFindUniqueZodSchema, UserSchema } from '@pkg/db/schemas';

const UserFindUniqueResSchema = UserSchema.pick({
  email: true,
  id: true,
  name: true,
}).partial();

export class UserFindUniqueReqDto extends createZodDto(
  UserFindUniqueZodSchema,
) {}
export class UserFindUniqueResDto extends createZodDto(
  UserFindUniqueResSchema,
) {}
