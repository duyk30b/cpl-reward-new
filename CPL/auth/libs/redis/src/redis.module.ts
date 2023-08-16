import { RedisService } from './redis.service'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import redis from 'config/redis'
import { RedisModule as IORedisModule } from '@nestjs-modules/ioredis'
import { RedisLockService } from './redis-lock.service'

@Module({
  imports: [
    ConfigModule,
    IORedisModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redis] })],
      useFactory: async (configService: ConfigService) => ({
        config: {
          host: configService.get('redis_config.host'),
          port: configService.get('redis_config.port'),
          db: configService.get('redis_config.db'),
          keyPrefix: 'auth:',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisService, RedisLockService],
  exports: [RedisService, RedisLockService],
})
export class RedisModule {}
