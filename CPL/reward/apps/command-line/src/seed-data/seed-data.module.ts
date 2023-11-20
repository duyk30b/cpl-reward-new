import { Campaign, CampaignModule } from '@libs/typeorm/campaign'
import { Mission, MissionModule } from '@libs/typeorm/mission'
import { MissionEvent } from '@libs/typeorm/mission-event'
import { RewardRule, RewardRuleModule } from '@libs/typeorm/reward-rule'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SeedDataService } from './seed-data.service'
import { CampaignSeed } from './seed/campaign.seed'
import { MissionEventSeed } from './seed/mission-event.seed'
import { MissionSeed } from './seed/mission.seed'
import { RewardRuleSeed } from './seed/reward-rule.seed'

@Module({
  imports: [
    TypeOrmModule.forFeature([Campaign, Mission, RewardRule, MissionEvent]),
    CampaignModule,
    MissionModule,
    RewardRuleModule,
  ],
  providers: [SeedDataService, CampaignSeed, MissionSeed, RewardRuleSeed, MissionEventSeed],
})
export class SeedDataModule {}
