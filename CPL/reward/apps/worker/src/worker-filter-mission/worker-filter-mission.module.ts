import { BullQueueModule } from '@lib/redis'
import { CampaignModule } from '@libs/typeorm/campaign'
import { RewardAggregateModule } from '@libs/typeorm/reward-aggregate/reward-aggregate.module'
import { MissionModule } from '@libs/typeorm/mission'
import { MissionEventModule } from '@libs/typeorm/mission-event'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { WorkerFilterMissionProcessor } from './worker-filter-mission.processor'
import { WorkerFilterMissionService } from './worker-filter-mission.service'

@Module({
  imports: [
    BullQueueModule.registerConsumer(),
    BullQueueModule.registerProducer(),
    RewardAggregateModule,
    CampaignModule,
    MissionModule,
    MissionEventModule,
    RewardHistoryModule,
  ],
  providers: [WorkerFilterMissionProcessor, WorkerFilterMissionService],
})
export class WorkerFilterMissionModule {}
