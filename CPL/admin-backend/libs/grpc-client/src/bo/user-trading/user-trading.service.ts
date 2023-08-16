import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcUserTradingDTO,
  GrpcUserTradingResponseDTO,
  ListGrpcUserTradingResponseDTO,
  TradingLimitUserDTO,
} from './user-trading.dto'
import {
  IGrpcUserTradingListRequest,
  IGrpcUserTradingService,
  IGrpcRequestStatisticSummary,
  IGrpcRequestStatisticDetail,
  IGrpcRequestStatisticUser,
  IFilterHistoryOrderRequest,
} from './user-trading.interface'

@Injectable()
export class GrpcUserTradingService {
  private boUserTradingService: IGrpcUserTradingService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_USER_TRADING_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.boUserTradingService = this.client.getService<IGrpcUserTradingService>(
      'BOUserTradingService',
    )
  }

  /**
   * list
   * @param listRequest
   * @returns
   */
  async list(
    listRequest: IGrpcUserTradingListRequest,
  ): Promise<ListGrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.list(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUserTradingResponseDTO>(
      GrpcUserTradingDTO,
      result,
    )
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcUserTradingListRequest) {
    const result = await firstValueFrom(
      this.boUserTradingService.export(listRequest),
    )

    return result
  }

  /**
   * statisticSummary
   * @param listRequest
   * @returns
   */
  async statisticSummary(
    listRequest: IGrpcRequestStatisticSummary,
  ): Promise<GrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.statisticSummary(listRequest),
    )

    return ParseResponseGrpc<GrpcUserTradingResponseDTO>(
      GrpcUserTradingDTO,
      result,
    )
  }

  /**
   * exportStatisticSummary
   * @param listRequest
   * @returns
   */
  async exportStatisticSummary(listRequest: IGrpcRequestStatisticSummary) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportStatisticSummary(listRequest),
    )

    return result
  }

  /**
   * statisticDetail
   * @param listRequest
   * @returns
   */
  async statisticDetail(
    listRequest: IGrpcRequestStatisticDetail,
  ): Promise<GrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.statisticDetail(listRequest),
    )

    return ParseResponseGrpc<GrpcUserTradingResponseDTO>(
      GrpcUserTradingDTO,
      result,
    )
  }

  /**
   * exportStatisticDetail
   * @param listRequest
   * @returns
   */
  async exportStatisticDetail(listRequest: IGrpcRequestStatisticDetail) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportStatisticDetail(listRequest),
    )

    return result
  }

  /**
   * statisticUser
   * @param listRequest
   * @returns
   */
  async statisticUser(
    listRequest: IGrpcRequestStatisticUser,
  ): Promise<GrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.statisticUser(listRequest),
    )

    return ParseResponseGrpc<GrpcUserTradingResponseDTO>(
      GrpcUserTradingDTO,
      result,
    )
  }

  /**
   * exportStatisticUser
   * @param listRequest
   * @returns
   */
  async exportStatisticUser(listRequest: IGrpcRequestStatisticUser) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportStatisticUser(listRequest),
    )

    return result
  }

  /**
   * usersTradingLimit
   * @param listRequest
   * @returns
   */
  async usersTradingLimit(
    listRequest: IGrpcUserTradingListRequest,
  ): Promise<ListGrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.usersTradingLimit(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUserTradingResponseDTO>(
      TradingLimitUserDTO,
      result,
    )
  }

  /**
   * exportUsersTradingLimit
   * @param listRequest
   * @returns
   */
  async exportUsersTradingLimit(listRequest: IGrpcUserTradingListRequest) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportUsersTradingLimit(listRequest),
    )
    return result
  }

  /**
   * suspensionUsers
   * @param listRequest
   * @returns
   */
  async suspensionUsers(
    listRequest: IGrpcUserTradingListRequest,
  ): Promise<ListGrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.suspensionUsers(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUserTradingResponseDTO>(
      TradingLimitUserDTO,
      result,
    )
  }

  /**
   * suspensionModes
   * @param listRequest
   * @returns
   */
  async suspensionModes(
    listRequest: IFilterHistoryOrderRequest,
  ): Promise<ListGrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.suspensionModes(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUserTradingResponseDTO>(
      TradingLimitUserDTO,
      result,
    )
  }

  /**
   * suspensionPairs
   * @param listRequest
   * @returns
   */
  async suspensionPairs(
    listRequest: IGrpcUserTradingListRequest,
  ): Promise<ListGrpcUserTradingResponseDTO> {
    const result = await firstValueFrom(
      this.boUserTradingService.suspensionPairs(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUserTradingResponseDTO>(
      TradingLimitUserDTO,
      result,
    )
  }

  /**
   * exportSuspensionCommon
   * @param listRequest
   * @returns
   */
  async exportSuspensionCommon(listRequest: IGrpcUserTradingListRequest) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportSuspensionCommon(listRequest),
    )

    return result
  }

  /**
   * exportSuspensionTradeMode
   * @param listRequest
   * @returns
   */
  async exportSuspensionTradeMode(listRequest: IGrpcUserTradingListRequest) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportSuspensionTradeMode(listRequest),
    )

    return result
  }

  /**
   * exportSuspensionMarket
   * @param listRequest
   * @returns
   */
  async exportSuspensionMarket(listRequest: IGrpcUserTradingListRequest) {
    const result = await firstValueFrom(
      this.boUserTradingService.exportSuspensionMarket(listRequest),
    )

    return result
  }
}
