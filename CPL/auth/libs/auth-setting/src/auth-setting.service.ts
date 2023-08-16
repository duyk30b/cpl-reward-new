import { RejectionReasonDto } from '@lib/user-kyc-admin/dto/rejection-reason.dto'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToClass } from 'class-transformer'
import { IKycSetting } from './auth-setting.interface'

const KYC_REJECTION_REASON = [
  {
    reason_category_id: -2,
    reason_category_name_en: 'Incomplete of documents and information',
    reason_category_name_ja: '提出書類と登録情報の不備',
    rejection_reason_id: -3,
    rejection_reason_name_en:
      'Please check the submission guideline again before you re-submit for verification.',
    rejection_reason_name_ja:
      '再度ガイドラインをお確かめの上、本人確認書類をご提出ください。',
  },
]

@Injectable()
export class AuthSettingService {
  constructor(private configService: ConfigService) {}

  async getKycSetting(): Promise<IKycSetting> {
    return this.configService.get('kyc')
  }

  async getAutoKycRejectionReason() {
    return plainToClass(RejectionReasonDto, KYC_REJECTION_REASON)
  }
}
