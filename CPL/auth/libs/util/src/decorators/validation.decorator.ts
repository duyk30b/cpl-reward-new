import { registerDecorator, ValidationOptions } from 'class-validator'
import { AuthValidationError } from '../formatter/error'
import * as dayjs from 'dayjs'
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'

export function IsFileType(
  validTypes: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isFileType',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: AuthValidationError.IS_FILE_TYPE,
        ...validationOptions,
      },
      validator: {
        validate(value: Express.Multer.File) {
          return !value || validTypes.includes(value.mimetype)
        },
      },
    })
  }
}

export function MaxFileSize(
  maxFileSizeInKb: number,
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'maxFileSize',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [maxFileSizeInKb],
      options: {
        message: AuthValidationError.MAX_FILE_SIZE,
        ...validationOptions,
      },
      validator: {
        validate(value: Express.Multer.File) {
          return !value || value.size < maxFileSizeInKb * 1000
        },
      },
    })
  }
}

export function IsFileExtension(
  validExtensions: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isFileExtension',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: AuthValidationError.IS_FILE_EXTENSION,
        ...validationOptions,
      },
      validator: {
        validate(value: Express.Multer.File) {
          const extension = (value.originalname || '')
            .split('.')
            .pop()
            .toLowerCase()
          return !value || validExtensions.includes(extension)
        },
      },
    })
  }
}

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
        message: AuthValidationError.MAX_DATE,
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

export function StringDateBeforeToday(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'StringDateBeforeToday',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: AuthValidationError.MAX_DATE,
        ...validationOptions,
      },
      constraints: ['TODAY'],
      validator: {
        validate(value: string) {
          return new Date(value).getTime() <= new Date().getTime()
        },
      },
    })
  }
}

export function UserPasswordValidate(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'UserPasswordValidate',
      target: object.constructor,
      propertyName: propertyName,
      options: {
        message: AuthValidationError.PASSWORD_TOO_WEAK,
        ...validationOptions,
      },
      validator: {
        validate(value: string) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,-./:;<=>?@\[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,-./:;<=>?@\[\\\]^_`{|}~]{8,50}$/.test(
            value,
          )
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
        message: AuthValidationError.IS_EMAIL,
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

@ValidatorConstraint({ name: 'zipCodeRequiredConstraint', async: false })
@Injectable()
export class ZipCodeRequiredConstraint implements ValidatorConstraintInterface {
  constructor(protected readonly configService: ConfigService) {}

  validate(text: string, args: ValidationArguments) {
    const { object, property, constraints } = args
    const countryFieldName = constraints?.[0] || 'nationalityId'
    if (
      object[countryFieldName] !=
      this.configService.get('special_countries.japan')
    ) {
      return true
    }

    return object[property] && object[property].length
  }

  defaultMessage() {
    return AuthValidationError.REQUIRED
  }
}
