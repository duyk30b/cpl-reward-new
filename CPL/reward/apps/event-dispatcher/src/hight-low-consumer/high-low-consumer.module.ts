import { BullQueueModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { HighLowConsumerController } from './high-low-consumer.controller'
import { HighLowConsumerService } from './high-low-consumer.service'

@Module({
  imports: [BullQueueModule.registerProducer()],
  controllers: [HighLowConsumerController],
  providers: [HighLowConsumerService],
})
export class HighLowConsumerModule {}
