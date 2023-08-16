import { classToPlain, plainToClass } from 'class-transformer'
import { ValueTransformer } from 'typeorm'
import * as dayjs from 'dayjs'

interface IJsonColumnTransformerOptions {
  type?: any
  isArray?: boolean
}

export function JsonColumnTransformer(
  options?: IJsonColumnTransformerOptions,
): ValueTransformer {
  const { isArray, type } = options || {}
  return {
    to: (value) => {
      if (type) {
        value = classToPlain(
          plainToClass(type, value, { ignoreDecorators: true }),
        )
      }
      return JSON.stringify(value || (isArray ? [] : {}))
    },
    from: (value) => {
      let result = JSON.parse(value || (isArray ? '[]' : '{}'))
      if (type) {
        result = plainToClass(type, result)
      }
      return result
    },
  }
}

export const BooleanColumnTransformer: ValueTransformer = {
  to: (value) => (value == 1 ? true : false),
  from: (value) => (value ? 1 : 0),
}

export function DateColumnTransformer(format = 'YYYY-MM-DD'): ValueTransformer {
  return {
    to: (value) => value,
    from: (value) => (value ? dayjs(value).format(format) : value),
  }
}
