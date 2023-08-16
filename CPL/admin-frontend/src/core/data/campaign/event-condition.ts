export interface UserConditions {
  value: EventConditionItem[]
}

export default class EventConditionItem {
  eventName = ''
  property = ''
  operator = ''
  value = ''
}
