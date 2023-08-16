import { Module } from '@nestjs/common'
import { ApiBalanceTransferHistoryService } from './api-balance-transfer-history.service'
import { ApiBalanceTransferHistoryController } from './api-balance-transfer-history.controller'
import { BalanceTransferHistoryModule } from '@lib/grpc-client/balance-transfer-history/balance-transfer-history.module'

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
    BalanceTransferHistoryModule,
    UserModule,
  ],
  controllers: [ApiBalanceTransferHistoryController],
  providers: [ApiBalanceTransferHistoryService],
})
export class ApiBalanceTransferHistoryModule {}
