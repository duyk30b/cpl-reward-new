import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsNotEmpty, ValidateNested } from 'class-validator'

export class UserTagDto {
  @ApiProperty({
    name: 'user_id',
    type: Number,
  })
  @Expose({ name: 'user_id' })
  userId: number

  @ApiProperty({
    name: 'tag_ids',
    type: Array(Number),
  })
  @Expose({ name: 'tag_ids' })
  tagIds: number[]
}
export class ApiAddUserTagsDto {
  @ApiProperty({
    name: 'user_tags',
    type: [UserTagDto],
    required: false,
  })
  @Expose({ name: 'user_tags' })
  @ValidateNested({ each: true })
  @Type(() => UserTagDto)
  @IsNotEmpty()
  userTags: UserTagDto[]
}

export class ApiFindUserTagsByUserIdDto {
  @ApiProperty({
    name: 'user_id',
  })
  @Expose({ name: 'user_id' })
  userId: number
}

export class ApiFindByIdDto {
  @ApiProperty()
  @Expose()
  id: number
}

export class ApiListUserTagDto {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @ApiProperty({
    name: 'user_ids',
    required: false,
    type: [Number],
  })
  @Expose({ name: 'user_ids' })
  userIds: number[]
}

export class ApiDeleteUserTagDto {
  @ApiProperty()
  @Expose()
  id: number
}

export class ApiDeleteUserTagsDto {
  @ApiProperty()
  @Expose()
  ids: number[]
}

export class ApiDeleteUserTagsByUsersDto {
  @ApiProperty({ name: 'user_ids' })
  @Expose({ name: 'user_ids' })
  userIds: number[]
}
