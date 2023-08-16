import { Optional } from '@nestjs/common'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class UserTagResponseDto {
  @Expose()
  id: number

  @Expose()
  userId: string

  @Expose()
  tagId: number

  @Expose()
  name: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}
export class CreateUserTagDto {
  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'tag_ids' })
  @IsNotEmpty()
  tagIds: string[]
}

export class UpdateUserTagDto {
  @Expose()
  id: number

  @Expose({ name: 'user_id' })
  @IsNotEmpty()
  userId: string

  @Expose({ name: 'tag_ids' })
  @IsNotEmpty()
  tagIds: string[]
}

export class FindByIdDto {
  @Expose()
  id: number
}

export class FindUserTagByUserIdDto {
  @Expose({ name: 'user_id' })
  userId: number
}

export class ListUserTagDto {
  @Optional()
  @Expose()
  page: number

  @Optional()
  @Expose()
  limit: number

  @Optional()
  @Expose({ name: 'user_ids' })
  userIds: string[]
}

export class DeleteUserTagDto {
  @Expose()
  id: number
}
export class DeleteUserTagsDto {
  @Expose()
  ids: number[]
}
export class DeleteUserTagsByUsersDto {
  @Expose({ name: 'user_ids' })
  userIds: number[]
}
