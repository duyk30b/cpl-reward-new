import { registerDecorator, ValidationOptions } from 'class-validator'
import { EValidationError } from '../variables/error.enum'
import * as dayjs from 'dayjs'

export function MaxDateFromString(
  date: Date,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'MaxDateFromString',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: EValidationError.MAX_DATE,
        ...validationOptions,
      },
      constraints: [dayjs(date).format('YYYY-MM-DD')],
      validator: {
        validate(value: string) {
          return new Date(value).getTime() <= date.getTime()
        },
      },
    })
  }
}
