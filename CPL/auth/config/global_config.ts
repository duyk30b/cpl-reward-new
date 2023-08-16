export default () => ({
  env: process.env.ENV || 'dev',
  app_name: process.env.APP_NAME || 'Bitcastle',
  aes_password: process.env.AES_PASSWORD || 'PkffKtt8',
  otp_secret_salt: process.env.OTP_SECRET_SALT || 'P4pyB3ar',
  time_health_check: process.env.TIME_HEALTH_CHECK || 1000,
  kafka_brokers: (process.env.KAFKA_BROKERS || '').split(','),
  firebase_api_key:
    process.env.FIREBASE_API_KEY || 'AIzaSyBo3W2LW7K6hKhYsoQoVOzHBkIKWkA2UGk',
  bitcastle_encryption_key:
    process.env.BITCASTLE_ENCRYPTION_KEY || 'Dv5B733LjyY41ChSPGbt26O63HiBHqRZ',
  decoder_url: process.env.DECODER_URL || 'http://dev-bce-decoder:80',
  sentry_dsn:
    process.env.SENTRY_DSN ||
    'http://cd9b8f4d8adb4d6ea1298c683e76bdde@cpl-sentry.staging-bitcastle.work/24',
  bce_url: process.env.BCE_URL,
  internal_secret: process.env.INTERNAL_SECRET,
  last_name_first_countries: [1116],
  resolve_error_sync_user_interval:
    process.env.RESOLVE_ERROR_SYNC_USER_INTERVAL || 1800000,
  days_before_delete_user: +process.env.DAYS_BEFORE_DELETE_USER || 30,
  ignore_email_domains: (
    process.env.IGNORE_EMAIL_DOMAINS ||
    'cryptopie-labo.com,blitz-marketing.co.jp'
  )
    .split(',')
    .map((e) => e.trim()),
})
