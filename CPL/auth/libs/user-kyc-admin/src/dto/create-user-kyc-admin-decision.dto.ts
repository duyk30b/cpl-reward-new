import { Expose } from 'class-transformer'
import { KycStatus, RiskRating } from '@lib/user-kyc/enum/user-kyc.enum'
import { RejectionReasonDto } from './rejection-reason.dto'

export class CreateUserKycAdminDecisionDto {
  @Expose()
  userId: string

  @Expose()
  userKycHistoryId: string

  @Expose()
  status: KycStatus

  @Expose()
  riskRating?: RiskRating

  @Expose()
  compareDocumentType?: boolean

  @Expose()
  compareLivenessSelfie?: boolean

  @Expose()
  compareBirthday?: boolean

  @Expose()
  compareName?: boolean

  @Expose()
  rejectionReasons?: RejectionReasonDto[]

  @Expose()
  adminId?: string

  @Expose()
  isAuto?: boolean
}
