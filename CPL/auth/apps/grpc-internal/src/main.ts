import { SentryInterceptor } from '@lib/util'
import { Logger, LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { InternalModule } from './internal.module'
import { grpcClientOptions } from './grpc-client.options'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    InternalModule,
    grpcClientOptions,
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
    Sentry.init({ dsn: SENTRY_DSN })
    app.useGlobalInterceptors(new SentryInterceptor())
  }
  app.listen()
  logger.debug(`Service grpc-internal running, ENV: ${ENV}`)
}

bootstrap()
