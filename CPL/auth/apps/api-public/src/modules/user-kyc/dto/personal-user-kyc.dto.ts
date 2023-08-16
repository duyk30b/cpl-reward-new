import { ApiProperty } from '@nestjs/swagger'
import { AuthValidationError } from '@lib/util'
import { getEnumComment, getEnumValues } from '@lib/util'
import { KycIdDocumentType } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose } from 'class-transformer'
import {
  ArrayMaxSize,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
} from 'class-validator'
import { TWO_SIDE_DOCUMENT_TYPES } from '@lib/user/const/user-kyc.const'

export class PersonalUserKycDto {
  @ApiProperty({
    name: 'id_document_type',
    description: getEnumComment(KycIdDocumentType),
    enum: getEnumValues(KycIdDocumentType),
  })
  @IsEnum(getEnumValues(KycIdDocumentType), {
    message: AuthValidationError.IS_ENUM,
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose({ name: 'id_document_type' })
  idDocumentType: number

  @ApiProperty({
    name: 'id_document_no',
  })
  @IsOptional()
  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @ApiProperty({ name: 'document_front' })
  @Expose({ name: 'document_front' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  documentFront: string

  @ApiProperty({ name: 'document_back', required: false })
  @Expose({ name: 'document_back' })
  @ValidateIf((o) =>
    TWO_SIDE_DOCUMENT_TYPES.some((type) => o.idDocumentType == type),
  )
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  documentBack: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  selfie: string

  @ApiProperty({
    name: 'addition_documents',
    type: 'array',
    items: {
      type: 'string',
    },
    maxItems: 5,
    required: false,
  })
  @Expose({ name: 'addition_documents' })
  @IsOptional()
  @ArrayMaxSize(5, { message: AuthValidationError.ARRAY_MAX_SIZE })
  additionDocuments: string[]
}
