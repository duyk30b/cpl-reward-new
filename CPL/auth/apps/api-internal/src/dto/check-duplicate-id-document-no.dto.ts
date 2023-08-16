import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'

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
