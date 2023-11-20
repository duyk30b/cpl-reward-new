import { UserModule } from '@app/grpc-client'
import { BullQueueModule } from '@lib/redis'
import { CheckUserConditionModule } from '@libs/check-user-condition'
import { CampaignModule } from '@libs/typeorm/campaign'
import { MissionModule } from '@libs/typeorm/mission'
import { Module } from '@nestjs/common'
import { WorkerCheckConditionProcessor } from './worker-check-condition.processor'
import { WorkerCheckConditionService } from './worker-check-condition.service'

@Module({
  imports: [
    BullQueueModule.registerConsumer(),
    BullQueueModule.registerProducer(),
    CampaignModule,
    MissionModule,
    UserModule,
    CheckUserConditionModule,
  ],
  providers: [WorkerCheckConditionProcessor, WorkerCheckConditionService],
})
export class WorkerCheckConditionModule {}
