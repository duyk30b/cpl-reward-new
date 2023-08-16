import { AuthValidationError, getEnumComment, getEnumValues } from '@lib/util'
import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { TutorialStatus, TutorialType } from '@lib/user/enum/user.enum'

export class UpdateTutorialStatusDto {
  @ApiProperty({
    enum: getEnumValues(TutorialType),
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsEnum(getEnumValues(TutorialType), {
    message: AuthValidationError.IS_ENUM,
  })
  @Expose()
  type: TutorialType

  @ApiProperty({
    enum: getEnumValues(TutorialStatus),
    description: getEnumComment(TutorialStatus),
  })
  @IsNotEmpty({
    message: AuthValidationError.REQUIRED,
  })
  @IsEnum(getEnumValues(TutorialStatus), {
    message: AuthValidationError.IS_ENUM,
  })
  @Expose()
  status: TutorialStatus
}
