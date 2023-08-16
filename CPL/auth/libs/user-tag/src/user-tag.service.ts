import { Injectable } from '@nestjs/common'
import { UserTag } from '@lib/user-tag/entities/user-tag.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import {
  Pagination,
  paginateRaw,
  IPaginationOptions,
  PaginationTypeEnum,
} from 'nestjs-typeorm-paginate'
import { diffTwoArray, uniqueArray } from '@lib/util'
import {
  CreateUserTagDto,
  DeleteUserTagDto,
  DeleteUserTagsByUsersDto,
  DeleteUserTagsDto,
  FindByIdDto,
  FindUserTagByUserIdDto,
  ListUserTagDto,
} from './user-tag.dto'
import { plainToClass } from 'class-transformer'

@Injectable()
export class UserTagService {
  constructor(
    @InjectRepository(UserTag)
    private userTagRepository: Repository<UserTag>,
  ) {}

  async getById(findByIdDto: FindByIdDto) {
    const query = this.userTagRepository
      .createQueryBuilder('user_tag')
      .leftJoin('tag', 'tag', 'tag.id = user_tag.tag_id')
      .select([
        'user_tag.id as id',
        'user_tag.user_id as userId',
        'user_tag.tag_id as tagId',
        'tag.name as name',
        'user_tag.created_at as createdAt',
        'user_tag.updated_at as updatedAt',
      ])
    query.andWhere('user_tag.id = :id', {
      id: findByIdDto.id,
    })
    return await query.getRawOne()
  }

  async getByUserId(findUserTagByUserIdDto: FindUserTagByUserIdDto) {
    const query = this.userTagRepository
      .createQueryBuilder('user_tag')
      .leftJoin('tag', 'tag', 'tag.id = user_tag.tag_id')
      .select([
        'user_tag.id as id',
        'user_tag.user_id as userId',
        'user_tag.tag_id as tagId',
        'tag.name as name',
        'user_tag.created_at as createdAt',
        'user_tag.updated_at as updatedAt',
      ])
    query.andWhere('user_tag.user_id = :userId', {
      userId: findUserTagByUserIdDto.userId,
    })
    return await query.getRawMany()
  }

  async getUserIdsByTagIds(tagIds: string[], page: number, limit: number) {
    const query = this.userTagRepository
      .createQueryBuilder('user_tag')
      .select(['DISTINCT user_tag.user_id as userId'])

    if (tagIds && tagIds.length > 0) {
      query.andWhere('user_tag.tag_id IN (:...tagIds)', {
        tagIds,
      })
    }

    const options: IPaginationOptions = {
      page: page || 1,
      limit: limit || 20,
      paginationType: PaginationTypeEnum.LIMIT_AND_OFFSET,
    }

    return await paginateRaw(query, options)
  }

  async create(createUserTagDtos: CreateUserTagDto[]): Promise<UserTag[]> {
    const responseCreateTotal = []
    if (createUserTagDtos && createUserTagDtos.length > 0) {
      for (const createUserTagDto of createUserTagDtos) {
        const userId = createUserTagDto.userId
        const tagIds = createUserTagDto.tagIds
        const userTagExists = await this.userTagRepository.find({
          where: {
            userId,
            tagId: In(tagIds),
          },
        })
        let responseCreate = userTagExists
        let tagIdsExists = []
        if (userTagExists && userTagExists.length > 0) {
          tagIdsExists = userTagExists.map((item) => +item.tagId)
        }
        const dataInsert = []
        const tagIdsDiff = uniqueArray(diffTwoArray(tagIds, tagIdsExists))
        if (tagIdsDiff && tagIdsDiff.length > 0) {
          const createTags = tagIdsDiff.map((item) => {
            return plainToClass(
              UserTag,
              { userId: +userId, tagId: +item },
              { ignoreDecorators: true },
            )
          })
          dataInsert.push(...createTags)
        }
        if (dataInsert && dataInsert.length > 0) {
          const resultInsert = await this.userTagRepository.save(dataInsert)
          responseCreate = [...userTagExists, ...resultInsert]
        }

        if (responseCreate && responseCreate.length > 0) {
          responseCreateTotal.push(...responseCreate)
        }
      }

      const reponseTagIds = responseCreateTotal.map(
        (item: UserTag) => item.tagId,
      )
      const reponseUserIds = responseCreateTotal.map(
        (item: UserTag) => item.userId,
      )
      const query = this.userTagRepository
        .createQueryBuilder('user_tag')
        .leftJoin('tag', 'tag', 'tag.id = user_tag.tag_id')
        .select([
          'user_tag.id as id',
          'user_tag.user_id as userId',
          'user_tag.tag_id as tagId',
          'tag.name as name',
          'user_tag.created_at as createdAt',
          'user_tag.updated_at as updatedAt',
        ])

      if (reponseTagIds && reponseTagIds.length > 0) {
        query.andWhere('tag.id IN (:...tagIds)', {
          tagIds: reponseTagIds,
        })
      }

      if (reponseUserIds && reponseUserIds.length > 0) {
        query.andWhere('user_tag.user_id IN (:...userIds)', {
          userIds: reponseUserIds,
        })
      }
      return await query.getRawMany()
    }
    return []
  }

  async list(listUserTagDto: ListUserTagDto): Promise<Pagination<UserTag>> {
    const query = this.userTagRepository
      .createQueryBuilder('user_tag')
      .leftJoin('tag', 'tag', 'tag.id = user_tag.tag_id')
      .select([
        'user_tag.id as id',
        'user_tag.user_id as userId',
        'user_tag.tag_id as tagId',
        'tag.name as name',
        'user_tag.created_at as createdAt',
        'user_tag.updated_at as updatedAt',
      ])

    if (listUserTagDto.userIds && listUserTagDto.userIds.length > 0) {
      query.andWhere('user_tag.user_id IN (:...userIds)', {
        userIds: listUserTagDto.userIds,
      })
    }

    const options = {
      page: listUserTagDto.page ? listUserTagDto.page : 1,
      limit: listUserTagDto.limit ? listUserTagDto.limit : 20,
    }
    return await paginateRaw<UserTag>(query, options)
  }

  async deleteOne(deleteUserTagDto: DeleteUserTagDto) {
    return await this.userTagRepository.delete(deleteUserTagDto.id)
  }

  async deleteMany(deleteUserTagsDto: DeleteUserTagsDto) {
    return await this.userTagRepository.delete(deleteUserTagsDto.ids)
  }

  async deleteManyByUsers(deleteUserTagsByUsersDto: DeleteUserTagsByUsersDto) {
    const entities = await this.userTagRepository.find({
      where: { userId: In(deleteUserTagsByUsersDto.userIds) },
    })
    if (entities) {
      return await this.userTagRepository.remove(entities)
    }
    return false
  }

  async getTagIdsByUserId(userId: string) {
    const result = await this.userTagRepository.find({ userId })
    return uniqueArray(result.map((userTag) => userTag.tagId))
  }
}
