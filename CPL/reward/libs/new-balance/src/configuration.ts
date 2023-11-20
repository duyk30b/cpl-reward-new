import { registerAs } from '@nestjs/config'

export default registerAs('new_balance', () => ({
  grpc_url: process.env.GRPC_BALANCE_URL || 'localhost:6000',
}))
