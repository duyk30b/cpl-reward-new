import { TransformInt } from '@lib/util'
import { Expose } from 'class-transformer'
import { Entity, Column, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm'

@Entity()
export class LoginHistory {
  @PrimaryGeneratedColumn()
  id: string

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Expose({ name: 'device_id' })
  @Column({ name: 'device_id' })
  deviceId: string

  @Expose()
  @Column()
  browser: string

  @Expose()
  @Column()
  os: string

  @Expose()
  @Column()
  ip: string

  @Expose({ name: 'created_at' })
  @Column({ name: 'created_at' })
  @TransformInt()
  createdAt: number

  @BeforeInsert()
  beforeInsert() {
    if (!this.createdAt) {
      this.createdAt = new Date().getTime()
    }
  }
}
