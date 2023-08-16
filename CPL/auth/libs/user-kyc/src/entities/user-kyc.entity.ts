import { MyBaseEntity } from '@lib/util'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import { Expose } from 'class-transformer'
import { BooleanColumnTransformer, JsonColumnTransformer } from '@lib/util'
import { RejectionReasonDto } from '@lib/user-kyc-admin/dto/rejection-reason.dto'
import { UploadedFile } from '@lib/upload-file/entities/uploaded-file.entity'

@Entity()
export class UserKyc extends MyBaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id: string

  @Column({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  userId: string

  @Column({ name: 'user_kyc_history_id' })
  @Expose({ name: 'user_kyc_history_id' })
  userKycHistoryId: string

  @Column({ name: 'id_document_type' })
  @Expose({ name: 'id_document_type' })
  idDocumentType: number

  @Column()
  @Expose()
  status: number

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

  @Column({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @Column({ name: 'risk_rating' })
  @Expose({ name: 'risk_rating' })
  riskRating: string

  @Column({
    name: 'compare_document_type',
    transformer: BooleanColumnTransformer,
  })
  @Expose({ name: 'compare_document_type' })
  compareDocumentType: boolean

  @Column({
    name: 'compare_liveness_selfie',
    transformer: BooleanColumnTransformer,
  })
  @Expose({ name: 'compare_liveness_selfie' })
  compareLivenessSelfie: boolean

  @Column({ name: 'compare_birthday', transformer: BooleanColumnTransformer })
  @Expose({ name: 'compare_birthday' })
  compareBirthday: boolean

  @Column({ name: 'compare_name', transformer: BooleanColumnTransformer })
  @Expose({ name: 'compare_name' })
  compareName: boolean

  @Column({
    name: 'rejection_reasons',
    type: 'text',
    transformer: JsonColumnTransformer({
      isArray: true,
      type: RejectionReasonDto,
    }),
  })
  @Expose({ name: 'rejection_reasons' })
  rejectionReasons: RejectionReasonDto[]

  @Column()
  @Expose()
  remark: string

  @Column({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  countryId: number

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
