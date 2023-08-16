import { Environment } from '@lib/util'
import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  env: process.env.ENV || Environment.DEV,
  brokers: [process.env.KAFKA_BROKER],
  group: process.env.KAFKA_GROUP,
  event: {
    user: {
      ban: process.env.KAFKA_USER_BAN_EVENT,
    },
  },
}))
