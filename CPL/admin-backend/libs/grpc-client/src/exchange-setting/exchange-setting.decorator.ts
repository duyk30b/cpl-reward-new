import { NumberUtil } from '@app/common/number.util'
import { FixedNumber } from '@ethersproject/bignumber'
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator'
import { Constants, MAX_DECIMAL_TOTAL_ROUND } from './constants'

export function IsArrayContainDecimal(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isArrayContainDecimal',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          for (const valueElement of value) {
            if (!Constants.DEFAULT_DECIMAL_LIST.includes(valueElement))
              return false
          }
          return true
        },
      },
    })
  }
}

export function IsDecimalInArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDecimalInArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Constants.DEFAULT_DECIMAL_LIST.includes(value)
        },
      },
    })
  }
}

export function IsAmountDecimalInArray(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDecimalInArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Constants.AMOUNT_DECIMAL_LIST.includes(value)
        },
      },
    })
  }
}

export function IsGreaterThanDecimalOfAmount(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanDecimalOfAmount',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['decimalOfAmount'],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const amountValue = (args.object as any)['decimalOfAmount']

          const decimalOfValue = NumberUtil.getPrecision(value)
          const decimalOfAmount = NumberUtil.getPrecision(amountValue)

          return decimalOfValue <= decimalOfAmount
        },
      },
    })
  }
}

export function IsGreaterThanDecimalOfTotal(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanDecimalOfTotal',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['decimalOfPrice', 'decimalOfAmount'],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const priceValue = (args.object as any)['decimalOfPrice']
          const amountValue = (args.object as any)['decimalOfAmount']

          const decimalOfPrice = NumberUtil.getPrecision(priceValue)
          const decimalOfAmount = NumberUtil.getPrecision(amountValue)
          const decimalOfTotal = NumberUtil.getPrecision(value)
          if (decimalOfPrice + decimalOfAmount > MAX_DECIMAL_TOTAL_ROUND)
            return false
          if (decimalOfTotal > decimalOfPrice + decimalOfAmount) return false

          return true
        },
        defaultMessage(args: ValidationArguments) {
          const priceValue = (args.object as any)['decimalOfPrice']
          const amountValue = (args.object as any)['decimalOfAmount']
          const value = args.value

          const decimalOfPrice = NumberUtil.getPrecision(priceValue)
          const decimalOfAmount = NumberUtil.getPrecision(amountValue)
          const decimalOfTotal = NumberUtil.getPrecision(value)

          if (decimalOfPrice + decimalOfAmount > MAX_DECIMAL_TOTAL_ROUND) {
            return (
              'Total decimal of price and amount cannot over ' +
              MAX_DECIMAL_TOTAL_ROUND
            )
          }
          if (decimalOfTotal > decimalOfPrice + decimalOfAmount) {
            return `Decimal of total cannot over total price of price and amount ${
              decimalOfPrice + decimalOfAmount
            }`
          }
        },
      },
    })
  }
}

export function IsDecimalNumber(
  rightDecimal: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDecimalNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [leftDigits, rightDigits] = value.split('.')

          const leftDigitsLength =
            leftDigits === undefined ? 0 : leftDigits.length
          const rightDigitsLength =
            rightDigits === undefined ? 0 : rightDigits.length

          if (rightDigits !== undefined && rightDigitsLength > rightDecimal)
            return false

          return leftDigitsLength + rightDigitsLength <= 16
        },
      },
    })
  }
}
export function IsTotalDecimalNumber(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isDecimalNumber',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [leftDigits, rightDigits] = value.split('.')

          const leftDigitsLength =
            leftDigits === undefined ? 0 : leftDigits.length
          const rightDigitsLength =
            rightDigits === undefined ? 0 : rightDigits.length
          if (
            rightDigits !== undefined &&
            rightDigitsLength > MAX_DECIMAL_TOTAL_ROUND
          )
            return false

          return leftDigitsLength + rightDigitsLength <= 20
        },
        defaultMessage(args: ValidationArguments) {
          const value = args.value
          const [leftDigits, rightDigits] = value.split('.')

          const leftDigitsLength =
            leftDigits === undefined ? 0 : leftDigits.length
          const rightDigitsLength =
            rightDigits === undefined ? 0 : rightDigits.length

          if (
            rightDigits !== undefined &&
            rightDigitsLength > MAX_DECIMAL_TOTAL_ROUND
          ) {
            return `Total must be less than or equal to ${MAX_DECIMAL_TOTAL_ROUND} decimal places`
          }
          if (leftDigitsLength + rightDigitsLength > 20) {
            return `Total must be less than or equal to 20 digits`
          }
          return 'minimum total was not decimal number'
        },
      },
    })
  }
}

export function IsGreaterThanMinimumAmount(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanMinimumAmount',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['minimumAmount'],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const minimumAmount = (args.object as any)['minimumAmount']

          const fixedValue = FixedNumber.fromString(value)
          const fixedMinimumAmount = FixedNumber.fromString(minimumAmount)
          const subResult = fixedValue.subUnsafe(fixedMinimumAmount)

          return Number(subResult.toString()) >= 0
        },
      },
    })
  }
}

export function IsGreaterThanMinimumTotal(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isGreaterThanMinimumTotal',
      target: object.constructor,
      propertyName: propertyName,
      constraints: ['minimumTotal'],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const minimumTotal = (args.object as any)['minimumTotal']

          const fixedValue = FixedNumber.fromString(value)
          const fixedMinimumTotal = FixedNumber.fromString(minimumTotal)
          const subResult = fixedValue.subUnsafe(fixedMinimumTotal)

          return Number(subResult.toString()) >= 0
        },
      },
    })
  }
}

export function FeeLimit(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'feeLimit',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Min fee = 0.0001 - Max fee = 100 (unit %). FE auto convert from % => value after / 100 (ex: 0.0001 / 100 = 0.000001)
          if (Number(value) === 0) return true
          if (Number(value) >= 0.000001 && Number(value) <= 1) {
            return true
          }
          return false
        },
      },
    })
  }
}
