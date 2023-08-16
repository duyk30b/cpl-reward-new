import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import {
  IAddRequest,
  IDeleteRequest,
  IDeleteUserTagsByUsersRequest,
  IDeleteUserTagsRequest,
  IFindByIdRequest,
  IFindByUserIdRequest,
  IListRequest,
  IUserTagService,
} from '.'
import { ParseResponseGrpc } from '..'
import {
  ListUserTagResponseDto,
  UserTagDto,
  UserTagResponseDto,
} from './user-tag.dto'

@Injectable()
export class UserTagService {
  private gUserTagSrv: IUserTagService
  constructor(@Inject('USER_TAG_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gUserTagSrv =
      this.client.getService<IUserTagService>('GUserTagService')
  }

  async create(addUserTags: IAddRequest): Promise<UserTagResponseDto> {
    const result = await lastValueFrom(
      this.gUserTagSrv.addUserTags(addUserTags),
    )
    return ParseResponseGrpc<UserTagResponseDto>(UserTagDto, result)
  }

  async findById(
    findByIdRequest: IFindByIdRequest,
  ): Promise<UserTagResponseDto> {
    const result = await firstValueFrom(
      this.gUserTagSrv.findById(findByIdRequest),
    )
    return ParseResponseGrpc<UserTagResponseDto>(UserTagDto, result)
  }

  async findUserTagsByUserId(
    findByUserIdRequest: IFindByUserIdRequest,
  ): Promise<UserTagResponseDto> {
    const result = await firstValueFrom(
      this.gUserTagSrv.findUserTagsByUserId(findByUserIdRequest),
    )
    return ParseResponseGrpc<UserTagResponseDto>(UserTagDto, result)
  }

  async listUserTags(
    listFilter: IListRequest,
  ): Promise<ListUserTagResponseDto> {
    const result = await firstValueFrom(
      this.gUserTagSrv.listUserTags(listFilter),
    )
    return ParseResponseGrpc<ListUserTagResponseDto>(UserTagDto, result)
  }

  async deleteOne(deleteUserTag: IDeleteRequest): Promise<UserTagResponseDto> {
    const result = await lastValueFrom(
      this.gUserTagSrv.deleteUserTag(deleteUserTag),
    )
    return ParseResponseGrpc<UserTagResponseDto>(UserTagDto, result)
  }

  async deleteMany(
    deleteUserTags: IDeleteUserTagsRequest,
  ): Promise<UserTagResponseDto> {
    const result = await lastValueFrom(
      this.gUserTagSrv.deleteUserTags(deleteUserTags),
    )
    return ParseResponseGrpc<UserTagResponseDto>(UserTagDto, result)
  }

  async deleteManyByUsers(
    deleteUserTagsByUsers: IDeleteUserTagsByUsersRequest,
  ): Promise<UserTagResponseDto> {
    const result = await lastValueFrom(
      this.gUserTagSrv.deleteUserTagsByUsers(deleteUserTagsByUsers),
    )
    return ParseResponseGrpc<UserTagResponseDto>(UserTagDto, result)
  }
}
