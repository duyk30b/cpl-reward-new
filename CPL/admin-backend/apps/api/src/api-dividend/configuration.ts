import { registerAs } from '@nestjs/config'

export default registerAs('dividend', () => ({
  internal_api: process.env.DIVIDEND_INTERNAL_API || '',
}))
