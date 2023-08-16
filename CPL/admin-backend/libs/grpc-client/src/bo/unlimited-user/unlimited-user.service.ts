import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import { ParseResponseGrpc } from '../../grpc-client.helper'
import {
  GrpcUnlimitedUserDTO,
  GrpcUnlimitedUserResponseDTO,
  GrpcUserUnLimitedDTO,
  GrpcUserUnlimitedResponseDTO,
  ListGrpcUnlimitedUserResponseDTO,
} from './unlimited-user.dto'
import {
  IGrpcUnlimitedUserAddRequest,
  IGrpcUnlimitedUserDeleteRequest,
  IGrpcUnlimitedUserFindOneRequest,
  IGrpcUnlimitedUserListRequest,
  IGrpcUnlimitedUserUpdateRequest,
  IGrpcUnlimitedUserService,
} from './unlimited-user.interface'

@Injectable()
export class GrpcUnlimitedUserService {
  private grpcUnlimitedUserService: IGrpcUnlimitedUserService

  /**
   * constructor
   * @param client
   */
  constructor(
    @Inject('BO_UNLIMITED_USER_PACKAGE') private client: ClientGrpc,
  ) {}

  /**
   * onModuleInit
   */
  onModuleInit() {
    this.grpcUnlimitedUserService =
      this.client.getService<IGrpcUnlimitedUserService>(
        'BOUnlimitedUserService',
      )
  }

  /**
   * create
   * @param addUnlimitedUser
   * @returns
   */
  async create(
    createRequest: IGrpcUnlimitedUserAddRequest,
  ): Promise<GrpcUnlimitedUserResponseDTO> {
    const result = await lastValueFrom(
      this.grpcUnlimitedUserService.add(createRequest),
    )
    return ParseResponseGrpc<GrpcUnlimitedUserResponseDTO>(
      GrpcUnlimitedUserDTO,
      result,
    )
  }

  /**
   * findOne
   * @param findOne
   * @returns
   */
  async findOne(
    findOne: IGrpcUnlimitedUserFindOneRequest,
  ): Promise<GrpcUnlimitedUserResponseDTO> {
    const result = await firstValueFrom(
      this.grpcUnlimitedUserService.findOne(findOne),
    )
    return ParseResponseGrpc<GrpcUnlimitedUserResponseDTO>(
      GrpcUnlimitedUserDTO,
      result,
    )
  }

  /**
   * update
   * @param updateRequest
   * @returns
   */
  async update(
    updateRequest: IGrpcUnlimitedUserUpdateRequest,
  ): Promise<GrpcUnlimitedUserResponseDTO> {
    const result = await firstValueFrom(
      this.grpcUnlimitedUserService.update(updateRequest),
    )
    return ParseResponseGrpc<GrpcUnlimitedUserResponseDTO>(
      GrpcUnlimitedUserDTO,
      result,
    )
  }

  /**
   * findAll
   * @param listRequest
   * @returns
   */
  async findAll(listRequest: IGrpcUnlimitedUserListRequest) {
    const result = await firstValueFrom(
      this.grpcUnlimitedUserService.list(listRequest),
    )
    return ParseResponseGrpc<GrpcUserUnlimitedResponseDTO>(
      GrpcUserUnLimitedDTO,
      result,
      true,
    )
  }

  /**
   * findAllVerified
   * @param listRequest
   * @returns
   */
  async findAllVerified(
    listRequest: IGrpcUnlimitedUserListRequest,
  ): Promise<ListGrpcUnlimitedUserResponseDTO> {
    const result = await firstValueFrom(
      this.grpcUnlimitedUserService.findAllVerified(listRequest),
    )
    return ParseResponseGrpc<ListGrpcUnlimitedUserResponseDTO>(
      GrpcUnlimitedUserDTO,
      result,
    )
  }

  /**
   * delete
   * @param deleteRequest
   * @returns
   */
  async delete(
    deleteRequest: IGrpcUnlimitedUserDeleteRequest,
  ): Promise<GrpcUnlimitedUserResponseDTO> {
    const result = await lastValueFrom(
      this.grpcUnlimitedUserService.delete(deleteRequest),
    )
    return ParseResponseGrpc<GrpcUnlimitedUserResponseDTO>(
      GrpcUnlimitedUserDTO,
      result,
    )
  }

  /**
   * export
   * @param listRequest
   * @returns
   */
  async export(listRequest: IGrpcUnlimitedUserListRequest) {
    const result = await lastValueFrom(
      this.grpcUnlimitedUserService.export(listRequest),
    )
    return result
  }
}
