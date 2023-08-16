import { Expose } from 'class-transformer'
import { UploadedFile } from '@lib/upload-file/entities/uploaded-file.entity'

export class CreateUserKycHistoryDto {
  @Expose()
  userId: string

  @Expose()
  userInfoHistoryId: string

  @Expose()
  enterpriseInfoHistoryId?: number

  @Expose()
  idDocumentType: number

  @Expose()
  type: number

  @Expose()
  imageProvider: number

  @Expose()
  riskScanProvider: number

  @Expose()
  files: UploadedFile[]

  @Expose()
  remark?: string

  @Expose()
  isModifiedByUser: boolean

  @Expose()
  modifierName?: string

  @Expose()
  countryId: number

  @Expose()
  idDocumentNo: string
}
