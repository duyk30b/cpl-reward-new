import { Inject, Injectable, Logger } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { lastValueFrom, map } from 'rxjs'
import {
  CreateBalanceConvertRequest,
  UpdateBalanceConvertRequest,
  ListBalanceConvertRequest,
  ListBalanceConvertLogRequest,
  BalanceConvert,
  BalanceConvertLog,
} from './balance-convert.dto'
import { IBalanceConvertService } from './balance-convert.interface'
import { BalanceConvertConstant } from './balance-convert.constant'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class BalanceConvertService {
  protected readonly logger = new Logger(BalanceConvertService.name)
  private balanceConvertService: IBalanceConvertService
  constructor(
    @Inject(BalanceConvertConstant.GRPC_BALANCE_CONVERT_PACKAGE)
    private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.balanceConvertService =
      this.client.getService<IBalanceConvertService>('SettingService')
  }

  async createBalanceConvert(body: CreateBalanceConvertRequest) {
    const result = await lastValueFrom(
      this.balanceConvertService.create(body).pipe(map((data) => data)),
    )
    return plainToInstance(BalanceConvert, result)
  }

  async updateBalanceConvert(params: UpdateBalanceConvertRequest) {
    const result = await lastValueFrom(
      this.balanceConvertService.update(params).pipe(map((data) => data)),
    )
    return plainToInstance(BalanceConvert, result)
  }

  async deleteBalanceConvert(id: string) {
    const result = await lastValueFrom(
      this.balanceConvertService.delete({ id }).pipe(map((data) => data)),
    )
    return plainToInstance(BalanceConvert, result)
  }

  async getBalanceConvert(id: string) {
    const result = await lastValueFrom(
      this.balanceConvertService.get({ id }).pipe(map((data) => data)),
    )
    return plainToInstance(BalanceConvert, result)
  }

  async listBalanceConvert(params: ListBalanceConvertRequest) {
    const result = await lastValueFrom(
      this.balanceConvertService.list(params).pipe(map((data) => data)),
    )
    return {
      data: result.data ? plainToInstance(BalanceConvert, result.data) : [],
      pagination: result.pagination,
    }
  }

  async listBalanceConvertLog(params: ListBalanceConvertLogRequest) {
    const result = await lastValueFrom(
      this.balanceConvertService.listLog(params).pipe(map((data) => data)),
    )
    return {
      data: result.data ? plainToInstance(BalanceConvertLog, result.data) : [],
      pagination: result.pagination,
    }
  }
}
