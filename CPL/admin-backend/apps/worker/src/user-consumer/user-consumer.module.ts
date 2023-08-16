import { Module } from '@nestjs/common'
import { UserConsumerService } from './user-consumer.service'
import { UserConsumerController } from './user-consumer.controller'
import { ConfigModule } from '@nestjs/config'
import { ExternalBceModule } from '@lib/external-bce'

@Module({
  imports: [ConfigModule, ExternalBceModule],
  controllers: [UserConsumerController],
  providers: [UserConsumerService],
})
export class UserConsumerModule {}
