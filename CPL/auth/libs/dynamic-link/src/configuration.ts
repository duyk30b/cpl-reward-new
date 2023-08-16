import { registerAs } from '@nestjs/config'

export default registerAs('dynamic_link', () => ({
  bitcastle_url:
    process.env.FIREBASE_DL_BITCASLE_URL || 'https://bitcastle.io/',
  api_key: process.env.FIREBASE_API_KEY || '',
  url:
    process.env.FIREBASE_DL_URL ||
    'https://firebasedynamiclinks.googleapis.com/v1/shortLinks',
  android_package_name:
    process.env.FIREBASE_DL_ANDROID_PACKAGE_NAME || undefined,
  ios_bundle_id: process.env.FIREBASE_DL_IOS_BUNDLE_ID || undefined,
  ios_ipad_bundle_id: process.env.FIREBASE_DL_IPAD_BUNDLE_ID || undefined,
  ios_app_store_id: process.env.FIREBASE_DL_IOS_APP_STORE_ID || undefined,
  domain_uri_prefix: process.env.FIREBASE_DL_DOMAIN_URI_PREFIX || undefined,
}))
