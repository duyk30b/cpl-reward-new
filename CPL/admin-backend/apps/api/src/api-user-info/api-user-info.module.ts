import { Module } from '@nestjs/common'
import { ApiUserInfoService } from './api-user-info.service'
import { ApiUserInfoController } from './api-user-info.controller'
import { UserInfoModule } from '@lib/grpc-client/user-info'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserInfoModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiUserInfoController],
  providers: [ApiUserInfoService],
})
export class ApiUserInfoModule {}
