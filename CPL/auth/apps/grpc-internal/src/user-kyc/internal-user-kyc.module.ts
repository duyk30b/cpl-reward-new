import { Module } from '@nestjs/common'
import { InternalUserKycService } from './internal-user-kyc.service'
import { InternalUserKycController } from './internal-user-kyc.controller'
import { UserModule } from '@lib/user'
import { UserKycCynopsisModule } from '@lib/user-kyc-cynopsis'
import { UploadFileModule } from '@lib/upload-file'
import { UserKycAdminModule } from '@lib/user-kyc-admin'
import { RedisQueueModule } from '@lib/redis-queue'
import { AdminAggregateModule } from '@lib/admin-aggregate'
import { UserKycModule } from '@lib/user-kyc'
import { UserKycRekognitionModule } from '@lib/user-kyc-rekognition'
import { KycProviderModule } from '@lib/kyc-provider'
import { UserKycSumsubModule } from '@lib/user-kyc-sumsub'

@Module({
  imports: [
    UserModule,
    UserKycCynopsisModule,
    UploadFileModule,
    UserKycAdminModule,
    RedisQueueModule,
    AdminAggregateModule,
    UserKycAdminModule,
    UserKycModule,
    UserKycRekognitionModule,
    UserKycSumsubModule,
    KycProviderModule,
  ],
  controllers: [InternalUserKycController],
  providers: [InternalUserKycService],
})
export class InternalUserKycModule {}
