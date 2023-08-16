import { Module } from '@nestjs/common'
import { BceConsumerService } from './bce-consumer.service'
import { BceConsumerController } from './bce-consumer.controller'
import { NotificationAggregateModule } from '@libs/notification-aggregate'
import { RedisModule } from '@libs/redis'

@Module({
  imports: [NotificationAggregateModule, RedisModule],
  controllers: [BceConsumerController],
  providers: [BceConsumerService],
})
export class BceConsumerModule {}
