import { Expose } from 'class-transformer'
import { ITag } from '.'
import { IPaginationMeta } from '..'
import { BaseResponseDto } from '../grpc-client.dto'

export class TagDto {
  @Expose()
  id: number

  @Expose()
  name: string

  @Expose({ name: 'is_existed' })
  isExisted: boolean

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number
}

export class TagResponseDto extends BaseResponseDto {
  data?: ITag
}

export class SearchTagResponseDto extends BaseResponseDto {
  data?: {
    items: ITag[]
    meta: IPaginationMeta
  }
}
