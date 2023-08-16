import { Expose, Transform } from 'class-transformer'
import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity, parseDeviceInfo } from '@lib/util'

@Entity()
export class Device extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Index('INDEX_UUID')
  @Column({ unique: true })
  uuid: string

  @Index('INDEX_DEVICE_HASH')
  @Expose({ name: 'device_hash' })
  @Column({ unique: true, name: 'device_hash' })
  deviceHash: string

  @Expose({ name: 'device_info' })
  @Column({ type: 'text', name: 'device_info' })
  @Transform((params) => parseDeviceInfo(params.value), { toPlainOnly: true })
  deviceInfo: string
}
