import { UserTagModule } from '@app/grpc-client/user-tag'
import { BullQueueModule } from '@lib/redis'
import { Module } from '@nestjs/common'
import { RewardTagUserProcessor } from './worker-reward-tag-user.processor'

@Module({
  imports: [BullQueueModule.registerConsumer(), UserTagModule],
  providers: [RewardTagUserProcessor],
})
export class RewardTagUserModule {}
