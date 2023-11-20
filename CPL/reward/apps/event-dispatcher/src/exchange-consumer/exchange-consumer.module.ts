import { BullQueueModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { ExchangeConsumerController } from './exchange-consumer.controller'
import { ExchangeConsumerService } from './exchange-consumer.service'

@Module({
  imports: [BullQueueModule.registerProducer()],
  controllers: [ExchangeConsumerController],
  providers: [ExchangeConsumerService],
})
export class ExchangeConsumerModule {}
