import { ArgumentsHost, Catch, Logger, ValidationError } from '@nestjs/common'
import { RpcExceptionFilter } from '@nestjs/common/interfaces'
import { KafkaContext, RpcException } from '@nestjs/microservices'
import * as Sentry from '@sentry/minimal'
import { from, Observable } from 'rxjs'

export class KafkaValidateException extends RpcException {
  constructor(error: string | Record<string, unknown> | ValidationError[]) {
    super(error)
  }
}

@Catch(KafkaValidateException)
export class KafkaValidateExceptionFilter implements RpcExceptionFilter<KafkaValidateException> {
  private logger = new Logger(KafkaValidateExceptionFilter.name)

  catch(exception: KafkaValidateException, host: ArgumentsHost): Observable<any> {
    const ctx = host.switchToRpc().getContext<KafkaContext>()

    const info = {
      message: exception.message,
      topic: ctx.getTopic(),
      partition: ctx.getPartition(),
      offset: ctx.getMessage().offset,
      error: exception.getError(),
      value: ctx.getMessage().value,
    }
    this.logger.error(info)
    Sentry.captureException(new Error(JSON.stringify(info)))
    return from([info])
  }
}
