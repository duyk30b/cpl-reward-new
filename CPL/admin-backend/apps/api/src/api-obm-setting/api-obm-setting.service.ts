import { Injectable } from '@nestjs/common'
import { ObmSettingService } from '@lib/grpc-client/obm-setting'
import {
  bodyGeneric,
  OBMExchangeParams,
  ObmExchangeSettingDTO,
  OBMPairParams,
  ObmPairSettingDTO,
  OBMSystemTargetParams,
} from '@lib/grpc-client/obm-setting/obm-setting.dto'
import {
  IOBMSystemTarget,
  PairActiveRes,
  IPairPropertyItem,
  IOBMBalance,
  IOBMThreshold,
} from '@lib/grpc-client/obm-setting/obm-setting.interface'

@Injectable()
export class ApiObmSettingService {
  constructor(private readonly obmSettingService: ObmSettingService) {}

  async getOBMPairSetting(
    query: OBMPairParams,
  ): Promise<bodyGeneric<IPairPropertyItem>> {
    return await this.obmSettingService.getOBMPairSetting(query)
  }

  async getOBMPairActive(): Promise<bodyGeneric<PairActiveRes>> {
    return await this.obmSettingService.getOBMPairActive()
  }

  async updatePairSetting(body: ObmPairSettingDTO): Promise<ObmPairSettingDTO> {
    return await this.obmSettingService.updatePairSetting(body)
  }

  async getOBMExchangeSetting(
    query: OBMExchangeParams,
  ): Promise<ObmExchangeSettingDTO> {
    return await this.obmSettingService.getExchange(query)
  }

  async updateExchangeSetting(
    body: ObmExchangeSettingDTO,
  ): Promise<ObmExchangeSettingDTO> {
    return await this.obmSettingService.updateExchangeSetting(body)
  }

  async getOBMSystemTarget(
    query: OBMSystemTargetParams,
  ): Promise<IOBMSystemTarget> {
    return await this.obmSettingService.getSystemTarget(query)
  }

  async getOBMBalance(): Promise<IOBMBalance> {
    return await this.obmSettingService.getBalanceSetting()
  }

  async getOBMThreshold(): Promise<IOBMThreshold> {
    return await this.obmSettingService.getThresholdSetting()
  }

  async deletePairInExchange(query: OBMSystemTargetParams): Promise<string> {
    return await this.obmSettingService.deletePairInExchange(query)
  }
}
