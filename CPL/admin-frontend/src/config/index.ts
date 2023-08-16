import axios from 'axios'

export class Config {
  APP_NAME: string
  APP_ENV: string
  APP_URL: string
  API_URL: string
  EXCHANGE_API_URL: string
  ADMIN_V2_URL: string
  CHANNEL_SETUP_ROOT_LINKS: string[]
  TOKEN_WALLET: string
  API_WALLET: string
  CURRENCY_LIST: string[]
  NOT_COIN_LIST: string[]
  PRECISION_LIST: string[]
  OBM_PRECISION_LIST: string[]
  EX_PRECISION_LIST: string[]
  EX_AMOUNT_PRECISION_LIST: string[]
  DECIMAL_LIST: number[]
  SOCKET_MQTT_URL: string
  UPDATE_ORDER_TOPIC: string
  INTERVAL_RELOAD_ORDERBOOK: number
  MARKET_MAKER_PAIR_LIST: string[]
  FE_URL: string
  OBM_MONITOR: string
  DISABLE_DATA_POINT_V1: boolean
  JAPAN_ID: string
}

class ConfigManagement extends Config {
  setConfig(config: Config) {
    this.APP_NAME = config.APP_NAME
    this.APP_ENV = config.APP_ENV
    this.APP_URL = config.APP_URL
    this.API_URL = config.API_URL
    this.EXCHANGE_API_URL = config.EXCHANGE_API_URL
    this.ADMIN_V2_URL = config.ADMIN_V2_URL
    this.CHANNEL_SETUP_ROOT_LINKS = config.CHANNEL_SETUP_ROOT_LINKS
    this.TOKEN_WALLET = config.TOKEN_WALLET
    this.API_WALLET = config.API_WALLET
    this.CURRENCY_LIST = config.CURRENCY_LIST
    this.NOT_COIN_LIST = config.NOT_COIN_LIST
    this.PRECISION_LIST = config.PRECISION_LIST
    this.OBM_PRECISION_LIST = config.OBM_PRECISION_LIST
    this.EX_PRECISION_LIST = config.EX_PRECISION_LIST
    this.EX_AMOUNT_PRECISION_LIST = config.EX_AMOUNT_PRECISION_LIST
    this.DECIMAL_LIST = config.DECIMAL_LIST
    this.SOCKET_MQTT_URL = config.SOCKET_MQTT_URL
    this.UPDATE_ORDER_TOPIC = config.UPDATE_ORDER_TOPIC
    this.INTERVAL_RELOAD_ORDERBOOK = config.INTERVAL_RELOAD_ORDERBOOK
    this.MARKET_MAKER_PAIR_LIST = config.MARKET_MAKER_PAIR_LIST
    this.FE_URL = config.FE_URL
    this.OBM_MONITOR = config.OBM_MONITOR
    this.DISABLE_DATA_POINT_V1 = config.DISABLE_DATA_POINT_V1
    this.JAPAN_ID = config.JAPAN_ID || '1116'
  }
}

const CONFIG = new ConfigManagement()

const getConfigVariables = async () => {
  try {
    const response = await axios.get<Config>(`/config.json`)
    CONFIG.setConfig(response.data)
    return response.data
  } catch (e) {
    const defaultConfig = new Config()
    defaultConfig.APP_NAME = 'bitcastle'
    defaultConfig.APP_ENV = 'development'
    defaultConfig.APP_URL = 'https://admin-frontend.dev.staging-bitcastle.work/'
    defaultConfig.API_URL =
      'admin-v3.dev-bitcastle.work/customer/admin-backend-3/v1/'
    defaultConfig.EXCHANGE_API_URL = 'https://api.dev-bitcastle.work/exchange'
    defaultConfig.ADMIN_V2_URL = 'https://admin-kyc.dev.staging-bitcastle.work/'
    defaultConfig.CHANNEL_SETUP_ROOT_LINKS = []
    defaultConfig.TOKEN_WALLET = 'beac408f-a1b1-482e-a3bc-dfead09dd8e5'
    defaultConfig.API_WALLET = 'admin-v3.dev-bitcastle.work/wallet/v1/'
    defaultConfig.CURRENCY_LIST = ['usdt', 'btc', 'castle']
    defaultConfig.NOT_COIN_LIST = ['usdt', 'usdc', 'busd']
    defaultConfig.PRECISION_LIST = [
      '100',
      '50',
      '10',
      '1',
      '0.1',
      '0.01',
      '0.001',
      '0.0001',
      '0.00001',
      '0.000001',
      '0.0000001',
      '0.00000001',
    ]
    defaultConfig.OBM_PRECISION_LIST = [
      '1',
      '0.1',
      '0.01',
      '0.001',
      '0.0001',
      '0.00001',
      '0.000001',
      '0.0000001',
      '0.00000001',
    ]
    defaultConfig.EX_PRECISION_LIST = [
      '1',
      '0.1',
      '0.01',
      '0.001',
      '0.0001',
      '0.00001',
      '0.000001',
      '0.0000001',
      '0.00000001',
      '0.000000001',
      '0.0000000001',
    ]
    defaultConfig.EX_AMOUNT_PRECISION_LIST = [
      '1',
      '0.1',
      '0.01',
      '0.001',
      '0.0001',
      '0.00001',
      '0.000001',
      '0.0000001',
      '0.00000001',
    ]
    defaultConfig.DECIMAL_LIST = [0, 1, 2, 3, 4, 5, 6, 7, 8]
    defaultConfig.SOCKET_MQTT_URL =
      'wss://dev-cpl-socket.staging-bitcastle.work:8083/mqtt'
    defaultConfig.UPDATE_ORDER_TOPIC = 'private/user/exchange/update_order/#'
    defaultConfig.INTERVAL_RELOAD_ORDERBOOK = 3000
    defaultConfig.MARKET_MAKER_PAIR_LIST = ['coin06/usdt']
    defaultConfig.OBM_MONITOR =
      'https://api.dev-bitcastle.work/obm/monitor-api/v1/'
    defaultConfig.DISABLE_DATA_POINT_V1 = false
    CONFIG.setConfig(defaultConfig)
    return defaultConfig
  }
}

export { getConfigVariables }

export default CONFIG
