import { registerAs } from '@nestjs/config'

export const GlobalConfig = registerAs('global', () => ({
  node_env: process.env.ENV || 'local',
  url_prefix: process.env.URL_PREFIX || '',
  url_prefix_internal: process.env.URL_PREFIX_INTERNAL || '',
  api_port: process.env.API_CONTAINER_PORT || 3000,
  sentry_dsn:
    process.env.SENTRY_DSN ||
    'http://81a2bb7e8a5444fabdccd18fdc57230e@cpl-sentry.staging-bitcastle.work/33',
}))
