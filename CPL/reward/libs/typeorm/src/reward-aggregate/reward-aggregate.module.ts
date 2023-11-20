import { IdGeneratorModule } from '@lib/id-generator'
import { Module } from '@nestjs/common'
import { ExchangeModule } from 'libs/exchange'
import { CampaignModule } from '../campaign/campaign.module'
import { MissionModule } from '../mission'
import { MissionEventModule } from '../mission-event'
import { RewardHistoryModule } from '../reward-history'
import { RewardRuleModule } from '../reward-rule'
import { RewardAggregateService } from './reward-aggregate.service'

@Module({
  imports: [
    CampaignModule,
    MissionModule,
    MissionEventModule,
    RewardHistoryModule,
    RewardRuleModule,
    IdGeneratorModule,
    ExchangeModule,
  ],
  providers: [RewardAggregateService],
  exports: [RewardAggregateService],
})
export class RewardAggregateModule {}
