import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcSwapsService {
  export(listRequest: IGrpcSwapsListRequest): Observable<IGrpcResponse>
}

////////////// REQUEST ////////////////
export interface IGrpcSwapsListRequest {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  lang?: string
  startDate?: string
  endDate?: string
  currency?: string
  status?: string
}
