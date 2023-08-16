import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Request } from 'express'
import { IRequestAdminActionLog } from 'libs/log/src/interfaces/admin-action-log.interface'
import { LogService } from 'libs/log/src/log.service'
import { getClientIp } from 'request-ip'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logService: LogService) {}
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ignoreEndpoints = ['/health', '/swagger', '/token', '/auth/login']
    const req: Request & { accessTokenInfo?: any } = context
      .switchToHttp()
      .getRequest()
    const res = context.switchToHttp().getResponse()

    const isIgnoreEndpoint = ignoreEndpoints.includes(req.path)
    const isIgnoreMethods = req.method === 'GET'
    const now = Date.now()
    let requestLog: IRequestAdminActionLog
    if (!isIgnoreEndpoint && !isIgnoreMethods) {
      const ip = getClientIp(req)
      requestLog = {
        adminId: req.accessTokenInfo ? req.accessTokenInfo.uid : '0',
        ip: ip,
        endpoint: req.path,
        method: req.method,
        request: JSON.stringify({
          body: req.body,
          query: req.query,
          params: req.params,
        }),
        response: '',
        statusCode: 200,
      }
      requestLog = await this.logService.requestLog(requestLog)
    }

    return next.handle().pipe(
      tap(async (reponse) => {
        if (reponse && requestLog) {
          await this.logService.responseLog({
            ...requestLog,
            statusCode: res.statusCode,
            timeProcessed: Date.now() - now,
          })
        }
      }),
      tap(null, async (exception) => {
        if (exception && requestLog) {
          await this.logService.responseLog({
            ...requestLog,
            statusCode: exception.status ? exception.status : 500,
            timeProcessed: Date.now() - now,
            response: JSON.stringify({
              error: exception.message,
            }),
          })
        }
      }),
    )
  }
}
