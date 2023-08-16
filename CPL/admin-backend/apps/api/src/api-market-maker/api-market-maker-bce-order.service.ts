import {
  BCEOpenOrder,
  BCEOrder,
  GetImportOrderStatusParams,
  OrderPairProcess,
  OrderProcessResponse,
} from '@app/market-maker'
import { TradeType, UtilService } from '@lib/util'
import { HttpService } from '@nestjs/axios'
import { BadRequestException, Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { FixedNumber } from '@ethersproject/bignumber'
import { removeRecordEmpty } from '@app/common'
import { MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK } from './constant'

@Injectable()
export class ApiMarketMakerBCEOrderService {
  private readonly logger = new Logger(ApiMarketMakerBCEOrderService.name)
  private readonly url
  private market_maker_user_id
  private readonly start_index_file_order
  private readonly result: OrderProcessResponse

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private utilService: UtilService,
  ) {
    this.url = this.configService.get('market_maker_order.url')
    this.start_index_file_order = this.configService.get(
      'market_maker_order.start_index_file_order',
    )
    this.result = {}
  }

  async importFileData(
    coin: string,
    currency: string,
    dataOrigin: Array<Array<string>>,
  ) {
    if (this.result[`${coin}_${currency}`]?.inProcess) {
      throw new BadRequestException('Import in process!')
    }
    this.result[`${coin}_${currency}`] = {
      inProcess: false,

      createdBuyPercent: '0',
      createdBuyOrders: [],
      canceledBuyOrders: [],
      canceledBuyPercent: '0',
      createdSellPercent: '0',
      createdSellOrders: [],
      canceledSellOrders: [],
      canceledSellPercent: '0',
    } as OrderPairProcess
    if (!this.url) throw new Error('ENV: cannot get BCE_API')
    this.market_maker_user_id =
      process.env[`${coin.toUpperCase()}_${currency.toUpperCase()}_TRADER_ID`]
    if (!this.market_maker_user_id) throw new Error('ENV: cannot get TRADER_ID')
    const dataNew = this.convertDataToOrder(
      coin,
      currency,
      dataOrigin,
      this.market_maker_user_id,
    )
    if (dataNew.length > MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK)
      throw new BadRequestException(
        `Data <= ${MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK} item`,
      )
    const dataOld = await this.getOpenOrder(
      coin,
      currency,
      this.market_maker_user_id,
    )
    this.result[`${coin}_${currency}`].inProcess = true
    await Promise.all([
      // buy side
      this.sideOrderProcess(
        dataNew.filter((order) => {
          return order.trade_type == TradeType.BUY
        }),
        dataOld.filter((order) => {
          return order.trade_type == TradeType.BUY
        }),
        coin,
        currency,
        TradeType.BUY,
      ),
      // sell side
      this.sideOrderProcess(
        dataNew.filter((order) => {
          return order.trade_type == TradeType.SELL
        }),
        dataOld.filter((order) => {
          return order.trade_type == TradeType.SELL
        }),
        coin,
        currency,
        TradeType.SELL,
      ),
    ])
    this.result[`${coin}_${currency}`].inProcess = false
  }

  async sideOrderProcess(
    createList: BCEOrder[],
    cancelList: BCEOpenOrder[],
    coin: string,
    currency: string,
    side: TradeType,
  ) {
    if (createList?.length == 0) return
    await this.createOrderProcess(createList, coin, currency, side)
    await this.cancelOrderProcess(
      cancelList,
      this.market_maker_user_id,
      coin,
      currency,
      side,
    )
  }

  async createOrderProcess(
    orders: BCEOrder[],
    coin: string,
    currency: string,
    tradeType: TradeType,
  ) {
    const totalOrder = orders.length
    const side = tradeType == TradeType.BUY ? 'Buy' : 'Sell'
    if (totalOrder == 0) {
      this.result[`${coin}_${currency}`][`created${side}Percent`] = '100'
    }
    while (orders.length > 0) {
      const random = Math.floor(Math.random() * orders.length)
      const el = orders.splice(random, 1)[0]
      this.result[`${coin}_${currency}`][`created${side}Orders`].push({
        key: `${el.coin}/${el.currency}/${el.price}/${el.quantity}`,
        status: await this.createOrder(el),
        side: el.trade_type,
      })
      this.result[`${coin}_${currency}`][`created${side}Percent`] = (
        ((totalOrder - orders.length) * 100) /
        totalOrder
      ).toFixed(2)
    }
  }

  async cancelOrderProcess(
    orders: BCEOpenOrder[],
    tradeId: string,
    coin: string,
    currency: string,
    tradeType: TradeType,
  ) {
    const totalOrder = orders.length
    const side = tradeType == TradeType.BUY ? 'Buy' : 'Sell'
    if (totalOrder == 0) {
      this.result[`${coin}_${currency}`][`canceled${side}Percent`] = '100'
    }
    while (orders.length > 0) {
      const random = Math.floor(Math.random() * orders.length)
      const el = orders.splice(random, 1)[0]
      this.result[`${coin}_${currency}`][`canceled${side}Orders`].push({
        key: `${el.id}-${el.coin}/${el.currency}/${FixedNumber.from(
          el.price,
        )}/${FixedNumber.from(el.quantity)}`,
        status: await this.cancelOrder(el.id, tradeId),
      })
      this.result[`${coin}_${currency}`][`canceled${side}Percent`] = (
        ((totalOrder - orders.length) * 100) /
        totalOrder
      ).toFixed(2)
    }
  }

  convertDataToOrder(
    coin: string,
    currency: string,
    dataOrigin: Array<Array<string>>,
    user_id: string,
  ) {
    const data = removeRecordEmpty(dataOrigin)
    const result: BCEOrder[] = []
    if (data.length == 0 || data.length < 2)
      throw new BadRequestException('File empty!')
    for (let i = Number(this.start_index_file_order); i < data.length; i++) {
      if (data[i].length != 3)
        throw new BadRequestException(`record ${i + 1} invalid format data`)
      if (!this.validateRecord(data[i]))
        throw new BadRequestException(`record ${i + 1} invalid`)
      const [side, price, volume] = data[i]
      result.push(
        plainToInstance(BCEOrder, {
          trade_type: side.toLowerCase(),
          currency,
          coin,
          type: 'limit',
          quantity: volume,
          price: price,
          user_id,
        }),
      )
    }
    return result
  }

  validateRecord(data: Array<string>): boolean {
    const [side, price, volume] = data
    if (!Object.values(TradeType).includes(side.toLowerCase() as TradeType))
      return false
    if (!this.utilService.isNumeric(price) || Number(price) <= 0) return false
    if (!this.utilService.isNumeric(volume) || Number(volume) <= 0) return false
    return true
  }

  removeRecordEmpty(data: Array<Array<string>>): Array<Array<string>> {
    return data.filter((item: Array<string>) => {
      let check = true
      for (const ele of item) {
        if (!ele) {
          check = false
          break
        }
      }
      return check
    })
  }

  async getOpenOrder(
    coin: string,
    currency: string,
    user_id,
  ): Promise<BCEOpenOrder[]> {
    let response
    try {
      response = await lastValueFrom(
        this.httpService.get(`${this.url}/api/v1/om-user/orders`, {
          params: { coin, currency, user_id },
        }),
      )
    } catch (error) {
      this.logger.error('get open order error!')
      return []
    }
    return response['data']['data']
  }

  async cancelOrder(order_id: string, user_id: string) {
    try {
      await lastValueFrom(
        this.httpService.post(
          `${this.url}/api/v1/om-user/cancel-order/${order_id}`,
          {
            user_id,
          },
        ),
      )
    } catch (error) {
      return `${JSON.stringify(error.response?.data) || error.message}!`
    }
    return 'success'
  }

  async createOrder(order: BCEOrder) {
    try {
      await lastValueFrom(
        this.httpService.post(
          `${this.url}/api/v1/om-user/counter-order`,
          order,
        ),
      )
    } catch (error) {
      return `${JSON.stringify(error.response?.data) || error.message}!`
    }
    return 'success'
  }

  getImportStatus(params: GetImportOrderStatusParams) {
    const { coin, currency } = params
    return this.result[`${coin}_${currency}`]
  }
}
