import { Module } from '@nestjs/common'
import { MysqlModule } from '@app/mysql'
import { BanUserHistoryModule } from '@lib/ban-user-history'
import { RejectKycStatusSuccessService } from './services/reject-kyc-status-success.service'
import { UserKycModule } from '@lib/grpc-client/user-kyc'
import { RejectKycStatusDuplicatedService } from './services/reject-kyc-status-duplicated.service'

@Module({
  imports: [MysqlModule, BanUserHistoryModule, UserKycModule],
  providers: [RejectKycStatusSuccessService, RejectKycStatusDuplicatedService],
})
export class CommanderModule {}
