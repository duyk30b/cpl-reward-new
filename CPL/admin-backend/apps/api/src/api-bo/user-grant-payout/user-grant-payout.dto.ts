import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class CreateUserGrantPayoutDTO {
  @ApiProperty({ name: 'user_id' })
  @Expose()
  @IsNotEmpty()
  userId: number

  @ApiProperty({ name: 'payout_bonus', required: false })
  @Expose()
  payoutBonus: number

  @ApiProperty({ name: 'note', required: false })
  @Expose({ name: 'note' })
  note: string

  @ApiProperty({ name: 'status', required: false })
  @Expose({ name: 'status' })
  status: number
}

export class UpdateUserGrantPayoutDTO {
  @ApiProperty({ name: 'payout_bonus', required: false })
  @Expose()
  payoutBonus: number

  @ApiProperty({ name: 'note', required: false })
  @Expose({ name: 'note' })
  note: string

  @ApiProperty({ name: 'status', required: false })
  @Expose({ name: 'status' })
  status: number
}

export class ListUserGrantPayoutDTO {
  @ApiProperty()
  @Expose()
  page: number

  @ApiProperty()
  @Expose()
  limit: number

  @ApiProperty({ name: 'search_field', required: false })
  @Expose({ name: 'search_field' })
  searchField: string

  @ApiProperty({ name: 'search_text', required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class DeleteUserGrantPayoutDTO {
  @ApiProperty()
  @Expose()
  id: number
}
