import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { FindOneByIdDTO } from 'apps/api/src/api-bo/setting/setting.dto'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  BOTradingMode,
  GrpcBOSettingDTO,
  GrpcBOSettingResponseDTO,
  GrpcBTCTransferSettingDTO,
  GrpcBTCTransferSettingResponseDTO,
  GrpcSettingResponseDTO,
  GrpcTradingModeResponseDTO,
} from './setting.dto'
import {
  IGrpcBOMajorCoinDtoAddRequest,
  IGrpcBOMajorCoinDtoFindOneRequest,
  IGrpcBOMajorCoinDtoUpdateRequest,
  IGrpcBOSettingAddRequest,
  IGrpcBOSettingDeleteRequest,
  IGrpcBOSettingUpdateRequest,
  IGrpcSettingService,
} from './setting.interface'

@Injectable()
export class GrpcSettingService {
  private grpcBOSettingService: IGrpcSettingService

  /**
   * constructor
   * @param client
   */
  constructor(
    @Inject('BO_SETTING_TRADING_PACKAGE') private client: ClientGrpc,
  ) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcBOSettingService =
      this.client.getService<IGrpcSettingService>('BOSettingService')
  }

  /**
   * getOneMode
   * @param id
   * @returns
   */
  async getOneMode(id: FindOneByIdDTO): Promise<GrpcTradingModeResponseDTO> {
    const result = await firstValueFrom(
      this.grpcBOSettingService.getOneMode(id),
    )
    return ParseResponseGrpc<GrpcTradingModeResponseDTO>(BOTradingMode, result)
  }

  /**
   * getBOSetting
   * @returns
   */
  async getBOSetting(filter): Promise<GrpcSettingResponseDTO> {
    const result = await firstValueFrom(
      this.grpcBOSettingService.listBOSetting(filter),
    )
    return ParseResponseGrpc<GrpcSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * createBOSetting
   * @returns
   */
  async createBOSetting(
    createRequest: IGrpcBOSettingAddRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.addBOSetting(createRequest),
    )

    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * updateBOSetting
   * @returns
   */
  async updateBOSetting(
    updateRequest: IGrpcBOSettingUpdateRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.updateBOSetting(updateRequest),
    )

    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * deleteBOSetting
   * @param deleteRequest
   * @returns
   */
  async deleteBOSetting(
    deleteRequest: IGrpcBOSettingDeleteRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.deleteBOSetting(deleteRequest),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * getBTCTransferSetting
   * @returns
   */
  async getBTCTransferSetting(): Promise<GrpcBTCTransferSettingResponseDTO> {
    const result = await firstValueFrom(
      this.grpcBOSettingService.getBTCTransferSetting({}),
    )
    if (result.data && result.data.items) {
      const keyCodes = [
        'btc_transfer_fee',
        'btc_transfer_max_fee',
        'btc_transfer_min_fee',
        'btc_transfer_max_amount',
        'btc_transfer_min_amount',
        'btc_transfer_fee_ratio',
        'btc_transfer_active',
      ]
      result.data.items = result.data.items.filter((item) =>
        keyCodes.includes(item.code),
      )
    }
    return ParseResponseGrpc<GrpcBTCTransferSettingResponseDTO>(
      GrpcBTCTransferSettingDTO,
      result,
    )
  }

  /**
   * updateBTCTransferSetting
   * @returns
   */
  async updateBTCTransferSetting(
    updateRequest: IGrpcBOSettingUpdateRequest[],
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.updateBTCTransferSetting({
        items: updateRequest,
      }),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * getMajorCoin
   * @returns
   */
  async getMajorCoin(): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.getMajorCoin({}),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * getDetailMajorCoin
   * @returns
   */
  async getDetailMajorCoin(
    findOneRequest: IGrpcBOMajorCoinDtoFindOneRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.getDetailMajorCoin(findOneRequest),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  async createMajorCoin(
    createRequest: IGrpcBOMajorCoinDtoAddRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.createMajorCoin(createRequest),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  async updateMajorCoin(
    updateRequest: IGrpcBOMajorCoinDtoUpdateRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.updateMajorCoin(updateRequest),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }

  /**
   * deleteMajorCoin
   * @returns
   */
  async deleteMajorCoin(
    deleteRequest: IGrpcBOMajorCoinDtoFindOneRequest,
  ): Promise<GrpcBOSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBOSettingService.deletelMajorCoin(deleteRequest),
    )
    return ParseResponseGrpc<GrpcBOSettingResponseDTO>(GrpcBOSettingDTO, result)
  }
}
