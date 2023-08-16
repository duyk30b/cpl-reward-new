import { IGrpcResponse } from '@lib/grpc-client/grpc-client.interface'
import { Observable } from 'rxjs'

export interface IGrpcCacheManagementService {
  delete(deleteRequest: IGrpcCacheManagementRequest): Observable<IGrpcResponse>
}

export interface IGrpcCacheManagementRequest {
  key: number
}
