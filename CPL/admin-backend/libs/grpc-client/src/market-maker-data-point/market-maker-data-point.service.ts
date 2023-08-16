import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { instanceToPlain } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import {
  DataPointItem,
  DataPointResponse,
  DeleteDataPointParams,
  GetDataPointParams,
} from './market-maker-data-point.dto'
import { IMarketMakerDataPointService } from './market-maker-data-point.interface'

@Injectable()
export class MarketMakerDataPointService {
  private grpcDataPointService: IMarketMakerDataPointService

  constructor(
    @Inject('MARKET_MAKER_DATA_POINT_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.grpcDataPointService =
      this.client.getService<IMarketMakerDataPointService>(
        'MarketMakerDataPointService',
      )
  }

  async insertDataPoint(body: DataPointItem): Promise<{ response: string }> {
    return lastValueFrom(this.grpcDataPointService.insertDataPoint(body))
  }

  async deleteDataPoint(
    params: DeleteDataPointParams,
  ): Promise<{ response: string }> {
    return lastValueFrom(this.grpcDataPointService.deleteDataPoint(params))
  }

  async getDataPoint(params: GetDataPointParams): Promise<DataPointResponse> {
    return lastValueFrom(
      this.grpcDataPointService.getDataPoint(instanceToPlain(params)),
    )
  }
}
