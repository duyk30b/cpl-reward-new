import { registerAs } from '@nestjs/config'

export default registerAs('grpc_client', () => ({
  auth: process.env.GRPC_USER_URL,
}))
