import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'
import { getClientIp } from 'request-ip'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  constructor(private readonly logger = new Logger('ACCESS_LOG')) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = new Date()
    const ctx = context.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    const { url, method } = request
    const { statusCode } = response
    const ip = getClientIp(request)

    return next.handle().pipe(
      tap(() => {
        let msg = `${startTime.toISOString()} | ${ip} | ${method} | ${statusCode} | ${url}`
        msg += ` | ${Date.now() - startTime.getTime()}ms`
        return this.logger.log(msg)
      }),
    )
  }
}
