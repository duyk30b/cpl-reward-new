import { registerAs } from '@nestjs/config'

export default registerAs('grpc_client', () => ({
  auth: process.env.AUTH_GRPC_URL,
}))
