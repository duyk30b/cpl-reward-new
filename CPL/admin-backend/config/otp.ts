export default () => ({
  otp: {
    length: parseInt(process.env.OTP_LENGTH) || 6,
    ttl: parseInt(process.env.OTP_TTL) || 300,
  },
  email_token: {
    length: parseInt(process.env.EMAIL_TOKEN_LENGTH) || 36,
    ttl: parseInt(process.env.EMAIL_TOKEN_TTL) || 24 * 60 * 60,
  },
})
