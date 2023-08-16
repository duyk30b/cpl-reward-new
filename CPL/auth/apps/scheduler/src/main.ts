import { Logger, LogLevel } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { SchedulerModule } from './scheduler.module'

async function bootstrap() {
  const logger = new Logger('bootstrap')
  const app = await NestFactory.createMicroservice(SchedulerModule)

  const configService = app.get(ConfigService)
  const ENV = configService.get('ENV') || 'dev'
  const logLevel: LogLevel[] =
    ENV == 'dev' || ENV == 'local'
      ? ['debug', 'error', 'log', 'verbose', 'warn']
      : ['error', 'warn', 'log']
  app.useLogger(logLevel)

  await app.listen()
  logger.debug(`Service scheduler running, ENV: ${ENV}`)
}
bootstrap()
