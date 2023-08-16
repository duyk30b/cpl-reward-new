import { Module } from '@nestjs/common'
import { ApiBalanceConvertService } from './api-balance-convert.service'
import { ApiBalanceConvertController } from './api-balance-convert.controller'
import { BalanceConvertModule } from '@lib/grpc-client/balance-convert/balance-convert.module'

import { AuthorizationModule } from '@lib/authorization'
import { AdminModule } from '@lib/admin'
import { RolePermissionModule } from '@lib/role-permission'
import { AbilityModule } from '../ability/ability.module'

@Module({
  imports: [
    AuthorizationModule,
    AdminModule,
    RolePermissionModule,
    AbilityModule,
    BalanceConvertModule,
  ],
  controllers: [ApiBalanceConvertController],
  providers: [ApiBalanceConvertService],
})
export class ApiBalanceConvertModule {}
