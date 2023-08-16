import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'
import { ValidationError } from '../formater/error'

export function UserPasswordValidate(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'UserPasswordValidate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: ValidationError.PASSWORD_TOO_WEAK,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%^=*?&.=+~`_-])[A-Za-z\d@$!#%^=*?&.=+~`_-\s]{8,50}$/.test(
            value,
          )
        },
      },
    })
  }
}

export function IsGreaterThan(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'IsGreaterThan',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints
          const relatedValue = (args.object as any)[relatedPropertyName]
          return value > relatedValue
        },
      },
    })
  }
}

export function EmailValidate(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'EmailValidate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: ValidationError.IS_EMAIL,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return /^[a-zA-Z0-9.!#$%&'+\=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]{2,}){1,}$/.test(
            value,
          )
        },
      },
    })
  }
}
