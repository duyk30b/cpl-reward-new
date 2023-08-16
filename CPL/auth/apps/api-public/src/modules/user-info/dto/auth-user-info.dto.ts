import { ApiProperty } from '@nestjs/swagger'
import {
  Gender,
  getEnumComment,
  getEnumValues,
  TransformTrim,
  ZipCodeRequiredConstraint,
} from '@lib/util'
import { AuthValidationError } from '@lib/util'
import { Expose } from 'class-transformer'
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  IsOptional,
  Matches,
  MaxLength,
  MinLength,
  Validate,
  ValidateIf,
} from 'class-validator'
export class AuthUserInfoDto {
  @ApiProperty({ name: 'first_name' })
  @Expose({ name: 'first_name' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  firstName: string

  @ApiProperty({ name: 'last_name' })
  @Expose({ name: 'last_name' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  lastName: string

  @ApiProperty({ name: 'furigana_1' })
  @Expose({ name: 'furigana_1' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  furigana1: string

  @ApiProperty({ name: 'furigana_2' })
  @Expose({ name: 'furigana_2' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  furigana2: string

  @ApiProperty({ example: '2010-01-01' })
  @Expose()
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsISO8601(
    { strict: true },
    {
      message: AuthValidationError.IS_DATE,
    },
  )
  @Matches(/^\d{4}(-)(((0)[0-9])|((1)[0-2]))(-)([0-2][0-9]|(3)[0-1])$/, {
    message: AuthValidationError.IS_DATE,
  })
  birthday: string

  @ApiProperty({ example: '123456789' })
  @Expose()
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @Matches(/^\d+$/, {
    message: AuthValidationError.MATCHES,
  })
  @MinLength(3, { message: AuthValidationError.MIN_LENGTH })
  // @MaxLength(20, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  phone: string

  @ApiProperty({ name: 'phone_country', example: '84' })
  @Expose({ name: 'phone_country' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @Matches(/^[\d\-]+$/, {
    message: AuthValidationError.MATCHES,
  })
  @TransformTrim()
  phoneCountry: string

  @ApiProperty({ name: 'building_room' })
  @Expose({ name: 'building_room' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  buildingRoom: string

  @ApiProperty()
  @Expose()
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  address: string

  @ApiProperty()
  @Expose()
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  city: string

  @ApiProperty({ name: 'state_region' })
  @Expose({ name: 'state_region' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  stateRegion: string

  @ApiProperty({ name: 'zip_code', example: '1111' })
  @Expose({ name: 'zip_code' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  @Validate(ZipCodeRequiredConstraint)
  @MaxLength(255, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  zipCode: string

  @ApiProperty({ name: 'country_id' })
  @Expose({ name: 'country_id' })
  @IsOptional()
  @ValidateIf((obj, value) => !!value)
  countryId: number

  @ApiProperty({ name: 'nationality_id' })
  @Expose({ name: 'nationality_id' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  nationalityId: number

  @ApiProperty({
    description: getEnumComment(Gender),
    enum: getEnumValues(Gender),
  })
  @Expose()
  @IsEnum(getEnumValues(Gender), {
    message: AuthValidationError.IS_ENUM,
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  gender: number
}
