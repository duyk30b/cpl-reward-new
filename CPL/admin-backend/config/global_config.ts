export default () => ({
  env: process.env.ENV || 'dev',
  aes_password: process.env.AES_PASSWORD || 'PkffKtt8',
  otp_secret_salt: process.env.OTP_SECRET_SALT || 'P4pyB3ar',
  bitcastle_encryption_key:
    process.env.BITCASTLE_ENCRYPTION_KEY || 'Dv5B733LjyY41ChSPGbt26O63HiBHqRZ',
})
