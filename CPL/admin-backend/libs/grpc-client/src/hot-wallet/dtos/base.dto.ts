import { Expose, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'

export abstract class GrpcHotWalletBaseResponse<T, M> {
  @Expose()
  @Type(() => String)
  @ApiProperty({ name: 'name' })
  message: string

  @Expose({
    name: 'time_stamp',
    toPlainOnly: true,
  })
  timeStamp: number

  @Expose({
    name: 'total_count',
    toPlainOnly: true,
  })
  totalCount: number

  @Expose({
    name: 'meta_data',
    toPlainOnly: true,
  })
  @ApiProperty()
  metaData?: M

  @Expose()
  abstract data: T
}

export abstract class BaseEntity {
  @ApiProperty({
    example: 1,
    description: 'ID of entity',
  })
  id: number

  @Expose({
    name: 'created_at',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '1648714966267',
    description: 'Entity created date',
  })
  createdAt: number

  @Expose({
    name: 'updated_at',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '1648714966267',
    description: 'Entity updated date',
  })
  updatedAt: number
}

export class BasePaginationQuery {
  @Expose()
  @ApiProperty({
    example: 1,
    description: 'Page index',
    required: false,
  })
  page?: number

  @Expose()
  @ApiProperty({
    example: 10,
    description: 'Page size',
    required: false,
  })
  size?: number
}

export class BaseFilterQuery extends BasePaginationQuery {
  @Expose()
  keyword?: string

  @Expose()
  symbol?: string

  @Expose({
    name: 'chain_code',
  })
  chainCode?: string

  @Expose()
  status?: string

  @Expose()
  sort?: string

  @Expose({
    name: 'sort_type',
  })
  sortType?: string

  @Expose()
  lang?: string
}
