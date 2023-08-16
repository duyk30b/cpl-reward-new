import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  MarketMakerSetting,
  MarketMakerSettingParams,
  GetSystemTargetParams,
  MarketMakerSystemTargetResponse,
  MarketMakerPair,
  UpdateMarketMakerSettings,
  UpdateMarketMakerSettingsResponse,
  MarketMakerSettingV2,
} from './market-maker-setting-v2.dto'
import { IGrpcMarketMakerV2Service } from './market-maker-setting-v2.interface'

@Injectable()
export class GrpcMarketMakerSettingV2Service {
  private grpcMarketMakerService: IGrpcMarketMakerV2Service

  constructor(
    @Inject('MARKET_MAKER_SETTING_V2_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcMarketMakerService =
      this.client.getService<IGrpcMarketMakerV2Service>('MarketMakerV2Service')
  }

  async getMarketMakerSetting(
    query: MarketMakerSettingParams,
  ): Promise<MarketMakerSetting> {
    return lastValueFrom(
      this.grpcMarketMakerService.getMarketMakerSetting(query),
    )
  }

  async setMarketMakerSetting(
    request: MarketMakerSettingV2,
  ): Promise<MarketMakerSettingV2> {
    return lastValueFrom(
      this.grpcMarketMakerService.setMarketMakerSetting(request),
    )
  }

  async addMarketMakerPair(
    request: MarketMakerPair,
  ): Promise<{ success: boolean }> {
    return lastValueFrom(
      this.grpcMarketMakerService.addMarketMakerPair(request),
    )
  }

  async deleteMarketMakerPair(
    request: MarketMakerPair,
  ): Promise<{ success: boolean }> {
    return lastValueFrom(
      this.grpcMarketMakerService.deleteMarketMakerPair(request),
    )
  }

  async getMarketMakerSystemTarget(
    request: GetSystemTargetParams,
  ): Promise<MarketMakerSystemTargetResponse> {
    return lastValueFrom(
      this.grpcMarketMakerService.getMarketMakerSystemTarget(request),
    )
  }

  async updateMarketMakerSettings(
    request: UpdateMarketMakerSettings,
  ): Promise<UpdateMarketMakerSettingsResponse> {
    return lastValueFrom(
      this.grpcMarketMakerService.updateMarketMakerSettings(request),
    )
  }
}
