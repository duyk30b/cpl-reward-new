import { BusinessExceptionFilter } from '@lib/common/exceptions/business-exception.filter'
import { HttpExceptionFilter } from '@lib/common/exceptions/http-exception.filter'
import {
  ValidationException,
  ValidationExceptionFilter,
} from '@lib/common/exceptions/validation-exception.filter'
import { SentryInterceptor } from '@lib/common/interceptors/sentry.interceptor'
import { ClassSerializerInterceptor, Logger, ValidationError, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ApiInternalModule } from './api-internal.module'
import * as Sentry from '@sentry/node'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(ApiInternalModule)

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      validationError: { target: false, value: true },
      skipMissingProperties: true,
      transform: true,
      transformOptions: {
        excludeExtraneousValues: false,
        exposeUnsetFields: false,
      },
      exceptionFactory: (errors: ValidationError[] = []) => new ValidationException(errors),
    }),
  )

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new BusinessExceptionFilter(),
    new ValidationExceptionFilter(),
  )

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    }),
  )

  const configService: ConfigService = app.get(ConfigService)
  const NODE_ENV = configService.get('global.node_env')
  const SENTRY_DSN = configService.get('global.sentry_dsn')
  const URL_PREFIX = configService.get('global.url_prefix_internal')
  const API_PORT = configService.get('global.api_port')

  if (NODE_ENV === 'local' || NODE_ENV === 'dev') {
    app.useLogger(['debug', 'error', 'log', 'verbose', 'warn'])

    const config = new DocumentBuilder()
      .setTitle('Reward Internal API')
      .addServer(URL_PREFIX)
      .setDescription('Bitcastle Reward Internal API ')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('document', app, document)
  } else {
    app.useLogger(['error', 'warn', 'log'])
    Sentry.init({ dsn: SENTRY_DSN, environment: NODE_ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen(API_PORT)

  logger.debug(`🚀 ===== [REWARD]: Service api-internal started =====`)
}
bootstrap()
