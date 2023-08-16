import { Observable } from 'rxjs'
import {
  FuturesSetting,
  IDeleteSettingDto,
  IGetFuturesSettingDto,
  IGetSingleSettingDto,
  IUpdateStatusDto,
  ODeleteSettingResponse,
  OUpdateSettingResponse,
  SettingResponse,
  SingleSettingResponse,
} from './futures-setting.dto'

export interface IFuturesSetting {
  getSettings: (request: IGetFuturesSettingDto) => Observable<SettingResponse>
  getSingleSetting: (
    request: IGetSingleSettingDto,
  ) => Observable<SingleSettingResponse>
  setFuturesSetting: (request: FuturesSetting) => Observable<FuturesSetting>
  deleteFuturesSetting: (
    request: IDeleteSettingDto,
  ) => Observable<ODeleteSettingResponse>
  updateStatusSetting: (
    request: IUpdateStatusDto,
  ) => Observable<OUpdateSettingResponse>
}
