import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { firstValueFrom, lastValueFrom } from 'rxjs'
import {
  IAddOneRequest,
  IAddRequest,
  IDeleteManyRequest,
  IDeleteOneRequest,
  IFindByIdsRequest,
  ISearchRequest,
  ITagService,
  IUpdateRequest,
} from '.'
import { ParseResponseGrpc } from '..'
import { SearchTagResponseDto, TagDto, TagResponseDto } from './tag.dto'

@Injectable()
export class TagService {
  private gTagSrv: ITagService
  constructor(@Inject('TAG_PACKAGE') private client: ClientGrpc) {}

  onModuleInit() {
    this.gTagSrv = this.client.getService<ITagService>('GTagService')
  }

  async createOne(addTag: IAddOneRequest): Promise<TagResponseDto> {
    const result = await lastValueFrom(this.gTagSrv.addOne(addTag))
    return ParseResponseGrpc<TagResponseDto>(TagDto, result)
  }

  async create(addTag: IAddRequest): Promise<TagResponseDto> {
    const result = await lastValueFrom(this.gTagSrv.add(addTag))
    return ParseResponseGrpc<TagResponseDto>(TagDto, result)
  }

  async findByIds(
    findByIdsRequest: IFindByIdsRequest,
  ): Promise<TagResponseDto> {
    const result = await firstValueFrom(
      this.gTagSrv.findByIds(findByIdsRequest),
    )
    return ParseResponseGrpc<TagResponseDto>(TagDto, result)
  }

  async update(updateTag: IUpdateRequest): Promise<TagResponseDto> {
    const result = await firstValueFrom(this.gTagSrv.update(updateTag))
    return ParseResponseGrpc<TagResponseDto>(TagDto, result)
  }

  async search(searchFilter: ISearchRequest): Promise<SearchTagResponseDto> {
    const result = await firstValueFrom(this.gTagSrv.search(searchFilter))
    return ParseResponseGrpc<SearchTagResponseDto>(TagDto, result)
  }

  async deleteOne(deleteOneTag: IDeleteOneRequest): Promise<TagResponseDto> {
    const result = await lastValueFrom(this.gTagSrv.deleteOne(deleteOneTag))
    return ParseResponseGrpc<TagResponseDto>(TagDto, result)
  }

  async deleteMany(deleteManyTag: IDeleteManyRequest): Promise<TagResponseDto> {
    const result = await lastValueFrom(this.gTagSrv.deleteMany(deleteManyTag))
    return ParseResponseGrpc<TagResponseDto>(TagDto, result)
  }
}
