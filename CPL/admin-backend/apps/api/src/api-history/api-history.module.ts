import { Module } from '@nestjs/common'
import { ApiHistoryService } from './api-history.service'
import { ApiHistoryController } from './api-history.controller'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'
import { LoginHistoryModule } from '@lib/grpc-client/login-history'
import { EmailChangeHistoryModule } from '@lib/grpc-client/email-change-history'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    LoginHistoryModule,
    RolePermissionModule,
    AbilityModule,
    EmailChangeHistoryModule,
  ],
  controllers: [ApiHistoryController],
  providers: [ApiHistoryService],
})
export class ApiHistoryModule {}
