export default () => ({
  upload_file: {
    s3_region: process.env.S3_REGION || 'ap-southeast-1',
    s3_api_key: process.env.S3_API_KEY || '',
    s3_api_secret: process.env.S3_SECRET_KEY || '',
    s3_bucket: process.env.S3_BUCKET || '',
  },
})
