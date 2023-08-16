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
import * as Sentry from '@sentry/node'
import { ApiPublicModule } from './api-public.module'
import { AccessLogInterceptor } from './interceptor/access-log.interceptor'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(ApiPublicModule)

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      validationError: { target: false, value: true },
      skipMissingProperties: true, // no validate field undefined
      transform: true,
      transformOptions: {
        excludeExtraneousValues: false, // exclude field not in class DTO => no
        exposeUnsetFields: false, // expose field undefined in DTO => no
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
    new AccessLogInterceptor(),
    // new TimeoutInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector), {
      excludeExtraneousValues: true,
      exposeUnsetFields: false,
    }),
  )

  const configService: ConfigService = app.get(ConfigService)
  const ENV = configService.get('global.node_env')
  const SENTRY_DSN = configService.get('global.sentry_dsn')
  const URL_PREFIX = configService.get('global.url_prefix')
  const API_PORT = configService.get('global.api_port')

  if (ENV === 'local' || ENV === 'dev') {
    app.useLogger(['debug', 'error', 'log', 'verbose', 'warn'])

    const config = new DocumentBuilder()
      .setTitle('Reward API')
      .addServer(URL_PREFIX)
      .setDescription('Bitcastle Reward API ')
      .addBearerAuth({ type: 'http', description: 'Access token' }, 'access-token')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup('document', app, document)
  } else {
    app.useLogger(['error', 'warn', 'log'])
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen(API_PORT)

  logger.debug(`🚀 ===== [REWARD]: Service api-public started =====`)
}
bootstrap()
