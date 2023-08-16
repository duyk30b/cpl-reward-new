import { TagService } from '@lib/tag'
import {
  CreateTagDto,
  DeleteManyTagDto,
  DeleteOneTagDto,
  FindByIdsTagDto,
  UpdateTagDto,
} from '@lib/tag/tag.dto'
import { Injectable } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { ResponseDto } from '../dto/response.dto'
import { TAG_MESSAGE } from './internal-tag.enum'
import {
  ICreateTags,
  IDeleteTagById,
  IDeleteTagsByIds,
  IFindTagsByIds,
  ISearchTags,
  IUpdateTag,
} from './internal-tag.interface'

@Injectable()
export class InternalTagService {
  constructor(private readonly tagService: TagService) {}

  async create(createTags: ICreateTags): Promise<ResponseDto> {
    const createTagsDto = plainToClass(CreateTagDto, createTags, {
      ignoreDecorators: true,
    })
    const result = await this.tagService.create(createTagsDto)
    if (!result) {
      return new ResponseDto().error(TAG_MESSAGE.ADD_FAIL)
    }
    return new ResponseDto(result)
  }

  async createOne(name: string): Promise<ResponseDto> {
    const result = await this.tagService.createOne(name)
    if (!result) {
      return new ResponseDto().error(TAG_MESSAGE.ADD_FAIL)
    }
    return new ResponseDto(result)
  }

  async getByIds(tagIds: IFindTagsByIds): Promise<ResponseDto> {
    const findByIdsTagDto = plainToClass(FindByIdsTagDto, tagIds, {
      ignoreDecorators: true,
    })
    const tags = await this.tagService.getByIds(findByIdsTagDto)
    if (!tags || tags.length < 1) {
      return new ResponseDto().error(TAG_MESSAGE.NOT_FOUND)
    }
    return new ResponseDto(tags)
  }

  async update(updateTag: IUpdateTag): Promise<ResponseDto> {
    const updateTagDto = plainToClass(UpdateTagDto, updateTag, {
      ignoreDecorators: true,
    })
    const tag = await this.tagService.update(updateTagDto)
    if (!tag) {
      return new ResponseDto().error(TAG_MESSAGE.UPDATE_FAIL)
    }
    return new ResponseDto(tag)
  }

  async paginate(tagSearch: ISearchTags): Promise<ResponseDto> {
    const result = await this.tagService.paginate(tagSearch)
    return new ResponseDto(result)
  }

  async deleteOne(deleteTagId: IDeleteTagById): Promise<ResponseDto> {
    try {
      const deleteOneTagDto = plainToClass(DeleteOneTagDto, deleteTagId, {
        ignoreDecorators: true,
      })
      const deleteSuccess = await this.tagService.deleteOne(deleteOneTagDto)
      if (!deleteSuccess) {
        return new ResponseDto().error(TAG_MESSAGE.DELETE_FAIL)
      }
      return new ResponseDto(deleteSuccess, TAG_MESSAGE.DELETE_SUCCESS)
    } catch (error: any) {
      return new ResponseDto().error(TAG_MESSAGE.DELETE_FAIL)
    }
  }

  async deleteMany(deleteTagIds: IDeleteTagsByIds): Promise<ResponseDto> {
    try {
      const deleteManyTagDto = plainToClass(DeleteManyTagDto, deleteTagIds, {
        ignoreDecorators: true,
      })
      const deleteSuccess = await this.tagService.deleteMany(deleteManyTagDto)
      if (!deleteSuccess) {
        return new ResponseDto().error(TAG_MESSAGE.DELETE_FAIL)
      }
      return new ResponseDto(deleteSuccess, TAG_MESSAGE.DELETE_SUCCESS)
    } catch (error: any) {
      return new ResponseDto().error(TAG_MESSAGE.DELETE_FAIL)
    }
  }
}
