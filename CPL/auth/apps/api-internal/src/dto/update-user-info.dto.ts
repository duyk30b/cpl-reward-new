import { ApiProperty } from '@nestjs/swagger'
import { TransformTrim } from '@lib/util'
import { AuthValidationError } from '@lib/util'
import { Expose } from 'class-transformer'
import {
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
} from 'class-validator'

export class UpdateUserInfoDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @ApiProperty({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  @IsNotEmpty()
  @MaxLength(100)
  @TransformTrim()
  firstName: string

  @ApiProperty({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  @IsNotEmpty()
  @MaxLength(100)
  @TransformTrim()
  lastName: string

  @ApiProperty({ name: 'furigana_1' })
  @Expose({ name: 'furigana_1' })
  @IsOptional()
  @MaxLength(100)
  @TransformTrim()
  furigana1: string

  @ApiProperty({ name: 'furigana_2' })
  @Expose({ name: 'furigana_2' })
  @IsOptional()
  @MaxLength(100)
  @TransformTrim()
  furigana2: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/)
  birthday: string

  @ApiProperty({ name: 'phone_country' })
  @Expose({ name: 'phone_country' })
  @IsNotEmpty()
  @Matches(/^[\d\-]+$/)
  @TransformTrim()
  phoneCountry: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @Matches(/^\d+$/)
  @MaxLength(20)
  @TransformTrim()
  phone: string

  @ApiProperty({ name: 'building_room' })
  @Expose({ name: 'building_room' })
  @IsOptional()
  @MaxLength(100)
  @TransformTrim()
  buildingRoom: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  @MaxLength(100)
  @TransformTrim()
  address: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(100)
  @TransformTrim()
  city: string

  @ApiProperty({ name: 'state_region' })
  @Expose({ name: 'state_region' })
  @IsNotEmpty()
  @MaxLength(100)
  @TransformTrim()
  stateRegion: string

  @ApiProperty({ name: 'zip_code' })
  @Expose({ name: 'zip_code' })
  @IsNotEmpty()
  @Matches(/^\d+$/)
  @MaxLength(32)
  @TransformTrim()
  zipCode: string

  @ApiProperty({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  @IsNotEmpty()
  countryId: number

  @ApiProperty({ name: 'nationality_id' })
  @Expose({ name: 'nationality_id' })
  @IsNotEmpty()
  nationalityId: number

  @ApiProperty()
  @Expose()
  @IsNotEmpty()
  gender: number

  @ApiProperty()
  @Expose()
  @IsOptional()
  remark: string

  @ApiProperty({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  @IsOptional()
  idDocumentNo: string
}
