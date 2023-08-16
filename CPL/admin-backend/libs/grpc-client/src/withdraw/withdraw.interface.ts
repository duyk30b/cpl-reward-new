import { Observable } from 'rxjs'
import {
  CreateWithdrawGroupRequest,
  getListAutoWithdrawRequest,
  getListAutoWithdrawResponse,
  HealthStatusValue,
  ListWithdrawGroupRequest,
  ListWithdrawGroupResponse,
  saveAutoWithdrawRequest,
  saveAutoWithdrawResponse,
  UpdateGroupStatusRequest,
  WalletKeyValue,
  withdrawalGroupRequest,
  WithdrawGroupResponse,
  DuplicateWithdrawRequest,
  validateDuplicateWithdrawResponse,
  CollectBalanceResponse,
} from './withdraw.dto'

export interface IGrpcWithdrawService {
  getListWithdrawalGroup(
    query: ListWithdrawGroupRequest,
  ): Observable<ListWithdrawGroupResponse>
  createWithdrawalGroup(
    body: CreateWithdrawGroupRequest,
  ): Observable<WithdrawGroupResponse>
  generatePrivateKey(body: withdrawalGroupRequest): Observable<WalletKeyValue>
  updateStatus(
    body: UpdateGroupStatusRequest,
  ): Observable<WithdrawGroupResponse>
  saveAutoWithdrawals(
    body: saveAutoWithdrawRequest,
  ): Observable<saveAutoWithdrawResponse>
  getListAutoWithdraw(
    query: getListAutoWithdrawRequest,
  ): Observable<getListAutoWithdrawResponse>
  Health(): Observable<HealthStatusValue>
  validateDuplicateAutoWithdraw(
    body: DuplicateWithdrawRequest,
  ): Observable<validateDuplicateWithdrawResponse>
  collectAutoWithdrawalGroup(
    body: withdrawalGroupRequest,
  ): Observable<CollectBalanceResponse>
}
