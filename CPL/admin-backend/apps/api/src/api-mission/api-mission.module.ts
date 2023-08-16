import { Module } from '@nestjs/common'
import { ApiMissionService } from './api-mission.service'
import { ApiMissionController } from './api-mission.controller'
import { MissionModule } from '@lib/grpc-client/mission'
import { AbilityModule } from '../ability/ability.module'
import { RolePermissionModule } from 'libs/role-permission/src'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    MissionModule,
    RolePermissionModule,
    AbilityModule,
  ],
  providers: [ApiMissionService],
  controllers: [ApiMissionController],
})
export class ApiMissionModule {}
