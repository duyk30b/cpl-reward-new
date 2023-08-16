import { BadRequestException, Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  FilterHistoryTransferDTO,
  GrpcUserBalanceDTO,
  GrpcUserBalanceResponseDTO,
  HistoryTransferDTO,
  HistoryTransferResponseDTO,
  ListGrpcUserBalanceResponseDTO,
} from './user-balance.dto'
import {
  IGrpcUserBalanceListRequest,
  IGrpcUserBalanceService,
} from './user-balance.interface'

@Injectable()
export class GrpcUserBalanceService {
  private boGrpcUserBalanceService: IGrpcUserBalanceService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_USER_BALANCE_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.boGrpcUserBalanceService =
      this.client.getService<IGrpcUserBalanceService>('BOUserBalanceService')
  }

  /**
   * list
   * @param listRequest
   * @returns
   */
  async list(
    listRequest: IGrpcUserBalanceListRequest,
  ): Promise<ListGrpcUserBalanceResponseDTO> {
    const result = await firstValueFrom(
      this.boGrpcUserBalanceService.list(listRequest),
    )

    return ParseResponseGrpc<ListGrpcUserBalanceResponseDTO>(
      GrpcUserBalanceDTO,
      result,
    )
  }

  /**
   * getSummary
   * @returns
   */
  async getSummary() {
    const result = await firstValueFrom(
      this.boGrpcUserBalanceService.summary({}),
    )
    return ParseResponseGrpc<GrpcUserBalanceResponseDTO>(
      GrpcUserBalanceDTO,
      result,
    )
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcUserBalanceListRequest) {
    const result = await firstValueFrom(
      this.boGrpcUserBalanceService.export(listRequest),
    )

    return result
  }

  /**
   * listExport
   * @param listRequest
   * @returns
   */
  async listExport(listRequest: IGrpcUserBalanceListRequest) {
    const result = await firstValueFrom(
      this.boGrpcUserBalanceService.listExport(listRequest),
    )

    return result
  }

  /**
   * listTransfers
   * @param listRequest
   * @returns
   */
  async listTransfers(
    listRequest: FilterHistoryTransferDTO,
  ): Promise<HistoryTransferResponseDTO> {
    try {
      const result = await firstValueFrom(
        this.boGrpcUserBalanceService.listTransfers(listRequest),
      )

      return ParseResponseGrpc<HistoryTransferResponseDTO>(
        HistoryTransferDTO,
        result,
      )
    } catch (error) {
      throw new BadRequestException(error)
    }
  }

  /**
   * exportTransfers
   * @param listRequest
   * @returns
   */
  async exportTransfers(listRequest: FilterHistoryTransferDTO) {
    const result = await firstValueFrom(
      this.boGrpcUserBalanceService.exportListTransfers(listRequest),
    )

    return result.data
  }
}
