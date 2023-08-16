import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcBlockUserDTO,
  GrpcBlockUserResponseDTO,
  GrpcUserBlockDTO,
  GrpcUserBlockResponseDTO,
} from './block-user.dto'
import {
  IGrpcBlockUserAddRequest,
  IGrpcBlockUserDeleteRequest,
  IGrpcBlockUserFindOneRequest,
  IGrpcBlockUserListRequest,
  IGrpcBlockUserService,
} from './block-user.interface'

@Injectable()
export class GrpcBlockUserService {
  private grpcBlockUserService: IGrpcBlockUserService

  /**
   * constructor
   * @param client
   */
  constructor(@Inject('BO_BLOCK_USER_PACKAGE') private client: ClientGrpc) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcBlockUserService =
      this.client.getService<IGrpcBlockUserService>('BOBlockUserService')
  }

  /**
   * create
   * @param addBlockUser
   * @returns
   */
  async create(
    createRequest: IGrpcBlockUserAddRequest,
  ): Promise<GrpcBlockUserResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBlockUserService.add(createRequest),
    )
    return ParseResponseGrpc<GrpcBlockUserResponseDTO>(GrpcBlockUserDTO, result)
  }

  /**
   * findOne
   * @param findOne
   * @returns
   */
  async findOne(
    findOne: IGrpcBlockUserFindOneRequest,
  ): Promise<GrpcBlockUserResponseDTO> {
    const result = await firstValueFrom(
      this.grpcBlockUserService.findOne(findOne),
    )
    return ParseResponseGrpc<GrpcBlockUserResponseDTO>(GrpcBlockUserDTO, result)
  }

  /**
   * findAll
   * @param listRequest
   * @returns
   */
  async findAll(listRequest: IGrpcBlockUserListRequest) {
    const result = await firstValueFrom(
      this.grpcBlockUserService.list(listRequest),
    )
    return ParseResponseGrpc<GrpcUserBlockResponseDTO>(
      GrpcUserBlockDTO,
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
    deleteRequest: IGrpcBlockUserDeleteRequest,
  ): Promise<GrpcBlockUserResponseDTO> {
    const result = await lastValueFrom(
      this.grpcBlockUserService.delete(deleteRequest),
    )
    return ParseResponseGrpc<GrpcBlockUserResponseDTO>(GrpcBlockUserDTO, result)
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcBlockUserListRequest) {
    const result = await lastValueFrom(
      this.grpcBlockUserService.export(listRequest),
    )
    return result
  }
}
