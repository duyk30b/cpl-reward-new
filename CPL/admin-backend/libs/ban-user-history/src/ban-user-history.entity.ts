import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity, TransformInt } from '@lib/util'
import { STATUS } from '@lib/ban-user-history/ban-user-history.enum'

@Entity({ name: 'ban_user_histories' })
export class BanUserHistory extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id', type: 'bigint' })
  userId: string

  @Column({ nullable: false })
  @Expose()
  email: string

  @Column({ default: STATUS.WAITING })
  @Expose()
  status: number

  @Expose({ name: 'admin_id' })
  @Column({ name: 'admin_id', type: 'bigint' })
  adminId: string

  @Expose({ name: 'admin_action_id' })
  @Column({ name: 'admin_action_id', type: 'bigint' })
  adminActionId: string

  @Expose({ name: 'request_time' })
  @Column({ name: 'request_time', type: 'bigint', default: null })
  @TransformInt()
  requestTime: string

  @Expose({ name: 'ban_time' })
  @Column({ name: 'ban_time', type: 'bigint', default: null })
  @TransformInt()
  banTime: string

  @Expose()
  @Column({ default: null })
  note: string

  @Column({
    name: 'external_response',
    type: 'text',
    default: null,
  })
  @Expose({ name: 'external_response' })
  externalResponse: string
}
