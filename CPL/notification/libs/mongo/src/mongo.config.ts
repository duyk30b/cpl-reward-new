import { registerAs } from '@nestjs/config'

export default registerAs('mongo', () => ({
  host: process.env.MONGO_HOST,
  port: process.env.MONGO_PORT,
  user: process.env.MONGO_USER,
  pass: process.env.MONGO_PASS,
  auth_source: process.env.MONGO_AUTH_SOURCE,
  db: process.env.MONGO_DB || 'notification',
}))
