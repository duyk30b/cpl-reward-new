import { registerAs } from '@nestjs/config'

export default registerAs('grpc_client', () => ({
  auth: process.env.AUTH_GRPC_URL,
  reward: process.env.REWARD_GRPC_URL,
  setting: process.env.SETTING_GRPC_URL,
  notification: process.env.NOTIFICATION_GRPC_URL,
  auto_withdraw: process.env.AUTO_WITHDRAW_URL,
  bo: process.env.BO_GRPC_URL,
  mt5: process.env.MT5_GRPC_URL,
  hot_wallet: process.env.HOT_WALLET_GRPC_URL,
  exchange: process.env.EXCHANGE_GRPC_URL,
  exchange_orderbook: process.env.EXCHANGE_ORDERBOOK_GRPC_URL,
  balance: process.env.BALANCE_GRPC_URL,
  api_management: process.env.API_MANAGEMENT_GRPC_URL,
  market_maker_admin: process.env.MARKET_MAKER_GRPC_URL,
  balance_convert: process.env.BALANCE_CONVERT_GRPC_URL,
  futures_integrate: process.env.FUTURE_INTEGRATE_GRPC_URL,
  grid_trading_service: process.env.GRID_TRADING_SERVICE_GRPC_URL,
  futures_core: process.env.FUTURE_CORE_GRPC_URL,
}))
