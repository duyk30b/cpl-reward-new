import { Observable } from 'rxjs'
import {
  CreateUserBlackListRequestDto,
  GetUserBlackListQuery,
  GrpcUserBlackListPaginationResponse,
  RemoveFromBlackListRequestDto,
  RemoveFromBlackListResponseDto,
  UpdateUserBlackListRequestDto,
  UserBlackListDto,
} from '../dtos/user-black-list.dto'

export interface IExchangeUserBlackList {
  getBlackList: (
    request: GetUserBlackListQuery,
  ) => Observable<GrpcUserBlackListPaginationResponse>
  removeBlackList: (
    request: RemoveFromBlackListRequestDto,
  ) => Observable<RemoveFromBlackListResponseDto>
  addBlackList: (
    request: CreateUserBlackListRequestDto,
  ) => Observable<UserBlackListDto>
  updateBlackList: (
    request: UpdateUserBlackListRequestDto,
  ) => Observable<UserBlackListDto>
}
