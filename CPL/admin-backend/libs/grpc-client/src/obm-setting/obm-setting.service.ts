import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import {
  IGrpcObmSettingService,
  IOBMSystemTarget,
  PairActiveRes,
  IPairPropertyItem,
  IOBMBalance,
  IOBMThreshold,
} from './obm-setting.interface'
import {
  bodyGeneric,
  OBMExchangeParams,
  ObmExchangeSettingDTO,
  OBMPairParams,
  ObmPairSettingDTO,
  OBMSystemTargetParams,
} from './obm-setting.dto'
import { lastValueFrom } from 'rxjs'

@Injectable()
export class ObmSettingService {
  private gObmSettingService: IGrpcObmSettingService

  constructor(@Inject('OBM_SETTING_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gObmSettingService = this.client.getService<IGrpcObmSettingService>(
      'ObmSettingV2Service',
    )
  }

  async getOBMPairSetting(
    query: OBMPairParams,
  ): Promise<bodyGeneric<IPairPropertyItem>> {
    const obmSetting = await lastValueFrom(
      this.gObmSettingService.getOBMPairSetting(query),
    )
    return {
      name: obmSetting?.name,
      data: JSON.parse(obmSetting?.data),
    }
  }

  async getOBMPairActive(): Promise<bodyGeneric<PairActiveRes>> {
    const obmSetting = await lastValueFrom(
      this.gObmSettingService.getOBMPairActive({}),
    )
    return obmSetting
  }

  async updatePairSetting(body: ObmPairSettingDTO): Promise<ObmPairSettingDTO> {
    const obmPairSetting = await lastValueFrom(
      this.gObmSettingService.updatePairs(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return obmPairSetting
  }

  async getExchange(query: OBMExchangeParams): Promise<ObmExchangeSettingDTO> {
    const obmSetting = await lastValueFrom(
      this.gObmSettingService.getExchange(query),
    )
    return obmSetting
  }

  async updateExchangeSetting(
    body: ObmExchangeSettingDTO,
  ): Promise<ObmExchangeSettingDTO> {
    const obmExchangeSetting = await lastValueFrom(
      this.gObmSettingService.updateExchange(body),
    ).catch((error) => {
      throw new BadRequestException(error)
    })
    return obmExchangeSetting
  }

  async getSystemTarget(
    query: OBMSystemTargetParams,
  ): Promise<IOBMSystemTarget> {
    const obmSetting = await lastValueFrom(
      this.gObmSettingService.getSystemTarget(query),
    )
    return obmSetting
  }

  async getBalanceSetting(): Promise<IOBMBalance> {
    const obmBalance = await lastValueFrom(
      this.gObmSettingService.getBalance({}),
    )
    return obmBalance
  }

  async getThresholdSetting(): Promise<IOBMThreshold> {
    const obmThreshold = await lastValueFrom(
      this.gObmSettingService.getThreshold({}),
    )
    return obmThreshold
  }

  async deletePairInExchange(query: OBMSystemTargetParams): Promise<string> {
    const deletePair = await lastValueFrom(
      this.gObmSettingService.deletePairInExchange(query),
    )
    return deletePair
  }
}
