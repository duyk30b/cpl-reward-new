import { Observable } from 'rxjs'
import {
  bodyGeneric,
  ModuleValue,
  OBMExchangeParams,
  ObmExchangeSettingDTO,
  OBMPairParams,
  ObmPairSettingDTO,
  OBMSystemTargetParams,
} from './obm-setting.dto'

export interface IGrpcObmSettingService {
  getOBMPairSetting(query: OBMPairParams): Observable<bodyGeneric<string>>
  getOBMPairActive({}): Observable<bodyGeneric<PairActiveRes>>
  updatePairs(body: ObmPairSettingDTO): Observable<ObmPairSettingDTO>
  getExchange(query: OBMExchangeParams): Observable<ObmExchangeSettingDTO>
  updateExchange(body: ObmExchangeSettingDTO): Observable<ObmExchangeSettingDTO>
  getSystemTarget(query: OBMSystemTargetParams): Observable<IOBMSystemTarget>
  getBalance({}): Observable<IOBMBalance>
  getThreshold({}): Observable<IOBMThreshold>
  deletePairInExchange(query: OBMSystemTargetParams): Observable<string>
}

export interface PairActiveRes {
  coin: string
  currency: string
  obmActive: number
  precisions: string[]
  decimal: string[]
}

export interface IPairPropertyItem {
  [pair: string]: { [key: string]: string | number }
}

export interface IOBMSystemTargetItem {
  exchange: string
  order: number
  status: number
}

export interface IOBMSystemTarget {
  name: string
  data: {
    [pairKey: string]: {
      status: number
      data: IOBMSystemTargetItem[]
    }
  }
}

export interface IOBMBalance {
  name: string
  data: {
    binance: {
      [pairKey: string]: {
        alert: ModuleValue
        stop: ModuleValue
      }
    }
    ftx: {
      [pairKey: string]: {
        alert: ModuleValue
        stop: ModuleValue
      }
    }
  }
}

export interface IOBMBotExchangeItem {
  exchange: string
  priority: number
  data: {
    [pairKey: string]: ModuleValue
  }
}

export interface IOBMThreshold {
  name: string
  data: {
    [pairKey: string]: {
      min: ModuleValue
      max: ModuleValue
    }
  }
}
