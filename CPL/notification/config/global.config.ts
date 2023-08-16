import { registerAs } from '@nestjs/config'
import { Environment } from '@libs/util/variables/core.enum'

export default registerAs('global', () => ({
  port: +process.env.SERVER_PORT,
  env: process.env.ENV || Environment.DEV,
  url_prepix: process.env.URL_PREFIX,
  sentry_dsn: process.env.SENTRY_DSN,
  bce_url: process.env.BCE_URL,
  bce_internal_secret: process.env.BCE_INTERNAL_SECRET,
  frontend_link: process.env.FRONTEND_LINK || '',
  bo_frontend_link: process.env.BO_FRONTEND_LINK || '',
  mobile_app_name: process.env.MOBILE_APP_NAME || 'bitcastle',
}))
