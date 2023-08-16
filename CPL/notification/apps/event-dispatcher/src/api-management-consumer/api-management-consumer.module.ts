import { Module } from '@nestjs/common'
import { ApiManagementConsumerService } from './api-management-consumer.service'
import { ApiManagementConsumerController } from './api-management-consumer.controller'
import { ConfigModule } from '@nestjs/config'
import { BullQueueModule } from '@libs/redis'

@Module({
  imports: [ConfigModule, BullQueueModule.registerProducer()],
  controllers: [ApiManagementConsumerController],
  providers: [ApiManagementConsumerService],
})
export class ApiManagementConsumerModule {}
