import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ValueTransformer } from 'typeorm'

interface IJsonColumnTransformerOprions {
  type?: any
  isArray?: boolean
}

export function JsonColumnTransformer(
  options?: IJsonColumnTransformerOprions,
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
