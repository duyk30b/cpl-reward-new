import CONFIG from '@/config'
import ApiService from '@/core/services/ApiService'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import {
  GlobalWithdrawalSettingListResponse,
  IGlobalWithdrawalSettingFilterParams,
  GlobalWithdrawalSettingPayloadModel,
  GlobalWithdrawalSettingModel,
  GlobalWithdrawalSettingUpdatePayloadModel,
  GlobalWithdrawalUsdtFeeSettings,
  GlobalWithdrawUsdtFeeModel,
  IPairPriceGroupByCoin,
  PairPrice,
  GlobalSetting,
  UpdateGlobalSettingParams,
  EWithdrawalFeeMode,
  EWithdrawalFeeType,
  IPairItemGroupByCoin,
  IPairPriceDecimalGroupByCoin,
  APPLIED_GLOBAL_SETTING,
  ESpecialCoin,
} from '@/models/setting-withdrawal/GlobalWithdrawal'
import BigNumber from 'bignumber.js'
import { instanceToPlain, plainToClass } from 'class-transformer'
import _ from 'lodash'
import { SettingExchangeService } from './SettingExchangeService'

const CustomBN = BigNumber.clone({ DECIMAL_PLACES: 8 })
CustomBN.config({
  EXPONENTIAL_AT: [-256, 256],
})

export class SettingWithdrawalService {
  public static async getPairPrices() {
    const pairPricesResponse = await ApiService.get(
      `${CONFIG.EXCHANGE_API_URL}/orderbook/v1/price`,
    )

    const pairListResponse = await SettingExchangeService.getPairList({})
    const pairListData = (pairListResponse?.data?.data || []) as PairItem[]
    const pairListGroupByCoin = pairListData
      .filter((item) => item.currency === ESpecialCoin.USDT)
      .reduce((acc, item) => {
        acc[item.coin] = item

        return acc
      }, {} as IPairItemGroupByCoin)

    const pairPricesData = (pairPricesResponse?.data?.data || []) as PairPrice[]

    /**
     * * Push default usdt value
     */
    pairPricesData.push({
      coin: ESpecialCoin.USDT,
      currency: ESpecialCoin.USDT,
      price: '1',
    })

    const pairPricesUsdtGroupByCoin = pairPricesData
      .filter((item) => item.currency === ESpecialCoin.USDT)
      .reduce((acc, item) => {
        let decimalPlace = 8

        const pairListData = pairListGroupByCoin[item.coin]

        if (pairListData && pairListData.decimal_of_amount) {
          decimalPlace = new BigNumber(pairListData.decimal_of_amount).dp()
        }

        acc[item.coin] = {
          ...item,
          decimalPlace,
        }

        return acc
      }, {} as IPairPriceDecimalGroupByCoin)

    return {
      pairPrices: pairPricesUsdtGroupByCoin,
    }
  }
  public static async getGlobalWithdrawalSettings(
    params: IGlobalWithdrawalSettingFilterParams,
  ): Promise<GlobalWithdrawalSettingListResponse> {
    const transformedParams = plainToClass(
      GlobalWithdrawalSettingPayloadModel,
      params,
    )

    const [res, globalSetting] = await Promise.all([
      ApiService.get('api-wallet-bce-admin/withdrawal-setting', {
        params: transformedParams,
      }),
      this.getGlobalSetting(),
    ])

    /**
     * * Map global usdt fee
     */
    if (globalSetting && res.data?.data && res.data?.data.items) {
      res.data.data.items.map((item) => {
        item['usdt_fee'] = globalSetting.usdtFee
        item['usdt_fee_castle'] = globalSetting.usdtFeeCastle

        return item
      })
    }

    const settings = plainToClass(
      GlobalWithdrawalSettingListResponse,
      res.data.data,
      {
        exposeDefaultValues: true,
      },
    )

    return settings
  }

  public static async updateGlobalWithdrawalSettings(
    body: GlobalWithdrawalSettingModel,
  ): Promise<boolean> {
    const transformedBody = plainToClass(
      GlobalWithdrawalSettingUpdatePayloadModel,
      body,
    )

    const res = await ApiService.put(
      'api-wallet-bce-admin/withdrawal-setting',
      transformedBody,
    )

    return res.data.data.result
  }

  private static getDecimalPlace(pairItem?: PairItem, decimalOfFee?: string) {
    let decimalOfAmount = '0.00000001' //* Default decimal place = 8

    if (pairItem) {
      decimalOfAmount = pairItem.decimal_of_amount || decimalOfAmount
    }

    if (decimalOfFee) {
      decimalOfAmount = decimalOfFee
    }

    return new BigNumber(decimalOfAmount).dp()
  }

  private static getAfterValue({
    coin,
    pairPriceGroupByCoin,
    pairListGroupByCoin,
    settingData,
    usdtFeeAmount,
    usdtFeeCastleAmount,
    isActiveCastleFee,
    decimalOfFee,
  }: {
    coin: string
    pairPriceGroupByCoin: IPairPriceGroupByCoin
    pairListGroupByCoin: IPairItemGroupByCoin
    settingData: GlobalWithdrawalSettingModel
    usdtFeeAmount?: string
    usdtFeeCastleAmount?: string
    isActiveCastleFee?: boolean
    decimalOfFee?: string
  }) {
    let pairPriceData = pairPriceGroupByCoin[coin]
    let pairItemData = pairListGroupByCoin[coin]

    if (coin === ESpecialCoin.USDT) {
      pairPriceData = {
        coin: ESpecialCoin.USDT,
        currency: ESpecialCoin.USDT,
        price: '1',
      }

      pairItemData = {
        coin: ESpecialCoin.USDT,
        currency: ESpecialCoin.USDT,
        decimal_of_amount: '1',
      } as PairItem
    }

    const decimalPlace = this.getDecimalPlace(pairItemData, decimalOfFee)

    const castlePriceData = pairPriceGroupByCoin[ESpecialCoin.CASTLE]
    const castleItemData = pairListGroupByCoin[ESpecialCoin.CASTLE]
    const decimalPlaceCastle = this.getDecimalPlace(castleItemData)

    let afterValue = ''
    /**
     * * Get after data
     */
    afterValue = +pairPriceData?.price
      ? new CustomBN(usdtFeeAmount || 0)
          .dividedBy(pairPriceData.price)
          .dp(decimalPlace, BigNumber.ROUND_HALF_EVEN)
          .toString()
      : '-'

    if (afterValue !== '-') {
      afterValue += ` ${coin.toUpperCase()}`
    }

    /**
     * * Break in case of CASTLE coin
     * * Assign Castle in after value
     */
    if (settingData.coin !== ESpecialCoin.CASTLE) {
      let castleAmount = ''
      if (isActiveCastleFee) {
        castleAmount = `${
          +castlePriceData?.price
            ? new CustomBN(usdtFeeCastleAmount || 0)
                .dividedBy(castlePriceData.price)
                .dp(decimalPlaceCastle, BigNumber.ROUND_HALF_EVEN)
                .toString()
            : '-'
        } ${ESpecialCoin.CASTLE.toUpperCase()}`
      }

      if (castleAmount) {
        afterValue += ` / ${castleAmount}`
      }
    }

    return afterValue
  }

  public static async getGlobalUsdtFeeSetting(
    params: IGlobalWithdrawalSettingFilterParams,
    usdtFeeAmount?: string,
    usdtFeeCastleAmount?: string,
  ): Promise<GlobalWithdrawalUsdtFeeSettings> {
    const [
      globalWithdrawalSettingsResponse,
      pairPricesResponse,
      pairListResponse,
    ] = await Promise.all([
      this.getGlobalWithdrawalSettings({
        ...(params || {}),
      }),
      ApiService.get(`${CONFIG.EXCHANGE_API_URL}/orderbook/v1/price`),
      SettingExchangeService.getPairList({}),
    ])

    const pairListData = (pairListResponse?.data?.data || []) as PairItem[]
    const pairListGroupByCoin = pairListData
      .filter((item) => item.currency === ESpecialCoin.USDT)
      .reduce((acc, item) => {
        acc[item.coin] = item

        return acc
      }, {} as IPairItemGroupByCoin)

    const pairPricesData = (pairPricesResponse?.data?.data || []) as PairPrice[]
    const pairPricesUsdtGroupByCoin = pairPricesData
      .filter((item) => item.currency === ESpecialCoin.USDT)
      .reduce((acc, item) => {
        acc[item.coin] = item

        return acc
      }, {} as IPairPriceGroupByCoin)

    const { items: globalWithdrawalSettings, pagination } =
      globalWithdrawalSettingsResponse

    let globalWithdrawalSettingsFiltered = globalWithdrawalSettings

    if (params.network) {
      globalWithdrawalSettingsFiltered =
        globalWithdrawalSettingsFiltered.filter(
          (item) =>
            item.feeSettings &&
            item.feeSettings.find(
              (feeSettingItem) => feeSettingItem.network === params.network,
            ),
        )
    }

    if (params.appliedType) {
      globalWithdrawalSettingsFiltered =
        globalWithdrawalSettingsFiltered.filter((item) => {
          if (params.appliedType === APPLIED_GLOBAL_SETTING.YES) {
            return item.feeMode === EWithdrawalFeeMode.GLOBAL_USDT
          }

          return item.feeMode !== EWithdrawalFeeMode.GLOBAL_USDT
        })
    }

    const allNetworks: string[] = []

    const castlePriceData = pairPricesUsdtGroupByCoin[ESpecialCoin.CASTLE]
    const castleItemData = pairListGroupByCoin[ESpecialCoin.CASTLE]

    const decimalPlaceCastle = this.getDecimalPlace(castleItemData)

    const globalUsdtFeeSettings = globalWithdrawalSettingsFiltered.reduce(
      (acc, item) => {
        let pairPriceData = pairPricesUsdtGroupByCoin[item.coin]

        let pairItemData = pairListGroupByCoin[item.coin]

        if (item.coin === ESpecialCoin.USDT) {
          pairPriceData = {
            coin: ESpecialCoin.USDT,
            currency: ESpecialCoin.USDT,
            price: '1',
          }

          pairItemData = {
            coin: ESpecialCoin.USDT,
            currency: ESpecialCoin.USDT,
            decimal_of_amount: '1',
          } as PairItem
        }

        const decimalPlace = this.getDecimalPlace(
          pairItemData,
          item.decimalOfFee,
        )

        let afterValue = '-'
        let appliedUsdt = '-' //* Usdt Value
        let beforeValue = '-'
        let isActiveCastleFee = false

        /**
         * * Get before data
         */
        switch (item.feeMode) {
          case EWithdrawalFeeMode.USDT:
            appliedUsdt = item.feeUsdtAmount.toString() || '-'
            item.feeSettings.forEach((feeSettingItem) => {
              if (!feeSettingItem.fees?.regular?.feeAmountBaseUsdt) {
                return
              }

              let symbol = feeSettingItem.symbol
              if (
                feeSettingItem.fees?.regular?.feeType ===
                EWithdrawalFeeType.NATIVE
              ) {
                symbol = ESpecialCoin.ETH
              }

              if (symbol.includes(ESpecialCoin.USDT)) {
                symbol = ESpecialCoin.USDT
              }

              beforeValue =
                `${
                  feeSettingItem.fees?.regular?.feeAmountBaseUsdt.toString() ||
                  '-'
                } ${symbol.toUpperCase()}` || '-'

              /**
               * * Check case not CASTLE
               */
              if (item.coin !== ESpecialCoin.CASTLE) {
                const feeTypeCastle = feeSettingItem.fees?.castle
                let castleAmount = ''
                if (feeTypeCastle && feeTypeCastle.isActive) {
                  castleAmount = `${feeTypeCastle.feeAmountBaseUsdt.toString()} ${ESpecialCoin.CASTLE.toUpperCase()}`
                  isActiveCastleFee = true
                }

                if (castleAmount && beforeValue) {
                  beforeValue += ` / ${castleAmount}`
                }
              }

              /**
               * * Get after data
               */
              afterValue = this.getAfterValue({
                coin: symbol,
                pairPriceGroupByCoin: pairPricesUsdtGroupByCoin,
                pairListGroupByCoin: pairListGroupByCoin,
                settingData: item,
                usdtFeeAmount,
                usdtFeeCastleAmount,
                isActiveCastleFee,
                decimalOfFee: item.decimalOfFee,
              })
            })
            break
          case EWithdrawalFeeMode.GLOBAL_USDT:
            appliedUsdt = usdtFeeAmount || '-'
            item.feeSettings.forEach((feeSettingItem) => {
              let symbol = feeSettingItem.symbol
              if (
                feeSettingItem.fees?.regular?.feeType ===
                EWithdrawalFeeType.NATIVE
              ) {
                symbol = ESpecialCoin.ETH
              }

              if (symbol.includes(ESpecialCoin.USDT)) {
                symbol = ESpecialCoin.USDT
              }

              if (feeSettingItem.fees?.regular?.feeAmountBaseUsdt) {
                beforeValue =
                  `${
                    feeSettingItem.fees?.regular?.feeAmountBaseUsdt.toString() ||
                    '-'
                  } ${symbol.toUpperCase()}` || '-'
              }

              /**
               * * Check case not CASTLE
               */
              if (item.coin !== ESpecialCoin.CASTLE) {
                const feeTypeCastle = feeSettingItem.fees?.castle
                let castleAmount = ''
                if (feeTypeCastle && feeTypeCastle.isActive) {
                  castleAmount = `${feeTypeCastle.feeAmountBaseUsdt.toString()} ${ESpecialCoin.CASTLE.toUpperCase()}`
                  isActiveCastleFee = true
                }

                if (castleAmount && beforeValue) {
                  beforeValue += ` / ${castleAmount}`
                }
              }

              /**
               * * Get after data
               */
              afterValue = this.getAfterValue({
                coin: symbol,
                pairPriceGroupByCoin: pairPricesUsdtGroupByCoin,
                pairListGroupByCoin: pairListGroupByCoin,
                settingData: item,
                usdtFeeAmount,
                usdtFeeCastleAmount,
                isActiveCastleFee,
                decimalOfFee: item.decimalOfFee,
              })
            })
            break
          case EWithdrawalFeeMode.COIN:
            appliedUsdt = '-' //* For case coin, no need to display usdt value
            item.feeSettings.forEach((feeSettingItem) => {
              let symbol = feeSettingItem.symbol

              if (
                feeSettingItem.fees?.regular?.feeType ===
                EWithdrawalFeeType.NATIVE
              ) {
                symbol = ESpecialCoin.ETH
              }

              if (symbol.includes(ESpecialCoin.USDT)) {
                symbol = ESpecialCoin.USDT
              }

              if (feeSettingItem.fees?.regular?.feeAmount) {
                beforeValue =
                  `${
                    feeSettingItem.fees?.regular?.feeAmount.toString() || '-'
                  } ${symbol.toUpperCase()}` || '-'
              }

              /**
               * * Check case not CASTLE
               */
              if (item.coin !== ESpecialCoin.CASTLE) {
                const feeTypeCastle = feeSettingItem.fees?.castle
                let castleAmount = ''
                if (feeTypeCastle && feeTypeCastle.isActive) {
                  castleAmount = `${feeTypeCastle.feeAmount.toString()} ${ESpecialCoin.CASTLE.toUpperCase()}`
                  isActiveCastleFee = true
                }

                if (castleAmount && beforeValue) {
                  beforeValue += ` / ${castleAmount}`
                }
              }

              /**
               * * Get after data
               */
              afterValue = this.getAfterValue({
                coin: symbol,
                pairPriceGroupByCoin: pairPricesUsdtGroupByCoin,
                pairListGroupByCoin: pairListGroupByCoin,
                settingData: item,
                usdtFeeAmount,
                usdtFeeCastleAmount,
                isActiveCastleFee,
                decimalOfFee: item.decimalOfFee,
              })
            })
            break
          default:
        }

        const networks: string[] = []

        if (item.feeSettings) {
          item.feeSettings.forEach((feeSettingItem) => {
            if (
              feeSettingItem.network &&
              feeSettingItem.network !== 'not_wallet'
            ) {
              networks.push(feeSettingItem.network.toUpperCase())
              allNetworks.push(feeSettingItem.network)
            }
          })
        }

        appliedUsdt = appliedUsdt !== '-' ? `${appliedUsdt} USDT` : appliedUsdt

        const globalWithdrawUsdtFeeData: GlobalWithdrawUsdtFeeModel = {
          selected: false,
          id: item.id,
          coin: item.coin,
          network: networks.join(`/`) || '-',
          beforeValue,
          afterValue,
          appliedUsdt,
          appliedGlobalSetting:
            item.feeMode === EWithdrawalFeeMode.GLOBAL_USDT
              ? APPLIED_GLOBAL_SETTING.YES
              : APPLIED_GLOBAL_SETTING.NO,
          pairPrice: pairPriceData?.price || '0',
          castlePrice: castlePriceData?.price || '0',
          decimalPlaceCastle,
          decimalPlace,
          isActiveCastleFee,
          price:
            pairPriceData && +pairPriceData.price ? pairPriceData.price : '-',
        }
        acc.push(globalWithdrawUsdtFeeData)

        return acc
      },
      [] as GlobalWithdrawUsdtFeeModel[],
    )

    return {
      items: globalUsdtFeeSettings,
      pagination,
      networks: _.uniq(allNetworks).sort(),
      pairPrices: pairPricesUsdtGroupByCoin,
    }
  }

  public static async getGlobalSetting(): Promise<GlobalSetting> {
    const res = await ApiService.get('api-wallet-bce-admin/global-setting')

    const settings = plainToClass(GlobalSetting, res.data.data, {
      exposeDefaultValues: true,
    })

    return settings
  }

  public static async updateGlobalSetting(
    params: UpdateGlobalSettingParams,
  ): Promise<any> {
    const transformedParams = instanceToPlain(params)

    return ApiService.patch(
      'api-wallet-bce-admin/global-fee',
      transformedParams,
    )
  }

  static clearParams(params) {
    return Object.keys(params).reduce((res, cur) => {
      if (params[cur]) res[cur] = params[cur]
      return res
    }, {})
  }
}
