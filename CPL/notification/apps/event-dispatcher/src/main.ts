import {
  KafkaConsumerService,
  KafkaValidationExceptionFilter,
} from '@libs/kafka'
import {
  Environment,
  getAllControllers,
  SentryInterceptor,
  ValidationException,
} from '@libs/util'
import {
  Logger,
  LogLevel,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { EventDispatcherModule } from './event-dispatcher.module'
import * as Sentry from '@sentry/node'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    EventDispatcherModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: (process.env.KAFKA_BROKERS || '').split(','),
        },
        consumer: {
          groupId: `${process.env.ENV}${process.env.KAFKA_GROUP}`,
          allowAutoTopicCreation: true,
        },
      },
    },
  )

  const configService = app.get(ConfigService)
  const ENV = configService.get('global.env') || Environment.DEV

  app.get(KafkaConsumerService).processKafkaDecorators(getAllControllers(app))

  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      transform: true,
      validationError: {
        target: false,
        value: false,
      },
      transformOptions: {
        excludeExtraneousValues: true,
      },
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new ValidationException(validationErrors)
      },
    }),
  )

  app.useGlobalFilters(new KafkaValidationExceptionFilter())

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
