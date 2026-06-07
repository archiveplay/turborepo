import { Injectable, NotFoundException } from '@nestjs/common';
import { UserFindUniqueReqDto } from 'src/common/dto/user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(query: UserFindUniqueReqDto) {
    const user = await this.prismaService.client.user.findUnique(query);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
