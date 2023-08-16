import { MyBaseEntity } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer } from '@lib/util'

@Entity()
export class UserKycCynopsis extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'ocr_status' })
  @Expose({ name: 'ocr_status' })
  ocrStatus: number

  @Column({ name: 'artemis_status' })
  @Expose({ name: 'artemis_status' })
  artemisStatus: number

  @Column({ name: 'history_id' })
  @Expose({ name: 'history_id' })
  historyId: string

  @Column({ name: 'customer_id' })
  @Expose({ name: 'customer_id' })
  customerId: number

  @Column({ name: 'record_id' })
  @Expose({ name: 'record_id' })
  recordId: number

  @Column({ name: 'crp_id' })
  @Expose({ name: 'crp_id' })
  crpId: number

  @Column({ name: 'cynopsis_data', transformer: JsonColumnTransformer() })
  @Expose({ name: 'cynopsis_data' })
  cynopsisData: string

  get hasCynopsisData() {
    return (
      this.customerId &&
      this.recordId &&
      this.crpId &&
      Object.keys(this.cynopsisData).length
    )
  }
}
