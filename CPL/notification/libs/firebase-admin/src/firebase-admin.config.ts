import { registerAs } from '@nestjs/config'

export default registerAs('firebase_admin', () => ({
  credential_path: process.env.FIREBASE_ADMIN_CREDENTIAL_PATH,
}))
