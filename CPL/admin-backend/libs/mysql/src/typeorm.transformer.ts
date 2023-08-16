import { ValueTransformer } from 'typeorm'
import { instanceToPlain, plainToInstance } from 'class-transformer'

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
        value = instanceToPlain(
          plainToInstance(type, value, { ignoreDecorators: true }),
        )
      }
      return JSON.stringify(value || (isArray ? [] : {}))
    },
    from: (value) => {
      let result = JSON.parse(value || (isArray ? '[]' : '{}'))
      if (type) {
        result = plainToInstance(type, result)
      }
      return result
    },
  }
}

export const BooleanColumnTransformer: ValueTransformer = {
  to: (value) => (value == 1 ? true : false),
  from: (value) => (value ? 1 : 0),
}
