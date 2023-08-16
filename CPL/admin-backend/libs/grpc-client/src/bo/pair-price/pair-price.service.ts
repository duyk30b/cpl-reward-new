import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcPairPriceDTO,
  GrpcPairPriceResponseDTO,
  ListGrpcPairPriceResponseDTO,
} from './pair-price.dto'
import {
  IGrpcPairPriceAddRequest,
  IGrpcPairPriceDeleteRequest,
  IGrpcPairPriceFindOneRequest,
  IGrpcPairPriceListRequest,
  IGrpcPairPriceUpdateRequest,
  IGrpcPairPriceService,
} from './pair-price.interface'

@Injectable()
export class GrpcPairPriceService {
  private boPairPriceService: IGrpcPairPriceService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_PAIR_PRICE_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.boPairPriceService =
      this.client.getService<IGrpcPairPriceService>('BOPairPriceService')
  }

  /**
   * create
   * @param createRequest
   * @returns
   */
  async create(
    createRequest: IGrpcPairPriceAddRequest,
  ): Promise<GrpcPairPriceResponseDTO> {
    const result = await lastValueFrom(
      this.boPairPriceService.add(createRequest),
    )
    return ParseResponseGrpc<GrpcPairPriceResponseDTO>(GrpcPairPriceDTO, result)
  }

  /**
   * findOne
   * @param findOne
   * @returns
   */
  async findOne(
    findOne: IGrpcPairPriceFindOneRequest,
  ): Promise<GrpcPairPriceResponseDTO> {
    const result = await firstValueFrom(
      this.boPairPriceService.findOne(findOne),
    )
    return ParseResponseGrpc<GrpcPairPriceResponseDTO>(GrpcPairPriceDTO, result)
  }

  /**
   * update
   * @param updateRequest
   * @returns
   */
  async update(
    updateRequest: IGrpcPairPriceUpdateRequest,
  ): Promise<GrpcPairPriceResponseDTO> {
    const result = await firstValueFrom(
      this.boPairPriceService.update(updateRequest),
    )
    return ParseResponseGrpc<GrpcPairPriceResponseDTO>(GrpcPairPriceDTO, result)
  }

  /**
   * findAll
   * @param listFilter
   * @returns
   */
  async findAll(
    listRequest: IGrpcPairPriceListRequest,
  ): Promise<ListGrpcPairPriceResponseDTO> {
    const result = await firstValueFrom(
      this.boPairPriceService.list(listRequest),
    )
    return ParseResponseGrpc<ListGrpcPairPriceResponseDTO>(
      GrpcPairPriceDTO,
      result,
    )
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcPairPriceDeleteRequest,
  ): Promise<GrpcPairPriceResponseDTO> {
    const result = await lastValueFrom(
      this.boPairPriceService.delete(deleteRequest),
    )
    return ParseResponseGrpc<GrpcPairPriceResponseDTO>(GrpcPairPriceDTO, result)
  }
}
