import { registerAs } from '@nestjs/config'

export default registerAs('exchange', () => ({
  grpc_url: process.env.EXCHANGE_ORDERBOOK_GRPC_URL || 'localhost:6368',
}))
