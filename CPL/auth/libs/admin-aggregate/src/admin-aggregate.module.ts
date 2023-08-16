import { AmazonCognitoModule } from '@lib/amazon-cognito'
import { ArtemisModule } from '@lib/artemis'
import { RedisQueueModule } from '@lib/redis-queue'
import { UploadFileModule } from '@lib/upload-file'
import { UserModule } from '@lib/user'
import { UserKycAdminModule } from '@lib/user-kyc-admin'
import { UserKycCynopsisModule } from '@lib/user-kyc-cynopsis'
import { Module } from '@nestjs/common'
import { AdminAggregateService } from './admin-aggregate.service'
import { UserKycModule } from '@lib/user-kyc'

@Module({
  imports: [
    UserModule,
    UserKycAdminModule,
    RedisQueueModule,
    UserKycCynopsisModule,
    AmazonCognitoModule,
    ArtemisModule,
    UploadFileModule,
    UserKycModule,
  ],
  providers: [AdminAggregateService],
  exports: [AdminAggregateService],
})
export class AdminAggregateModule {}
