import { NewBalanceModule } from '@libs/new-balance'
import { CampaignModule } from '@libs/typeorm/campaign'
import { MissionModule } from '@libs/typeorm/mission'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { RewardRuleModule } from '@libs/typeorm/reward-rule'
import { Module } from '@nestjs/common'
import { ExchangeModule } from 'libs/exchange'
import { GrpcCampaignController } from './grpc-campaign.controller'
import { GrpcCampaignService } from './grpc-campaign.service'

@Module({
  imports: [
    CampaignModule,
    MissionModule,
    RewardRuleModule,
    RewardHistoryModule,
    ExchangeModule,
    NewBalanceModule,
  ],
  controllers: [GrpcCampaignController],
  providers: [GrpcCampaignService],
})
export class GrpcCampaignModule {}
