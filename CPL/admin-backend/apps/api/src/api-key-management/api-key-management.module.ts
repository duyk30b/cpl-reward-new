import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { UploadFileModule } from '@lib/upload-file'
import { QueueModule } from '@lib/queue'
import { ApiManagementModule } from '@lib/grpc-client/api-management/api-management.module'
import { ApiKeyManagementService } from './api-key-management.service'
import { ApiKeyManagementController } from './api-key-management.controller'

@Module({
  imports: [
    ApiManagementModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    UploadFileModule,
    QueueModule,
  ],
  providers: [ApiKeyManagementService],
  controllers: [ApiKeyManagementController],
})
export class ApiKeyManagementModule {}
