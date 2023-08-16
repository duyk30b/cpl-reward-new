import {
  ExecutionContext,
  Injectable,
  NestInterceptor,
  CallHandler,
  HttpException,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import * as Sentry from '@sentry/minimal'
import { BusinessException, ValidationException } from '..'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        error: (exception) => {
          const ignoreExceptions = [
            BusinessException,
            ValidationException,
            HttpException,
          ]
          if (!ignoreExceptions.some((type) => exception instanceof type)) {
            Sentry.captureException(exception)
          }
        },
      }),
    )
  }
}
