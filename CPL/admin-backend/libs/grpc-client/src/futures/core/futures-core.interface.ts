import { Observable } from 'rxjs'
import {
  GetPositionListRequest,
  GetPositionListResponse,
} from './futures-core.dto'

export interface FuturesCoreInterface {
  getPositionList: (
    request: GetPositionListRequest,
  ) => Observable<GetPositionListResponse>
}
