import { Injectable } from '@nestjs/common';
import { UserFindUniqueDto } from 'src/common/dto/user';
import { prisma } from '@pkg/db/client';

@Injectable()
export class UserService {
  async findUnique({ where, select }: UserFindUniqueDto) {
    const user = await prisma.user.findUnique({ where, select });
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      };
    }

    return {
      success: true,
      data: user,
    };
  }
}
