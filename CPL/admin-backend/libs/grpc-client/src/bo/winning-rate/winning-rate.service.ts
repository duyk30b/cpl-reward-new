import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcWinningRateDTO,
  GrpcWinningRateResponseDTO,
  ListGrpcWinningRateResponseDTO,
} from './winning-rate.dto'
import {
  IGrpcWinningRateListRequest,
  IGrpcWinningRateService,
} from './winning-rate.interface'

@Injectable()
export class GrpcWinningRateService {
  private boGrpcWinningRateService: IGrpcWinningRateService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_WINNING_RATE_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */

  onModuleInit() {
    this.boGrpcWinningRateService =
      this.client.getService<IGrpcWinningRateService>(
        'BOWinningRateAnalysisService',
      )
  }

  /**
   * getBySeconds
   * @returns
   */
  async getBySeconds(
    listFilter: IGrpcWinningRateListRequest,
  ): Promise<GrpcWinningRateResponseDTO> {
    const result = await firstValueFrom(
      this.boGrpcWinningRateService.listSeconds(listFilter),
    )
    return ParseResponseGrpc<GrpcWinningRateResponseDTO>(
      GrpcWinningRateDTO,
      result,
    )
  }

  /**
   * getByMinutes
   * @returns
   */
  async getByMinutes(
    listFilter: IGrpcWinningRateListRequest,
  ): Promise<GrpcWinningRateResponseDTO> {
    const result = await firstValueFrom(
      this.boGrpcWinningRateService.listMinutes(listFilter),
    )
    return ParseResponseGrpc<GrpcWinningRateResponseDTO>(
      GrpcWinningRateDTO,
      result,
    )
  }

  /**
   * getByHours
   * @returns
   */
  async getByHours(
    listFilter: IGrpcWinningRateListRequest,
  ): Promise<GrpcWinningRateResponseDTO> {
    const result = await firstValueFrom(
      this.boGrpcWinningRateService.listHours(listFilter),
    )
    return ParseResponseGrpc<GrpcWinningRateResponseDTO>(
      GrpcWinningRateDTO,
      result,
    )
  }
}
