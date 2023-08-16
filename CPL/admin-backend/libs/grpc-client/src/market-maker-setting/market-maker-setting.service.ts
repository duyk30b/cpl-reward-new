import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'
import {
  MarketMakerSetting,
  GrpcMarketMakerSettingItem,
  MarketMakerSettingParams,
} from './market-maker-setting.dto'
import { IGrpcMarketMakerService } from './market-maker-setting.interface'

@Injectable()
export class GrpcMarketMakerSettingService {
  private grpcMarketMakerService: IGrpcMarketMakerService

  constructor(
    @Inject('MARKET_MAKER_SETTING_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcMarketMakerService =
      this.client.getService<IGrpcMarketMakerService>('MarketMakerService')
  }

  async getMarketMakerSetting(
    query: MarketMakerSettingParams,
  ): Promise<MarketMakerSetting> {
    return lastValueFrom(
      this.grpcMarketMakerService.getMarketMakerSetting(query),
    )
  }

  async setMarketMakerSetting(
    request: GrpcMarketMakerSettingItem,
  ): Promise<GrpcMarketMakerSettingItem> {
    return lastValueFrom(
      this.grpcMarketMakerService.setMarketMakerSetting(request),
    )
  }
}
