import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigType } from '@nestjs/config'
import Bull from 'bull'
import { RedisConfig } from '../redis.config'
import { BullQueueService } from './bull-queue.service'
import { QUEUE_EVENT } from './bull-queue.variable'

const QUEUES: BullModuleOptions[] = [
  { name: QUEUE_EVENT.FILTER_MISSION },
  {
    name: QUEUE_EVENT.CHECK_CONDITION,
    limiter: { max: 1, duration: 200, groupKey: 'groupKey' },
  },
  {
    name: QUEUE_EVENT.CHECK_BUDGET,
    limiter: { max: 1, duration: 200, groupKey: 'missionId' },
  },
  {
    name: QUEUE_EVENT.SEND_REWARD,
    limiter: { max: 1, duration: 500, groupKey: 'userId' },
  },
  {
    name: QUEUE_EVENT.REWARD_TAG_USER,
    defaultJobOptions: { attempts: 3 },
  },
]

@Module({})
export class BullQueueModule {
  static forRoot(): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [
        BullModule.forRootAsync({
          imports: [ConfigModule.forFeature(RedisConfig)],
          inject: [RedisConfig.KEY],
          useFactory: async (redisConfig: ConfigType<typeof RedisConfig>) => {
            const bullConfig: Bull.QueueOptions = {
              redis: {
                host: redisConfig.host,
                port: redisConfig.port,
                db: +redisConfig.db,
              },
              defaultJobOptions: { removeOnComplete: true },
              prefix: 'reward',
            }
            return bullConfig
          },
        }),
      ],
    }
  }

  static registerProducer(): DynamicModule {
    const base = BullQueueModule.register()
    base.providers = [...(base.providers || []), BullQueueService]
    base.exports = [...(base.exports || []), BullQueueService]
    return base
  }

  static registerConsumer(): DynamicModule {
    return BullQueueModule.register()
  }

  private static register(): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [BullModule.registerQueue(...QUEUES)],
    }
  }
}
