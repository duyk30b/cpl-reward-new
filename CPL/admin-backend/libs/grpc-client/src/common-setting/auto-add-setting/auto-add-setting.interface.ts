import { Observable } from 'rxjs'
import { GrpcCoinSettingDto } from '../../exchange-setting/dtos/coin'
import {
  ChangeStatusDepositWithdrawResponse,
  GetCurrencySettingDto,
  GrpcCurrencySettingResponse,
  ISetCurrencySetting,
  IUpdateCurrencySetting,
  IUpdateStatusDepositWithdraw,
} from './auto-add-setting.dto'

export interface IAutoAddSettingService {
  setCurrencySetting: (
    request: ISetCurrencySetting,
  ) => Observable<GrpcCoinSettingDto>
  getCurrencySetting: (
    request: GetCurrencySettingDto,
  ) => Observable<GrpcCurrencySettingResponse>
  updateCurrencySetting: (
    request: IUpdateCurrencySetting,
  ) => Observable<GrpcCurrencySettingResponse>
  updateDepositWithdraw: (
    request: IUpdateStatusDepositWithdraw,
  ) => Observable<ChangeStatusDepositWithdrawResponse>
}
