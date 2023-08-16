import { SentryInterceptor } from '@lib/util'
import { Logger, LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { CynopsisModule } from './cynopsis.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CynopsisModule,
  )
  const configService = app.get(ConfigService)
  const ENV = configService.get('ENV') || 'dev'
  const logLevel: LogLevel[] =
    ENV == 'dev' || ENV == 'local'
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)

  if (ENV != 'local') {
    // Sentry
    const SENTRY_DSN = configService.get('sentry_dsn')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  app.listen()
  logger.debug(`Service worker running, ENV: ${ENV}`)
}
bootstrap()
