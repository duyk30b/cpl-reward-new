import { Module } from '@nestjs/common'
import { ApiRejectionReasonService } from './api-rejection-reason.service'
import { ApiRejectionReasonController } from './api-rejection-reason.controller'
import { ConfigModule } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    ConfigModule,
    HttpModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiRejectionReasonController],
  providers: [ApiRejectionReasonService],
})
export class ApiRejectionReasonModule {}
