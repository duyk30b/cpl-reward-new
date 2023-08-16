import { Module } from '@nestjs/common'
import { GrpcAppVersionModule } from '@lib/grpc-client/app-version/app-version.module'
import { ApiAppVersionController } from './api-app-version.controller'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [
    GrpcAppVersionModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiAppVersionController],
})
export class ApiAppVersionModule {}
