import { registerAs } from '@nestjs/config'

export default registerAs('mt5', () => ({
  admin_emails: (process.env.MT5_ADMIN_EMAILS || '').split(','),
}))
