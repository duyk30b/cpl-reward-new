import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { TransformInt } from '@libs/util'

@Entity()
export class DeviceToken {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'device_id' })
  @Expose({ name: 'device_id' })
  deviceId: string

  @Column()
  @Expose()
  token: string

  @Column({ name: 'is_active' })
  @Expose({ name: 'is_active' })
  isActive: boolean

  @Expose({ name: 'refreshed_at' })
  @Column({ name: 'refreshed_at' })
  @TransformInt()
  refreshedAt: number
}
