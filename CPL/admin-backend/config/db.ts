import { registerAs } from '@nestjs/config'

export default registerAs('mysql_master', () => ({
  host: process.env.ADMINV3_MYSQL_MASTER_HOST || 'localhost',
  port: process.env.ADMINV3_MYSQL_MASTER_PORT || 3361,
  user: process.env.ADMINV3_MYSQL_MASTER_USER || 'root',
  pass: process.env.ADMINV3_MYSQL_MASTER_PASS || '',
  db: process.env.ADMINV3_MYSQL_MASTER_DB || 'db_admin_v3',
}))
