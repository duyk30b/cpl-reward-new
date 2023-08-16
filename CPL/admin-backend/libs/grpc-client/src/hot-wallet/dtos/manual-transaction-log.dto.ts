import { Admin } from '@lib/admin'
import { Expose, Type } from 'class-transformer'
import { BaseEntity } from './base.dto'

export class ManualTransactionLogEntity extends BaseEntity {
  type: string
  action: string

  @Expose({
    name: 'transaction_hash',
    toPlainOnly: true,
  })
  transactionHash: string

  @Expose({
    name: 'retry_id',
    toPlainOnly: true,
  })
  retryId: number

  @Expose({
    name: 'before_status',
    toPlainOnly: true,
  })
  beforeStatus: string

  @Expose({
    name: 'after_status',
    toPlainOnly: true,
  })
  afterStatus: string

  message: string
  symbol: string

  @Expose({
    name: 'chain_code',
    toPlainOnly: true,
  })
  chainCode: string

  @Expose({
    name: 'created_by',
    toPlainOnly: true,
  })
  createdBy: number

  @Expose({
    name: 'process_status',
    toPlainOnly: true,
  })
  processStatus: string

  /**
   * * Overwrite
   */
  @Expose({
    name: 'overwrite_action',
    toPlainOnly: true,
  })
  overwriteAction: string

  @Expose({
    name: 'overwrite_action_by',
    toPlainOnly: true,
  })
  overwriteActionBy: number

  @Expose({
    name: 'overwrite_message',
    toPlainOnly: true,
  })
  overwriteMessage: string

  @Expose({
    name: 'overwrite_created_at',
    toPlainOnly: true,
  })
  overwriteCreatedAt: number

  @Expose({
    name: 'created_admin',
    toPlainOnly: true,
  })
  @Type(() => Admin)
  createdAdmin: Admin

  @Expose({
    name: 'overwrite_admin',
    toPlainOnly: true,
  })
  @Type(() => Admin)
  overwriteAdmin: Admin
}
