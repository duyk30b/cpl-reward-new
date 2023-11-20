import { BullQueueModule } from '@lib/redis'
import { MariadbModule } from '@libs/typeorm/mariadb.module'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GlobalConfig } from 'config/global-config'
import { HealthModule } from './health/health.module'
import { WorkerCheckBudgetModule } from './worker-check-budget/worker-check-budget.module'
import { WorkerCheckConditionModule } from './worker-check-condition/worker-check-condition.module'
import { WorkerFilterMissionModule } from './worker-filter-mission/worker-filter-mission.module'
import { WorkerSendRewardModule } from './worker-send-reward/worker-send-reward.module'
import { RewardTagUserModule } from './worker-reward-tag-user/worker-reward-tag-user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.ENV || 'local'}`, '.env'],
      isGlobal: true,
      load: [GlobalConfig],
    }),
    MariadbModule,
    BullQueueModule.forRoot(),
    HealthModule,
    WorkerFilterMissionModule,
    WorkerCheckConditionModule,
    WorkerCheckBudgetModule,
    WorkerSendRewardModule,
    RewardTagUserModule,
  ],
})
export class WorkerModule {}
