import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '@lib/common'
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Transform,
  TransformationType,
} from 'class-transformer'

export class UserCondition {
  @Expose()
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return snakeCaseToCamelCase(value)
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return camelCaseToSnakeCase(value)
    }
    return value
  })
  property?: string

  @Expose()
  operator?: string

  @Expose()
  value?: string

  @Expose()
  type?: string

  static fromPlains(input: Record<string, any>[]): UserCondition[] {
    return plainToInstance(UserCondition, input, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }

  static toPlains(input: UserCondition[]): Record<string, any>[] {
    return instanceToPlain<UserCondition>(input, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }
}
