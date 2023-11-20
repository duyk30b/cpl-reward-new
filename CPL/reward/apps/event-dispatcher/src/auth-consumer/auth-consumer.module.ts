import { BullQueueModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { AuthConsumerController } from './auth-consumer.controller'
import { AuthConsumerService } from './auth-consumer.service'

@Module({
  imports: [BullQueueModule.registerProducer()],
  controllers: [AuthConsumerController],
  providers: [AuthConsumerService],
})
export class AuthConsumerModule {}
