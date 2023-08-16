import { Catch, ExceptionFilter, Logger } from '@nestjs/common'
import { from, Observable } from 'rxjs'

@Catch(Error)
export class GrpcExceptionFilter implements ExceptionFilter {
  private logger = new Logger(GrpcExceptionFilter.name)

  catch(exception: Error): Observable<any> {
    const info = {
      message: exception.message,
    }
    this.logger.error(info)

    return from([info])
  }
}
