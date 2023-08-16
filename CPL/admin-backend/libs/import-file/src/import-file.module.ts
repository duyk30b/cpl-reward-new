import { BalanceTransactionModule } from '@lib/grpc-client/balance-transaction/balance-transaction.module'
import { CoinSettingModule } from '@lib/grpc-client/common-setting/coin-setting/coin-setting.module'
import { UserModule } from '@lib/grpc-client/user'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { BalanceImportExcelFileEntity } from './entites/balance-import-excel-file.entity'
import { BalanceImportExcelRowEntity } from './entites/balance-import-excel-row.entity'
import { BalanceImportExcelSettingEntity } from './entites/balance-import-excel-setting.entity'
import { ImportFileService } from './import-file.service'

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      BalanceImportExcelFileEntity,
      BalanceImportExcelRowEntity,
      BalanceImportExcelSettingEntity,
    ]),
    BalanceTransactionModule,
    UserModule,
    CoinSettingModule,
  ],
  providers: [ImportFileService],
  exports: [ImportFileService],
})
export class ImportFileModule {}
