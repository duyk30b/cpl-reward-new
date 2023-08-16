import { Observable } from 'rxjs'
import {
  MarketMakerSetting,
  MarketMakerSettingV2,
  MarketMakerSettingParams,
  MarketMakerPair,
  MarketMakerSystemTargetResponse,
  GetSystemTargetParams,
  UpdateMarketMakerSettings,
  UpdateMarketMakerSettingsResponse,
} from './market-maker-setting-v2.dto'

export interface IGrpcMarketMakerV2Service {
  getMarketMakerSetting(
    query: MarketMakerSettingParams,
  ): Observable<MarketMakerSetting>
  setMarketMakerSetting(
    request: MarketMakerSettingV2,
  ): Observable<MarketMakerSettingV2>
  addMarketMakerPair(request: MarketMakerPair): Observable<{ success: boolean }>
  deleteMarketMakerPair(
    request: MarketMakerPair,
  ): Observable<{ success: boolean }>
  getMarketMakerSystemTarget(
    query: GetSystemTargetParams,
  ): Observable<MarketMakerSystemTargetResponse>
  updateMarketMakerSettings(
    request: UpdateMarketMakerSettings,
  ): Observable<UpdateMarketMakerSettingsResponse>
}
