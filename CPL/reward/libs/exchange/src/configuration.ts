import { registerAs } from '@nestjs/config'

export default registerAs('exchange', () => ({
  grpc_url: process.env.GRPC_EXCHANGE_ORDERBOOK_URL || 'localhost:6368',
}))
