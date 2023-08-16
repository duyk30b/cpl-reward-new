import { registerDecorator, ValidationOptions } from 'class-validator'
import { FixedNumber } from '@ethersproject/bignumber'
export function FixedNumberIsPositive(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'fixedNumberIsPositive',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return !FixedNumber.from(value).isNegative()
        },
      },
    })
  }
}
