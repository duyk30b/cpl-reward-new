import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class PerformanceMonitoringInterceptor implements NestInterceptor {
  private readonly logger = new Logger(PerformanceMonitoringInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now()

    return next.handle().pipe(
      tap(() => {
        const endTime = Date.now()
        const executionTime = endTime - startTime

        this.logger.log(`executionTime = ${executionTime}ms`)
      }),
    )
  }
}
