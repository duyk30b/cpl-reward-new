import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcTradingPairDTO,
  GrpcTradingPairResponseDTO,
  ListGrpcTradingPairResponseDTO,
} from './trading-pair.dto'
import {
  IGrpcTradingPairAddRequest,
  IGrpcTradingPairDeleteRequest,
  IGrpcTradingPairFindOneRequest,
  IGrpcTradingPairListRequest,
  IGrpcTradingPairUpdateRequest,
  IGrpcTradingPairService,
} from './trading-pair.interface'

@Injectable()
export class GrpcTradingPairService {
  private boTradingPairService: IGrpcTradingPairService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_TRADING_PAIR_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.boTradingPairService = this.client.getService<IGrpcTradingPairService>(
      'BOTradingPairService',
    )
  }

  /**
   * create
   * @param createRequest
   * @returns
   */
  async create(
    createRequest: IGrpcTradingPairAddRequest,
  ): Promise<GrpcTradingPairResponseDTO> {
    const result = await lastValueFrom(
      this.boTradingPairService.add(createRequest),
    )
    return ParseResponseGrpc<GrpcTradingPairResponseDTO>(
      GrpcTradingPairDTO,
      result,
    )
  }

  /**
   * findOne
   * @param findOne
   * @returns
   */
  async findOne(
    findOne: IGrpcTradingPairFindOneRequest,
  ): Promise<GrpcTradingPairResponseDTO> {
    const result = await firstValueFrom(
      this.boTradingPairService.findOne(findOne),
    )
    return ParseResponseGrpc<GrpcTradingPairResponseDTO>(
      GrpcTradingPairDTO,
      result,
    )
  }

  /**
   * update
   * @param updateRequest
   * @returns
   */
  async update(
    updateRequest: IGrpcTradingPairUpdateRequest,
  ): Promise<GrpcTradingPairResponseDTO> {
    const result = await firstValueFrom(
      this.boTradingPairService.update(updateRequest),
    )
    return ParseResponseGrpc<GrpcTradingPairResponseDTO>(
      GrpcTradingPairDTO,
      result,
    )
  }

  /**
   * findAll
   * @param listRequest
   * @returns
   */
  async findAll(
    listRequest: IGrpcTradingPairListRequest,
  ): Promise<ListGrpcTradingPairResponseDTO> {
    const result = await firstValueFrom(
      this.boTradingPairService.list(listRequest),
    )
    return ParseResponseGrpc<ListGrpcTradingPairResponseDTO>(
      GrpcTradingPairDTO,
      result,
    )
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcTradingPairDeleteRequest,
  ): Promise<GrpcTradingPairResponseDTO> {
    const result = await lastValueFrom(
      this.boTradingPairService.delete(deleteRequest),
    )
    return ParseResponseGrpc<GrpcTradingPairResponseDTO>(
      GrpcTradingPairDTO,
      result,
    )
  }
}
