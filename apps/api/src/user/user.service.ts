import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  User,
  UserFindUniqueReqDto,
  UserUpdateSchema,
} from 'src/common/dto/user.dto';
import { PrismaService } from 'src/common/modules/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUnique(query: UserFindUniqueReqDto) {
    const user = await this.prismaService.client.user.findUnique(query);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async create(data: User) {
    try {
      const user = await this.prismaService.client.user.upsert({
        where: { id: data.id },
        create: data,
        update: UserUpdateSchema.parse(data),
      });

      console.log('Created:', user);

      return user;
    } catch (e) {
      console.error('UserService create User error', e);
      throw e;
    }
  }
}
