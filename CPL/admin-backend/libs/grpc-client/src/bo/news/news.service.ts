import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcNewsDTO,
  GrpcNewsResponseDTO,
  ListGrpcNewsResponseDTO,
} from './news.dto'
import {
  IGrpcNewsAddRequest,
  IGrpcNewsDeleteRequest,
  IGrpcNewsFindOneRequest,
  IGrpcNewsListRequest,
  IGrpcNewsUpdateRequest,
  IGrpcNewsService,
} from './news.interface'

@Injectable()
export class GrpcNewsService {
  private boNewsService: IGrpcNewsService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_NEWS_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.boNewsService =
      this.client.getService<IGrpcNewsService>('BONewsService')
  }

  /**
   * create
   * @param createRequest
   * @returns
   */
  async create(
    createRequest: IGrpcNewsAddRequest,
  ): Promise<GrpcNewsResponseDTO> {
    const result = await lastValueFrom(this.boNewsService.add(createRequest))
    return ParseResponseGrpc<GrpcNewsResponseDTO>(GrpcNewsDTO, result)
  }

  /**
   * findOne
   * @param findOne
   * @returns
   */
  async findOne(
    findOneRequest: IGrpcNewsFindOneRequest,
  ): Promise<GrpcNewsResponseDTO> {
    const result = await firstValueFrom(
      this.boNewsService.findOne(findOneRequest),
    )
    return ParseResponseGrpc<GrpcNewsResponseDTO>(GrpcNewsDTO, result)
  }

  /**
   * update
   * @param updateRequest
   * @returns
   */
  async update(
    updateRequest: IGrpcNewsUpdateRequest,
  ): Promise<GrpcNewsResponseDTO> {
    const result = await firstValueFrom(
      this.boNewsService.update(updateRequest),
    )
    return ParseResponseGrpc<GrpcNewsResponseDTO>(GrpcNewsDTO, result)
  }

  /**
   * findAll
   * @param listRequest
   * @returns
   */
  async findAll(
    listRequest: IGrpcNewsListRequest,
  ): Promise<ListGrpcNewsResponseDTO> {
    const result = await firstValueFrom(this.boNewsService.list(listRequest))
    return ParseResponseGrpc<ListGrpcNewsResponseDTO>(GrpcNewsDTO, result)
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcNewsDeleteRequest,
  ): Promise<GrpcNewsResponseDTO> {
    const result = await lastValueFrom(this.boNewsService.delete(deleteRequest))
    return ParseResponseGrpc<GrpcNewsResponseDTO>(GrpcNewsDTO, result)
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcNewsListRequest) {
    const result = await lastValueFrom(this.boNewsService.export(listRequest))
    return result
  }
}
