import { Module } from '@nestjs/common'
import { HighLowConsumerService } from './high-low-consumer.service'
import { HighLowConsumerController } from './high-low-consumer.controller'
import { ConfigModule } from '@nestjs/config'
import { NotificationAggregateModule } from '@libs/notification-aggregate'

@Module({
  imports: [ConfigModule, NotificationAggregateModule],
  controllers: [HighLowConsumerController],
  providers: [HighLowConsumerService],
})
export class HighLowConsumerModule {}
