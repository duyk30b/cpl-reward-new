import { Expose, Transform } from 'class-transformer'

export class JudgmentConditionEntity {
  @Expose({ name: 'event_name' })
  eventName: string

  @Expose()
  property: string

  @Expose()
  operator: string

  @Expose()
  @Transform(({ value }) => String(value))
  value: string

  @Expose()
  type?: string
}

export const ConditionRules = {
  number: {
    operator: [
      {
        key: '==',
        value: '=',
      },
      {
        key: '!=',
        value: '≠',
      },
      {
        key: '>',
        value: '>',
      },
      {
        key: '>=',
        value: '≥',
      },
      {
        key: '<=',
        value: '≤',
      },
      {
        key: '<',
        value: '<',
      },
    ],
    type: 'number',
  },
  unix_timestamp: {
    operator: [
      {
        key: '==',
        value: '=',
      },
      {
        key: '!=',
        value: '≠',
      },
      {
        key: '>',
        value: '>',
      },
      {
        key: '>=',
        value: '≥',
      },
      {
        key: '<=',
        value: '≤',
      },
      {
        key: '<',
        value: '<',
      },
    ],
    type: 'unix_timestamp',
  },
  enum: {
    operator: [
      {
        key: '==',
        value: '=',
      },
      {
        key: '!=',
        value: '≠',
      },
      {
        key: '>',
        value: '>',
      },
      {
        key: '>=',
        value: '≥',
      },
      {
        key: '<=',
        value: '≤',
      },
      {
        key: '<',
        value: '<',
      },
    ],
    type: 'enum',
  },
  boolean: {
    operator: [
      {
        key: '==',
        value: '=',
      },
      {
        key: '!=',
        value: '≠',
      },
    ],
    type: 'boolean',
  },
  string: {
    operator: [
      {
        key: '==',
        value: '=',
      },
      {
        key: '!=',
        value: '≠',
      },
    ],
    type: 'string',
  },
}

export default JudgmentConditionEntity
