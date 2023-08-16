export default () => ({
  otp: {
    length: parseInt(process.env.OTP_LENGTH) || 6,
    ttl: parseInt(process.env.OTP_TTL) || 300,
    time_block_resend: parseInt(process.env.OTP_TIME_BLOCK_RESEND) || 100,
    ignore_otp_users: (process.env.IGNORE_OTP_USERS || '').split(','),
  },
})
