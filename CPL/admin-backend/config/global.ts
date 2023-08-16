import { registerAs } from '@nestjs/config'

const GlobalConfig = registerAs('global', () => ({
  app_name: process.env.APP_NAME || 'Bitcastle Admin',
  port: +process.env.SERVER_PORT,
  env: process.env.ENV || 'dev',
  url_prepix: process.env.URL_PREFIX,
  sentry_dsn: process.env.SENTRY_DSN,
  bce_admin_url: process.env.BCE_ADMIN_URL,
  bce_admin_internal_secret: process.env.BCE_ADMIN_INTERNAL_SECRET,
  admin_v3_frontend_url: process.env.ADMIN_V3_FRONTEND_URL,
  time_send_email_missing_reward:
    Number(process.env.TIME_SEND_EMAIL_MISSING_REWARD) || 3600,
}))

export default GlobalConfig
