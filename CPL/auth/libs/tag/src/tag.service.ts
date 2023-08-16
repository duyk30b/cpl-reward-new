import { Injectable } from '@nestjs/common'
import { Tag } from '@lib/tag/entities/tag.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Brackets, In, Repository } from 'typeorm'
import { plainToClass } from 'class-transformer'
import { ITagForManagementFilter } from './interfaces/tag.interface'
import { paginateRaw, Pagination } from 'nestjs-typeorm-paginate'
import {
  convertStringToUnicode,
  convertUnicodeToString,
  diffTwoArray,
  escapeLikeChars,
} from '@lib/util'
import {
  CreateTagDto,
  DeleteManyTagDto,
  DeleteOneTagDto,
  FindByIdsTagDto,
  UpdateTagDto,
} from './tag.dto'

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getByIds(findByIdsTagDto: FindByIdsTagDto) {
    return await this.tagRepository.find({
      where: {
        id: In(findByIdsTagDto.ids),
      },
    })
  }

  async update(updateTagDto: UpdateTagDto): Promise<Tag> {
    try {
      const itemEntity = plainToClass(Tag, updateTagDto, {
        ignoreDecorators: true,
      })
      itemEntity.unicodeName = convertStringToUnicode(itemEntity.name)
      const resultUpdate = await this.tagRepository.update(
        { id: itemEntity.id },
        itemEntity,
      )
      if (!resultUpdate) {
        return null
      }
      return itemEntity
    } catch (error) {
      return null
    }
  }

  async createOne(name: string) {
    const unicodeNameTag = convertStringToUnicode(name)
    const existsTag = await this.tagRepository.find({
      where: { unicodeName: unicodeNameTag },
    })
    if (existsTag && existsTag.length > 0) {
      return {
        ...existsTag[0],
        isExisted: true,
      }
    }
    const newTag = plainToClass(
      Tag,
      { name, unicodeName: unicodeNameTag },
      { ignoreDecorators: true },
    )
    return await this.tagRepository.save(newTag)
  }

  async create(createTagDto: CreateTagDto): Promise<Tag[]> {
    const unicodeNameTags = createTagDto.names.map((item) =>
      convertStringToUnicode(item),
    )
    const existsTags = await this.tagRepository.find({
      where: { unicodeName: In(unicodeNameTags) },
    })
    let unicodeNameExists = []
    if (existsTags && existsTags.length > 0) {
      unicodeNameExists = existsTags.map((item) => item.unicodeName)
    }
    const unicodeNameDiff = diffTwoArray(unicodeNameTags, unicodeNameExists)
    if (unicodeNameDiff && unicodeNameDiff.length > 0) {
      const createTags = unicodeNameDiff.map((item) => {
        const tempTag = {
          name: convertUnicodeToString(item),
          unicodeName: item,
        }
        return plainToClass(Tag, tempTag, { ignoreDecorators: true })
      })
      const resultInsert = await this.tagRepository.save(createTags)
      return [...existsTags, ...resultInsert]
    }
    return existsTags
  }

  async paginate(tagFilter: ITagForManagementFilter): Promise<Pagination<Tag>> {
    const TAG_SORT_FIELD_MAP = {
      id: 'id',
      name: 'name',
      created_at: 'created_at',
      updated_at: 'updated_at',
    }

    const TAG_SEARCH_FIELD_MAP = {
      name: 'name',
    }

    const queryBuilder = this.tagRepository
      .createQueryBuilder('tag')
      .select([
        '*',
        'tag.created_at as createdAt',
        'tag.updated_at as updatedAt',
      ])

    const { searchField, searchText, sort, sortType } = tagFilter
    if (searchText) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          if (searchField && TAG_SEARCH_FIELD_MAP[searchField]) {
            qb.where(`${TAG_SEARCH_FIELD_MAP[searchField]} LIKE :keyword`)
          } else {
            Object.keys(TAG_SEARCH_FIELD_MAP).forEach((field) => {
              qb.orWhere(`${TAG_SEARCH_FIELD_MAP[field]} LIKE :keyword`)
            })
          }
        }),
        {
          keyword: `%${escapeLikeChars(searchText)}%`,
        },
      )
    }

    if (sort && TAG_SORT_FIELD_MAP[sort]) {
      queryBuilder.orderBy(TAG_SORT_FIELD_MAP[sort], sortType || 'ASC')
    } else {
      queryBuilder.orderBy('created_at', 'DESC')
    }

    const options = {
      page: tagFilter.page || 1,
      limit: tagFilter.limit || 20,
    }
    return paginateRaw<Tag>(queryBuilder, options)
  }

  async deleteOne(deleteOneTagDto: DeleteOneTagDto) {
    return await this.tagRepository.delete(deleteOneTagDto.id)
  }

  async deleteMany(deleteManyTagDto: DeleteManyTagDto) {
    return await this.tagRepository.delete(deleteManyTagDto.ids)
  }
}
