import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from '../common/base.entity'

@Entity({ name: 'mission_event' })
export class MissionEvent extends BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column({ name: 'mission_id' })
  @Expose({ name: 'mission_id' })
  missionId: number

  @Column({ name: 'campaign_id' })
  @Expose({ name: 'campaign_id' })
  campaignId: number

  @Column({ name: 'event_name' })
  @Expose({ name: 'event_name' })
  eventName: string
}
