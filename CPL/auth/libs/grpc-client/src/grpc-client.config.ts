import { registerAs } from '@nestjs/config'

const GrpcClientConfig = registerAs('grpc_client', () => ({
  notification: process.env.NOTIFICATION_GRPC_URL,
  setting: process.env.SETTING_GRPC_URL,
  exchangeUrl: process.env.EXCHANGE_GRPC_URL,
  bOUrl: process.env.BO_GRPC_URL,
}))

export default GrpcClientConfig
