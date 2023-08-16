export default () => ({
  redis_config: {
    host: process.env.AUTHENTICATE_REDIS_HOST || 'localhost',
    port: process.env.AUTHENTICATE_REDIS_PORT || 6379,
    db: process.env.AUTHENTICATE_REDIS_DB || 5,
  },
})
