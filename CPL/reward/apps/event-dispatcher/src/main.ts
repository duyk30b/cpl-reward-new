import { getAllControllers } from '@lib/common/helpers/process.helper'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { KafkaDecoratorService } from '@lib/kafka'
import { Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices/enums'
import * as Sentry from '@sentry/node'
import { EventDispatcherModule } from './event-dispatcher.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(EventDispatcherModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [process.env.KAFKA_BROKERS],
        clientId: `${process.env.ENV}-${process.env.KAFKA_GROUP_ID}-client`,
      },
      consumer: {
        groupId: `${process.env.ENV}-${process.env.KAFKA_GROUP_ID}`,
        allowAutoTopicCreation: true,
      },
    },
  })
  app.get(KafkaDecoratorService).processKafkaDecorators(getAllControllers(app))

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
  logger.debug(`🚀 ===== [REWARD]: Service event-dispatcher started =====`)
}

bootstrap()
