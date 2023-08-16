import { registerDecorator, ValidationOptions } from 'class-validator'
import { isFixedNumberString } from '@app/common/validation/rules/is-fixed-number-string'

export function IsFixedNumberString(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isFixedNumberString',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return isFixedNumberString(value)
        },
      },
    })
  }
}
