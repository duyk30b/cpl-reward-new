import { Expose } from 'class-transformer'
import { UploadedFile } from '@lib/upload-file/entities/uploaded-file.entity'
import { RejectionReasonDto } from '@lib/user-kyc-admin/dto/rejection-reason.dto'
import { RiskRating } from '@lib/user-kyc/enum/user-kyc.enum'

export class UpdateUserKycDto {
  @Expose()
  userKycHistoryId?: string

  @Expose()
  type?: number

  @Expose()
  provider?: number

  @Expose()
  idDocumentNo?: string

  @Expose()
  files?: UploadedFile[]

  @Expose()
  idDocumentType?: number

  @Expose()
  status?: number

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
  remark?: string

  @Expose()
  countryId?: number
}
