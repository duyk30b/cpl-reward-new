import { BaseEntityWithCreatedAt } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'

@Entity()
export class EmailCheckLog extends BaseEntityWithCreatedAt {
  @PrimaryGeneratedColumn()
  @Expose()
  id: number

  @Column()
  @Expose()
  email: string

  @Column({ name: 'device_hash' })
  @Expose({ name: 'device_hash' })
  deviceHash: string

  @Column({ name: 'existed_email' })
  @Expose({ name: 'existed_email' })
  existedEmail: string

  @Column()
  @Expose()
  ip: string
}
