import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import {
  BalanceConvertSmall,
  BalanceConvertSmallDetail,
  ListBalanceConvertSmallRequest,
  DetailBalanceConvertSmallRequest,
  DetailBalanceConvertSmallByIdsRequest,
} from './balance-convert-small.dto'
import { IBalanceConvertSmallService } from './balance-convert-small.interface'
import { BalanceConvertSmallConstant } from './balance-convert-small.constant'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom, map } from 'rxjs'

@Injectable()
export class BalanceConvertSmallService {
  protected readonly logger = new Logger(BalanceConvertSmallService.name)
  private balanceConvertSmallService: IBalanceConvertSmallService
  constructor(
    @Inject(BalanceConvertSmallConstant.GRPC_BALANCE_CONVERT_SMALL_PACKAGE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.balanceConvertSmallService =
      this.client.getService<IBalanceConvertSmallService>('ConvertSmallService')
  }

  async getListBalanceConvertSmall(params: ListBalanceConvertSmallRequest) {
    const result = await lastValueFrom(
      this.balanceConvertSmallService.list(params).pipe(map((data) => data)),
    )
    return {
      data: result.data
        ? plainToInstance(BalanceConvertSmall, result.data)
        : [],
      pagination: result.pagination,
    }
  }

  async getDetailBalanceConvertSmall(params: DetailBalanceConvertSmallRequest) {
    const result = await lastValueFrom(
      this.balanceConvertSmallService
        .listDetail(params)
        .pipe(map((data) => data)),
    )
    return plainToInstance(BalanceConvertSmallDetail, result.data)
  }

  async getDetailBalanceConvertSmallByIds(
    params: DetailBalanceConvertSmallByIdsRequest,
  ) {
    const result = await lastValueFrom(
      this.balanceConvertSmallService
        .listDetailByIds(params)
        .pipe(map((data) => data)),
    )
    return plainToInstance(BalanceConvertSmallDetail, result.data)
  }
}
