import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { CacheModule } from './common/modules/cache.module';

@Module({
  imports: [PrismaModule, CacheModule, UserModule],
})
export class AppModule {}
