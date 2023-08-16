import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { ResponseDto } from '../dto/response.dto'
import {
  ICreateUserTags,
  IDeleteById,
  IDeleteUserTagByIds,
  IDeleteUserTagByUsers,
  IListUserTags,
  IUserTagById,
  IUserTagByUserId,
} from './internal-user-tag.interface'
import { InternalUserTagService } from './internal-user-tag.service'

@Controller('UserTag')
export class InternalUserTagController {
  constructor(private readonly userTagService: InternalUserTagService) {}

  @GrpcMethod('GUserTagService')
  async addUserTags(createUserTags: ICreateUserTags): Promise<ResponseDto> {
    return await this.userTagService.create(createUserTags)
  }

  @GrpcMethod('GUserTagService')
  async findUserTagsByUserId(
    userTagByUserId: IUserTagByUserId,
  ): Promise<ResponseDto> {
    return await this.userTagService.getByUserId(userTagByUserId)
  }

  @GrpcMethod('GUserTagService')
  async findById(userTagById: IUserTagById): Promise<ResponseDto> {
    return await this.userTagService.getById(userTagById)
  }

  @GrpcMethod('GUserTagService')
  async listUserTags(listUserTags: IListUserTags): Promise<ResponseDto> {
    return await this.userTagService.list(listUserTags)
  }

  @GrpcMethod('GUserTagService')
  async deleteUserTag(userTagById: IDeleteById): Promise<ResponseDto> {
    return await this.userTagService.deleteOne(userTagById)
  }

  @GrpcMethod('GUserTagService')
  async deleteUserTags(
    userTagByIds: IDeleteUserTagByIds,
  ): Promise<ResponseDto> {
    return await this.userTagService.deleteMany(userTagByIds)
  }

  @GrpcMethod('GUserTagService')
  async deleteUserTagsByUsers(
    userTagByUsers: IDeleteUserTagByUsers,
  ): Promise<ResponseDto> {
    return await this.userTagService.deleteManyByUsers(userTagByUsers)
  }
}
