import ApiService from '@/core/services/ApiService'
import { ref } from 'vue'

export type TRuleProperties = {
  display: 'enum' | 'number' | 'select' | 'unix_timestamp' | string
  type: 'string' | 'number' | 'unix_timestamp' | 'boolean' | string
  options?: Record<string, any>
  label?: string
  description?: string
}

export type TRules = Record<string, TRuleProperties>

const JudgmentRules = ref<Record<string, TRules>>({})
const DisplayRules = ref<TRules>({})
const UserRules = ref<TRules>({})

const loaded = ref(false)

const getData = async () => {
  const RULES = await Promise.all([
    ApiService.get('/campaign/events'),
    ApiService.get('/campaign/display-conditions'),
    ApiService.get('/campaign/user-conditions'),
  ])

  JudgmentRules.value = (
    RULES[0].data as {
      eventName: string
      properties: (TRuleProperties & { key: string })[]
    }[]
  ).reduce((acc, cur: { eventName: string; properties: (TRuleProperties & { key: string })[] }) => {
    acc[cur.eventName] = cur.properties.reduce((a, c) => {
      a[c.key] = c
      return a
    }, {} as TRules)
    return acc
  }, {} as Record<string, TRules>)

  DisplayRules.value = RULES[1].data.list
  UserRules.value = RULES[2].data.list
}

const init = async () => {
  if (!loaded.value) await getData()
  loaded.value = true
}

export const ConditionRulesStore = { JudgmentRules, DisplayRules, UserRules, init }
