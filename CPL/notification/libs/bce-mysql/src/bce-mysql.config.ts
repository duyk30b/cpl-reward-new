import { registerAs } from '@nestjs/config'

export default registerAs('bce_mysql', () => ({
  master: {
    host: process.env.BCE_MYSQL_MASTER_HOST,
    port: process.env.BCE_MYSQL_MASTER_PORT,
    user: process.env.BCE_MYSQL_MASTER_USER,
    pass: process.env.BCE_MYSQL_MASTER_PASS,
    db: process.env.BCE_MYSQL_MASTER_DB,
  },
}))
