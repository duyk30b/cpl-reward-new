import { AdminModule } from '@lib/admin'
import { AuthorizationModule } from '@lib/authorization'
import { CoinSettingModule } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.module'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { AbilityModule } from '../ability/ability.module'
import { ApiCoinController } from './api-coin.controller'

@Module({
  imports: [
    CoinSettingModule,
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
  ],
  controllers: [ApiCoinController],
})
export class ApiCoinModule {}
