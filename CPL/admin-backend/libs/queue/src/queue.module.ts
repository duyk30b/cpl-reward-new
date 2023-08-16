import { Module } from '@nestjs/common'
import { QueueService } from './queue.service'
import { BullModule } from '@nestjs/bull'
import { ConfigModule } from '@nestjs/config'
import redisConfig from '../../../config/redis'
import { WorkerBullOptions } from './options/worker-bull-options.factory'
import { WorkerLanguageOptionsFactory } from './options/worker-language-options.factory'
import {
  PROCESSOR_API_LANGUAGE_QUEUE,
  PROCESSOR_API_USER_QUEUE,
} from './constant'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
    }),
    BullModule.registerQueueAsync({
      name: PROCESSOR_API_USER_QUEUE,
      useClass: WorkerBullOptions,
    }),
    BullModule.registerQueueAsync({
      name: PROCESSOR_API_LANGUAGE_QUEUE,
      useClass: WorkerLanguageOptionsFactory,
    }),
  ],
  providers: [QueueService],
  exports: [QueueService],
})
export class QueueModule {}
