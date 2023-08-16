import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'
import { getClientIp } from 'request-ip'

@Injectable()
export class AccessLogInterceptor implements NestInterceptor {
  constructor(private readonly logger = new Logger('access_log')) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const res = context.switchToHttp().getResponse()
    const url = req.url
    const method = req.method
    const ip = getClientIp(req)
    const reqTime = new Date()
    const responseCode = res.statusCode
    const now = Date.now()

    // Sample access_log:
    // 2021-09-10T08:45:15.994Z | ::ffff:172.21.0.1 | GET | 200 |  /flow?action=register&uuid=kant-fntl-okmg-lsn5-gltb-oolg | 16ms
    return next
      .handle()
      .pipe(
        tap(() =>
          this.logger.log(
            `${reqTime.toISOString()} | ${ip} | ${method} | ${responseCode} |  ${url} | ${
              Date.now() - now
            }ms`,
          ),
        ),
      )
  }
}
