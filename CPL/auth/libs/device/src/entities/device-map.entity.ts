import { Expose } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity, TransformInt } from '@lib/util'

@Entity()
export class DeviceMap extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Index('INDEX_DEVICE_ID')
  @Expose({ name: 'device_id' })
  @Column({ name: 'device_id' })
  deviceId: string

  @Index('INDEX_USER_ID')
  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Expose({ name: 'last_login' })
  @Column({
    default: null,
    nullable: true,
    name: 'last_login',
  })
  @TransformInt()
  lastLogin: number

  @Expose({ name: 'last_ip' })
  @Column({
    default: null,
    nullable: true,
    name: 'last_ip',
  })
  lastIp: string
}
