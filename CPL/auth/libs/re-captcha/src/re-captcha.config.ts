export default () => ({
  recaptcha: {
    enabled: process.env.ENABLE_RECAPTCHA,
    secretV2Android: process.env.RECAPTCHA_SECRET_V2_ANDROID || '',
    secretV2Invisible: process.env.RECAPTCHA_SECRET_V2_INVISIBLE || '',
    secretV3: process.env.RECAPTCHA_SECRET_V3 || '',
    cacheTtl: process.env.RECAPTCHA_CACHE_TTL || 0,
  },
})
