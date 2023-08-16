import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function IsFileTypes(
  type: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsFileTypes',
      target: object.constructor,
      propertyName: propertyName,
      constraints: type,
      options: validationOptions,
      validator: {
        validate(value: string, args: ValidationArguments) {
          if (value) {
            const fileType = value.split('.').pop()
            return type.includes(fileType)
          }
          return false
        },
      },
    })
  }
}
