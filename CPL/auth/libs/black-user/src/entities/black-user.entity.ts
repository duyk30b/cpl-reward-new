import { Expose } from 'class-transformer'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'black_users' })
export class BlackUser extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Expose({ name: 'user_id' })
  @Column({ name: 'user_id' })
  userId: string

  @Expose({ name: 'is_updating' })
  @Column({ name: 'is_updating' })
  isUpdating: number

  @Expose({ name: 'deleted_at' })
  @Column({ name: 'deleted_at' })
  deletedAt: string

  @Expose({ name: 'passed_order_transaction_id' })
  @Column({ name: 'passed_order_transaction_id' })
  passedOrderTransactionId: number
}
