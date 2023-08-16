import { registerAs } from '@nestjs/config'

export default registerAs('bce', () => ({
  url: process.env.BCE_BACKEND_URL || '',
  secret: process.env.BCE_BACKEND_INTERNAL_SECRET || '',
  admin_url: process.env.BCE_ADMIN_URL || '',
  admin_secret: process.env.BCE_ADMIN_INTERNAL_SECRET || '',
}))
