import { DataPointItem, GetDataPointParams } from '@app/market-maker'
import { BadRequestException } from '@nestjs/common'
import { Injectable } from '@nestjs/common'
import * as moment from 'moment'
import { ConfigService } from '@nestjs/config'
import { UtilService } from '@lib/util'
import { removeRecordEmpty } from '@app/common'
import { MarketMakerDataPointService } from '@lib/grpc-client/market-maker-data-point'

@Injectable()
export class GrpcMarketMakerService {
  private readonly start_index_file_point

  constructor(
    private readonly marketMakerService: MarketMakerDataPointService,
    private configService: ConfigService,
    private utilService: UtilService,
  ) {
    this.start_index_file_point = this.configService.get(
      'market_maker_order.start_index_file_order',
    )
  }

  async getDataPoints(params: GetDataPointParams) {
    if (Number(params.endTime) < Number(params.startTime))
      throw new BadRequestException(`end time must be more than start time!`)
    return this.marketMakerService.getDataPoint(params)
  }

  importFileData(
    coin: string,
    currency: string,
    dataOrigin: Array<Array<string>>,
  ) {
    const currentTime = new Date().getTime().toString()
    const data = removeRecordEmpty(dataOrigin)
    const result = []
    let previousPoint: DataPointItem = {} as DataPointItem
    let currentPoint: DataPointItem = {} as DataPointItem
    if (data.length == 0 || data.length < 3)
      throw new BadRequestException('File empty!')
    for (let i = Number(this.start_index_file_point); i < data.length; i++) {
      if (data[i].length != 2)
        throw new BadRequestException(`record ${i + 1} invalid format data`)
      if (!this.checkValidRecord(data[i]))
        throw new BadRequestException(`record ${i + 1} invalid`)
      const [timePoint, valuePoint] = data[i]
      previousPoint = Object.assign({}, currentPoint)
      currentPoint = {
        coin,
        currency,
        created_at: currentTime,
        start_time: previousPoint.end_time,
        end_time: moment(timePoint, 'YYYY/MM/DD HH:mm:ss')
          .utc(true)
          .format('x')
          .toString(),
        start_price: previousPoint.end_price,
        end_price: valuePoint,
      }
      if (this.isValidDataPoint(currentPoint, i)) result.push(currentPoint)
    }
    return this.insertDataToDb(result, coin, currency)
  }

  async insertDataToDb(data: DataPointItem[], coin: string, currency: string) {
    if (data.length == 0) throw new BadRequestException('No record valid!')
    if (data.length > 3000)
      throw new BadRequestException('Over record handler!')
    await this.marketMakerService.deleteDataPoint({ coin, currency })
    const response = [] as { response: string }[]
    for (const point of data) {
      response.push(await this.marketMakerService.insertDataPoint(point))
    }
    return response
  }

  isValidDataPoint(dataPoint: DataPointItem, i: number): boolean {
    const timeFiveMinute = 5 * 60 * 1000
    if (
      !dataPoint.start_price ||
      !dataPoint.start_time ||
      !dataPoint.end_price ||
      !dataPoint.end_time
    )
      return false
    if (
      Number(dataPoint.end_time) - Number(dataPoint.start_time) <
      5 * 60 * 1000 // 5p
    )
      throw new BadRequestException(
        `It must be at least 5 mins between the ${i} and the ${
          i + 1
        } data point `,
      )
    if (
      Number(dataPoint.end_time) % timeFiveMinute != 0 ||
      Number(dataPoint.start_time) % timeFiveMinute != 0
    )
      throw new BadRequestException(
        `The ${i + 1} data point must be divisible by 5 mins `,
      )
    if (
      Number(dataPoint.end_time) - Number(dataPoint.start_time) >
      8 * 60 * 60 * 1000 // 8h
    ) {
      throw new BadRequestException(
        `It must be less than 8 hour between the ${i} and the ${i + 1} `,
      )
    }
    return true
  }

  checkValidRecord(data: Array<string>): boolean {
    const [timePoint, valuePoint] = data
    if (isNaN(new Date(timePoint).getTime())) return false
    if (!this.utilService.isNumeric(valuePoint) || Number(valuePoint) <= 0)
      return false
    return true
  }
}
