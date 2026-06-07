import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { PrismaModule } from './common/modules/prisma/prisma.module';
import { CacheModule } from './common/modules/cache.module';
import { QueryCacheInterceptorProvider } from './common/interceptors/cache/query.cache.intercetptor';

@Module({
  imports: [PrismaModule, CacheModule, UserModule],
  providers: [QueryCacheInterceptorProvider],
})
export class AppModule {}
