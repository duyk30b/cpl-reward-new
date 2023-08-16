import { registerAs } from '@nestjs/config'

export default registerAs('upload_file', () => ({
  s3_region: process.env.S3_REGION || 'ap-southeast-1',
  s3_api_key: process.env.S3_API_KEY || '',
  s3_api_secret: process.env.S3_SECRET_KEY || '',
  s3_bucket: process.env.S3_BUCKET || '',
  s3_bce_icon_bucket: process.env.S3_BCE_ICON_BUCKET || '',
  s3_notification_bucket: process.env.S3_NOTIFICATION_BUCKET,
}))
