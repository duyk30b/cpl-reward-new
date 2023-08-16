import { BullQueueModule } from '@lib/redis'
import { NewBalanceModule } from '@libs/new-balance'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { WorkerSendRewardProcessor } from './worker-send-reward.processor'
import { WorkerSendRewardService } from './worker-send-reward.service'

@Module({
  imports: [BullQueueModule.registerProducer(), RewardHistoryModule, NewBalanceModule],
  providers: [WorkerSendRewardProcessor, WorkerSendRewardService],
})
export class WorkerSendRewardModule {}
