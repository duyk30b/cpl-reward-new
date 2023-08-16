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
import {
  BaseFilterQuery,
  GrpcGetDepositResponse,
  GrpcFilterIncidentCollectionQuery,
  GrpcGetIncidentCollectionResponse,
  GrpcPostIncidentCollectionResponse,
  GrpcGetWalletQuery,
  GrpcGetWalletResponse,
  GrpcGetWithdrawResponse,
  GrpcGetSettingQuery,
  GrpcGetSettingResponse,
  GrpcUpdateSettingBody,
  GrpcUpdateSettingResponse,
  WithdrawTransactionDto,
  SettingResponse,
  IncidentResponse,
  WalletDto,
  DepositTransactionDto,
  UpdateSettingResponse,
  Erc20TokenDto,
  BlacklistAddressDto,
  GrpcAddListBlacklistQuery,
  GrpcGetBlacklistAddressResponse,
  GrpcUpdateBlacklistAddressResponse,
  GrpcUpdateIgnoreBlacklistQuery,
  UpdateBlacklistAddressQuery,
  GrpcGetBlacklistUserResponse,
  BasePaginationQuery,
  BlacklistUserDto,
  GrpcAddListBlacklistUserQuery,
  GrpcUpdateIgnoreBlacklistUserQuery,
  GrpcUpdateBlacklistUserResponse,
  UpdateBlacklistUserQuery,
  GrpcGetErc20TokenResponse,
  GrpcGetChainNetworkResponse,
  ChainNetworkDto,
  GrpcSmartContractResponse,
  SmartContractDto,
  GrpcCreateManualDepositResponse,
  CreateManualDepositBodyDto,
  RetryDepositDto,
  GrpcRetryDepositResponse,
  GrpcExportResponse,
  GrpcRetryFailedWithdrawResponse,
  RetryFailedWithdrawDto,
  StopProcessingWithdrawDto,
  GrpcStopWithdrawResponse,
  GrpcWithdrawByIdResponse,
  GrpcDepositByIdResponse,
  GrpcDepositByIdData,
  GrpcWithdrawByIdData,
  GrpcGetTrezorWalletResponse,
  FilterTrezorWalletQuery,
  GrpcGetTrezorCollectorAddressResponse,
  CreateTrezorTransactionParams,
  GrpcCreateTrezorTransactionResponse,
} from '../dtos'
import { IGrpcHotWallet } from '../interfaces'

@Injectable()
export class HotWalletService implements OnModuleInit {
  private grpcHotWallet: IGrpcHotWallet

  constructor(
    @Inject(Constants.GRPC_HOT_WALLET_TOKEN)
    private readonly clientGrpc: ClientGrpc,
  ) {}

  public onModuleInit() {
    this.grpcHotWallet = this.clientGrpc.getService(
      Constants.GRPC_HOT_WALLET_SERVICE,
    )
  }

  async getDeposit(query: BaseFilterQuery): Promise<GrpcGetDepositResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getDeposit(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(DepositTransactionDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getWithdraw(query: BaseFilterQuery): Promise<GrpcGetWithdrawResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getWithdraw(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(WithdrawTransactionDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getWallet(query: GrpcGetWalletQuery): Promise<GrpcGetWalletResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getWallet(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(WalletDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  /**
   * * Incident
   */
  async getIncidentCollection(
    query: GrpcFilterIncidentCollectionQuery,
  ): Promise<GrpcGetIncidentCollectionResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getIncidentCollection(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(WalletDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }
  async postIncidentCollection(
    query: GrpcFilterIncidentCollectionQuery,
  ): Promise<GrpcPostIncidentCollectionResponse> {
    return lastValueFrom(
      this.grpcHotWallet.postIncidentCollection(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(IncidentResponse, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  /**
   * * Setting
   */
  async getSetting(
    query: GrpcGetSettingQuery,
  ): Promise<GrpcGetSettingResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getSetting(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(SettingResponse, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateSetting(
    body: GrpcUpdateSettingBody,
  ): Promise<GrpcUpdateSettingResponse> {
    return lastValueFrom(
      this.grpcHotWallet.updateSetting(body).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(UpdateSettingResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getErc20Token(): Promise<GrpcGetErc20TokenResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getErc20Token({}).pipe(
        map((result) => ParseResponseGrpcHotWallet(Erc20TokenDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getChainNetwork(): Promise<GrpcGetChainNetworkResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getChainNetwork({}).pipe(
        map((result) => ParseResponseGrpcHotWallet(ChainNetworkDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  /**
   * * Blacklist Address
   */
  async getListBlacklist(
    query: BaseFilterQuery,
  ): Promise<GrpcGetBlacklistAddressResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getListBlacklist(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BlacklistAddressDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async addListBlacklist(
    query: GrpcAddListBlacklistQuery,
  ): Promise<GrpcGetBlacklistAddressResponse> {
    return lastValueFrom(
      this.grpcHotWallet.addListBlacklist(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BlacklistAddressDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateIgnoreBlacklist(
    query: GrpcUpdateIgnoreBlacklistQuery,
  ): Promise<GrpcUpdateBlacklistAddressResponse> {
    return lastValueFrom(
      this.grpcHotWallet.updateIgnoreBlacklist(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BlacklistAddressDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateBlacklist(
    query: UpdateBlacklistAddressQuery,
  ): Promise<GrpcUpdateBlacklistAddressResponse> {
    return lastValueFrom(
      this.grpcHotWallet.updateBlacklist(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BlacklistAddressDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async removeBlacklist(query: {
    id: number
  }): Promise<GrpcUpdateBlacklistAddressResponse> {
    return lastValueFrom(
      this.grpcHotWallet.removeBlacklist(query).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(BlacklistAddressDto, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  /**
   * * Blacklist User
   */
  async getListBlacklistUser(
    query: BasePaginationQuery,
  ): Promise<GrpcGetBlacklistUserResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getListBlacklistUser(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BlacklistUserDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async addListBlacklistUser(
    query: GrpcAddListBlacklistUserQuery,
  ): Promise<GrpcGetBlacklistUserResponse> {
    return lastValueFrom(
      this.grpcHotWallet.addListBlacklistUser(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BlacklistUserDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateIgnoreBlacklistUser(
    query: GrpcUpdateIgnoreBlacklistUserQuery,
  ): Promise<GrpcUpdateBlacklistUserResponse> {
    return lastValueFrom(
      this.grpcHotWallet.updateIgnoreBlacklistUser(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BlacklistUserDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async updateBlacklistUser(
    query: UpdateBlacklistUserQuery,
  ): Promise<GrpcUpdateBlacklistUserResponse> {
    return lastValueFrom(
      this.grpcHotWallet.updateBlacklistUser(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BlacklistUserDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async removeBlacklistUser(query: {
    id: number
  }): Promise<GrpcUpdateBlacklistUserResponse> {
    return lastValueFrom(
      this.grpcHotWallet.removeBlacklistUser(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(BlacklistUserDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getSmartContractInfo(query: {
    address: string
    chainCode: string
  }): Promise<GrpcSmartContractResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getSmartContract(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(SmartContractDto, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async createManualDeposit(
    body: CreateManualDepositBodyDto,
  ): Promise<GrpcCreateManualDepositResponse> {
    return lastValueFrom(
      this.grpcHotWallet.createManualDeposit(body).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcCreateManualDepositResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async retryManualDeposit(
    data: RetryDepositDto,
  ): Promise<GrpcRetryDepositResponse> {
    return lastValueFrom(
      this.grpcHotWallet.retryManualDeposit(data).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcRetryDepositResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async retryFailedWithdraw(
    data: RetryFailedWithdrawDto,
  ): Promise<GrpcRetryFailedWithdrawResponse> {
    return lastValueFrom(
      this.grpcHotWallet.retryFailedWithdraw(data).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcRetryFailedWithdrawResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async stopWithdrawTransaction(
    data: StopProcessingWithdrawDto,
  ): Promise<GrpcStopWithdrawResponse> {
    return lastValueFrom(
      this.grpcHotWallet.forceStopQueue(data).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcStopWithdrawResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async exportDepositTransactions(
    query: BaseFilterQuery,
  ): Promise<GrpcExportResponse> {
    return lastValueFrom(
      this.grpcHotWallet.exportDeposit(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(GrpcExportResponse, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async exportWithdrawTransactions(
    query: BaseFilterQuery,
  ): Promise<GrpcExportResponse> {
    return lastValueFrom(
      this.grpcHotWallet.exportWithdraw(query).pipe(
        map((result) => ParseResponseGrpcHotWallet(GrpcExportResponse, result)),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getWithdrawById(id: number): Promise<GrpcWithdrawByIdResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getWithdrawById({ id }).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcWithdrawByIdData, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  async getDepositById(id: number): Promise<GrpcDepositByIdResponse> {
    return lastValueFrom(
      this.grpcHotWallet.getDepositById({ id }).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcDepositByIdData, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  getTrezorWallet(params: FilterTrezorWalletQuery) {
    return lastValueFrom(
      this.grpcHotWallet.getTrezorWallet(params).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(GrpcGetTrezorWalletResponse, result),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  getTrezorCollectorAddress() {
    return lastValueFrom(
      this.grpcHotWallet.getTrezorCollectorAddress({}).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(
            GrpcGetTrezorCollectorAddressResponse,
            result,
          ),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }

  createTrezorTransaction(params: CreateTrezorTransactionParams) {
    return lastValueFrom(
      this.grpcHotWallet.createTrezorTransaction(params).pipe(
        map((result) =>
          ParseResponseGrpcHotWallet(
            GrpcCreateTrezorTransactionResponse,
            result,
          ),
        ),
        catchError((error) => {
          throw new BadRequestException(error.details || error)
        }),
      ),
    )
  }
}
