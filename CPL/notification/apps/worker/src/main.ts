import { Environment, SentryInterceptor } from '@libs/util'
import { Logger, LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RedisOptions, Transport } from '@nestjs/microservices'
import { WorkerModule } from './worker.module'
import * as Sentry from '@sentry/node'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice<RedisOptions>(WorkerModule, {
    transport: Transport.REDIS,
    options: {
      host: process.env.REDIS_HOST,
      port: +process.env.REDIS_PORT,
      db: process.env.REDIS_DB,
    },
  })

  const configService = app.get(ConfigService)
  const ENV = configService.get('global.env') || Environment.DEV

  const logLevel: LogLevel[] =
    ENV == Environment.DEV || ENV == Environment.LOCAL
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)
  logger.debug(`ENV: ${ENV}`)

  if (ENV != Environment.LOCAL) {
    const SENTRY_DSN = configService.get('global.sentry_dsn')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen()
}
bootstrap()
