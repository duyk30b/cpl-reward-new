import { BullQueueModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { BceConsumerController } from './bce-consumer.controller'
import { BceConsumerService } from './bce-consumer.service'

@Module({
  imports: [BullQueueModule.registerProducer()],
  controllers: [BceConsumerController],
  providers: [BceConsumerService],
})
export class BceConsumerModule {}
