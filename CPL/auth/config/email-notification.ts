export default () => ({
  email_notification: {
    host: process.env.MAIL_HOST || 'smtp.gmail.com',
    port: process.env.MAIL_PORT || 465,
    user: process.env.EMAIL_USER,
    from: process.env.EMAIL_FROM || 'no-reply@bitcastle.com',
    password: process.env.EMAIL_PASSWORD,
    secure: process.env.EMAIL_SECURE == '1' ? true : false,
    ses_api_key: process.env.SES_API_KEY || '',
    ses_secret: process.env.SES_SECRET_KEY || '',
    ses_region: process.env.SES_REGION || 'ap-southeast-1',
    subject_prefix: process.env.EMAIL_SUBJECT_PREFIX || '【bitcastle】',
  },
})
