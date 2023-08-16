import { Observable } from 'rxjs'
import {
  MarketMakerSetting,
  GrpcMarketMakerSettingItem,
  MarketMakerSettingParams,
} from './market-maker-setting.dto'

export interface IGrpcMarketMakerService {
  getMarketMakerSetting(
    query: MarketMakerSettingParams,
  ): Observable<MarketMakerSetting>
  setMarketMakerSetting(
    request: GrpcMarketMakerSettingItem,
  ): Observable<GrpcMarketMakerSettingItem>
}
