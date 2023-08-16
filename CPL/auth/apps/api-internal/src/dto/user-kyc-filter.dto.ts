import { ApiProperty } from '@nestjs/swagger'
import { getEnumComment, getEnumValues } from '@lib/util'
import { KycStatus } from '@lib/user-kyc/enum/user-kyc.enum'
import { Expose, Transform } from 'class-transformer'

export class UserKycFilterDto {
  @ApiProperty({ required: false })
  @Expose()
  page: number

  @ApiProperty({ name: 'per_page', required: false })
  @Expose({ name: 'per_page' })
  perPage: number

  @ApiProperty({
    required: false,
    enum: getEnumValues(KycStatus),
    description: getEnumComment(KycStatus),
  })
  @Expose()
  status: number

  @ApiProperty({
    name: 'selected_search',
    required: false,
    enum: ['email', 'name', 'phone'],
  })
  @Expose({ name: 'selected_search' })
  selectedSearch: string

  @ApiProperty({ name: 'search_key', required: false })
  @Expose({ name: 'search_key' })
  searchKey: string

  @ApiProperty({ name: 'user_id', required: false })
  @Expose({ name: 'user_id' })
  userId: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false })
  @Expose({ name: 'sort_type' })
  @Transform((params) => {
    return params.value ? params.value.toUpperCase() : params.value
  })
  sortType: 'ASC' | 'DESC'

  @ApiProperty({
    required: false,
    enum: ['verified', 'verifying', 'rejected', 'pending'],
  })
  @Expose()
  type: string
}
