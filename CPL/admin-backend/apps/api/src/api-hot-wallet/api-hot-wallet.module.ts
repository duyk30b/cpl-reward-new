import { Module } from '@nestjs/common'
import { ApiHotWalletController } from './api-hot-wallet.controller'
import { HotWalletModule } from '@lib/grpc-client/hot-wallet/hot-wallet.module'
import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'
import { ApiHotWalletService } from './api-hot-wallet.service'
import { UserModule } from '@lib/grpc-client/user'
import { WalletBceBackendModule } from '@lib/grpc-client/wallet-bce-backend/wallet-bce-backend.module'

@Module({
  imports: [
    HotWalletModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    UserModule,
    WalletBceBackendModule,
  ],
  controllers: [ApiHotWalletController],
  providers: [ApiHotWalletService],
})
export class ApiHotWalletModule {}
