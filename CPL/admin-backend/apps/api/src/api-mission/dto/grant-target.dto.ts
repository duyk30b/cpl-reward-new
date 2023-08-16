import { GRANT_METHOD } from '@lib/grpc-client/mission/mission.enum'
import { ApiProperty } from '@nestjs/swagger'
import BigNumber from 'bignumber.js'
import { Expose } from 'class-transformer'
import {
  IsNotEmpty,
  IsNumberString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'

@ValidatorConstraint({ name: 'ValidateGrantAmountPercent', async: false })
class ValidateGrantAmountPercent implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const amount = new BigNumber(args.value)
    if (!amount.isGreaterThan(0)) return false

    const objectData = args.object as GrantTargetDto
    if (objectData.grantMethod === GRANT_METHOD.PERCENT) {
      return (
        amount.isLessThan(1000) &&
        /^\d{0,999}(\.\d{1,2})?$/.test(objectData.amount)
      )
    }
    return true
  }

  defaultMessage(args: ValidationArguments) {
    const objectData = args.object as GrantTargetDto
    if (objectData.grantMethod === GRANT_METHOD.PERCENT) {
      return 'Percentage must be greater than 0, less than 1000, up to 2 decimal places!'
    } else {
      return 'Amount must be greater than 0'
    }
  }
}

export class GrantTargetDto {
  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  user: string

  @ApiProperty({ type: String, required: true })
  @Expose({ name: 'grant_method' })
  @IsNotEmpty()
  grantMethod: string = GRANT_METHOD.FIXED

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  @IsNumberString()
  @Validate(ValidateGrantAmountPercent)
  amount: string

  @ApiProperty({ type: String, required: true })
  @Expose({ name: 'property_to_calculate_amount' })
  propertyToCalculateAmount = ''

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ type: String, required: true })
  @Expose()
  @IsNotEmpty()
  wallet: string

  @ApiProperty({ type: String, required: false })
  @Expose({ name: 'tag_ids' })
  tagIds: Array<number>
}
