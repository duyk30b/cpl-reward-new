import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { MyBaseEntity } from '@lib/util'

@Entity({ name: 'balance_import_excel_files' })
export class BalanceImportExcelFileEntity extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'admin_id' })
  @Expose({ name: 'admin_id' })
  adminId: string

  @Column()
  @Expose()
  status: number

  @Column({ name: 'file_name' })
  @Expose({ name: 'file_name' })
  fileName: string

  @Column({ name: 'total_rows' })
  @Expose({ name: 'total_rows' })
  totalRows: number

  @Column({ name: 'failed_rows' })
  @Expose({ name: 'failed_rows' })
  failedRows: number

  @Column({ name: 'balance_type' })
  @Expose({ name: 'balance_type' })
  balanceType: string
}
