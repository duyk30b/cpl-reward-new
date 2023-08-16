import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { RedisService } from './redis.service'
import redisConfig from '../redis.config'
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis'
import { RedisLockService } from './redis-lock.service'

@Module({
  imports: [
    ConfigModule.forFeature(redisConfig),
    IORedisModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        config: {
          host: configService.get('redis.host'),
          port: configService.get('redis.port'),
          db: configService.get('redis.db'),
          keyPrefix: 'notification:',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService, RedisLockService],
  exports: [RedisService, RedisLockService],
})
export class RedisModule {}
