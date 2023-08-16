import { Expose } from 'class-transformer'

export class RekognitionInfoHistoryWithUserInfo {
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'face_id' })
  faceId: string

  @Expose()
  email: string

  @Expose({ name: 'detected_at' })
  detectedAt: number
}
