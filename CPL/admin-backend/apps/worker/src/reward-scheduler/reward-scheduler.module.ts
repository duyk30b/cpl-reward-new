import { AdminModule } from '@lib/admin'
import { RewardModule } from '@lib/grpc-client/reward'
import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { RewardSchedulerService } from './reward-scheduler.service'
import { NotificationModule } from '@lib/grpc-client/notification'
import { ConfigModule } from '@nestjs/config'
import GlobalConfig from 'config/global'

@Module({
  imports: [
    ConfigModule.forFeature(GlobalConfig),
    ScheduleModule.forRoot(),
    RewardModule,
    NotificationModule,
    AdminModule,
  ],
  providers: [RewardSchedulerService],
})
export class RewardSchedulerModule {}
