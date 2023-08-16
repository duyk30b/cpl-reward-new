import { registerAs } from '@nestjs/config'

export default registerAs('mail', () => ({
  name: process.env.MAIL_NAME || 'bitcastle',
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: +process.env.MAIL_PORT || 465,
  user: process.env.MAIL_USER || 'no-reply@bitcastle.com',
  from: process.env.MAIL_ADDRESS || 'no-reply@bitcastle.com',
  password: process.env.MAIL_PASSWORD,
  subject_prefix: process.env.MAIL_SUBJECT_PREFIX || '【bitcastle】',
}))
