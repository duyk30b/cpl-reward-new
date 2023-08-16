import { UserTagService } from '@lib/user-tag'
import {
  CreateUserTagDto,
  DeleteUserTagDto,
  DeleteUserTagsByUsersDto,
  DeleteUserTagsDto,
  FindByIdDto,
  FindUserTagByUserIdDto,
  ListUserTagDto,
  UserTagResponseDto,
} from '@lib/user-tag/user-tag.dto'
import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { ResponseDto } from '../dto/response.dto'
import { USER_TAG_MESSAGE } from './internal-user-tag.enum'
import {
  ICreateUserTags,
  IDeleteById,
  IDeleteUserTagByIds,
  IDeleteUserTagByUsers,
  IListUserTags,
  IUserTagById,
  IUserTagByUserId,
} from './internal-user-tag.interface'

@Injectable()
export class InternalUserTagService {
  constructor(private readonly userTagService: UserTagService) {}

  async create(createUserTags: ICreateUserTags): Promise<ResponseDto> {
    try {
      if (createUserTags.userTags.length < 1) {
        return new ResponseDto().error(USER_TAG_MESSAGE.ADD_FAIL)
      }
      const createUserTagsDto = plainToClass(
        CreateUserTagDto,
        createUserTags.userTags,
        {
          ignoreDecorators: true,
        },
      )
      const userTags = await this.userTagService.create(createUserTagsDto)
      if (!userTags) {
        return new ResponseDto().error(USER_TAG_MESSAGE.ADD_FAIL)
      }
      const userTagResponse = userTags.map((item) => {
        return plainToClass(UserTagResponseDto, item, {
          ignoreDecorators: true,
        })
      })
      return new ResponseDto(userTagResponse)
    } catch (error) {
      return new ResponseDto().error(USER_TAG_MESSAGE.ADD_FAIL)
    }
  }

  async getById(getById: IUserTagById): Promise<ResponseDto> {
    const getByIdDto = plainToClass(FindByIdDto, getById, {
      ignoreDecorators: true,
    })
    const userTag = await this.userTagService.getById(getByIdDto)
    return new ResponseDto(
      plainToClass(UserTagResponseDto, userTag, { ignoreDecorators: true }),
    )
  }

  async getByUserId(userTagByUserId: IUserTagByUserId): Promise<ResponseDto> {
    const findUserTagByUserIdDto = plainToClass(
      FindUserTagByUserIdDto,
      userTagByUserId,
      {
        ignoreDecorators: true,
      },
    )
    const userTags = await this.userTagService.getByUserId(
      findUserTagByUserIdDto,
    )
    const userTagResponse = userTags.map((item) => {
      return plainToClass(UserTagResponseDto, item, { ignoreDecorators: true })
    })
    return new ResponseDto(userTagResponse)
  }

  async list(listUserTags: IListUserTags): Promise<ResponseDto> {
    const listUserTagDto = plainToClass(ListUserTagDto, listUserTags, {
      ignoreDecorators: true,
    })
    const userTags = await this.userTagService.list(listUserTagDto)

    const itemUserTags = userTags.items.map((item) => {
      return plainToClass(UserTagResponseDto, item, { ignoreDecorators: true })
    })
    return new ResponseDto({ items: itemUserTags, meta: userTags.meta })
  }

  async deleteOne(deleteById: IDeleteById): Promise<ResponseDto> {
    try {
      const deleteUserTagDto = plainToClass(DeleteUserTagDto, deleteById, {
        ignoreDecorators: true,
      })
      const deleteSuccess = await this.userTagService.deleteOne(
        deleteUserTagDto,
      )
      if (!deleteSuccess) {
        return new ResponseDto().error(USER_TAG_MESSAGE.DELETE_FAIL)
      }
      return new ResponseDto(null, USER_TAG_MESSAGE.DELETE_SUCCESS)
    } catch (error: any) {
      return new ResponseDto().error(USER_TAG_MESSAGE.DELETE_FAIL)
    }
  }

  async deleteMany(
    deleteUserTagByIds: IDeleteUserTagByIds,
  ): Promise<ResponseDto> {
    try {
      const deleteUserTagsDto = plainToClass(
        DeleteUserTagsDto,
        deleteUserTagByIds,
        {
          ignoreDecorators: true,
        },
      )
      const deleteSuccess = await this.userTagService.deleteMany(
        deleteUserTagsDto,
      )
      if (!deleteSuccess) {
        return new ResponseDto().error(USER_TAG_MESSAGE.DELETE_FAIL)
      }
      return new ResponseDto(null, USER_TAG_MESSAGE.DELETE_SUCCESS)
    } catch (error: any) {
      return new ResponseDto().error(USER_TAG_MESSAGE.DELETE_FAIL)
    }
  }

  async deleteManyByUsers(
    userIds: IDeleteUserTagByUsers,
  ): Promise<ResponseDto> {
    try {
      const deleteUserTagsByUsersDto = plainToClass(
        DeleteUserTagsByUsersDto,
        userIds,
        {
          ignoreDecorators: true,
        },
      )
      const deleteSuccess = await this.userTagService.deleteManyByUsers(
        deleteUserTagsByUsersDto,
      )
      if (!deleteSuccess) {
        return new ResponseDto().error(USER_TAG_MESSAGE.DELETE_FAIL)
      }
      return new ResponseDto(null, USER_TAG_MESSAGE.DELETE_SUCCESS)
    } catch (error: any) {
      return new ResponseDto().error(USER_TAG_MESSAGE.DELETE_FAIL)
    }
  }
}
