import { ApiProperty } from '@nestjs/swagger'
import { AuthValidationError } from '@lib/util'
import { getEnumComment, getEnumValues } from '@lib/util'
import { KycIdDocumentType } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose } from 'class-transformer'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class CheckDuplicateIdDocumentNoDto {
  @ApiProperty({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  idDocumentNo: string

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
}
