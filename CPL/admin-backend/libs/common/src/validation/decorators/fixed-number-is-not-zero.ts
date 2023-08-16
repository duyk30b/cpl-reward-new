import { registerDecorator, ValidationOptions } from 'class-validator'
import { FixedNumber } from '@ethersproject/bignumber'
export function FixedNumberIsNotZero(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'fixedNumberIsNotZero',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return !FixedNumber.from(value).isZero()
        },
      },
    })
  }
}
