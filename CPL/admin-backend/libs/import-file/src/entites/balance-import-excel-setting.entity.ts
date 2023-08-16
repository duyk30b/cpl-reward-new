import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'balance_import_excel_settings' })
export class BalanceImportExcelSettingEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'max_file_amount' })
  @Expose({ name: 'max_file_amount' })
  maxFileAmount: string

  @Column({ name: 'max_line_amount' })
  @Expose({ name: 'max_line_amount' })
  maxLineAmount: string

  @Column({ name: 'remain_amount' })
  @Expose({ name: 'remain_amount' })
  remainAmount: string

  @Column()
  @Expose()
  currency: string

  @Column({ name: 'is_unlimited' })
  @Expose({ name: 'is_unlimited' })
  isUnlimited: boolean
}
