import { ValidationException } from '@lib/util'
import { ExceptionFilter, Catch, Logger, ArgumentsHost } from '@nestjs/common'
import { KafkaContext } from '@nestjs/microservices'
import * as Sentry from '@sentry/minimal'

@Catch(ValidationException)
export class KafkaValidationExceptionFilter implements ExceptionFilter {
  private logger = new Logger(KafkaValidationExceptionFilter.name)
  async catch(exception: ValidationException, host: ArgumentsHost) {
    const ctx = host.switchToRpc().getContext<KafkaContext>()
    const topic = ctx.getTopic()
    const error = `KAFKA VALIDATION ERROR FOR TOPIC: ${topic}`
    this.logger.error(error)
    this.logger.error({
      message: ctx.getMessage().value,
      errors: exception.getErrors(),
    })
    Sentry.captureException(new Error(error))
  }
}
