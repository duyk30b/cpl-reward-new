import { Observable } from 'rxjs'
import { IResponseWithPagination } from '../grpc-client.interface'

export interface INotificationCategory {
  id: number
  name: string
}

export interface INotificationCategoryService {
  getList({}): Observable<IResponseWithPagination<INotificationCategory>>
}
