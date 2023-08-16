import { Expose } from 'class-transformer'
import { IUserTag } from '.'
import { IPaginationMeta } from '..'
import { BaseResponseDto } from '../grpc-client.dto'

export class UserTagDto {
  @Expose()
  id: number

  @Expose({ name: 'user_id' })
  userId: number

  @Expose({ name: 'tag_id' })
  tagId: number

  @Expose()
  name: string

  @Expose({ name: 'created_at' })
  createdAt: number

  @Expose({ name: 'updated_at' })
  updatedAt: number
}

export class UserTagResponseDto extends BaseResponseDto {
  data?: IUserTag
}

export class ListUserTagResponseDto extends BaseResponseDto {
  data?: {
    items: IUserTag[]
    meta: IPaginationMeta
  }
}
