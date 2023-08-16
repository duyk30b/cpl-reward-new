import { BaseResponseDto } from '@lib/grpc-client/grpc-client.dto'
import { Expose } from 'class-transformer'

export class GrpcBaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcSettingResponseDTO extends BaseResponseDto {
  data?: GrpcBOSettingDTO
}

export class BOTradingPairResponseDto {
  @Expose()
  id: number

  @Expose()
  symbol: string

  @Expose()
  active: string

  @Expose()
  binanceSymbol: string

  @Expose()
  image: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}

export class TradingPairResponseDTO extends BaseResponseDto {
  data?: {
    items: BOTradingPairResponseDto[]
  }
}

export class BOTradingMode {
  @Expose()
  id: number

  @Expose()
  mode: string

  @Expose()
  period: string

  @Expose()
  startTime: string

  @Expose()
  endTime: string

  @Expose()
  payout: string

  @Expose({ name: 'suggestion1' })
  suggestion_1: string

  @Expose({ name: 'suggestion2' })
  suggestion_2: string

  @Expose({ name: 'suggestion3' })
  suggestion_3: string

  @Expose()
  scalingActive: string

  @Expose()
  scalingBcast: string

  @Expose()
  payoutMax: string

  @Expose()
  rankScalingActive: string

  @Expose()
  limitOrderMin: string

  @Expose()
  limitOrderMax: string

  @Expose()
  limitOrderMaxAmount: string

  @Expose()
  orderExpireTime: string

  @Expose()
  orderUnit: string

  @Expose()
  limitDayUnit: string

  @Expose()
  limitOrderTimes: string

  @Expose()
  limitOrderAmount: string

  @Expose()
  stopThresholdValue: string

  @Expose()
  restrictedDayUnit: string

  @Expose()
  restrictedOrderTimes: string

  @Expose()
  restrictedDayOrderTimes: string

  @Expose()
  restrictedDayOrderAmount: string

  @Expose()
  activeThresholdValue: string

  @Expose()
  restrictedOrderAmount: string

  @Expose()
  scalingValue: string

  @Expose()
  rank1ScaleBcast: string

  @Expose()
  rank2ScaleBcast: string

  @Expose()
  rank3ScaleBcast: string

  @Expose()
  apiToken: string

  @Expose()
  allowResell: string

  @Expose()
  oddsMode: string

  @Expose()
  oddsFee: string

  @Expose()
  payoutScalingUnit: string

  @Expose()
  orderMinimum: string

  @Expose()
  expireTime: string

  @Expose()
  emergencyThreshold: string

  @Expose()
  maxUsdtPerOrder: string

  @Expose()
  maxBcastPerOrder: string

  @Expose()
  sameDirectionInterval: string

  @Expose()
  diffDirectionInterval: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}

export class GrpcTradingModeResponseDTO extends BaseResponseDto {
  data?: BOTradingMode
}

export class FormatModeGrpc {
  mode: string
  name: string

  constructor(param: any = {}) {
    this.mode = param.mode ? param.mode : ''
    this.name = param.mode ? this.getName(param.mode) : ''
  }

  getName(mode: string) {
    switch (mode) {
      case 'H':
        return 'High/Low'
      case 'T':
        return 'Lightning'
      case 'HS':
        return 'High/Low Spread'
      case 'TS':
        return 'Lightning Spread'
      default:
        return ''
    }
  }
}

export class GrpcBOSettingDTO {
  @Expose()
  id: number

  @Expose({ name: 'code' })
  code: string

  @Expose({ name: 'value' })
  value: string

  @Expose({ name: 'active' })
  active: number
}

export class GrpcBOSettingResponseDTO extends GrpcBaseResponseDTO {
  data?: GrpcBOSettingDTO
}

export class GrpcTradingModeDTO {
  @Expose()
  id: number

  @Expose()
  mode: string

  @Expose()
  period: string

  @Expose()
  startTime: string

  @Expose()
  endTime: string

  @Expose()
  payout: string

  @Expose({ name: 'suggestion1' })
  suggestion1: string

  @Expose({ name: 'suggestion2' })
  suggestion2: string

  @Expose({ name: 'suggestion3' })
  suggestion3: string

  @Expose()
  scalingActive: string

  @Expose()
  scalingBcast: string

  @Expose()
  payoutMax: string

  @Expose()
  rankScalingActive: string

  @Expose()
  limitOrderMin: string

  @Expose()
  limitOrderMax: string

  @Expose()
  limitOrderMaxAmount: string

  @Expose()
  orderExpireTime: string

  @Expose()
  orderUnit: string

  @Expose()
  limitDayUnit: string

  @Expose()
  limitOrderTimes: string

  @Expose()
  limitOrderAmount: string

  @Expose()
  stopThresholdValue: string

  @Expose()
  restrictedDayUnit: string

  @Expose()
  restrictedOrderTimes: string

  @Expose()
  restrictedDayOrderTimes: string

  @Expose()
  restrictedDayOrderAmount: string

  @Expose()
  activeThresholdValue: string

  @Expose()
  restrictedOrderAmount: string

  @Expose()
  scalingValue: string

  @Expose()
  rank1ScaleBcast: string

  @Expose()
  rank2ScaleBcast: string

  @Expose()
  rank3ScaleBcast: string

  @Expose()
  apiToken: string

  @Expose()
  allowResell: string

  @Expose()
  oddsMode: string

  @Expose()
  oddsFee: string

  @Expose()
  payoutScalingUnit: string

  @Expose()
  orderMinimum: string

  @Expose()
  expireTime: string

  @Expose()
  emergencyThreshold: string

  @Expose()
  maxUsdtPerOrder: string

  @Expose()
  maxBcastPerOrder: string

  @Expose()
  sameDirectionInterval: string

  @Expose()
  diffDirectionInterval: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}
export class GrpcBTCTransferSettingDTO {
  @Expose()
  id: number

  @Expose()
  pairId: number

  @Expose()
  decimalPart: number

  @Expose()
  highlowSpread: number

  @Expose()
  turboSpread: number

  @Expose()
  emergencyThreshold: number

  @Expose()
  createdAt: number

  @Expose()
  updatedAt: number
}

export class GrpcBTCTransferSettingResponseDTO extends BaseResponseDto {
  data?: GrpcBTCTransferSettingDTO
}
