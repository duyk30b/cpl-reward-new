import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'

import { InternalTagService } from './internal-tag.service'
import { ResponseDto } from '../dto/response.dto'
import {
  ICreateTag,
  ICreateTags,
  IDeleteTagById,
  IDeleteTagsByIds,
  IFindTagsByIds,
  ISearchTags,
  IUpdateTag,
} from './internal-tag.interface'

@Controller('tag')
export class InternalTagController {
  constructor(private readonly tagService: InternalTagService) {}

  @GrpcMethod('GTagService')
  async add(createTags: ICreateTags): Promise<ResponseDto> {
    return await this.tagService.create(createTags)
  }

  @GrpcMethod('GTagService')
  async addOne(createTag: ICreateTag): Promise<ResponseDto> {
    return await this.tagService.createOne(createTag.name)
  }

  @GrpcMethod('GTagService')
  async findByIds(tagIds: IFindTagsByIds): Promise<ResponseDto> {
    return await this.tagService.getByIds(tagIds)
  }

  @GrpcMethod('GTagService')
  async update(updateTag: IUpdateTag): Promise<ResponseDto> {
    return await this.tagService.update(updateTag)
  }

  @GrpcMethod('GTagService')
  async search(tagSearch: ISearchTags): Promise<ResponseDto> {
    return await this.tagService.paginate(tagSearch)
  }

  @GrpcMethod('GTagService')
  async deleteOne(tagId: IDeleteTagById): Promise<ResponseDto> {
    return await this.tagService.deleteOne(tagId)
  }

  @GrpcMethod('GTagService')
  async deleteMany(tagIds: IDeleteTagsByIds): Promise<ResponseDto> {
    return await this.tagService.deleteMany(tagIds)
  }
}
