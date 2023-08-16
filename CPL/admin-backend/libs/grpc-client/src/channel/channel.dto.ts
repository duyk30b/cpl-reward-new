import { Optional } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IChannel, ITag } from '.'
import { IPaginationMeta } from '..'
import { BaseResponseDto } from '../grpc-client.dto'

export class ChannelDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose()
  link: string

  @Expose({ name: 'dynamic_link' })
  dynamicLink: string

  @Expose({ name: 'tag_ids' })
  @Optional()
  tagIds: string

  @Expose({ name: 'tags' })
  @Optional()
  tags: ITag[]

  @Expose({ name: 'created_at' })
  @Optional()
  createdAt: number

  @Expose({ name: 'updated_at' })
  @Optional()
  updatedAt: number
}

export class ChannelResponseDto extends BaseResponseDto {
  data?: IChannel
}

export class ListChannelResponseDto extends BaseResponseDto {
  data?: {
    items: IChannel[]
    meta: IPaginationMeta
  }
}
