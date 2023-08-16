import { Module } from '@nestjs/common'
import { ExchangeConsumerService } from './exchange-consumer.service'
import { ExchangeConsumerController } from './exchange-consumer.controller'
import { NotificationAggregateModule } from '@libs/notification-aggregate'
import { RedisModule } from '@libs/redis'

@Module({
  imports: [NotificationAggregateModule, RedisModule],
  controllers: [ExchangeConsumerController],
  providers: [ExchangeConsumerService],
})
export class ExchangeConsumerModule {}
