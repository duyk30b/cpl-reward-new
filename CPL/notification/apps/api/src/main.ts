import {
  StripNullResponseInterceptor,
  ValidationException,
  ValidationExceptionFilter,
  SentryInterceptor,
  Environment,
  getAllControllers,
} from '@libs/util'
import {
  Logger,
  LogLevel,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { ApiModule } from './api.module'
import * as Sentry from '@sentry/node'
import { BusinessExceptionFilter } from '@libs/util/exception-filters/business-exception.filter'
import { processAuthKongDecorators } from '@libs/auth-kong'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(ApiModule)

  const configService = app.get(ConfigService)
  const PORT = configService.get('SERVER_PORT') || 3000
  const ENV = configService.get('ENV') || Environment.DEV
  const URL_PREFIX = configService.get('URL_PREFIX')

  const logLevel: LogLevel[] =
    ENV == 'dev' || ENV == 'local'
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)
  logger.debug(`PORT: ${PORT}`)
  logger.debug(`ENV: ${ENV}`)

  app.enableCors()

  app.useGlobalInterceptors(new StripNullResponseInterceptor())

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

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new BusinessExceptionFilter(),
  )

  if (ENV == Environment.DEV || ENV == Environment.LOCAL) {
    processAuthKongDecorators(configService, getAllControllers(app))

    const config = new DocumentBuilder()
      .setTitle('Notification API')
      .addServer(URL_PREFIX || '')
      .addBearerAuth(
        {
          type: 'http',
          description: 'Access token',
        },
        'access-token',
      )
      .setDescription('Bitcastle Notification API ')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('document', app, document)
  }

  if (ENV != Environment.LOCAL) {
    const SENTRY_DSN = configService.get('sentry_dsn')
    Sentry.init({ dsn: SENTRY_DSN })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen(PORT)
}
bootstrap()
