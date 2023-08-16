import { TransformTrim, ValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  IsNotEmpty,
  MaxLength,
  IsISO8601,
  Matches,
  ValidateIf,
} from 'class-validator'

export class UpdateUserInfoDto {
  @ApiProperty({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  @MaxLength(255)
  @TransformTrim()
  firstName: string

  @ApiProperty({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  @IsNotEmpty()
  @MaxLength(255)
  @TransformTrim()
  lastName: string

  @ApiProperty({ name: 'furigana_1' })
  @Expose({ name: 'furigana_1' })
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255)
  @TransformTrim()
  furigana1: string

  @ApiProperty({ name: 'furigana_2' })
  @Expose({ name: 'furigana_2' })
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255)
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
  @ValidateIf((obj, value) => !!value)
  @Matches(/^[\d\-]+$/)
  @TransformTrim()
  phoneCountry: string

  @ApiProperty()
  @Expose()
  @ValidateIf((obj, value) => !!value)
  @Matches(/^\d+$/)
  @MaxLength(20)
  @TransformTrim()
  phone: string

  @ApiProperty({ name: 'building_room' })
  @Expose({ name: 'building_room' })
  @ValidateIf((obj, value) => !!value)
  @MaxLength(100)
  @TransformTrim()
  buildingRoom: string

  @ApiProperty()
  @Expose()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(100)
  @TransformTrim()
  address: string

  @ApiProperty()
  @Expose()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(100)
  @TransformTrim()
  city: string

  @ApiProperty({ name: 'state_region' })
  @Expose({ name: 'state_region' })
  @ValidateIf((obj, value) => !!value)
  @MaxLength(100)
  @TransformTrim()
  stateRegion: string

  @ApiProperty({ name: 'zip_code' })
  @Expose({ name: 'zip_code' })
  @ValidateIf((obj, value) => !!value)
  @Matches(/^\d+$/)
  @MaxLength(32)
  @TransformTrim()
  zipCode: string

  @ApiProperty({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  @ValidateIf((obj, value) => !!value)
  countryId: number

  @ApiProperty({ name: 'nationality_id' })
  @Expose({ name: 'nationality_id' })
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  nationalityId: number

  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  gender: number

  @ApiProperty()
  @Expose()
  @ValidateIf((obj, value) => !!value)
  remark: string

  @ApiProperty({ name: 'id_document_no' })
  @Expose({ name: 'id_document_no' })
  @ValidateIf((obj, value) => !!value)
  idDocumentNo: string
}
