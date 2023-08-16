import { registerAs } from '@nestjs/config'

export default registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: +process.env.REDIS_PORT,
  db: +process.env.REDIS_DB || 0,
}))
