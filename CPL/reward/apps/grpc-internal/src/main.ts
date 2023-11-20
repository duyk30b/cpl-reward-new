import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { ClassSerializerInterceptor, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import * as Sentry from '@sentry/node'
import { join } from 'path'
import { GrpcInternalModule } from './grpc-internal.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(GrpcInternalModule, {
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:${process.env.GRPC_CONTAINER_PORT || 5000}`,
      package: ['admin_campaign', 'admin_mission', 'admin_common', 'grpc.health.v1', 'reward'],
      protoPath: [
        join(__dirname, '../grpc-internal/grpc-campaign/grpc-campaign.proto'),
        join(__dirname, '../grpc-internal/grpc-mission/grpc-mission.proto'),
        join(__dirname, '../grpc-internal/grpc-common/grpc-common.proto'),
        join(__dirname, '../grpc-internal/grpc-reward/grpc-reward.proto'),
        join(__dirname, '../grpc-internal/health/health.proto'),
      ],
      loader: { keepCase: true },
    },
  })

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    }),
  )

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
  logger.debug(`🚀 ===== [REWARD]: Service grpc-internal started =====`)
}
bootstrap()
