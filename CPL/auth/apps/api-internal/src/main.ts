import { NestFactory } from '@nestjs/core'
import { AdminModule } from './admin.module'
import * as requestIp from 'request-ip'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AccessLogInterceptor } from 'apps/api-public/src/interceptors/access-log.interceptor'
import { StripNullResponseInterceptor } from 'apps/api-public/src/interceptors/strip-null-response.interceptor'
import {
  ValidationPipe,
  BadRequestException,
  Logger,
  LogLevel,
} from '@nestjs/common'
import { ValidationError } from 'class-validator'
import { ConfigService } from '@nestjs/config'
import * as Sentry from '@sentry/node'
import { SentryInterceptor } from '@lib/util'
import { BusinessExceptionFilter } from '@lib/util/exception-filters/business-exception.filter'
import { ValidationExceptionFilter } from 'apps/api-public/src/exception-filter/validation-exception.filter'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AdminModule)

  const configService = app.get(ConfigService)
  const PORT = configService.get('SERVER_PORT') || 3000
  const ENV = configService.get('ENV') || 'dev'
  const ADMIN_URL_PREFIX = configService.get('URL_PREFIX')

  const logLevel: LogLevel[] =
    ENV == 'dev' || ENV == 'local'
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)

  app.enableCors()
  app.use(requestIp.mw())
  app.useGlobalInterceptors(
    new AccessLogInterceptor(),
    new StripNullResponseInterceptor(),
  )

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
        return new BadRequestException(validationErrors)
      },
    }),
  )

  app.useGlobalFilters(
    new BusinessExceptionFilter(),
    new ValidationExceptionFilter(),
  )

  // Apply Swagger
  if (ENV == 'dev' || ENV == 'local') {
    const config = new DocumentBuilder()
      .setTitle('Admin API')
      .addServer(ADMIN_URL_PREFIX || '')
      .setDescription('Bitcastle Admin API ')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('document', app, document)
  }

  if (ENV != 'local') {
    // Sentry
    const SENTRY_DSN = configService.get('sentry_dsn')
    Sentry.init({ dsn: SENTRY_DSN })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen(PORT, () => {
    logger.debug(`Service api-internal listen: PORT: ${PORT}, ENV: ${ENV}`)
  })
}
bootstrap()
