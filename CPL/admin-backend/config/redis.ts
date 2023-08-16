export default () => ({
  redis_config: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
    db: process.env.REDIS_QUEUE_DB || 0,
    worker_limit_duration: process.env.REDIS_WORKER_LIMIT_DURATION || 500,
  },
})
