import { registerAs } from '@nestjs/config'

export default registerAs('mysql', () => ({
  master: {
    host: process.env.MYSQL_MASTER_HOST,
    port: process.env.MYSQL_MASTER_PORT,
    user: process.env.MYSQL_MASTER_USER,
    pass: process.env.MYSQL_MASTER_PASS,
    db: process.env.MYSQL_MASTER_DB,
  },
}))
