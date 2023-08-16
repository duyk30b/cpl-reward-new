import { Tag } from '@lib/tag/entities/tag.entity'
import { TransformTrim } from '@lib/util'
import { Optional } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsOptional } from 'class-validator'

export class ChannelResponseDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  link: string

  @Expose()
  tagIds: string

  @Expose()
  tags: Tag[]

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}
export class CreateChannelDto {
  @Expose()
  @TransformTrim()
  name: string

  @Expose()
  @TransformTrim()
  link: string

  @IsOptional()
  @Expose({ name: 'tag_ids' })
  tagIds: string
}

export class FindOneChannelDto {
  @Optional()
  @Expose()
  @TransformTrim()
  id: number

  @Optional()
  @Expose()
  @TransformTrim()
  link: string
}

export class UpdateChannelDto {
  @Optional()
  @Expose()
  id: number

  @Optional()
  @Expose()
  @TransformTrim()
  name: string

  @Optional()
  @Expose()
  @TransformTrim()
  link: string

  @Optional()
  @Expose({ name: 'tag_ids' })
  tagIds: string
}

export class ListChannelDto {
  @Optional()
  @Expose()
  page: number

  @Optional()
  @Expose()
  limit: number

  @Optional()
  @Expose({ name: 'search_field' })
  searchField: string

  @Optional()
  @Expose({ name: 'search_text' })
  searchText: string

  @Optional()
  @Expose()
  sort: string

  @Optional()
  @Expose({ name: 'sort_type' })
  sortType?: 'ASC' | 'DESC'
}

export class FindByIdsChannelDto {
  @Expose()
  ids: number[]
}

export class DeleteChannelDto {
  @Expose()
  id: number
}
