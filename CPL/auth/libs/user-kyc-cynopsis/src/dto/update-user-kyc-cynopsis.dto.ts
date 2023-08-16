import { Expose } from 'class-transformer'

export class UpdateUserKycCynopsisDto {
  @Expose()
  ocrStatus?: number

  @Expose()
  artemisStatus?: number

  @Expose()
  historyId?: number

  @Expose()
  customerId?: number

  @Expose()
  recordId?: number

  @Expose()
  crpId?: number

  @Expose()
  cynopsisData?: Record<string, unknown>
}
