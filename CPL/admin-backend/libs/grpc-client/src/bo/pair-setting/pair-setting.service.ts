import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcPairSettingDTO,
  GrpcPairSettingListResponseDTO,
  GrpcPairSettingResponseDTO,
} from './pair-setting.dto'
import {
  IGrpcPairSettingAddRequest,
  IGrpcPairSettingDeleteRequest,
  IGrpcPairSettingUpdateRequest,
  IGrpcPairSettingService,
  IGrpcPairSettingRequest,
} from './pair-setting.interface'

@Injectable()
export class GrpcPairSettingService {
  private grpcPairSettingService: IGrpcPairSettingService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_PAIR_SETTING_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcPairSettingService =
      this.client.getService<IGrpcPairSettingService>('BOPairSettingService')
  }

  /**
   * getPairSetting
   * @returns
   */
  async getPairSetting(filter): Promise<GrpcPairSettingListResponseDTO> {
    const result = await firstValueFrom(
      this.grpcPairSettingService.listPairSetting(filter),
    )
    return ParseResponseGrpc<GrpcPairSettingListResponseDTO>(
      GrpcPairSettingDTO,
      result,
    )
  }

  /**
   * addPairSetting
   * @returns
   */
  async addPairSetting(
    createRequest: IGrpcPairSettingAddRequest,
  ): Promise<GrpcPairSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcPairSettingService.addPairSetting(createRequest),
    )

    return ParseResponseGrpc<GrpcPairSettingResponseDTO>(
      GrpcPairSettingDTO,
      result,
    )
  }

  /**
   * updatePairSetting
   * @returns
   */
  async updatePairSetting(
    updateRequest: IGrpcPairSettingUpdateRequest,
  ): Promise<GrpcPairSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcPairSettingService.updatePairSetting(updateRequest),
    )

    return ParseResponseGrpc<GrpcPairSettingResponseDTO>(
      GrpcPairSettingDTO,
      result,
    )
  }

  /**
   * deletePairSetting
   * @param deleteRequest
   * @returns
   */
  async deletePairSetting(
    deleteRequest: IGrpcPairSettingDeleteRequest,
  ): Promise<GrpcPairSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcPairSettingService.deletePairSetting(deleteRequest),
    )
    return ParseResponseGrpc<GrpcPairSettingResponseDTO>(
      GrpcPairSettingDTO,
      result,
    )
  }

  /**
   * exportPairSetting
   * @param listRequest
   * @returns
   */
  async exportPairSetting(listRequest: IGrpcPairSettingRequest) {
    const result = await firstValueFrom(
      this.grpcPairSettingService.exportPairSetting(listRequest),
    )

    return result
  }
}
