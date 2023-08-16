import { BullQueueModule } from '@lib/redis'
import { MissionModule } from '@libs/typeorm/mission'
import { RewardAggregateModule } from '@libs/typeorm/reward-aggregate/reward-aggregate.module'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { WorkerCheckBudgetProcessor } from './worker-check-budget.processor'
import { WorkerCheckBudgetService } from './worker-check-budget.service'

@Module({
  imports: [
    BullQueueModule.registerConsumer(),
    BullQueueModule.registerProducer(),
    MissionModule,
    RewardHistoryModule,
    RewardAggregateModule,
  ],
  providers: [WorkerCheckBudgetProcessor, WorkerCheckBudgetService],
})
export class WorkerCheckBudgetModule {}
