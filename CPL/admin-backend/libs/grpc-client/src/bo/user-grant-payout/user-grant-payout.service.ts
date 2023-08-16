import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import {
  ParseResponseGrpc,
  ParseResponseGrpcHL,
} from '../../grpc-client.helper'
import {
  GrpcUserGrantPayoutDTO,
  GrpcUserGrantPayoutResponseDTO,
  ListGrpcUserGrantPayoutResponseDTO,
} from './user-grant-payout.dto'
import {
  IGrpcUserGrantPayoutAddRequest,
  IGrpcUserGrantPayoutDeleteRequest,
  IGrpcUserGrantPayoutFindOneRequest,
  IGrpcUserGrantPayoutListRequest,
  IGrpcUserGrantPayoutService,
  IGrpcUserGrantPayoutUpdateRequest,
} from './user-grant-payout.interface'

@Injectable()
export class GrpcUserGrantPayoutService {
  private grpcUserGrantPayoutService: IGrpcUserGrantPayoutService

  /**
   * constructor
   * @param client
   */
  constructor(
    @Inject('BO_USER_GRANT_PAYOUT_PACKAGE') private client: ClientGrpc,
  ) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcUserGrantPayoutService =
      this.client.getService<IGrpcUserGrantPayoutService>(
        'BOUserGrantPayoutService',
      )
  }

  /**
   * create
   * @param addUserGrantPayout
   * @returns
   */
  async create(
    createRequest: IGrpcUserGrantPayoutAddRequest,
  ): Promise<GrpcUserGrantPayoutResponseDTO> {
    const result = await lastValueFrom(
      this.grpcUserGrantPayoutService.add(createRequest),
    )
    return ParseResponseGrpcHL<GrpcUserGrantPayoutResponseDTO>(
      GrpcUserGrantPayoutDTO,
      result,
    )
  }

  /**
   * update
   * @param addUserGrantPayout
   * @returns
   */
  async update(
    updateRequest: IGrpcUserGrantPayoutUpdateRequest,
  ): Promise<GrpcUserGrantPayoutResponseDTO> {
    const result = await lastValueFrom(
      this.grpcUserGrantPayoutService.update(updateRequest),
    )
    return ParseResponseGrpcHL<GrpcUserGrantPayoutResponseDTO>(
      GrpcUserGrantPayoutDTO,
      result,
    )
  }

  /**
   * findOne
   * @param findOne
   * @returns
   */
  async findOne(
    findOne: IGrpcUserGrantPayoutFindOneRequest,
  ): Promise<GrpcUserGrantPayoutResponseDTO> {
    const result = await firstValueFrom(
      this.grpcUserGrantPayoutService.findOne(findOne),
    )
    return ParseResponseGrpc<GrpcUserGrantPayoutResponseDTO>(
      GrpcUserGrantPayoutDTO,
      result,
    )
  }

  /**
   * findAll
   * @param listRequest
   * @returns
   */
  async findAll(listRequest: IGrpcUserGrantPayoutListRequest) {
    const result = await firstValueFrom(
      this.grpcUserGrantPayoutService.list(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUserGrantPayoutResponseDTO>(
      GrpcUserGrantPayoutDTO,
      result,
      true,
    )
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcUserGrantPayoutDeleteRequest,
  ): Promise<GrpcUserGrantPayoutResponseDTO> {
    const result = await lastValueFrom(
      this.grpcUserGrantPayoutService.delete(deleteRequest),
    )
    return ParseResponseGrpc<GrpcUserGrantPayoutResponseDTO>(
      GrpcUserGrantPayoutDTO,
      result,
    )
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcUserGrantPayoutListRequest) {
    const result = await lastValueFrom(
      this.grpcUserGrantPayoutService.export(listRequest),
    )
    return result
  }
}
