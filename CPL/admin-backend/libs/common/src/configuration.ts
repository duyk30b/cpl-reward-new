import { registerAs } from '@nestjs/config'
import { Environment } from '@app/common'

export default registerAs('common', () => ({
  env: process.env.APP_ENV || Environment.Local,
  name: process.env.APP_NAME,
  event_dispatcher_port: +process.env.EVENT_DISPATCHER_PORT || 3000,
  public_api_port: +process.env.PUBLIC_API_PORT || 3000,
}))
