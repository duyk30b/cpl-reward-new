import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import { RedisConfig } from '../redis.config'
import { RedisLockService } from './redis-lock.service'
import { RedisService } from './redis.service'

@Module({
  imports: [
    IORedisModule.forRootAsync({
      imports: [ConfigModule.forFeature(RedisConfig)],
      inject: [RedisConfig.KEY],
      useFactory: async (redisConfig: ConfigType<typeof RedisConfig>) => ({
        config: {
          host: redisConfig.host,
          port: redisConfig.port,
          db: +redisConfig.db,
          keyPrefix: 'reward',
        },
      }),
    }),
  ],
  providers: [RedisService, RedisLockService],
  exports: [RedisService, RedisLockService],
})
export class RedisModule {}
