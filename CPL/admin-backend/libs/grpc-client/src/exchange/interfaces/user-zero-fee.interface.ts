import { Observable } from 'rxjs'

import {
  GrpcUserZeroFeePaginationResponse,
  UserZeroFeeDto,
  UpdateUserZeroFeeRequestDto,
  GetUserZeroFeeQuery,
} from '../dtos/user-zero-fee.dto'

export interface IExchangeUserZeroFee {
  getUserZeroFee: (
    request: GetUserZeroFeeQuery,
  ) => Observable<GrpcUserZeroFeePaginationResponse>
  updateUserZeroFee: (
    request: UpdateUserZeroFeeRequestDto,
  ) => Observable<UserZeroFeeDto>
}
