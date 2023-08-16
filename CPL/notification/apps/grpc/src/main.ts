import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { GrpcOptions, Transport } from '@nestjs/microservices'
import { GrpcModule } from './grpc.module'
import * as Sentry from '@sentry/node'
import { Environment, SentryInterceptor } from '@libs/util'
import { Logger, LogLevel } from '@nestjs/common'
import { getProtoPath } from '@libs/grpc-client'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice<GrpcOptions>(GrpcModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.GRPC_PORT || 5000}`,
      package: [
        'notification',
        'user_group',
        'notification_category',
        'system_push_notification_setting',
        'grpc.health.v1',
      ],
      protoPath: [
        getProtoPath('notification.proto'),
        getProtoPath('user_group.proto'),
        getProtoPath('notification_category.proto'),
        getProtoPath('system_push_notification_setting.proto'),
        getProtoPath('health.proto'),
      ],
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
    // Sentry
    const SENTRY_DSN = configService.get('sentry_dsn')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen()
}
bootstrap()
