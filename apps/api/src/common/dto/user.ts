import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '@pkg/db/schemas';
import { ResultSchema } from './result';
import { UserFindUniqueZodSchema } from '@pkg/db/schemas';

const UserFindUniqueZodResultSchema = ResultSchema(
  UserSchema.pick({
    email: true,
    id: true,
    name: true,
  }).partial(),
);

export class UserFindUniqueReqDto extends createZodDto(
  UserFindUniqueZodSchema,
) {}
export class UserFindUniqueResDto extends createZodDto(
  UserFindUniqueZodResultSchema,
) {}
