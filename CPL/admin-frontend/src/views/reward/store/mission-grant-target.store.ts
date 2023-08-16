import ApiService from '@/core/services/ApiService'
import { ref } from 'vue'

export type TTargetResponse = {
  methods: ({ key: 'fixed'; value: 'Fixed' } | { key: 'percent'; value: 'In Percent' })[]
  propertiesToCalculateAmount: { key: string; value: string }[]
  users: ({ key: 'user'; value: 'User' } | { key: 'referral_user'; value: 'Referral User' })[]
  wallets: (
    | { key: 'DIRECT_BALANCE'; value: 'BALANCE' }
    | { key: 'DIRECT_CASHBACK'; value: 'CASHBACK' }
    | { key: 'DIRECT_REWARD'; value: 'REWARD' }
  )[]
}

const loaded = ref(false)

const TargetRules = ref<TTargetResponse>({
  methods: [],
  propertiesToCalculateAmount: [],
  users: [],
  wallets: [],
})

const getData = async () => {
  const response = await ApiService.get('/campaign/grant-targets')
  TargetRules.value = response.data
}

const init = async () => {
  if (!loaded.value) await getData()
  loaded.value = true
}

export const GrantTargetStore = { TargetRules, init }
