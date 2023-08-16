import ApiService from '@/core/services/ApiService'
import {
  HighLowProfitModel,
  HighLowTotalRecordModel,
} from '@/models/high-low/HighLowSecurity'
import { ESecurityResult } from '@/models/security/WithdrawalSecurity'
import {
  GlobalWithdrawalSettingListResponse,
  GlobalWithdrawalSettingModel,
  GlobalWithdrawalSettingPayloadModel,
  GlobalWithdrawalSettingUpdatePayloadModel,
  IGlobalWithdrawalSettingFilterParams,
} from '@/models/setting-withdrawal/GlobalWithdrawal'
import {
  ApproveTransactionPayloadModel,
  BceConfigTransactionApprovalDto,
  IApproveTransactionParams,
  IRemitTransactionParams,
  RemitTransactionPayloadModel,
  TransactionApprovalModel,
  TransactionParamsPayloadModel,
} from '@/models/withdrawal-control/TransactionApproval'
import { plainToClass } from 'class-transformer'

export class WalletBceService {
  /**
   * * Withdrawal control
   */
  public static async getExternalWithdrawTransactions(params) {
    return await ApiService.get(
      `api-wallet-bce-admin/transactions/external-withdraws`,
      { params },
    )
  }

  public static async exportWithdrawControl(params) {
    return await ApiService.get(
      `api-wallet-bce-admin/transactions/external-withdraws/export`,
      { params },
    )
  }

  /**
   * * History
   */
  public static async getBceDepositHistory(params) {
    return await ApiService.get('api-wallet-bce-admin/deposit-history', {
      params,
    })
  }

  public static async exportDepositHistory(params) {
    return await ApiService.get('api-wallet-bce-admin/deposit-history/export', {
      params,
    })
  }

  public static async getBceWithdrawHistory(params) {
    return await ApiService.get('api-wallet-bce-admin/withdraw-history', {
      params,
    })
  }

  public static async exportWithdrawHistory(params) {
    return await ApiService.get(
      'api-wallet-bce-admin/withdraw-history/export',
      {
        params,
      },
    )
  }

  public static async getListFileExport(params) {
    return await ApiService.get('api-wallet-bce-admin/file-export', {
      params,
    })
  }

  public static async downloadFileExport(params) {
    return await ApiService.get('api-wallet-bce-admin/file-export/download', {
      params,
    })
  }

  public static async getGlobalWithdrawalSettings(
    params: IGlobalWithdrawalSettingFilterParams,
  ): Promise<GlobalWithdrawalSettingListResponse> {
    const transformedParams = plainToClass(
      GlobalWithdrawalSettingPayloadModel,
      params,
    )

    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-setting',
      { params: transformedParams },
    )

    const settings = plainToClass(
      GlobalWithdrawalSettingListResponse,
      res.data.data,
    )

    return settings
  }

  public static async updateGlobalWithdrawalSettings(
    body: GlobalWithdrawalSettingModel,
  ): Promise<boolean> {
    const transformedBody = plainToClass(
      GlobalWithdrawalSettingUpdatePayloadModel,
      body,
    )

    const res = await ApiService.put(
      'api-wallet-bce-admin/withdrawal-setting',
      transformedBody,
    )

    return res.data.data.result
  }

  public static async getTransactionDetail(
    transactionId: string,
  ): Promise<TransactionApprovalModel> {
    const transformedParams = plainToClass(TransactionParamsPayloadModel, {
      transactionId,
    })

    const res = await ApiService.get(
      '/api-wallet-bce-admin/transactions/detail',
      { params: transformedParams },
    )

    const details = plainToClass(TransactionApprovalModel, res.data.data, {
      excludeExtraneousValues: true,
    })

    return details
  }

  public static async approveTransaction(
    body: IApproveTransactionParams,
  ): Promise<any> {
    const transformedBody = plainToClass(ApproveTransactionPayloadModel, body)

    const res = await ApiService.post(
      '/api-wallet-bce-admin/transactions/approve',
      transformedBody,
    )

    return res.data.data
  }

  public static async rejectTransaction(
    body: IApproveTransactionParams,
  ): Promise<any> {
    const transformedBody = plainToClass(ApproveTransactionPayloadModel, body)

    const res = await ApiService.post(
      'api-wallet-bce-admin/transactions/reject',
      transformedBody,
    )

    return res.data.data
  }

  public static async remitTransaction(
    body: IRemitTransactionParams,
  ): Promise<any> {
    const transformedBody = plainToClass(RemitTransactionPayloadModel, body)

    const res = await ApiService.post(
      '/api-wallet-bce-admin/transactions/registration-remittance',
      transformedBody,
    )

    return res.data.data
  }

  public static async checkHighLowTotalRecord(userId: number) {
    const res = await ApiService.get(
      `api-wallet-bce-admin/bo/get-total-record`,
      { params: { user_id: userId } },
    )

    return plainToClass(HighLowTotalRecordModel, res.data.data)
  }

  public static async checkHighLowProfit(userId: number) {
    const res = await ApiService.get(`api-wallet-bce-admin/bo/get-profit`, {
      params: { user_id: userId },
    })

    return plainToClass(HighLowProfitModel, res.data.data)
  }

  public static async checkOrderMinutelyRating(
    userId: number,
  ): Promise<boolean> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-security/order-minutely-rating',
      { params: { user_id: userId } },
    )

    return res.data.data.result === ESecurityResult.SUCCESS
  }

  public static async checkOrderDailyRating(userId: number): Promise<boolean> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-security/order-daily-rating',
      { params: { user_id: userId } },
    )

    return res.data.data.result === ESecurityResult.SUCCESS
  }

  public static async checkOrderOverLimit(userId: number): Promise<boolean> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-security/order-over-limit',
      { params: { user_id: userId } },
    )

    return res.data.data.result === ESecurityResult.SUCCESS
  }

  public static async checkUserBalance(
    userId: number,
    currency: string,
  ): Promise<boolean> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-security/user-balance',
      { params: { user_id: userId, currency } },
    )

    return res.data.data.result === ESecurityResult.SUCCESS
  }

  public static async checkManuallyUpdateMajorBalance(
    userId: number,
  ): Promise<boolean> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-security/manually-update-major-balance',
      { params: { user_id: userId } },
    )

    return res.data.data.result === ESecurityResult.SUCCESS
  }

  public static async checkDividendCodeDuplicated(
    userId: number,
  ): Promise<boolean> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/withdrawal-security/dividend-code-duplicated',
      { params: { user_id: userId } },
    )

    return res.data.data.result === ESecurityResult.SUCCESS
  }

  public static async getConfigTransactionApproval(): Promise<BceConfigTransactionApprovalDto> {
    const res = await ApiService.get(
      'api-wallet-bce-admin/config-transaction-approval',
    )

    return plainToClass(BceConfigTransactionApprovalDto, res.data.data)
  }
}
