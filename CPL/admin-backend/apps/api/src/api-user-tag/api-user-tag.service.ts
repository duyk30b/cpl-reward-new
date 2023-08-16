import { UserTagService } from '@lib/grpc-client/user-tag'
import { Injectable } from '@nestjs/common'
import {
  ApiAddUserTagsDto,
  ApiDeleteUserTagDto,
  ApiDeleteUserTagsByUsersDto,
  ApiDeleteUserTagsDto,
  ApiFindByIdDto,
  ApiFindUserTagsByUserIdDto,
  ApiListUserTagDto,
} from './api-user-tag.dto'

@Injectable()
export class ApiUserTagService {
  constructor(private userTagService: UserTagService) {}

  async create(apiAddUserTagsDto: ApiAddUserTagsDto) {
    return await this.userTagService.create(apiAddUserTagsDto)
  }

  async findByUserId(apiFindUserTagsByUserIdDto: ApiFindUserTagsByUserIdDto) {
    return await this.userTagService.findUserTagsByUserId(
      apiFindUserTagsByUserIdDto,
    )
  }

  async findById(apiFindByIdDto: ApiFindByIdDto) {
    return await this.userTagService.findById(apiFindByIdDto)
  }

  async listUserTags(apiListUserTagDto: ApiListUserTagDto) {
    return await this.userTagService.listUserTags(apiListUserTagDto)
  }

  async deleteOne(apiDeleteUserTagDto: ApiDeleteUserTagDto) {
    return await this.userTagService.deleteOne(apiDeleteUserTagDto)
  }

  async deleteMany(apiDeleteUserTagsDto: ApiDeleteUserTagsDto) {
    return await this.userTagService.deleteMany(apiDeleteUserTagsDto)
  }

  async deleteManyByUsers(
    apiDeleteUserTagsByUsersDto: ApiDeleteUserTagsByUsersDto,
  ) {
    return await this.userTagService.deleteManyByUsers(
      apiDeleteUserTagsByUsersDto,
    )
  }
}
