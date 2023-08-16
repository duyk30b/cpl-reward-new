import { KycStatus, RiskRating } from '@lib/grpc-client/user'
import { CheckBoxValue, getEnumValues, ValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidateNested,
} from 'class-validator'

export class RejectionReasonDto {
  @ApiProperty({ name: 'reason_category_id' })
  @Expose({ name: 'reason_category_id' })
  @IsNotEmpty()
  reasonCategoryId: number

  @ApiProperty({ name: 'reason_category_name_en' })
  @Expose({ name: 'reason_category_name_en' })
  @IsNotEmpty()
  reasonCategoryNameEn: string

  @ApiProperty({ name: 'reason_category_name_ja' })
  @Expose({ name: 'reason_category_name_ja' })
  @IsNotEmpty()
  reasonCategoryNameJa: string

  @ApiProperty({ name: 'rejection_reason_id' })
  @Expose({ name: 'rejection_reason_id' })
  @IsNotEmpty()
  rejectionReasonId: number

  @ApiProperty({ name: 'rejection_reason_name_en' })
  @Expose({ name: 'rejection_reason_name_en' })
  @IsNotEmpty()
  rejectionReasonNameEn: string

  @ApiProperty({ name: 'rejection_reason_name_ja' })
  @Expose({ name: 'rejection_reason_name_ja' })
  @IsNotEmpty()
  rejectionReasonNameJa: string
}

export class ReviewOcrDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    enum: [KycStatus.REJECT, KycStatus.PENDING_PAPER, KycStatus.ACCEPT],
    description: '2 - REJECT, 8 - PENDING_PAPER, 1 - ACCEPT',
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum([KycStatus.REJECT, KycStatus.PENDING_PAPER, KycStatus.ACCEPT])
  status: number

  @ApiProperty({ name: 'compare_birthday', enum: getEnumValues(CheckBoxValue) })
  @Expose({ name: 'compare_birthday' })
  @IsNotEmpty()
  compareBirthday: boolean

  @ApiProperty({
    name: 'compare_document_type',
    enum: getEnumValues(CheckBoxValue),
  })
  @Expose({ name: 'compare_document_type' })
  @IsNotEmpty()
  compareDocumentType: boolean

  @ApiProperty({
    name: 'compare_liveness_selfie',
    enum: getEnumValues(CheckBoxValue),
  })
  @Expose({ name: 'compare_liveness_selfie' })
  @IsNotEmpty()
  compareLivenessSelfie: boolean

  @ApiProperty({ name: 'compare_name', enum: getEnumValues(CheckBoxValue) })
  @Expose({ name: 'compare_name' })
  @IsNotEmpty()
  compareName: boolean

  @ApiProperty({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @ValidateIf((o) => o.status == KycStatus.ACCEPT)
  idDocumentNo: string

  @ApiProperty({
    name: 'rejection_reasons',
    type: [RejectionReasonDto],
    required: false,
  })
  @Expose({ name: 'rejection_reasons' })
  @ValidateNested({ each: true })
  @Type(() => RejectionReasonDto)
  @ValidateIf((o) => o.status == KycStatus.REJECT)
  @IsNotEmpty()
  rejectionReasons: RejectionReasonDto[]
}

export class ReviewRiskDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    enum: [KycStatus.REJECT, KycStatus.PENDING, KycStatus.ACCEPT],
    description: '2 - REJECT, 3 - PENDING, 1 - ACCEPT',
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum([KycStatus.REJECT, KycStatus.PENDING, KycStatus.ACCEPT])
  status: number

  @ApiProperty({
    name: 'risk_rating',
    enum: [
      RiskRating.LOW,
      RiskRating.MEDIUM,
      RiskRating.HIGH,
      RiskRating.UNKNOWN,
    ],
    description: '1 - LOW, 2 - MEDIUM, 3 - HIGH, 4 - UNKNOWN',
  })
  @Expose({ name: 'risk_rating' })
  @IsNotEmpty()
  @IsEnum([
    RiskRating.LOW,
    RiskRating.MEDIUM,
    RiskRating.HIGH,
    RiskRating.UNKNOWN,
  ])
  riskRating: number

  @ApiProperty({
    name: 'rejection_reasons',
    type: [RejectionReasonDto],
    required: false,
  })
  @Expose({ name: 'rejection_reasons' })
  @ValidateNested({ each: true })
  @Type(() => RejectionReasonDto)
  @ValidateIf((o) => o.status == KycStatus.REJECT)
  @IsNotEmpty()
  rejectionReasons: RejectionReasonDto[]
}

export class CheckDuplicateIdDocumentNoDto {
  @ApiProperty({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  @IsNotEmpty()
  idDocumentNo: string

  @ApiProperty({ name: 'id_document_type' })
  @Expose({ name: 'id_document_type' })
  @IsNotEmpty()
  idDocumentType: number

  @ApiProperty({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  @IsNotEmpty()
  countryId: number

  @ApiProperty({ name: 'except_user_id', required: false })
  @Expose({ name: 'except_user_id' })
  @IsOptional()
  exceptUserId: string
}

export class FindRelatedFaceDto {
  @ApiProperty({ name: 'face_id' })
  @Expose({ name: 'face_id' })
  @IsNotEmpty()
  faceId: string

  @ApiProperty({ name: 'except_user_id' })
  @Expose({ name: 'except_user_id' })
  @IsOptional()
  exceptUserId: string

  @ApiProperty()
  @Expose()
  @IsOptional()
  page: number

  @ApiProperty()
  @Expose()
  @IsOptional()
  limit: number
}

export class FindRekognitionInfoHistoryWithUserInfoDto {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ name: 'limit', required: false, example: 20 })
  @Expose({ name: 'limit' })
  limit: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ name: 'face_id', required: false })
  @Expose({ name: 'face_id' })
  faceId: string

  @ApiProperty({ name: 'except_user_id', required: false })
  @Expose({ name: 'except_user_id' })
  exceptUserId: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'
}
