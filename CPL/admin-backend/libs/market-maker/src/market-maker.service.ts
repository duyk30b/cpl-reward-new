import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, InsertResult, LessThan, MoreThan, Repository } from 'typeorm'
import { DataPointResponse, GetDataPointParams } from './market-maker.dto'
import { DataPointItem } from './data-point.entity'

@Injectable()
export class MarketMakerService {
  constructor(
    @InjectRepository(DataPointItem)
    private readonly dataPointItemRepository: Repository<DataPointItem>,
  ) {}

  async getDataPoints(params: GetDataPointParams): Promise<DataPointResponse> {
    const { coin, currency, startTime, endTime } = params
    const dataPoint = await this.dataPointItemRepository.find({
      where: [
        {
          coin,
          currency,
          start_time: Between(Number(startTime), Number(endTime)),
        },
        {
          coin,
          currency,
          end_time: Between(Number(startTime), Number(endTime)),
        },
        {
          coin,
          currency,
          start_time: LessThan(Number(startTime)),
          end_time: MoreThan(Number(endTime)),
        },
      ],
      order: {
        start_time: 'ASC',
      },
    })
    const dataVersion = await this.dataPointItemRepository.findOne({
      where: {
        coin: params.coin,
        currency: params.currency,
      },
      order: {
        created_at: -1,
      },
    })
    return {
      version: dataVersion ? dataVersion.created_at : '',
      data_point: dataPoint.map((item: DataPointItem) => {
        return {
          ...item,
          start_time: String(Number(item.start_time) / 1000),
          end_time: String(Number(item.end_time) / 1000),
        }
      }),
    }
  }

  async insertDataPoint(body: DataPointItem): Promise<InsertResult> {
    return this.dataPointItemRepository.insert(body)
  }

  async deleteDataPointsByPair(coin: string, currency: string) {
    return this.dataPointItemRepository.delete({
      coin,
      currency,
    })
  }
}
