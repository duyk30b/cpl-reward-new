import { GrpcSettingService } from '@lib/grpc-client/bo/setting/setting.service'
import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import {
  ApiCreateBOSettingDTO,
  ApiUpdateBOSettingDTO,
  ApiDeleteBOSettingDTO,
  ApiFindOneBOMajorCoinDto,
  ApiUpdateBOMajorCoinDto,
  ApiCreateBOMajorCoinDto,
} from './setting.dto'

@Injectable()
export class SettingService {
  /**
   * constructor
   * @param grpcSettingService
   */
  constructor(
    private readonly grpcSettingService: GrpcSettingService,
    private readonly httpService: HttpService,
  ) {}

  //BO Setting
  /**
   * getBOSetting
   * @param filter
   * @returns
   */
  async getBOSetting(filter) {
    const data = await this.grpcSettingService.getBOSetting(filter)
    return data.data
  }

  /**
   * createBOSetting
   * @param apiCreateBOSettingDTO
   * @returns
   */
  async createBOSetting(apiCreateBOSettingDTO: ApiCreateBOSettingDTO) {
    return await this.grpcSettingService.createBOSetting(apiCreateBOSettingDTO)
  }

  /**
   * updateBOSettings
   * @param apiUpdateBOSettingsDTO
   * @returns
   */
  async updateBOSettings(apiUpdateBOSettingsDTO: ApiUpdateBOSettingDTO[]) {
    apiUpdateBOSettingsDTO.forEach(async (item) => {
      await this.grpcSettingService.updateBOSetting(item)
    })
    return true
  }

  /**
   * updateBOSetting
   * @param apiUpdateBOSettingDTO
   * @returns
   */
  async updateBOSetting(apiUpdateBOSettingDTO: ApiUpdateBOSettingDTO) {
    return await this.grpcSettingService.updateBOSetting(apiUpdateBOSettingDTO)
  }

  /**
   * deleteBOSetting
   * @param apiDeleteBOSettingDTO
   * @returns
   */
  async deleteBOSetting(apiDeleteBOSettingDTO: ApiDeleteBOSettingDTO) {
    return await this.grpcSettingService.deleteBOSetting(apiDeleteBOSettingDTO)
  }

  /**
   * getBTCTransferSetting
   * @returns
   */
  async getBTCTransferSetting() {
    const data = await this.grpcSettingService.getBTCTransferSetting()
    return data.data
  }

  /**
   * getBTCTransferHistoryUrl
   * @returns
   */
  getBTCTransferHistoryUrl() {
    return process.env.SWAP_API
  }

  /**
   * actionGetUrl
   * @param url
   * @param params
   * @returns
   */
  async actionGetUrl(url, params) {
    return (await firstValueFrom(this.httpService.get(url, { params }))).data
  }

  /**
   * getBTCTransferHistory
   * @param filter
   * @returns
   */
  async getBTCTransferHistory(filter) {
    const params = {
      page: filter.page,
      limit: filter.limit,
      sort: filter.sort,
      sortType: filter.sort_type,
      sort_type: filter.sort_type,
      start_date: filter.start_date,
      end_date: filter.end_date,
      currency: filter.currency,
      status: filter.status,
      search_text: filter.search_text,
      search_field: filter.search_field,
    }
    const swapUrl = 'http://swap-service-internal.bo/swaps'
    return await this.actionGetUrl(swapUrl, params)
  }

  /**
   * updateBTCTransferSetting
   * @param apiUpdateBOSettingDTO
   * @returns
   */
  async updateBTCTransferSetting(
    apiUpdateBOSettingDTO: ApiUpdateBOSettingDTO[],
  ) {
    return await this.grpcSettingService.updateBTCTransferSetting(
      apiUpdateBOSettingDTO,
    )
  }

  /**
   * getMajorCoin
   * @returns
   */
  async getMajorCoin() {
    return await this.grpcSettingService.getMajorCoin()
  }

  /**
   * getDetailMajorCoin
   * @param
   * @returns
   */
  async getDetailMajorCoin(apiFindOneBOMajorCoinDto: ApiFindOneBOMajorCoinDto) {
    return await this.grpcSettingService.getDetailMajorCoin(
      apiFindOneBOMajorCoinDto,
    )
  }

  /**
   * createMajorCoin
   * @param
   * @returns
   */
  async createMajorCoin(apiCreateBOMajorCoinDto: ApiCreateBOMajorCoinDto) {
    return await this.grpcSettingService.createMajorCoin(
      apiCreateBOMajorCoinDto,
    )
  }

  /**
   * updateMajorCoin
   * @param
   * @returns
   */
  async updateMajorCoin(apiUpdateBOMajorCoinDto: ApiUpdateBOMajorCoinDto) {
    return await this.grpcSettingService.updateMajorCoin(
      apiUpdateBOMajorCoinDto,
    )
  }

  /**
   * deleteMajorCoin
   * @param
   * @returns
   */
  async deleteMajorCoin(apiDeleteBOMajorCoinDto: ApiFindOneBOMajorCoinDto) {
    return await this.grpcSettingService.deleteMajorCoin(
      apiDeleteBOMajorCoinDto,
    )
  }
}
