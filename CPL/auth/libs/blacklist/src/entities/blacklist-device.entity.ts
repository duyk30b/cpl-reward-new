import { Expose } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity } from '@lib/util'

@Entity()
export class BlacklistDevice extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('INDEX_DEVICE_ID')
  @Expose({ name: 'device_id' })
  @Column({ name: 'device_id' })
  deviceId: string

  @Column({ nullable: true })
  @Expose()
  note: string

  @Column({ default: 0 })
  @Expose()
  until: number
}
