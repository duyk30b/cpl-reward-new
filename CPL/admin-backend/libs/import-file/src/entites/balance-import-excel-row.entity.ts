import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'balance_import_excel_rows' })
export class BalanceImportExcelRowEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'import_file_id' })
  @Expose({ name: 'import_file_id' })
  importFileId: string

  @Column({ name: 'row_index' })
  @Expose({ name: 'row_index' })
  rowIndex: string

  @Column()
  @Expose()
  email: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column()
  @Expose()
  currency: string

  @Column()
  @Expose()
  amount: string

  @Column()
  @Expose()
  status: number

  @Column()
  @Expose()
  note: string
}
