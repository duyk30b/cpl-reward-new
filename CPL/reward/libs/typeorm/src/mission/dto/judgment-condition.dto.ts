import { camelCaseToSnakeCase, comparison, snakeCaseToCamelCase } from '@lib/common'
import {
  Expose,
  instanceToPlain,
  plainToInstance,
  Transform,
  TransformationType,
} from 'class-transformer'

export class JudgmentCondition {
  @Expose({ name: 'eventName' })
  eventName: string

  @Expose()
  @Transform(({ value, type }) => {
    if (type === TransformationType.PLAIN_TO_CLASS) {
      return snakeCaseToCamelCase(value)
    } else if (type === TransformationType.CLASS_TO_PLAIN) {
      return camelCaseToSnakeCase(value)
    }
    return value
  })
  property: string

  @Expose()
  operator: string

  @Expose()
  value: string

  @Expose()
  type?: string

  static fromPlains(input: Record<string, any>[]): JudgmentCondition[] {
    return plainToInstance(JudgmentCondition, input, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }

  static toPlains(input: JudgmentCondition[]): Record<string, any>[] {
    return instanceToPlain<JudgmentCondition>(input, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    })
  }
}

export const checkJudgmentConditions = async (
  data: Record<string, any>,
  conditions: JudgmentCondition[],
): Promise<{ error: string[]; pass: boolean }> => {
  const result = { error: [], pass: true }

  conditions.forEach((condition) => {
    const { eventName, property, operator, value, type } = condition

    if (eventName !== data.eventName) {
      result.error.push(`EventName ${eventName} invalid`)
      result.pass = false
    }

    // if (data[property] == null) { // Một số field của kafka dạng optional, nên cứ để so sánh bìnhh thường
    //   result.error.push(`Property "${property}" does not in message`)
    // }

    if (!comparison(data[property], operator, value, type)) {
      result.error.push(
        `Comparison Judgment: ${property} [${type}] ${data[property]} ${operator} ${value} failed !`,
      )
      result.pass = false
    }
  })

  return result
}
