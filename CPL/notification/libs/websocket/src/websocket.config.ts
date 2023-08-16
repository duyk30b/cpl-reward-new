import { registerAs } from '@nestjs/config'

export default registerAs('websocket', () => ({
  ws: process.env.EMQX_WS || 'wss',
  host: process.env.EMQX_HOST || 'localhost',
  port: process.env.EMQX_PORT || 8083,
  topic: process.env.ENV + '_notification',
}))
