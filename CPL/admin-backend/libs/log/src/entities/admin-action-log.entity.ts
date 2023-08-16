import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'admin_action_log' })
export class AdminActionLog extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'admin_id' })
  @Expose({ name: 'admin_id' })
  adminId: string

  @Column()
  @Expose()
  ip: string

  @Column({ name: 'endpoint' })
  @Expose()
  endpoint: string

  @Column({ name: 'method' })
  @Expose()
  method: string

  @Column()
  @Expose()
  request: string

  @Column()
  @Expose()
  response: string

  @Column({ name: 'status_code' })
  @Expose({ name: 'status_code' })
  statusCode: number

  @Column({ name: 'time_processed' })
  @Expose({ name: 'time_processed' })
  timeProcessed: number
}
