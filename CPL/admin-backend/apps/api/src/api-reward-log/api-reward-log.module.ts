import { Module } from '@nestjs/common'
import { ApiRewardLogService } from './api-reward-log.service'
import { ApiRewardLogController } from './api-reward-log.controller'
import { RewardModule } from '@lib/grpc-client/reward'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { AbilityModule } from '../ability/ability.module'
import { RolePermissionModule } from '@lib/role-permission'

@Module({
  imports: [
    RewardModule,
    AuthorizationModule,
    AdminModule,
    AbilityModule,
    RolePermissionModule,
  ],
  providers: [ApiRewardLogService],
  controllers: [ApiRewardLogController],
})
export class ApiRewardLogModule {}
