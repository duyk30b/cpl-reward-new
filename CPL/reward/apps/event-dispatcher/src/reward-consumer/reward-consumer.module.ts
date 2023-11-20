import { BullQueueModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { RewardConsumerController } from './reward-consumer.controller'
import { RewardConsumerService } from './reward-consumer.service'

@Module({
  imports: [BullQueueModule.registerProducer()],
  controllers: [RewardConsumerController],
  providers: [RewardConsumerService],
})
export class RewardConsumerModule {}
