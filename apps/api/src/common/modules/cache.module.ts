import KeyvRedis from '@keyv/redis';
import { Global, Module } from '@nestjs/common';

import { env } from '@tooling/env/server';
import { KeyvCacheableMemory } from 'cacheable';
import { CACHE_CLIENT } from '../constants/cache.contants';

const cacheStore = {
  provide: CACHE_CLIENT,
  isGlobal: true,
  useFactory: async () => {
    const memory = new KeyvCacheableMemory({
      ttl: 10000,
      lruSize: 5000,
    });

    const redis = new KeyvRedis(env.REDIS_URL);

    return {
      stores: [memory, redis],
      ttl: env.CACHE_TTL,
    };
  },
};

@Global()
@Module({
  providers: [cacheStore],
  exports: [CACHE_CLIENT],
})
export class CacheModule {}
