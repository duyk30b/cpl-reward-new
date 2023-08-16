import { registerAs } from '@nestjs/config'

export default registerAs('amazon_rekognition', () => ({
  region: process.env.S3_REGION || 'ap-southeast-1',
  api_key: process.env.S3_API_KEY || '',
  api_secret: process.env.S3_SECRET_KEY || '',
  bucket: process.env.S3_BUCKET || '',
}))
