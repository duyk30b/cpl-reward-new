import { Module } from '@nestjs/common'
import { RedisQueueService } from './redis-queue.service'
import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { ConfigModule, ConfigService } from '@nestjs/config'
import redis from '../../../config/redis'
import {
  EXPORT_USER_QUEUE,
  EXPORT_USER_TAG_QUEUE,
  KYC_QUEUE,
  SUMSUB_QUEUE,
  USER_QUEUE,
} from './redis-queue.variable'

export const QUEUES: BullModuleOptions[] = [
  {
    name: EXPORT_USER_QUEUE,
  },
  {
    name: EXPORT_USER_TAG_QUEUE,
  },
  {
    name: USER_QUEUE,
    limiter: {
      max: 1,
      duration: 500,
      groupKey: 'userId',
    },
  },
  {
    name: KYC_QUEUE,
    limiter: {
      max: 1,
      duration: 500,
      groupKey: 'userId',
    },
  },
  {
    name: SUMSUB_QUEUE,
    limiter: {
      max: 1,
      duration: 30000,
      groupKey: 'userId',
    },
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
    },
  },
]

@Module({
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule.forRoot({ load: [redis] })],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('redis_config.host'),
          port: +configService.get('redis_config.port'),
          db: configService.get('redis_config.db'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
        },
      }),
      inject: [ConfigService],
    }),
    /* List of queue here */
    BullModule.registerQueue(...QUEUES),
  ],
  providers: [RedisQueueService],
  exports: [RedisQueueService],
})
export class RedisQueueModule {}
