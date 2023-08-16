import { GrpcCrawlSettingService } from '@lib/grpc-client/bo/crawl-setting'
import { Injectable } from '@nestjs/common'
import {
  ApiCreateBOCrawlSettingDTO,
  ApiUpdateBOCrawlSettingDTO,
  ApiDeleteBOCrawlSettingDTO,
} from './crawl-setting.dto'

@Injectable()
export class CrawlSettingService {
  /**
   * constructor
   * @param grpcSettingService
   */
  constructor(
    private readonly grpcCrawlSettingService: GrpcCrawlSettingService,
  ) {}

  //BO Crawl Setting
  /**
   * getBOCrawlSetting
   * @param filter
   * @returns
   */
  async getBOCrawlSetting(filter) {
    const data = await this.grpcCrawlSettingService.getBOCrawlSetting(filter)
    return data.data
  }

  /**
   * createBOCrawlSetting
   * @param apiCreateBOCrawlSettingDTO
   * @returns
   */
  async createBOCrawlSetting(
    apiCreateBOCrawlSettingDTO: ApiCreateBOCrawlSettingDTO,
  ) {
    return await this.grpcCrawlSettingService.createBOCrawlSetting(
      apiCreateBOCrawlSettingDTO,
    )
  }

  /**
   * updateBOCrawlSetting
   * @param apiUpdateBOCrawlSettingDTO
   * @returns
   */
  async updateBOCrawlSetting(
    apiUpdateBOCrawlSettingDTO: ApiUpdateBOCrawlSettingDTO,
  ) {
    return await this.grpcCrawlSettingService.updateBOCrawlSetting(
      apiUpdateBOCrawlSettingDTO,
    )
  }

  /**
   * updateBOCrawlSettings
   * @param apiUpdateBOCrawlSettingsDTO
   * @returns
   */
  async updateBOCrawlSettings(
    apiUpdateBOCrawlSettingsDTO: ApiUpdateBOCrawlSettingDTO[],
  ) {
    apiUpdateBOCrawlSettingsDTO.forEach(async (item) => {
      await this.grpcCrawlSettingService.updateBOCrawlSetting(item)
    })

    return true
  }

  /**
   * deleteBOCrawlSetting
   * @param apiDeleteBOCrawlSettingDTO
   * @returns
   */
  async deleteBOCrawlSetting(
    apiDeleteBOCrawlSettingDTO: ApiDeleteBOCrawlSettingDTO,
  ) {
    return await this.grpcCrawlSettingService.deleteBOCrawlSetting(
      apiDeleteBOCrawlSettingDTO,
    )
  }
}
