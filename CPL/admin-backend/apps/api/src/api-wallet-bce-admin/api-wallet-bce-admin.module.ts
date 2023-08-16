import { Module } from '@nestjs/common'
import { ApiWalletBceAdminController } from './api-wallet-bce-admin.controller'
import { WalletBceAdminModule } from '@lib/grpc-client/wallet-bce-admin/wallet-bce-admin.module'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'
import { ApiWalletBceAdminService } from './api-wallet-bce-admin.service'
import { UserModule } from '@lib/grpc-client/user'
import { UploadFileModule } from '@lib/upload-file'

@Module({
  imports: [
    WalletBceAdminModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    UserModule,
    UploadFileModule,
  ],
  controllers: [ApiWalletBceAdminController],
  providers: [ApiWalletBceAdminService],
})
export class ApiWalletBceAdminModule {}
