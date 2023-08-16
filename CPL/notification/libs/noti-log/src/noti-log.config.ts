import { registerAs } from '@nestjs/config'

export default registerAs('noti_log', () => ({
  time_partition_format: process.env.LOG_TIME_PARTITION_FORMAT || 'YYYY_MM',
}))
