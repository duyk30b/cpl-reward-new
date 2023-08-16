import { Expose } from 'class-transformer'

export class BanHistoryListDto {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  email: string

  @Expose()
  status: number

  @Expose({ name: 'admin_id' })
  adminId: string

  @Expose({ name: 'admin_action_id' })
  adminActionId: string

  @Expose({ name: 'request_time' })
  requestTime: string

  @Expose({ name: 'ban_time' })
  banTime: string

  @Expose()
  note: string

  @Expose({ name: 'created_at' })
  createdAt: string

  @Expose({ name: 'updated_at' })
  updatedAt: string
}

export class CreateBanHistoryDto {
  @Expose({ name: 'user_id' })
  userId: string

  @Expose()
  email: string

  @Expose({ name: 'admin_id' })
  adminId: string

  @Expose({ name: 'admin_action_id' })
  adminActionId: string

  @Expose({ name: 'request_time' })
  requestTime: string

  @Expose()
  status?: number

  @Expose()
  note?: string
}

export class UpdateBanHistoryDto extends CreateBanHistoryDto {
  @Expose({ name: 'ban_time' })
  banTime?: string

  @Expose({ name: 'external_response' })
  externalResponse?: string
}
