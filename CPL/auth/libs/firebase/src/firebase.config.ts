import { registerAs } from '@nestjs/config'

export default registerAs('firebase', () => ({
  api_key:
    process.env.FIREBASE_API_KEY || 'AIzaSyBo3W2LW7K6hKhYsoQoVOzHBkIKWkA2UGk',
}))
