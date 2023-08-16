import { Observable } from 'rxjs'

import {
  CreateUserUnlimitedRequestDto,
  GetUserUnlimitedQuery,
  GrpcUserUnlimitedPaginationResponse,
  RemoveFromUnlimitedRequestDto,
  RemoveFromUnlimitedResponseDto,
  UpdateUserUnlimitedRequestDto,
  UserUnlimitedDto,
} from '../dtos/user-unlimited.dto'

export interface IExchangeUserUnlimited {
  getUserUnlimited: (
    request: GetUserUnlimitedQuery,
  ) => Observable<GrpcUserUnlimitedPaginationResponse>
  removeUserUnlimited: (
    request: RemoveFromUnlimitedRequestDto,
  ) => Observable<RemoveFromUnlimitedResponseDto>
  addUserUnlimited: (
    request: CreateUserUnlimitedRequestDto,
  ) => Observable<UserUnlimitedDto>
  updateUserUnlimited: (
    request: UpdateUserUnlimitedRequestDto,
  ) => Observable<UserUnlimitedDto>
}
