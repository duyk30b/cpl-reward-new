import { Injectable } from '@nestjs/common'
import {
  ApiCreateTradingModeDTO,
  ApiUpdateTradingModeDTO,
  ApiDeleteTradingModeDTO,
  ApiListTradingModeDTO,
  ApiFindOneTradingModeDTO,
  ApiUpdateStatusTradingModeDTO,
} from './trading-mode.dto'
import { GrpcTradingModeService } from '@lib/grpc-client/bo/trading-mode'
import { plainToClass } from 'class-transformer'

@Injectable()
export class TradingModeService {
  /**
   * constructor
   * @param grpcTradingModeService
   */
  constructor(
    private readonly grpcTradingModeService: GrpcTradingModeService,
  ) {}

  //Trading Mode
  /**
   * list
   * @param filter
   * @returns
   */
  async list(filter: ApiListTradingModeDTO) {
    const data = await this.grpcTradingModeService.list(filter)
    return data.data
  }

  /**
   * export
   * @param filter
   * @returns
   */
  async export(filter: ApiListTradingModeDTO) {
    const data = await this.grpcTradingModeService.export(filter)
    return data
  }

  /**
   * create
   * @param apiCreateTradingModeDTO
   * @returns
   */
  async create(apiCreateTradingModeDTO: ApiCreateTradingModeDTO) {
    return await this.grpcTradingModeService.create(apiCreateTradingModeDTO)
  }

  /**
   * update
   * @param apiUpdateTradingModeDTO
   * @returns
   */
  async update(apiUpdateTradingModeDTO: ApiUpdateTradingModeDTO) {
    return await this.grpcTradingModeService.update(apiUpdateTradingModeDTO)
  }

  /**
   * update
   * @param apiUpdateTradingModeDTO
   * @returns
   */
  async updateStatus(apiUpdateTradingModeDTO: ApiUpdateStatusTradingModeDTO) {
    // convert ApiUpdateStatusTradingModeDTO => ApiUpdateTradingModeDTO
    const data = plainToClass(
      ApiUpdateTradingModeDTO,
      apiUpdateTradingModeDTO,
      {
        excludeExtraneousValues: true,
      },
    )
    return await this.grpcTradingModeService.update(data)
  }

  /**
   * delete
   * @param apiDeleteTradingModeDTO
   * @returns
   */
  async delete(apiDeleteTradingModeDTO: ApiDeleteTradingModeDTO) {
    return await this.grpcTradingModeService.delete(apiDeleteTradingModeDTO)
  }

  /**
   * findOne
   * @param id
   * @returns
   */
  async findOne(findOneRequest: ApiFindOneTradingModeDTO) {
    const data = await this.grpcTradingModeService.findOne(findOneRequest)
    return data.data
  }

  /**
   * getPeriod
   * @returns
   */
  async getPeriod() {
    const data = await this.grpcTradingModeService.getPeriod()
    return data.data
  }
}
