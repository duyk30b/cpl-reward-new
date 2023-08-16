import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../common/base.entity'

@Entity({ name: 'user_checkin_logs' })
export class CheckInLog extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'last_ignore_display' })
  @Expose({ name: 'last_ignore_display' })
  lastIgnoreDisplay: number

  @Column({ name: 'last_checkin' })
  @Expose({ name: 'last_checkin' })
  lastCheckIn: number
}
