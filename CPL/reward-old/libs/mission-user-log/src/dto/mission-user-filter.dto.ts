import { Expose } from 'class-transformer'

export class MissionUserFilterDto {
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Expose({ name: 'mission_id' })
  missionId: number

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'success_count' })
  successCount: number

  @Expose({ name: 'user_type' })
  userType: string

  @Expose()
  currency: string

  @Expose()
  wallet: string

  @Expose()
  status: number

  @Expose()
  fromTime: number

  @Expose()
  toTime: number
}
