import { ApiProperty } from '@nestjs/swagger'
import { CheckBoxValue } from '@lib/util'
import { getEnumValues } from '@lib/util'
import { RejectionReasonDto } from '@lib/user-kyc-admin/dto/rejection-reason.dto'
import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose, Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, ValidateIf, ValidateNested } from 'class-validator'

export class UpdateUserInfoOcrDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({
    enum: [KycStatus.REJECT, KycStatus.PENDING_PAPER, KycStatus.APPROVED_PAPER],
    description: '2 - REJECT, 8 - PENDING_PAPER, 4 - APPROVED_PAPER',
  })
  @Expose()
  @IsNotEmpty()
  @IsEnum([KycStatus.REJECT, KycStatus.PENDING_PAPER, KycStatus.APPROVED_PAPER])
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
  @IsNotEmpty()
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
