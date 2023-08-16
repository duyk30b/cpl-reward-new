import {
  BasePaginationDto,
  BasePaginationQueryDto,
} from '@app/common/base-pagination.dto'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator'

export class GetBaseUserTradingQuery extends BasePaginationQueryDto {
  @ApiPropertyOptional({ name: 'keyword' })
  @Expose({ name: 'keyword' })
  @ValidateIf((o) => o.searchByField)
  @IsString()
  @IsNotEmpty()
  keyword?: string

  @ApiPropertyOptional({ name: 'search_by_field' })
  @Expose({ name: 'search_by_field' })
  @ValidateIf((o) => o.keyword)
  @IsString()
  @IsNotEmpty()
  searchByField?: string

  @ApiPropertyOptional({ name: 'sort_by', description: 'Sort by field name' })
  @Expose({ name: 'sort_by' })
  @IsString()
  @IsOptional()
  sortBy?: string
}

export class BaseRemoveUserTradingRequestDto {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsString()
  userId: string
}

export class BaseRemoveUserTradingResponseDto {
  @ApiProperty({ name: 'status' })
  @Expose({ name: 'status' })
  @IsString()
  status: number
}

abstract class BaseUserTradingItem {
  @ApiPropertyOptional({ name: 'note' })
  @Expose({ name: 'note' })
  @IsString()
  @IsOptional()
  note?: string

  @ApiPropertyOptional({ name: 'reason' })
  @Expose({ name: 'reason' })
  @IsString()
  @IsOptional()
  reason?: string
}

export class BaseCreateUserTradingRequestDto extends BaseUserTradingItem {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsString()
  userId: string

  @ApiProperty({ name: 'email' })
  @Expose({ name: 'email' })
  @IsString()
  email: string
}

export class BaseUpdateUserTradingRequestDto extends BaseUserTradingItem {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id' })
  @IsString()
  userId: string
}

export class BaseUserTradingDto extends BaseUserTradingItem {
  @ApiProperty({ name: 'user_id' })
  @Expose({ name: 'user_id', toPlainOnly: true })
  @IsString()
  userId: string

  @ApiProperty({ name: 'email' })
  @Expose({ name: 'email', toPlainOnly: true })
  @IsString()
  email: string

  @ApiProperty({ name: 'create_time' })
  @Expose({ name: 'create_time', toPlainOnly: true })
  @IsString()
  createTime: string
}

export class BaseGrpcUserTradingPaginationResponse<T> extends BasePaginationDto<
  T[]
> {
  data: T[]
}
