import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  FormatCrawSettingGrpc,
  GrpcBOCrawlSettingDTO,
  GrpcBOCrawlSettingResponseDTO,
} from './crawl-setting.dto'
import {
  IGrpcBOCrawlSettingAddRequest,
  IGrpcBOCrawlSettingDeleteRequest,
  IGrpcBOCrawlSettingUpdateRequest,
  IGrpcSettingService,
} from './crawl-setting.interface'

@Injectable()
export class GrpcCrawlSettingService {
  private grpcCrawlSettingService: IGrpcSettingService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_CRAWL_SETTING_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcCrawlSettingService = this.client.getService<IGrpcSettingService>(
      'BOCrawlSettingService',
    )
  }

  /**
   * getBOCrawlSetting
   * @returns
   */
  async getBOCrawlSetting(filter): Promise<GrpcBOCrawlSettingResponseDTO> {
    const result = await firstValueFrom(
      this.grpcCrawlSettingService.listBOCrawlSetting(filter),
    )
    result.data.items = result.data.items.map(
      (item) => new FormatCrawSettingGrpc(item),
    )
    return ParseResponseGrpc<GrpcBOCrawlSettingResponseDTO>(
      GrpcBOCrawlSettingDTO,
      result,
    )
  }

  /**
   * createBOCrawlSetting
   * @returns
   */
  async createBOCrawlSetting(
    addGrpcBOCrawlSetting: IGrpcBOCrawlSettingAddRequest,
  ): Promise<GrpcBOCrawlSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcCrawlSettingService.addBOCrawlSetting(addGrpcBOCrawlSetting),
    )

    return ParseResponseGrpc<GrpcBOCrawlSettingResponseDTO>(
      GrpcBOCrawlSettingDTO,
      result,
    )
  }

  /**
   * updateBOCrawlSetting
   * @returns
   */
  async updateBOCrawlSetting(
    updateBOGrpcCrawlSetting: IGrpcBOCrawlSettingUpdateRequest,
  ): Promise<GrpcBOCrawlSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcCrawlSettingService.updateBOCrawlSetting(
        updateBOGrpcCrawlSetting,
      ),
    )

    return ParseResponseGrpc<GrpcBOCrawlSettingResponseDTO>(
      GrpcBOCrawlSettingDTO,
      result,
    )
  }

  /**
   * deleteBOCrawlSetting
   * @param deleteBOCrawlSetting
   * @returns
   */
  async deleteBOCrawlSetting(
    deleteBOCrawlSetting: IGrpcBOCrawlSettingDeleteRequest,
  ): Promise<GrpcBOCrawlSettingResponseDTO> {
    const result = await lastValueFrom(
      this.grpcCrawlSettingService.deleteBOCrawlSetting(deleteBOCrawlSetting),
    )
    return ParseResponseGrpc<GrpcBOCrawlSettingResponseDTO>(
      GrpcBOCrawlSettingDTO,
      result,
    )
  }
}
