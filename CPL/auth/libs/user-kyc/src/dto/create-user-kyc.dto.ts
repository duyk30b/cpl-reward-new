import { Expose } from 'class-transformer'
import { UploadedFile } from '@lib/upload-file/entities/uploaded-file.entity'

export class CreateUserKycDto {
  @Expose()
  userId: string

  @Expose()
  userKycHistoryId: string

  @Expose()
  idDocumentType: number

  @Expose()
  status: number

  @Expose()
  type: number

  @Expose()
  imageProvider: number

  @Expose()
  riskScanProvider: number

  @Expose()
  files: UploadedFile[]

  @Expose()
  countryId: number
}
