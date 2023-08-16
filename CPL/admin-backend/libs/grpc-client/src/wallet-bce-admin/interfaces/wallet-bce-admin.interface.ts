import { Observable } from 'rxjs'
import {
  BceApproveTransactionRequest,
  BceExportFileRequest,
  BceExternalWithdrawRequest,
  BceRegistrationRemittanceRequest,
  BceTransactionDetailRequest,
  BceWithdrawHistoryRequest,
  GrpcBceApproveTransactionResponse,
  GrpcBceExportFileResponse,
  GrpcBceExternalWithdrawResponse,
  GrpcDepositHistoryResponse,
  GrpcWithdrawHistoryResponse,
  GrpcBceTransactionDetailResponse,
  BceWithdrawalSecurityRequest,
  GrpcBceBOTotalRecordResponse,
  GrpcBceBOProfitResponse,
  GrpcBceBaseWithdrawalSecurityResponse,
  BceGetUserBalanceRequest,
  GrpcBceUserBalanceResponse,
  SettingPaginationRequest,
  GrpcWithdrawalSettingPaginationResponse,
  GrpcUpdateWithdrawalSettingResponse,
  UpdateWithdrawalSettingParams,
  GrpcBceListExportFileResponse,
  GrpcBceConfigTransactionApprovalResponse,
  GlobalUsdtFeeSettingParams,
  GrpcGetGlobalSettingResponse,
} from '../dtos/wallet-bce-admin.dto'
import { BceDepositHistoryRequest } from '../dtos/wallet-bce-admin.dto'

export interface IGrpcWalletBceAdmin {
  depositHistories: (
    request: BceDepositHistoryRequest,
  ) => Observable<GrpcDepositHistoryResponse>

  depositHistoryExport: (
    request: BceDepositHistoryRequest,
  ) => Observable<GrpcBceExportFileResponse>

  getConfigTransactionApproval: ({}) => Observable<GrpcBceConfigTransactionApprovalResponse>

  withdrawHistories: (
    request: BceWithdrawHistoryRequest,
  ) => Observable<GrpcWithdrawHistoryResponse>

  withdrawHistoryExport: (
    request: BceWithdrawHistoryRequest,
  ) => Observable<GrpcBceExportFileResponse>

  listExportFile: (
    request: BceExportFileRequest,
  ) => Observable<GrpcBceListExportFileResponse>

  getExternalWithdraw: (
    request: BceExternalWithdrawRequest,
  ) => Observable<GrpcBceExternalWithdrawResponse>

  exportWithdrawControl: (
    request: BceExternalWithdrawRequest,
  ) => Observable<GrpcBceExportFileResponse>

  getTransactionDetail: (
    request: BceTransactionDetailRequest,
  ) => Observable<GrpcBceTransactionDetailResponse>

  approveTransaction: (
    request: BceApproveTransactionRequest,
  ) => Observable<GrpcBceApproveTransactionResponse>

  registrationRemittance: (
    request: BceRegistrationRemittanceRequest,
  ) => Observable<GrpcBceTransactionDetailResponse>

  getBoTotalRecord: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBOTotalRecordResponse>

  getBoProfit: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBOProfitResponse>

  getOrderMinutelyRating: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBaseWithdrawalSecurityResponse>

  getOrderDailyRating: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBaseWithdrawalSecurityResponse>

  getOrderOverLimit: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBaseWithdrawalSecurityResponse>

  getUserBalance: (
    request: BceGetUserBalanceRequest,
  ) => Observable<GrpcBceUserBalanceResponse>

  getManuallyUpdateMajorBalance: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBaseWithdrawalSecurityResponse>

  getDividendCodeDuplicated: (
    request: BceWithdrawalSecurityRequest,
  ) => Observable<GrpcBceBaseWithdrawalSecurityResponse>

  getWithdrawalSettings: (
    request: SettingPaginationRequest,
  ) => Observable<GrpcWithdrawalSettingPaginationResponse>

  updateWithdrawalSetting: (
    request: UpdateWithdrawalSettingParams,
  ) => Observable<GrpcUpdateWithdrawalSettingResponse>

  updateGlobalUsdtFeeSetting: (
    request: GlobalUsdtFeeSettingParams,
  ) => Observable<GrpcWithdrawalSettingPaginationResponse>

  getGlobalSetting: ({}) => Observable<GrpcGetGlobalSettingResponse>
}
