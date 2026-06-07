import { Global, Module } from '@nestjs/common';
import KeyvRedis from '@keyv/redis';
import { KeyvCacheableMemory } from 'cacheable';
import { env } from '@tooling/env/server';
import { Cacheable } from 'cacheable';
import { CACHE_CLIENT } from 'src/common/constants/cache.contants';

const cacheStore = {
  provide: CACHE_CLIENT,
  useFactory: async () => {
    const memory = new KeyvCacheableMemory({
      ttl: 5000,
      lruSize: 5000,
    });

    const redis = new KeyvRedis(env.REDIS_URL);

    const cache = new Cacheable({
      primary: memory,
      secondary: redis,
      ttl: env.CACHE_TTL,
    });

    return cache;
  },
};

@Global()
@Module({
  providers: [cacheStore],
  exports: [CACHE_CLIENT],
})
export class CacheModule {}
