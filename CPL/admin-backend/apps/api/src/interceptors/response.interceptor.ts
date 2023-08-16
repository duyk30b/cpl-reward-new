import { instanceToPlain } from 'class-transformer'
import { Observable, map } from 'rxjs'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'

export interface Response<T> {
  message: string
  data: T
  time_stamp: number
  path?: string
}
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, Response<any>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<any>> {
    return next.handle().pipe(
      map((data) => ({
        message: 'Success',
        data: instanceToPlain(data.data || data),
        time_stamp: new Date().getTime(),
        total_count: data.totalCount || null,
        meta_data: data.metaData || null,
      })),
    )
  }
}
