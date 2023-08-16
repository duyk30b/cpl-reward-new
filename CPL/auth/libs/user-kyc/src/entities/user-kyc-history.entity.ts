import { MyBaseEntity } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { JsonColumnTransformer } from '@lib/util'
import { UploadedFile } from '@lib/upload-file/entities/uploaded-file.entity'

@Entity()
export class UserKycHistory extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'user_info_history_id' })
  @Expose({ name: 'user_info_history_id' })
  userInfoHistoryId: string

  @Column({ name: 'enterprise_info_history_id' })
  @Expose({ name: 'enterprise_info_history_id' })
  enterpriseInfoHistoryId: number

  @Column({ name: 'id_document_type' })
  @Expose({ name: 'id_document_type' })
  idDocumentType: number

  @Column()
  @Expose()
  type: number

  @Column({ name: 'image_provider' })
  @Expose({ name: 'image_provider' })
  imageProvider: number

  @Column({ name: 'risk_scan_provider' })
  @Expose({ name: 'risk_scan_provider' })
  riskScanProvider: number

  @Column({
    type: 'text',
    transformer: JsonColumnTransformer({ isArray: true }),
  })
  @Expose()
  files: UploadedFile[]

  @Column()
  @Expose()
  remark: string

  @Column({
    name: 'is_modified_by_user',
  })
  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: boolean

  @Column({
    name: 'modifier_name',
  })
  @Expose({ name: 'modifier_name' })
  modifierName: string

  @Column({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  countryId: number

  @Column({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @Expose({ name: 'user_info_history' })
  userInfoHistory

  @Column({
    name: 'image_providers',
    type: 'varchar',
    transformer: JsonColumnTransformer({ isArray: true }),
  })
  @Expose({ name: 'image_providers' })
  imageProviders: number[]

  @Column({
    name: 'risk_scan_providers',
    type: 'varchar',
    transformer: JsonColumnTransformer({ isArray: true }),
  })
  @Expose({ name: 'risk_scan_providers' })
  riskScanProviders: number[]
}
