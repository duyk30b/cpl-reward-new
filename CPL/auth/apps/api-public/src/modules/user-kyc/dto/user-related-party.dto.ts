import { ApiProperty } from '@nestjs/swagger'
import { AuthValidationError } from '@lib/util'
import { Gender } from '@lib/util'
import { getEnumComment, getEnumValues } from '@lib/util'
import { UserRelatedPartyType } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose } from 'class-transformer'
import {
  IsEnum,
  IsISO8601,
  IsNotEmpty,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator'
import { TransformTrim } from '@lib/util'

export class UserRelatedPartyDto {
  @ApiProperty({
    name: 'type',
    description: getEnumComment(UserRelatedPartyType),
    enum: getEnumValues(UserRelatedPartyType),
  })
  @IsEnum(getEnumValues(UserRelatedPartyType), {
    message: AuthValidationError.IS_ENUM,
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @Expose()
  type: number

  @ApiProperty({ name: 'full_name' })
  @Expose({ name: 'full_name' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.INDIVIDUAL)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(100, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  fullName: string

  @ApiProperty()
  @Expose()
  @ValidateIf((o) => o.type == UserRelatedPartyType.INDIVIDUAL)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  nationality: number

  @ApiProperty({ name: 'country_of_residence' })
  @Expose({ name: 'country_of_residence' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.INDIVIDUAL)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  countryOfResidence: number

  @ApiProperty({ name: 'date_of_birth' })
  @Expose({ name: 'date_of_birth' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.INDIVIDUAL)
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
  dateOfBirth: string

  @ApiProperty({
    description: getEnumComment(Gender),
    enum: getEnumValues(Gender),
  })
  @IsEnum(getEnumValues(Gender), {
    message: AuthValidationError.IS_ENUM,
  })
  @Expose()
  @ValidateIf((o) => o.type == UserRelatedPartyType.INDIVIDUAL)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  gender: number

  @ApiProperty({ name: 'add_roles' })
  @Expose({ name: 'add_roles' })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  addRoles: string[]

  @ApiProperty({ name: 'name_of_corporation' })
  @Expose({ name: 'name_of_corporation' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.CORPORATE)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @MaxLength(100, { message: AuthValidationError.MAX_LENGTH })
  @TransformTrim()
  nameOfCorporation: string

  @ApiProperty({ name: 'entity_type' })
  @Expose({ name: 'entity_type' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.CORPORATE)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  entityType: string

  @ApiProperty({ name: 'country_of_incorporation' })
  @Expose({ name: 'country_of_incorporation' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.CORPORATE)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  countryOfIncorporation: number

  @ApiProperty({ name: 'country_of_operations' })
  @Expose({ name: 'country_of_operations' })
  @ValidateIf((o) => o.type == UserRelatedPartyType.CORPORATE)
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  countryOfOperations: number
}
