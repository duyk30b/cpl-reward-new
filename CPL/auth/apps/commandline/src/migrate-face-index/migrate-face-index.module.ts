import { Module } from '@nestjs/common'
import { MigrateFaceIndexService } from './migrate-face-index.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserKyc } from '@lib/user-kyc/entities/user-kyc.entity'
import { UserKycHistory } from '@lib/user-kyc/entities/user-kyc-history.entity'
import { KycProviderModule } from '@lib/kyc-provider'

@Module({
  imports: [
    TypeOrmModule.forFeature([UserKyc, UserKycHistory]),
    KycProviderModule,
  ],
  providers: [MigrateFaceIndexService],
})
export class MigrateFaceIndexModule {}
