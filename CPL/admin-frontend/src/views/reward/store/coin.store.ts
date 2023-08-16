import ApiService from '@/core/services/ApiService'
import { ref } from 'vue'

const loaded = ref(false)

const COINS = ref<string[]>([])

const getData = async () => {
  const response = await ApiService.get('/coin')
  const data = response.data as { coin: string; icon: string; name: string; status: number; networks: any }[]
  COINS.value = data.map((i) => i.coin.toUpperCase())
}

const init = async () => {
  if (!loaded.value) await getData()
  loaded.value = true
}

export const CoinStore = { init, COINS }
