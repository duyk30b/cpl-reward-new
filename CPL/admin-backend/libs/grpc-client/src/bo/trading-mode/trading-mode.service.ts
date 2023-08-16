import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  BOPeriodResponseDto,
  BOTradingMode,
  FormatModeGrpc,
  GrpcTradingModeDTO,
  GrpcTradingModeResponseDTO,
  PeriodResponseDTO,
} from './trading-mode.dto'
import {
  IGrpcTradingModeAddRequest,
  IGrpcTradingModeDeleteRequest,
  IGrpcTradingModeFindOneRequest,
  IGrpcTradingModeRequest,
  IGrpcTradingModeService,
  IGrpcTradingModeUpdateRequest,
} from './trading-mode.interface'

@Injectable()
export class GrpcTradingModeService {
  private grpcTradingModesService: IGrpcTradingModeService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_TRADING_MODE_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcTradingModesService =
      this.client.getService<IGrpcTradingModeService>('BOTradingModeService')
  }

  /**
   * list
   * @param listRequest
   * @returns
   */
  async list(
    listRequest: IGrpcTradingModeRequest,
  ): Promise<GrpcTradingModeResponseDTO> {
    const result = await firstValueFrom(
      this.grpcTradingModesService.list(listRequest),
    )

    if (listRequest.getOnly) {
      result.data.items = result.data.items.map(
        (item) => new FormatModeGrpc(item),
      )
    }
    return ParseResponseGrpc<GrpcTradingModeResponseDTO>(BOTradingMode, result)
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcTradingModeRequest) {
    const result = await firstValueFrom(
      this.grpcTradingModesService.export(listRequest),
    )

    return result
  }

  /**
   * findOne
   * @param findOneRequest
   * @returns
   */
  async findOne(
    findOneRequest: IGrpcTradingModeFindOneRequest,
  ): Promise<GrpcTradingModeResponseDTO> {
    const result = await firstValueFrom(
      this.grpcTradingModesService.findOne(findOneRequest),
    )

    return ParseResponseGrpc<GrpcTradingModeResponseDTO>(BOTradingMode, result)
  }

  /**
   * create
   * @returns
   */
  async create(
    createRequest: IGrpcTradingModeAddRequest,
  ): Promise<GrpcTradingModeResponseDTO> {
    const result = await lastValueFrom(
      this.grpcTradingModesService.create(createRequest),
    )

    return ParseResponseGrpc<GrpcTradingModeResponseDTO>(
      GrpcTradingModeDTO,
      result,
    )
  }

  /**
   * update
   * @returns
   */
  async update(
    updateRequest: IGrpcTradingModeUpdateRequest,
  ): Promise<GrpcTradingModeResponseDTO> {
    const result = await lastValueFrom(
      this.grpcTradingModesService.update(updateRequest),
    )

    return ParseResponseGrpc<GrpcTradingModeResponseDTO>(
      GrpcTradingModeDTO,
      result,
    )
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcTradingModeDeleteRequest,
  ): Promise<GrpcTradingModeResponseDTO> {
    const result = await lastValueFrom(
      this.grpcTradingModesService.delete(deleteRequest),
    )

    return ParseResponseGrpc<GrpcTradingModeResponseDTO>(
      GrpcTradingModeDTO,
      result,
    )
  }

  /**
   * getPeriod
   * @returns
   */
  async getPeriod(): Promise<PeriodResponseDTO> {
    const result = await firstValueFrom(
      this.grpcTradingModesService.getPeriod({}),
    )

    return ParseResponseGrpc<PeriodResponseDTO>(BOPeriodResponseDto, result)
  }
}
