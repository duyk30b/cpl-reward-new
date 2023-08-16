import { catchError, lastValueFrom, map } from 'rxjs'
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

import { ParseResponseGrpcHotWallet } from '@lib/grpc-client/grpc-client.helper'

import { Constants } from '../constants'

import { IGrpcWalletBceAdmin } from '../interfaces'
import {
  BceApproveTransactionRequest,
  BceApproveTransactionResponse,
  BceBaseWithdrawalSecurityResponse,
  BceBOProfitResponse,
  BceBOTotalRecordResponse,
  BceConfigTransactionApprovalDto,
  BceDepositHistoryRequest,
  BceExportFileDto,
  BceExportFileRequest,
  BceExternalWithdrawDto,
  BceExternalWithdrawRequest,
  BceGetUserBalanceRequest,
  BceRegistrationRemittanceRequest,
  BceTransactionDetail,
  BceTransactionDetailRequest,
  BceUserBalanceResponse,
  BceWithdrawalSecurityRequest,
  BceWithdrawHistoryRequest,
  GetGlobalSettingResponse,
  GlobalUsdtFeeSettingParams,
  GrpcBceApproveTransactionResponse,
  GrpcBceBaseWithdrawalSecurityResponse,
  GrpcBceBOProfitResponse,
  GrpcBceBOTotalRecordResponse,
  GrpcBceConfigTransactionApprovalResponse,
  GrpcBceExportFileResponse,
  GrpcBceExternalWithdrawResponse,
  GrpcBceListExportFileResponse,
  GrpcBceTransactionDetailResponse,
  GrpcBceUserBalanceResponse,
  GrpcDepositHistoryResponse,
  GrpcGetGlobalSettingResponse,
  GrpcUpdateWithdrawalSettingResponse,
  GrpcWithdrawalSettingPaginationResponse,
  GrpcWithdrawHistoryResponse,
  SettingPaginationRequest,
  UpdateWithdrawalSettingParams,
  UpdateWithdrawalSettingResponse,
  WithdrawalSettingPaginationResponse,
} from '../dtos/wallet-bce-admin.dto'

@Injectable()
export class WalletBceAdminService implements OnModuleInit {
  private grpcWalletBceAdmin: IGrpcWalletBceAdmin

  constructor(
    @Inject(Constants.GRPC_WALLET_BCE_ADMIN_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcWalletBceAdmin = this.clientGrpc.getService(
      Constants.GRPC_WALLET_BCE_ADMIN_SERVICE,
    )
  }

  async depositHistories(
    query: BceDepositHistoryRequest,
  ): Promise<GrpcDepositHistoryResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.depositHistories(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceExternalWithdrawDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async depositHistoryExport(
    query: BceDepositHistoryRequest,
  ): Promise<GrpcBceExportFileResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.depositHistoryExport(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BceExportFileDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async withdrawHistories(
    query: BceWithdrawHistoryRequest,
  ): Promise<GrpcWithdrawHistoryResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.withdrawHistories(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceExternalWithdrawDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async withdrawHistoryExport(
    query: BceWithdrawHistoryRequest,
  ): Promise<GrpcBceExportFileResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.withdrawHistoryExport(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BceExportFileDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async listExportFile(
    query: BceExportFileRequest,
  ): Promise<GrpcBceListExportFileResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.listExportFile(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BceExportFileDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getExternalWithdraw(
    query: BceExternalWithdrawRequest,
  ): Promise<GrpcBceExternalWithdrawResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getExternalWithdraw(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceExternalWithdrawDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async exportWithdrawControl(
    query: BceExternalWithdrawRequest,
  ): Promise<GrpcBceExportFileResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.exportWithdrawControl(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BceExportFileDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getTransactionDetail(
    query: BceTransactionDetailRequest,
  ): Promise<GrpcBceTransactionDetailResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getTransactionDetail(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceTransactionDetail, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async approveTransaction(
    query: BceApproveTransactionRequest,
  ): Promise<GrpcBceApproveTransactionResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.approveTransaction(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceApproveTransactionResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async registrationRemittance(
    query: BceRegistrationRemittanceRequest,
  ): Promise<GrpcBceTransactionDetailResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.registrationRemittance(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceTransactionDetail, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getBoTotalRecord(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBOTotalRecordResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getBoTotalRecord(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBOTotalRecordResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getBoProfit(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBOProfitResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getBoProfit(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBOProfitResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getOrderMinutelyRating(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBaseWithdrawalSecurityResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getOrderMinutelyRating(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBaseWithdrawalSecurityResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getOrderDailyRating(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBaseWithdrawalSecurityResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getOrderDailyRating(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBaseWithdrawalSecurityResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getOrderOverLimit(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBaseWithdrawalSecurityResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getOrderOverLimit(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBaseWithdrawalSecurityResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getUserBalance(
    query: BceGetUserBalanceRequest,
  ): Promise<GrpcBceUserBalanceResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getUserBalance(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceUserBalanceResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getManuallyUpdateMajorBalance(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBaseWithdrawalSecurityResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getManuallyUpdateMajorBalance(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBaseWithdrawalSecurityResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getDividendCodeDuplicated(
    query: BceWithdrawalSecurityRequest,
  ): Promise<GrpcBceBaseWithdrawalSecurityResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getDividendCodeDuplicated(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceBaseWithdrawalSecurityResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getWithdrawalSettings(
    query: SettingPaginationRequest,
  ): Promise<GrpcWithdrawalSettingPaginationResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getWithdrawalSettings(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(
            WithdrawalSettingPaginationResponse,
            result,
          ),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateWithdrawalSettings(
    params: UpdateWithdrawalSettingParams,
  ): Promise<GrpcUpdateWithdrawalSettingResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.updateWithdrawalSetting(params).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(UpdateWithdrawalSettingResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getConfigTransactionApproval(): Promise<GrpcBceConfigTransactionApprovalResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getConfigTransactionApproval({}).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BceConfigTransactionApprovalDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateGlobalUsdtFeeSetting(
    params: GlobalUsdtFeeSettingParams,
  ): Promise<GrpcUpdateWithdrawalSettingResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.updateGlobalUsdtFeeSetting(params).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(
            WithdrawalSettingPaginationResponse,
            result,
          ),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getGlobalUsdtFeeSetting(): Promise<GrpcGetGlobalSettingResponse> {
    return lastValueFrom(
      this.grpcWalletBceAdmin.getGlobalSetting({}).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GetGlobalSettingResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }
}
