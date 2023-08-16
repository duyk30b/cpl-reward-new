import { Module } from '@nestjs/common'
import { ApiCampaignService } from './api-campaign.service'
import { ApiCampaignController } from './api-campaign.controller'
import { RewardModule } from '@lib/grpc-client/reward'
import { RolePermissionModule } from 'libs/role-permission/src/role-permission.module'
import { AbilityModule } from '../ability/ability.module'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    RewardModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiCampaignController],
  providers: [ApiCampaignService],
})
export class ApiCampaignModule {}
