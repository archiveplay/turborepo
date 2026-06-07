import { Injectable } from '@nestjs/common';
import { UserFindUniqueReqDto } from 'src/common/dto/user';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique({ where, select }: UserFindUniqueReqDto) {
    const user = await this.prismaService.client.user.findUnique({
      where,
      select,
    });

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
