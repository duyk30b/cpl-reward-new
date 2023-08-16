import { Expose, plainToClass, Transform, Type } from 'class-transformer'
import { PairItem } from '../setting-exchange/TradingPair'
import { BigNumber, bigNumber } from '@/core/helpers/bigNumber'

export class WithdrawalFeeGlobalSettingModel {
  @Expose({ name: 'fee_amount' })
  @Transform(({ value }) => bigNumber(value))
  feeAmount: BigNumber

  @Expose({ name: 'fee_amount_base_usdt' })
  @Transform(({ value }) => bigNumber(value))
  feeAmountBaseUsdt: BigNumber

  @Expose({ name: 'fee_type' })
  @Transform(({ value }) => EWithdrawalFeeType[value])
  feeType: EWithdrawalFeeType

  @Expose({ name: 'is_active' })
  isActive: boolean
}

export enum APPLIED_GLOBAL_SETTING {
  YES = 'yes',
  NO = 'no',
}

export class FeeSettingModel {
  @Expose({ name: 'fees' })
  @Type(() => WithdrawalFeeGlobalSettingModel)
  @Transform(({ value }) => {
    const newFees = value.reduce(
      (
        curr: WithdrawalFeeGlobalSettingModel | any,
        next: WithdrawalFeeGlobalSettingModel,
      ) => {
        return {
          ...curr,
          [next.feeType === EWithdrawalFeeType.CASTLE ? 'castle' : 'regular']: {
            ...next,
          },
        }
      },
      {},
    )

    return newFees
  })
  fees: ITransformedFee

  @Expose({ name: 'network' })
  network: string | null = null

  @Expose({ name: 'symbol' })
  symbol: string
}

export class GlobalWithdrawalSettingModel {
  @Expose({ name: 'id' })
  id: string

  @Expose({ name: 'fee_settings' })
  @Type(() => FeeSettingModel)
  feeSettings: FeeSettingModel[]

  @Expose({ name: 'coin' })
  coin: string

  @Expose({ name: 'withdrawal_enable' })
  withdrawalEnable: boolean

  @Expose({ name: 'minimum_withdrawal' })
  @Transform(({ value }) => bigNumber(value))
  minimumWithdrawal: BigNumber

  @Expose({ name: 'limit_amount' })
  @Transform(({ value }) => bigNumber(value))
  maximumWithdrawal: BigNumber

  @Expose({ name: 'limit_time' })
  maximumResetTime: number

  @Expose({ name: 'auto_withdrawal_threshold' })
  @Transform(({ value }) => bigNumber(value))
  autoWithdrawalThreshold: BigNumber

  @Expose({ name: 'fee_mode' })
  feeMode: EWithdrawalFeeMode

  @Expose({ name: 'fee_usdt_amount' })
  @Transform(({ value }) => bigNumber(value))
  feeUsdtAmount: BigNumber

  @Expose({ name: 'fee_usdt_castle_amount' })
  @Transform(({ value }) => bigNumber(value))
  feeUsdtCastleAmount: BigNumber

  @Expose({ name: 'usdt_fee' })
  globalUsdtFee: string

  @Expose({ name: 'decimal_of_fee' })
  decimalOfFee: string

  get feeTypes() {
    const types = new Set<string>()

    this.feeSettings.forEach((setting) => {
      Object.keys(setting.fees).forEach((key) => {
        switch (setting.fees[key].feeType) {
          case EWithdrawalFeeType.ORIGINAL:
            types.add(this.coin)
            break

          case EWithdrawalFeeType.NATIVE:
            types.add(
              setting.network === 'erc20' ? ESpecialCoin.ETH : ESpecialCoin.BNB,
            )
            break

          case EWithdrawalFeeType.CASTLE:
            if (setting.fees[key].isActive) {
              types.add(ESpecialCoin.CASTLE)
            }
            break
        }
      })
    })

    // if (
    //   [EWithdrawalFeeMode.GLOBAL_USDT, EWithdrawalFeeMode.USDT].includes(
    //     this.feeMode,
    //   )
    // ) {
    //   types.add(ESpecialCoin.USDT)
    // }

    return Array.from(types)
  }

  get feeAmounts() {
    const arr: string[] = []

    this.feeSettings.forEach((setting) => {
      Object.keys(setting.fees).forEach((key) => {
        let feeAmount = setting.fees[key].feeAmount.toString()

        if (
          this.feeMode === EWithdrawalFeeMode.GLOBAL_USDT ||
          this.feeMode === EWithdrawalFeeMode.USDT
        ) {
          feeAmount = setting.fees[key]?.feeAmountBaseUsdt?.toString() || '-'
        }

        if (setting.fees[key].feeType === EWithdrawalFeeType.NATIVE) {
          arr.push(
            setting.network === 'erc20'
              ? `${feeAmount} ${ESpecialCoin.ETH.toUpperCase()}`
              : `${feeAmount} ${ESpecialCoin.BNB.toUpperCase()}`,
          )
        } else if (
          setting.fees[key].feeType === EWithdrawalFeeType.ORIGINAL &&
          setting.fees[key].isActive
        ) {
          arr.push(`${feeAmount} ${this.coin.toLocaleUpperCase()}`)
        } else if (
          setting.fees[key].isActive &&
          this.coin !== ESpecialCoin.CASTLE
        ) {
          arr.push(`${feeAmount} ${ESpecialCoin.CASTLE.toUpperCase()}`)
        }
      })
    })

    // let isAddUsdtAmount = this.coin !== ESpecialCoin.USDT

    // if (this.coin === ESpecialCoin.USDT) {
    //   isAddUsdtAmount = !!this.feeSettings.find(
    //     (item) =>
    //       item?.fees?.regular.feeType === EWithdrawalFeeType.NATIVE &&
    //       item?.fees?.regular.isActive,
    //   )
    // }

    // if (this.feeMode === EWithdrawalFeeMode.USDT && isAddUsdtAmount) {
    //   arr.push(`${this.feeUsdtAmount} ${ESpecialCoin.USDT.toUpperCase()}`)
    // }

    // if (this.feeMode === EWithdrawalFeeMode.GLOBAL_USDT && isAddUsdtAmount) {
    //   arr.push(`${this.globalUsdtFee} ${ESpecialCoin.USDT.toUpperCase()}`)
    // }

    return arr
  }

  get isCastleFeeSetting() {
    let result = false
    for (let index = 0; index < this.feeSettings.length; index++) {
      if (
        Object.keys(this.feeSettings[index].fees).some(
          (key, i, arr) =>
            arr.includes(EWithdrawalFeeType.CASTLE.toLowerCase()) &&
            this.feeSettings[index].fees.castle?.isActive,
        )
      ) {
        result = true

        break
      }
    }

    return result
  }
}

export class GlobalWithdrawalSettingListPagination {
  @Expose({ name: 'page' })
  page: number

  @Expose({ name: 'size' })
  size: number

  @Expose({ name: 'total' })
  total: number
}

export class GlobalWithdrawalSettingListResponse {
  @Expose({ name: 'items' })
  @Type(() => GlobalWithdrawalSettingModel)
  items: GlobalWithdrawalSettingModel[]

  @Expose({ name: 'pagination' })
  pagination: GlobalWithdrawalSettingListPagination
}

export class WithdrawalFeeGlobalSettingPayloadModel {
  @Expose({ name: 'feeAmount' })
  @Transform(({ value }) => (value ? value.toString() : '0'))
  fee_amount: string

  @Expose({ name: 'feeType' })
  fee_type: string

  @Expose({ name: 'isActive' })
  is_active: boolean

  @Expose({ name: 'feeAmountBaseUsdt' })
  @Transform(({ value }) => (value ? value.toString() : '0'))
  fee_amount_base_usdt: string
}

export class FeeSettingPayloadModel {
  @Expose({ name: 'fees' })
  @Transform(({ value }) => {
    return Object.values(value).map((value) =>
      plainToClass(WithdrawalFeeGlobalSettingPayloadModel, value),
    )
  })
  fees: WithdrawalFeeGlobalSettingPayloadModel[]

  @Expose({ name: 'network' })
  network: string

  @Expose({ name: 'symbol' })
  symbol: string
}

export class GlobalWithdrawalSettingUpdatePayloadModel {
  @Expose({ name: 'id' })
  id?: string

  @Expose({ name: 'feeSettings' })
  @Type(() => FeeSettingPayloadModel)
  fee_settings: FeeSettingPayloadModel[]

  @Expose({ name: 'coin' })
  coin: string

  @Expose({ name: 'withdrawalEnable' })
  withdrawal_enable: boolean

  @Expose({ name: 'minimumWithdrawal' })
  @Transform(({ value }) => value.toString())
  minimum_withdrawal: string

  @Expose({ name: 'maximumWithdrawal' })
  @Transform(({ value }) => value.toString())
  limit_amount: string

  @Expose({ name: 'maximumResetTime' })
  @Transform(({ value }) => parseInt(value))
  limit_time: number

  @Expose({ name: 'autoWithdrawalThreshold' })
  @Transform(({ value }) => value.toString())
  auto_withdrawal_threshold: string

  @Expose({ name: 'feeMode' })
  fee_mode: string

  @Expose({ name: 'feeUsdtAmount' })
  @Transform(({ value }) => (value ? value.toString() : '0'))
  fee_usdt_amount: string

  @Expose({ name: 'feeUsdtCastleAmount' })
  @Transform(({ value }) => (value ? value.toString() : '0'))
  fee_usdt_castle_amount: string

  @Expose({ name: 'decimalOfFee' })
  @Transform(({ value }) => value.toString())
  decimal_of_fee: string
}

export interface IGlobalWithdrawalSettingFilterParams {
  page?: number
  size?: number
  search?: string
  sort?: string
  sortType?: string
  network?: string
  appliedType?: string
}

export interface ITransformedFee {
  castle?: WithdrawalFeeGlobalSettingModel
  regular: WithdrawalFeeGlobalSettingModel
}

export enum SAVE_TYPE {
  APPLY_FOR_APPLIED = 'APPLY_FOR_APPLIED',
  APPLY_FOR_SELECTED = 'APPLY_FOR_SELECTED',
  APPLY_FOR_ALL = 'APPLY_FOR_ALL',
}

export class GlobalWithdrawalSettingPayloadModel {
  @Expose({ name: 'page' })
  @Transform(({ value }) => (value ? value : 1))
  page: number

  @Expose({ name: 'size' })
  @Transform(({ value }) => (value ? value : 10))
  per_page: number

  @Expose({ name: 'sort' })
  sort?: string

  @Expose({ name: 'sortType' })
  sort_type?: string

  @Expose({ name: 'search' })
  search?: string
}

export enum EWithdrawalFeeMode {
  COIN = 'COIN',
  USDT = 'USDT',
  GLOBAL_USDT = 'GLOBAL_USDT',
}

export enum ESpecialCoin {
  USDT = 'usdt',
  CASTLE = 'castle',
  ETH = 'eth',
  BNB = 'bnb',
}

export enum EGlobalUsdtType {
  USDT = 'USDT',
  USDT_CASTLE = 'USDT_CASTLE',
}

export enum EWithdrawalFeeType {
  NATIVE = 'NATIVE',
  ORIGINAL = 'ORIGINAL',
  CASTLE = 'CASTLE',
}

export class GlobalWithdrawUsdtFeeModel {
  @Expose({ name: 'selected' })
  selected = false

  @Expose({ name: 'id' })
  id: string

  @Expose({ name: 'coin' })
  coin: string

  @Expose({ name: 'network' })
  network: string

  @Expose({ name: 'applied_usdt' })
  appliedUsdt: string

  @Expose({ name: 'after_value' })
  afterValue: string

  @Expose({ name: 'before_value' })
  beforeValue: string

  @Expose({ name: 'applied_global_setting' })
  appliedGlobalSetting: string

  @Expose({ name: 'pair_price' })
  pairPrice: string

  @Expose({ name: 'decimal_place' })
  decimalPlace: number

  @Expose({ name: 'price' })
  price: string

  @Expose({ name: 'castle_price' })
  castlePrice: string

  @Expose({ name: 'decimal_place_castle' })
  decimalPlaceCastle: number

  @Expose({ name: 'is_active_castle_fee' })
  isActiveCastleFee: boolean
}

export class GlobalWithdrawalUsdtFeeSettings {
  @Expose({ name: 'items' })
  @Type(() => GlobalWithdrawUsdtFeeModel)
  items: GlobalWithdrawUsdtFeeModel[]

  @Expose({ name: 'pagination' })
  pagination: GlobalWithdrawalSettingListPagination

  @Expose({ name: 'networks' })
  networks: string[]

  @Expose({ name: 'pair-prices' })
  pairPrices: IPairPriceGroupByCoin
}

export class PairPrice {
  @Expose()
  coin: string

  @Expose()
  currency: string

  @Expose()
  price: string
}

export class PairPriceDecimal extends PairPrice {
  @Expose({ name: 'decimal_place' })
  decimalPlace: number
}

export interface IPairPriceGroupByCoin {
  [coin: string]: PairPrice
}

export interface IPairItemGroupByCoin {
  [coin: string]: PairItem
}

export interface IPairPriceDecimalGroupByCoin {
  [coin: string]: PairPriceDecimal
}

export class GlobalSetting {
  @Expose({
    name: 'usdt_fee',
  })
  usdtFee: string

  @Expose({
    name: 'usdt_fee_castle',
  })
  usdtFeeCastle: string
}

export class UpdateGlobalSettingParams {
  @Expose()
  coins?: string[]

  @Expose({
    name: 'usdtFeeAmount',
  })
  usdt_fee_amount: string

  @Expose({
    name: 'usdtFeeCastleAmount',
  })
  usdt_fee_castle_amount: string
}

export class UpdateFeePriceBaseUsdt {
  @Expose()
  coin: string

  @Expose()
  price: string

  @Expose()
  precision?: string
}
