import { registerAs } from '@nestjs/config'

export default registerAs('market_maker_order', () => ({
  exchange_target: process.env.MARKET_MAKER_EXCHANGE_TARGET,
  url: process.env.BCE_API_URL,
  time_delay_order_process: process.env.MARKET_MAKER_ORDER_DELAY || 1000,
  start_index_file_order: process.env.START_INDEX_MARKET_MAKER_ORDER || 1,
  start_index_file_data_point: process.env.START_INDEX_MARKET_MAKER || 1,
  external_url: process.env.EXTERNAL_URL,
  external_public_key: process.env.EXTERNAL_PUBLIC_KEY,
  external_secret_key: process.env.EXTERNAL_SECRET_KEY,
}))
