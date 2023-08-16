import {
  Logger,
  LogLevel,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as requestIp from 'request-ip'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './exception-filter/http-exception.filter'
// import { AccessLogInterceptor } from './interceptors/access-log.interceptor'
import { SentryInterceptor, ValidationException } from '@lib/util'
import { ConfigService } from '@nestjs/config'
import * as Sentry from '@sentry/node'
import { useContainer } from 'class-validator'
import { ValidationExceptionFilter } from './exception-filter/validation-exception.filter'
import { StripNullResponseInterceptor } from './interceptors/strip-null-response.interceptor'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.create(AppModule, { rawBody: true })

  useContainer(app.select(AppModule), { fallbackOnErrors: true })

  const configService = app.get(ConfigService)
  const PORT = configService.get('SERVER_PORT') || 3000
  const ENV = configService.get('ENV') || 'dev'
  const URL_PREFIX = configService.get('URL_PREFIX')

  const logLevel: LogLevel[] =
    ENV == 'dev' || ENV == 'local'
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)

  app.enableCors()
  app.use(requestIp.mw())
  app.useGlobalInterceptors(
    //new AccessLogInterceptor(),
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
        return new ValidationException(validationErrors)
      },
    }),
  )

  app.useGlobalFilters(
    new ValidationExceptionFilter(),
    new HttpExceptionFilter(),
  )

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

  if (ENV != 'local') {
    // Sentry
    const SENTRY_DSN = configService.get('sentry_dsn')
    Sentry.init({ dsn: SENTRY_DSN, environment: ENV })
    app.useGlobalInterceptors(new SentryInterceptor())
  }

  await app.listen(PORT, () => {
    logger.debug(`Service api-public listen: PORT: ${PORT}, ENV: ${ENV}`)
  })
}
bootstrap()
