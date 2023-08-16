import { Module } from '@nestjs/common'
import { ApiBalanceSwapHistoryService } from './api-balance-swap-history.service'
import { ApiBalanceSwapHistoryController } from './api-balance-swap-history.controller'
import { BalanceSwapHistoryModule } from '@lib/grpc-client/balance-swap-history/balance-swap-history.module'

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
    BalanceSwapHistoryModule,
    UserModule,
  ],
  controllers: [ApiBalanceSwapHistoryController],
  providers: [ApiBalanceSwapHistoryService],
})
export class ApiBalanceSwapHistoryModule {}
