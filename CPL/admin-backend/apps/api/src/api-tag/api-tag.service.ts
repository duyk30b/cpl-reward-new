import { TagService } from '@lib/grpc-client/tag'
import { Injectable } from '@nestjs/common'
import {
  ApiCreateOneTagDto,
  ApiCreateTagDto,
  ApiDeleteManyTagDto,
  ApiDeleteOneTagDto,
  ApiFindTagsByIdsDto,
  ApiSearchTagDto,
  ApiUpdateTagDto,
} from './api-tag.dto'

@Injectable()
export class ApiTagService {
  constructor(private tagService: TagService) {}

  async create(createTagDto: ApiCreateTagDto) {
    return await this.tagService.create(createTagDto)
  }

  async createOne(createTagDto: ApiCreateOneTagDto) {
    return await this.tagService.createOne(createTagDto)
  }

  async search(filterTagDto: ApiSearchTagDto) {
    return await this.tagService.search(filterTagDto)
  }

  async findByIds(findTagsByIdsDto: ApiFindTagsByIdsDto) {
    return await this.tagService.findByIds(findTagsByIdsDto)
  }

  async update(id: number, updateTagDto: ApiUpdateTagDto) {
    updateTagDto.id = id
    return await this.tagService.update(updateTagDto)
  }

  async deleteOne(deleteOneTagDto: ApiDeleteOneTagDto) {
    return await this.tagService.deleteOne(deleteOneTagDto)
  }

  async deleteMany(deleteManyTagDto: ApiDeleteManyTagDto) {
    return await this.tagService.deleteMany(deleteManyTagDto)
  }
}
