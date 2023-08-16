import { Module } from '@nestjs/common'
import { ApiUserKycService } from './api-user-kyc.service'
import { ApiUserKycController } from './api-user-kyc.controller'
import { UserKycModule } from '@lib/grpc-client/user-kyc'
import { AbilityModule } from '../ability/ability.module'
import { RolePermissionModule } from 'libs/role-permission/src'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    UserKycModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiUserKycController],
  providers: [ApiUserKycService],
})
export class ApiUserKycModule {}
