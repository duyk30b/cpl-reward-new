import { Observable } from 'rxjs'
import {
  DataPointItem,
  DataPointResponse,
  DeleteDataPointParams,
} from './market-maker-data-point.dto'

export interface IMarketMakerDataPointService {
  insertDataPoint(body: DataPointItem): Observable<{ response: string }>
  deleteDataPoint(
    params: DeleteDataPointParams,
  ): Observable<{ response: string }>
  getDataPoint(params): Observable<DataPointResponse>
}
