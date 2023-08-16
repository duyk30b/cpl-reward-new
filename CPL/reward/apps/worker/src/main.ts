import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisOptions, Transport } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { WorkerModule } from './worker.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')

  const app = await NestFactory.createMicroservice<RedisOptions>(WorkerModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST || 'localhost',
      port: +process.env.REDIS_PORT || 6379,
      db: process.env.REDIS_DB || '0',
    },
  })

  const configService: ConfigService = app.get(ConfigService)
  const ENV = configService.get('global.node_env')
  const SENTRY_DSN = configService.get('global.sentry_dsn')

  if (ENV === 'local') {
    app.useLogger(['debug', 'error', 'log', 'verbose', 'warn'])
  } else {
    app.useLogger(['error', 'warn', 'log'])

    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen()
  logger.debug(`🚀 ===== [REWARD]: Service worker started =====`)
}
bootstrap()
