import { Expose } from 'class-transformer'

export class CreateUserKycCynopsisDto {
  @Expose()
  ocrStatus: number

  @Expose()
  artemisStatus: number

  @Expose()
  historyId: string

  @Expose()
  customerId: number

  @Expose()
  recordId: number

  @Expose()
  crpId: number

  @Expose()
  cynopsisData: string
}
