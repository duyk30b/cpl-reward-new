import { GrpcPairSettingService } from '@lib/grpc-client/bo/pair-setting'
import { GrpcTradingPairService } from '@lib/grpc-client/bo/trading-pair'
import { Injectable } from '@nestjs/common'
import {
  ApiCreatePairSettingDTO,
  ApiUpdatePairSettingDTO,
  ApiDeletePairSettingDTO,
  ApiListPairSettingDTO,
} from './pair-setting.dto'

@Injectable()
export class PairSettingService {
  /**
   * constructor
   * @param grpcPairSettingService
   */
  constructor(
    private readonly grpcPairSettingService: GrpcPairSettingService,
    private readonly grpcTradingPairService: GrpcTradingPairService,
  ) {}

  //Pair Setting
  /**
   * getPairSetting
   * @param filter
   * @returns
   */
  async getPairSetting(filter) {
    const dataPairSetting = await this.grpcPairSettingService.getPairSetting(
      filter,
    )
    const dataTradingPair = await this.grpcTradingPairService.findAll(filter)

    const statusPair = dataTradingPair.data.data.reduce((prev, cur) => {
      prev[cur.id] = cur.active
      return prev
    }, {})
    // add status from bo_trading_pair to bo_pair_settings
    dataPairSetting.data.data.forEach((item) => {
      item.status = statusPair[item.id] === '1' ? true : false
    })
    return dataPairSetting.data
  }

  /**
   * addPairSetting
   * @param apiCreatePairSettingDTO
   * @returns
   */
  async addPairSetting(apiCreatePairSettingDTO: ApiCreatePairSettingDTO) {
    return await this.grpcPairSettingService.addPairSetting(
      apiCreatePairSettingDTO,
    )
  }

  /**
   * updatePairSettings
   * @param apiUpdatePairSettingsDTO
   * @returns
   */
  async updatePairSettings(
    apiUpdatePairSettingsDTO: ApiUpdatePairSettingDTO[],
  ) {
    apiUpdatePairSettingsDTO.forEach(async (item) => {
      await this.grpcPairSettingService.updatePairSetting(item)
    })

    return true
  }

  /**
   * updatePairSetting
   * @param apiUpdatePairSettingDTO
   * @returns
   */
  async updatePairSetting(apiUpdatePairSettingDTO: ApiUpdatePairSettingDTO) {
    return await this.grpcPairSettingService.updatePairSetting(
      apiUpdatePairSettingDTO,
    )
  }

  /**
   * deletePairSetting
   * @param apiDeletePairSettingDTO
   * @returns
   */
  async deletePairSetting(apiDeletePairSettingDTO: ApiDeletePairSettingDTO) {
    return await this.grpcPairSettingService.deletePairSetting(
      apiDeletePairSettingDTO,
    )
  }

  /**
   * exportPairSetting
   * @param listPairSettingDto
   * @returns
   */
  async exportPairSetting(listPairSettingDto: ApiListPairSettingDTO) {
    return await this.grpcPairSettingService.exportPairSetting(
      listPairSettingDto,
    )
  }
}
