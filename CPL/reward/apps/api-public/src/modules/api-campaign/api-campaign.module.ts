import { RedisModule } from '@lib/redis/cache'
import { CheckUserConditionModule } from '@libs/check-user-condition'
import { CampaignModule } from '@libs/typeorm/campaign'
import { RewardAggregateModule } from '@libs/typeorm/reward-aggregate/reward-aggregate.module'
import { CheckInLogModule } from '@libs/typeorm/checkin-log'
import { MissionModule } from '@libs/typeorm/mission'
import { RewardHistoryModule } from '@libs/typeorm/reward-history'
import { Module } from '@nestjs/common'
import { ApiCampaignController } from './api-campaign.controller'
import { ApiCampaignService } from './api-campaign.service'
import { UserModule } from '@app/grpc-client'
import { BullQueueModule } from '@lib/redis'

@Module({
  imports: [
    BullQueueModule.forRoot(),
    BullQueueModule.registerProducer(),
    RedisModule,
    CampaignModule,
    MissionModule,
    RewardHistoryModule,
    CheckInLogModule,
    RewardAggregateModule,
    CheckUserConditionModule,
    UserModule,
  ],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
  exports: [ApiCampaignService],
})
export class ApiCampaignModule {}
