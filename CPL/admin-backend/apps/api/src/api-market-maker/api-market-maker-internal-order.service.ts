import {
  GetImportOrderStatusParams,
  OrderPairProcess,
  OrderProcessResponse,
} from '@app/market-maker'
import { TradeType, UtilService } from '@lib/util'
import { BadRequestException, Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { FixedNumber } from '@ethersproject/bignumber'
import { ExchangeOrderService } from '@lib/grpc-client/exchange/services/exchange-order.service'
import { CreateOrderRequestDto } from '@lib/grpc-client/exchange/dtos/create-order.dto'
import {
  ORDER_CLASS,
  ORDER_STATUS,
  ORDER_TYPE,
} from '@lib/grpc-client/exchange/enums'
import { BaseOrderDto } from '@lib/grpc-client/exchange/dtos/base-order.dto'
import { removeRecordEmpty } from '@app/common'
import { MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK } from './constant'

@Injectable()
export class ApiMarketMakerOrderService {
  private readonly logger = new Logger(ApiMarketMakerOrderService.name)
  private market_maker_user_id
  private readonly start_index_file_order
  private readonly result: OrderProcessResponse

  constructor(
    private configService: ConfigService,
    private utilService: UtilService,
    private readonly exchangeOrderService: ExchangeOrderService,
  ) {
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
          return order.orderType == ORDER_TYPE.Buy
        }),
        dataOld.filter((order) => {
          return order.orderType == ORDER_TYPE.Buy
        }),
        coin,
        currency,
        TradeType.BUY,
      ),
      // sell side
      this.sideOrderProcess(
        dataNew.filter((order) => {
          return order.orderType == ORDER_TYPE.Sell
        }),
        dataOld.filter((order) => {
          return order.orderType == ORDER_TYPE.Sell
        }),
        coin,
        currency,
        TradeType.SELL,
      ),
    ])
    this.result[`${coin}_${currency}`].inProcess = false
  }

  async sideOrderProcess(
    createList: BaseOrderDto[],
    cancelList: BaseOrderDto[],
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
    orders: BaseOrderDto[],
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
        key: `${el.coin}/${el.currency}/${el.price}/${el.volume}`,
        status: await this.createOrder(el),
        side: el.orderType == ORDER_TYPE.Buy ? 'buy' : 'sell',
      })
      this.result[`${coin}_${currency}`][`created${side}Percent`] = (
        ((totalOrder - orders.length) * 100) /
        totalOrder
      ).toFixed(2)
    }
  }

  async cancelOrderProcess(
    orders: BaseOrderDto[],
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
        key: `${el.orderId}-${el.coin}/${el.currency}/${FixedNumber.from(
          el.price,
        )}/${FixedNumber.from(el.volume)}`,
        status: await this.cancelOrder(el.orderId),
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
  ): BaseOrderDto[] {
    const data = removeRecordEmpty(dataOrigin)
    const result: BaseOrderDto[] = []
    if (data.length == 0 || data.length < 2)
      throw new BadRequestException('File empty!')
    for (let i = Number(this.start_index_file_order); i < data.length; i++) {
      if (data[i].length != 3)
        throw new BadRequestException(`record ${i + 1} invalid format data`)
      if (!this.validateRecord(data[i]))
        throw new BadRequestException(`record ${i + 1} invalid`)
      const [side, price, volume] = data[i]
      result.push(
        plainToInstance(BaseOrderDto, {
          order_type:
            side.toLowerCase() == TradeType.BUY
              ? ORDER_TYPE.Buy
              : ORDER_TYPE.Sell,
          currency,
          coin,
          order_class: ORDER_CLASS.Limit,
          volume: volume,
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

  async getOpenOrder(
    coin: string,
    currency: string,
    user_id,
  ): Promise<BaseOrderDto[]> {
    let response
    try {
      response = await this.exchangeOrderService.getListOrderByUser({
        userId: user_id,
        coin,
        currency,
        status: ORDER_STATUS.Pending,
        take: 100,
      })
    } catch (error) {
      this.logger.error(error.message || 'get open order error!')
      return []
    }
    return response['data'] || []
  }

  async cancelOrder(order_id: string) {
    try {
      await this.exchangeOrderService.cancelOrderByIds({ orderIds: [order_id] })
    } catch (error) {
      return `${JSON.stringify(error.response?.data) || error.message}!`
    }
    return 'success'
  }

  async createOrder(order: BaseOrderDto) {
    try {
      await this.exchangeOrderService.createOrder(
        plainToInstance(CreateOrderRequestDto, {
          coin: order.coin,
          currency: order.currency,
          order_type: order.orderType,
          order_class: ORDER_CLASS.Limit,
          price: order.price,
          volume: order.volume,
          user_id: this.market_maker_user_id,
        }),
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
