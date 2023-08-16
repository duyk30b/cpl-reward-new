import {
  BaseFilterQuery,
  GrpcFilterIncidentCollectionQuery,
  GrpcGetDepositResponse,
  GrpcGetErc20TokenResponse,
  GrpcGetIncidentCollectionResponse,
  GrpcGetSettingQuery,
  GrpcGetSettingResponse,
  GrpcGetWalletQuery,
  GrpcGetWalletResponse,
  GrpcGetWithdrawResponse,
  GrpcPostIncidentCollectionResponse,
  GrpcUpdateSettingBody,
  GrpcUpdateSettingResponse,
  UpdateBlacklistAddressQuery,
  GrpcAddListBlacklistQuery,
  GrpcGetBlacklistAddressResponse,
  GrpcUpdateBlacklistAddressResponse,
  GrpcUpdateIgnoreBlacklistQuery,
  GrpcGetBlacklistUserResponse,
  GrpcAddListBlacklistUserQuery,
  GrpcUpdateIgnoreBlacklistUserQuery,
  GrpcUpdateBlacklistUserResponse,
  UpdateBlacklistUserQuery,
  BasePaginationQuery,
  GrpcRemoveBlacklistAddressResponse,
  GrpcRemoveBlacklistUserResponse,
  GrpcGetChainNetworkResponse,
  GrpcSmartContractResponse,
  GrpcCreateManualDepositResponse,
  CreateManualDepositBodyDto,
  RetryDepositDto,
  GrpcRetryDepositResponse,
  RetryFailedWithdrawDto,
  GrpcRetryFailedWithdrawResponse,
  StopProcessingWithdrawDto,
  GrpcStopWithdrawResponse,
  GrpcWithdrawByIdResponse,
  GrpcDepositByIdResponse,
  GrpcGetTrezorWalletResponse,
  FilterTrezorWalletQuery,
  GrpcGetTrezorCollectorAddressResponse,
  CreateTrezorTransactionParams,
  GrpcCreateTrezorTransactionResponse,
} from '../dtos'
import { Observable } from 'rxjs'

export interface IGrpcHotWallet {
  getDeposit: (request: BaseFilterQuery) => Observable<GrpcGetDepositResponse>
  getWithdraw: (request: BaseFilterQuery) => Observable<GrpcGetWithdrawResponse>
  getWallet: (request: GrpcGetWalletQuery) => Observable<GrpcGetWalletResponse>

  getIncidentCollection: (
    request: GrpcFilterIncidentCollectionQuery,
  ) => Observable<GrpcGetIncidentCollectionResponse>
  postIncidentCollection: (
    request: GrpcFilterIncidentCollectionQuery,
  ) => Observable<GrpcPostIncidentCollectionResponse>

  getSetting: (
    request: GrpcGetSettingQuery,
  ) => Observable<GrpcGetSettingResponse>
  updateSetting: (
    request: GrpcUpdateSettingBody,
  ) => Observable<GrpcUpdateSettingResponse>

  getErc20Token: ({}) => Observable<GrpcGetErc20TokenResponse>
  getChainNetwork: ({}) => Observable<GrpcGetChainNetworkResponse>

  /**
   * * Blacklist address
   */
  getListBlacklist: (
    request: BaseFilterQuery,
  ) => Observable<GrpcGetBlacklistAddressResponse>

  addListBlacklist: (
    request: GrpcAddListBlacklistQuery,
  ) => Observable<GrpcGetBlacklistAddressResponse>

  updateIgnoreBlacklist: (
    request: GrpcUpdateIgnoreBlacklistQuery,
  ) => Observable<GrpcUpdateBlacklistAddressResponse>

  updateBlacklist: (
    request: UpdateBlacklistAddressQuery,
  ) => Observable<GrpcUpdateBlacklistAddressResponse>

  removeBlacklist: (request: {
    id: number
  }) => Observable<GrpcRemoveBlacklistAddressResponse>

  /**
   * * Blacklist address
   */
  getListBlacklistUser: (
    request: BasePaginationQuery,
  ) => Observable<GrpcGetBlacklistUserResponse>

  addListBlacklistUser: (
    request: GrpcAddListBlacklistUserQuery,
  ) => Observable<GrpcGetBlacklistUserResponse>

  updateIgnoreBlacklistUser: (
    request: GrpcUpdateIgnoreBlacklistUserQuery,
  ) => Observable<GrpcUpdateBlacklistUserResponse>

  updateBlacklistUser: (
    request: UpdateBlacklistUserQuery,
  ) => Observable<GrpcUpdateBlacklistUserResponse>

  removeBlacklistUser: (request: {
    id: number
  }) => Observable<GrpcRemoveBlacklistUserResponse>

  getSmartContract: (request: {
    address: string
    chainCode: string
  }) => Observable<GrpcSmartContractResponse>

  createManualDeposit: (
    request: CreateManualDepositBodyDto,
  ) => Observable<GrpcCreateManualDepositResponse>

  retryManualDeposit: (
    request: RetryDepositDto,
  ) => Observable<GrpcRetryDepositResponse>

  retryFailedWithdraw: (
    request: RetryFailedWithdrawDto,
  ) => Observable<GrpcRetryFailedWithdrawResponse>

  forceStopQueue: (
    request: StopProcessingWithdrawDto,
  ) => Observable<GrpcStopWithdrawResponse>

  exportDeposit: (
    request: BaseFilterQuery,
  ) => Observable<GrpcGetDepositResponse>

  exportWithdraw: (
    request: BaseFilterQuery,
  ) => Observable<GrpcGetDepositResponse>

  getDepositById: (request: {
    id: number
  }) => Observable<GrpcDepositByIdResponse>

  getWithdrawById: (request: {
    id: number
  }) => Observable<GrpcWithdrawByIdResponse>

  getTrezorWallet: (
    request: FilterTrezorWalletQuery,
  ) => Observable<GrpcGetTrezorWalletResponse>

  getTrezorCollectorAddress: ({}) => Observable<GrpcGetTrezorCollectorAddressResponse>

  createTrezorTransaction: (
    params: CreateTrezorTransactionParams,
  ) => Observable<GrpcCreateTrezorTransactionResponse>
}
