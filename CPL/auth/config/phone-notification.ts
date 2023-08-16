export default () => ({
  phone_notification: {
    from: process.env.PHONE_FROM || 'BITCASTLE',
    active_code_ttl: process.env.PHONE_ACTIVE_CODE_TTL || 5,
    sns_api_key: process.env.SNS_API_KEY || '',
    sns_secret: process.env.SNS_SECRET_KEY || '',
    sns_region: process.env.SNS_REGION || 'ap-southeast-1',
  },
})
