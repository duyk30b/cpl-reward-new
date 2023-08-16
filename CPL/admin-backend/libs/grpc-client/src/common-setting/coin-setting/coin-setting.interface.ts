import { Observable } from 'rxjs'
import { CoinSetting } from './coin-setting.dto'
export interface ICoinSettingService {
  getAllCoinSettings({}): Observable<CoinSetting>
}
