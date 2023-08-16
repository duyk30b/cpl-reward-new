import { GrpcUserBalanceService } from '@lib/grpc-client/bo/user-balance/user-balance.service'
import { Injectable } from '@nestjs/common'
import { FilterHistoryTransferDTO } from './user-balance.dto'

@Injectable()
export class UserBalanceService {
  /**
   * constructor
   * @param boBalanceService
   */
  constructor(private readonly boBalanceService: GrpcUserBalanceService) {}

  /**
   * list
   * @param listUserBalanceDto
   * @returns
   */
  async list(listUserBalanceDto) {
    const data = await this.boBalanceService.list(listUserBalanceDto)
    return data.data
  }

  /**
   * getSummary
   * @returns
   */
  async getSummary() {
    const data = await this.boBalanceService.getSummary()
    return data.data
  }

  /**
   * export
   * @param listUserBalanceDto
   * @returns
   */
  async export(listUserBalanceDto) {
    return await this.boBalanceService.export(listUserBalanceDto)
  }

  /**
   * listExport
   * @param
   * @returns
   */
  async listExport(listUserBalanceDto) {
    return await this.boBalanceService.listExport(listUserBalanceDto)
  }

  /**
   * listTransfers
   * @param filter
   * @returns
   */
  async listTransfers(filter: FilterHistoryTransferDTO) {
    const data = await this.boBalanceService.listTransfers(filter)
    return data.data
  }

  /**
   * exportTransfers
   * @param filter
   * @returns
   */
  async exportTransfers(filter: FilterHistoryTransferDTO) {
    const data = await this.boBalanceService.exportTransfers(filter)
    return data
  }
}
