import {
  OrderPairProcess,
  OrderProcessResponse,
  P2pb2bOrderItem,
} from '@app/market-maker'
import { TradeType, UtilService } from '@lib/util'
import { HttpService } from '@nestjs/axios'
import { BadRequestException, Logger } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import { FixedNumber } from '@ethersproject/bignumber'
import * as CryptoJS from 'crypto-js'
import { removeRecordEmpty } from '@app/common'
import { MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK } from './constant'

@Injectable()
export class ApiMarketMakerExternalOrderService {
  private readonly logger = new Logger(ApiMarketMakerExternalOrderService.name)
  private readonly external_url
  private readonly external_public_key
  private readonly external_secret_key
  private readonly result: OrderProcessResponse

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
    private utilService: UtilService,
  ) {
    this.external_url = this.configService.get(
      'market_maker_order.external_url',
    )
    this.external_public_key = this.configService.get(
      'market_maker_order.external_public_key',
    )
    this.external_secret_key = this.configService.get(
      'market_maker_order.external_secret_key',
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
    if (!this.external_url) throw new Error('ENV: cannot get BCE_API')
    if (!this.external_public_key) throw new Error('ENV: cannot get public key')
    if (!this.external_secret_key) throw new Error('ENV: cannot get secret key')
    const dataNew = this.convertDataToOrder(coin, currency, dataOrigin)
    if (dataNew.length > MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK)
      throw new BadRequestException(
        `Data <= ${MAX_AMOUNT_ORDER_IMPORT_ORDER_BOOK} item`,
      )
    const dataOld = await this.getOpenOrder(coin, currency)
    this.result[`${coin}_${currency}`].inProcess = true
    await Promise.all([
      // buy side
      this.sideOrderProcess(
        dataNew.filter((order) => {
          return order.side == TradeType.BUY
        }),
        dataOld.filter((order) => {
          return order.side == TradeType.BUY
        }),
        coin,
        currency,
        TradeType.BUY,
      ),
      // sell side
      this.sideOrderProcess(
        dataNew.filter((order) => {
          return order.side == TradeType.SELL
        }),
        dataOld.filter((order) => {
          return order.side == TradeType.SELL
        }),
        coin,
        currency,
        TradeType.SELL,
      ),
    ])
    this.result[`${coin}_${currency}`].inProcess = false
  }

  async sideOrderProcess(
    createList: P2pb2bOrderItem[],
    cancelList: P2pb2bOrderItem[],
    coin: string,
    currency: string,
    side: TradeType,
  ) {
    if (createList?.length == 0) return
    await this.createOrderProcess(createList, coin, currency, side)
    await this.cancelOrderProcess(cancelList, coin, currency, side)
  }

  async createOrderProcess(
    orders: P2pb2bOrderItem[],
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
        key: `${el.market}/${el.price}/${el.amount}`,
        status: await this.createOrder(el),
        side: el.side,
      })
      this.result[`${coin}_${currency}`][`created${side}Percent`] = (
        ((totalOrder - orders.length) * 100) /
        totalOrder
      ).toFixed(2)
    }
  }

  async cancelOrderProcess(
    orders: P2pb2bOrderItem[],
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
        key: `${el.orderId}-${el.market}/${FixedNumber.from(
          el.price,
        )}/${FixedNumber.from(el.amount)}`,
        status: await this.cancelOrder(coin, currency, el.orderId),
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
  ) {
    const data = removeRecordEmpty(dataOrigin)
    const result: P2pb2bOrderItem[] = []
    if (data.length == 0 || data.length < 2)
      throw new BadRequestException('File empty!')
    for (let i = 1; i < data.length; i++) {
      if (data[i].length != 3)
        throw new BadRequestException(`record ${i + 1} invalid format data`)
      if (!this.validateRecord(data[i]))
        throw new BadRequestException(`record ${i + 1} invalid`)
      const [side, price, volume] = data[i]
      result.push(
        plainToInstance(P2pb2bOrderItem, {
          side: side.toLowerCase(),
          amount: volume,
          price: price,
          market: `${coin.toUpperCase()}_${currency.toUpperCase()}`,
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

  getHeaderRequest(body) {
    const payload = CryptoJS.enc.Base64.stringify(
      CryptoJS.enc.Utf8.parse(JSON.stringify(body)),
    )
    return {
      'Content-Type': 'application/json',
      'X-TXC-APIKEY': this.external_public_key,
      'X-TXC-PAYLOAD': payload,
      'X-TXC-SIGNATURE': CryptoJS.HmacSHA512(payload, this.external_secret_key),
    }
  }

  async getOpenOrder(
    coin: string,
    currency: string,
  ): Promise<P2pb2bOrderItem[]> {
    const body = {
      market: `${coin.toUpperCase()}_${currency.toUpperCase()}`,
      offset: 0,
      limit: 100,
      request: '/api/v2/orders',
      nonce: Date.now(),
    }
    let response
    try {
      response = await lastValueFrom(
        this.httpService.post('/api/v2/orders', body, {
          baseURL: this.external_url,
          headers: this.getHeaderRequest(body) as any,
        }),
      )
    } catch (error) {
      this.logger.error(
        `${JSON.stringify(error.response?.data) || error.message}!`,
      )
      return []
    }
    if (!response?.['data']?.['result']) {
      throw new BadRequestException('p2pb2b error!')
    }
    return response?.['data']?.['result']
  }

  async cancelOrder(coin: string, currency: string, order_id: string) {
    const body = {
      market: `${coin.toUpperCase()}_${currency.toUpperCase()}`,
      orderId: order_id,
      request: '/api/v2/order/cancel',
      nonce: Date.now(),
    }
    try {
      await lastValueFrom(
        this.httpService.post(`/api/v2/order/cancel`, body, {
          baseURL: this.external_url,
          headers: this.getHeaderRequest(body) as any,
        }),
      )
    } catch (error) {
      return `${JSON.stringify(error.response?.data) || error.message}!`
    }
    return 'success'
  }

  async createOrder(order: P2pb2bOrderItem) {
    order.request = '/api/v2/order/new'
    order.nonce = Date.now()
    try {
      await lastValueFrom(
        this.httpService.post('/api/v2/order/new', order, {
          baseURL: this.external_url,
          headers: this.getHeaderRequest(order) as any,
        }),
      )
    } catch (error) {
      return `${JSON.stringify(error.response?.data) || error.message}!`
    }
    return 'success'
  }

  getImportStatus(coin: string, currency: string) {
    return this.result[`${coin}_${currency}`]
  }
}
