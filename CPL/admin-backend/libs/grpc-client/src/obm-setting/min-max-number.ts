import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator'

export function IsNumberRange(
  min: number,
  max: number,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isNumberRange',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [min, max],
      options: validationOptions,
      validator: {
        validate(value: number | string, args: ValidationArguments) {
          if (!isNumeric(value)) return false
          const valueNumber = Number(value)
          const [min, max] = args.constraints
          if (valueNumber < min || valueNumber > max) return false
          return true
        },
      },
    })
  }
}

function isNumeric(str: string | number) {
  if (typeof str != 'string' && typeof str != 'number') return false // we only process strings!
  return (
    !isNaN(+str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(String(str)))
  ) // ...and ensure strings of whitespace fail
}
