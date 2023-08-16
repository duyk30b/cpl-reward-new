import { BullModule, BullModuleOptions } from '@nestjs/bull'
import { DynamicModule, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import Bull from 'bull'
import redisConfig from '../redis.config'
import {
  GROUP_NOTIFICATION_QUEUE,
  MAIL_COMMAND_QUEUE,
  PERSONAL_NOTIFICATION_QUEUE,
  PUSH_COMMAND_QUEUE,
  USER_FILTER_QUEUE,
} from './bull-queue.variable'
import { BullQueueService } from './bull-queue.service'

const QUEUES: BullModuleOptions[] = [
  { name: MAIL_COMMAND_QUEUE },
  { name: PUSH_COMMAND_QUEUE },
  { name: GROUP_NOTIFICATION_QUEUE },
  { name: PERSONAL_NOTIFICATION_QUEUE },
  { name: USER_FILTER_QUEUE },
]

@Module({})
export class BullQueueModule {
  static forRoot(): DynamicModule {
    return {
      module: BullQueueModule,
      imports: [
        ConfigModule.forFeature(redisConfig),
        BullModule.forRootAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => {
            const bullConfig: Bull.QueueOptions = {
              redis: {
                host: configService.get('redis.host'),
                port: configService.get('redis.port'),
                db: configService.get('redis.db'),
              },
              defaultJobOptions: {
                removeOnComplete: true,
              },
            }
            return bullConfig
          },
          inject: [ConfigService],
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
