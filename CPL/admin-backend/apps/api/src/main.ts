import { NestFactory } from '@nestjs/core'
import { ApiModule } from './api.module'
import { ConfigService } from '@nestjs/config'
import {
  Logger,
  LogLevel,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ValidationException } from '@lib/util'
import { HttpExceptionFilter } from './exception-filter/http-exception.filter'
import { ValidationExceptionFilter } from './exception-filter/validation-exception.filter'
import * as Sentry from '@sentry/node'
import { LoggingInterceptor, SentryInterceptor } from '@app/common'
import { LogService } from '@lib/log'
import { ErrorFilter } from './exception-filter/error.filter'
import { BusinessExceptionFilter } from './exception-filter/business-exception.filter'
import { BadRequestExceptionFilter } from './exception-filter/bad-request-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(ApiModule)
  app.enableCors()

  const logger = new Logger('bootstrap')
  const configService = app.get(ConfigService)

  const PORT = configService.get('SERVER_PORT') || 3000
  const ENV = configService.get('ENV') || 'dev'
  const URL_PREFIX = configService.get('URL_PREFIX')

  // Log level
  const logLevel: LogLevel[] =
    ENV == 'dev' || ENV == 'local'
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)
  logger.debug(`PORT: ${PORT}`)
  logger.debug(`ENV: ${ENV}`)

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
    new ErrorFilter(),
    new ValidationExceptionFilter(),
    new HttpExceptionFilter(),
    new BusinessExceptionFilter(),
    new BadRequestExceptionFilter(),
  )

  // Sentry
  const SENTRY_DSN = configService.get('SENTRY_DSN')
  Sentry.init({ dsn: SENTRY_DSN })

  const logService = app.get(LogService)
  app.useGlobalInterceptors(
    new LoggingInterceptor(logService),
    new SentryInterceptor(),
  )

  // app.useGlobalInterceptors(new ResponseInterceptor())

  // Apply Swagger
  if (ENV == 'dev' || ENV == 'local') {
    const config = new DocumentBuilder()
      .setTitle('Authenticate API')
      .addServer(URL_PREFIX || '')
      .addBearerAuth(
        {
          type: 'http',
          description: 'Access token',
        },
        'access-token',
      )
      .setDescription('Bitcastle Authenticate API ')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('document', app, document)
  }
  await app.listen(PORT)

  logger.debug(`🚀 ===== [ADMIN-BACKEND]: Service api-public started =====`)
}
bootstrap()
