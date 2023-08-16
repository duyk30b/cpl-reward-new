import { AmazonCognitoModule } from '@lib/amazon-cognito'
import { AmazonRekognitionModule } from '@lib/amazon-rekognition'
import { AresModule } from '@lib/ares'
import { ArtemisModule } from '@lib/artemis'
import { AuthSettingModule } from '@lib/auth-setting'
import { SumsubModule } from '@lib/sumsub'
import { UploadFileModule } from '@lib/upload-file'
import { UserModule } from '@lib/user'
import { UserKycModule } from '@lib/user-kyc'
import { UserKycAdminModule } from '@lib/user-kyc-admin'
import { UserKycCynopsisModule } from '@lib/user-kyc-cynopsis'
import { UserKycRekognitionModule } from '@lib/user-kyc-rekognition'
import { UserKycSumsubModule } from '@lib/user-kyc-sumsub'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import cynopsis from 'config/cynopsis'
import kyc from 'config/kyc'
import { KycProviderService } from './kyc-provider.service'
import { AmazonKycService } from './services/amazon-kyc.service'
import { CynopsisImageKycService } from './services/cynopsis-image-kyc.service'
import { CynopsisRiskKycService } from './services/cynopsis-risk-kyc.service'
import { SumsubKycService } from './services/sumsub-kyc.service'

@Module({
  imports: [
    UserKycModule,
    ConfigModule.forRoot({
      load: [cynopsis, kyc],
    }),
    ArtemisModule,
    AresModule,
    UserModule,
    UserKycCynopsisModule,
    UploadFileModule,
    AmazonCognitoModule,
    AmazonRekognitionModule,
    UserKycRekognitionModule,
    AuthSettingModule,
    AmazonCognitoModule,
    SumsubModule,
    UserKycSumsubModule,
    UserKycAdminModule,
  ],
  providers: [
    KycProviderService,
    AmazonKycService,
    CynopsisImageKycService,
    CynopsisRiskKycService,
    SumsubKycService,
  ],
  exports: [
    KycProviderService,
    AmazonKycService,
    CynopsisImageKycService,
    CynopsisRiskKycService,
    SumsubKycService,
  ],
})
export class KycProviderModule {}
