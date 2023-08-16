import { registerAs } from '@nestjs/config'

export default registerAs('sumsub', () => ({
  webhook_secret: process.env.SUMSUB_WEBHOOK_SECRET,
  app_token: process.env.SUMSUB_APP_TOKEN,
  base_url: process.env.SUMSUB_BASE_URL || 'https://api.sumsub.com',
  token_ttl: +process.env.SUMSUB_TOKEN_TTL || 600,
  level_name: process.env.SUMSUB_LEVEL_NAME || 'basic-kyc-level',
  secret_key: process.env.SUMSUB_SECRET_KEY,
}))
