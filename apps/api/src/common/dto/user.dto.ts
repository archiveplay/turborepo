import { createZodDto } from 'nestjs-zod';
import { UserSchema } from '@pkg/db/schemas';
import { UserFindUniqueZodSchema } from '@pkg/db/schemas';
import { HttpResponseSchema } from 'src/common/schemas/http.response.schema';

const UserFindUniqueResSchema = HttpResponseSchema(
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
  UserFindUniqueResSchema,
) {}
