import { CheckUserConditionModule } from '@libs/check-user-condition'
import { CampaignModule } from '@libs/typeorm/campaign'
import { MissionModule } from '@libs/typeorm/mission'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { ApiMissionController } from './api-mission.controller'
import { ApiMissionService } from './api-mission.service'

@Module({
  imports: [CampaignModule, MissionModule, RewardHistoryModule, CheckUserConditionModule],
  controllers: [ApiMissionController],
  providers: [ApiMissionService],
})
export class ApiMissionModule {}
