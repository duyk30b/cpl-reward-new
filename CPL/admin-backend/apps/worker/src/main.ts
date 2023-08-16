import { SentryInterceptor } from '@app/common'
import { Environment, getAllControllers, ValidationException } from '@lib/util'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { WorkerModule } from './worker.module'
import * as Sentry from '@sentry/node'
import {
  Logger,
  LogLevel,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import {
  KafkaConsumerService,
  KafkaValidationExceptionFilter,
} from '@lib/kafka'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(WorkerModule)

  app.get(KafkaConsumerService).processKafkaDecorators(getAllControllers(app))

  await app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER],
        },
        consumer: {
          groupId: `${process.env.ENV}${process.env.KAFKA_GROUP}`,
          allowAutoTopicCreation: true,
        },
      },
    },
    { inheritAppConfig: true },
  )

  const configService = app.get(ConfigService)
  const ENV = configService.get('env') || Environment.DEV

  const logLevel: LogLevel[] =
    ENV == Environment.DEV || ENV == Environment.LOCAL
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)
  logger.debug(`ENV: ${ENV}`)

  if (ENV != Environment.LOCAL) {
    const SENTRY_DSN = configService.get('SENTRY_DSN')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.startAllMicroservices()

  await app.listen(3000, () => {
    logger.debug('===== ADMIN-BACKEND: Service Worker started =====')
  })
}
bootstrap()
