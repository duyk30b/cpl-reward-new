import { Module } from '@nestjs/common'
import { Mt5ConsumerService } from './mt5-consumer.service'
import { Mt5ConsumerController } from './mt5-consumer.controller'
import { ConfigModule } from '@nestjs/config'
import { BullQueueModule } from '@libs/redis'

@Module({
  imports: [ConfigModule, BullQueueModule.registerProducer()],
  controllers: [Mt5ConsumerController],
  providers: [Mt5ConsumerService],
})
export class Mt5ConsumerModule {}
