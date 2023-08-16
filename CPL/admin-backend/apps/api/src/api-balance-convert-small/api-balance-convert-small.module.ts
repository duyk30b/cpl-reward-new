import { Module } from '@nestjs/common'
import { ApiBalanceConvertSmallService } from './api-balance-convert-small.service'
import { ApiBalanceConvertSmallController } from './api-balance-convert-small.controller'
import { BalanceConvertSmallModule } from '@lib/grpc-client/balance-convert-small/balance-convert-small.module'

import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'
import { UserModule } from '@lib/grpc-client/user'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    BalanceConvertSmallModule,
    UserModule,
  ],
  controllers: [ApiBalanceConvertSmallController],
  providers: [ApiBalanceConvertSmallService],
})
export class ApiBalanceConvertSmallModule {}
