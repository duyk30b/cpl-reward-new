import { AdminModule } from '@lib/admin'
import { BalanceAccountModule } from '@lib/grpc-client/balance-account/balance-account.module'
import { BalanceHistoryModule } from '@lib/grpc-client/balance-history/balance-history.module'
import { BalanceMonitorModule } from '@lib/grpc-client/balance-monitor/balance-monitor.module'
import { BalanceTransactionModule } from '@lib/grpc-client/balance-transaction/balance-transaction.module'
import { BalanceTransferModule } from '@lib/grpc-client/balance-transfer/balance-transfer.module'
import { CoinSettingModule } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.module'
import { UserModule } from '@lib/grpc-client/user'
import { RolePermissionModule } from '@lib/role-permission'
import { Module } from '@nestjs/common'
import { BalanceAccountController } from './balance-account/balance-account.controller'
import { BalanceAccountService } from './balance-account/balance-account.service'
import { BalanceHistoryController } from './balance-history/balance-history.controller'
import { BalanceHistoryService } from './balance-history/balance-history.service'
import { BalanceMonitorController } from './balance-monitor/balance-monitor.controller'
import { BalanceMonitorService } from './balance-monitor/balance-monitor.service'
import { BalanceTransactionController } from './balance-transaction/balance-transaction.controller'
import { BalanceTransactionService } from './balance-transaction/balance-transaction.service'
import { BalanceTransferController } from './balance-transfer/balance-transfer.controller'
import { BalanceTransferService } from './balance-transfer/balance-transfer.service'
@Module({
  imports: [
    BalanceTransactionModule,
    CoinSettingModule,
    RolePermissionModule,
    AdminModule,
    BalanceAccountModule,
    BalanceTransferModule,
    BalanceHistoryModule,
    BalanceMonitorModule,
    UserModule,
  ],
  controllers: [
    BalanceAccountController,
    BalanceTransactionController,
    BalanceTransferController,
    BalanceHistoryController,
    BalanceMonitorController,
  ],
  providers: [
    BalanceAccountService,
    BalanceTransactionService,
    BalanceTransferService,
    BalanceHistoryService,
    BalanceMonitorService,
  ],
})
export class ApiBalanceModule {}
