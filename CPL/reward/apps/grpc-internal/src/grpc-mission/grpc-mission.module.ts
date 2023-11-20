import { CampaignModule } from '@libs/typeorm/campaign'
import { MissionModule } from '@libs/typeorm/mission'
import { MissionEventModule } from '@libs/typeorm/mission-event'
import { RewardAggregateModule } from '@libs/typeorm/reward-aggregate'
import { RewardRuleModule } from '@libs/typeorm/reward-rule'
import { Module } from '@nestjs/common'
import { GrpcMissionController } from './grpc-mission.controller'
import { GrpcMissionService } from './grpc-mission.service'

@Module({
  imports: [
    CampaignModule,
    MissionModule,
    RewardRuleModule,
    MissionEventModule,
    RewardAggregateModule,
  ],
  controllers: [GrpcMissionController],
  providers: [GrpcMissionService],
})
export class GrpcMissionModule {}
