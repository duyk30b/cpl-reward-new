import {
  BasePaginationDto,
  BasePaginationQueryDto,
  SORT_TYPE,
} from '@app/common/base-pagination.dto'
import {
  IsNotEmpty,
  isNumber,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator'
import { Expose, Transform, Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import * as _ from 'lodash'

const convertInputSort = (input: string) => {
  if (input === 'ASC') return SORT_TYPE.ASC
  if (input === 'DESC') return SORT_TYPE.DESC
  return input
}

export class IGetApiKeysDto extends BasePaginationQueryDto {
  @ApiPropertyOptional({
    name: 'sort_type',
    enum: Object.values(SORT_TYPE).filter((value) => typeof value === 'number'),
    default: SORT_TYPE.DESC,
  })
  @Expose({ name: 'sort_type' })
  @IsOptional()
  @Transform(
    ({ value }) => (value ? convertInputSort(value) : SORT_TYPE.DESC),
    {
      toClassOnly: true,
    },
  )
  sortType?: SORT_TYPE

  @ApiProperty({ name: 'key', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'key' })
  key?: string

  @ApiProperty({ name: 'user_id', type: String })
  @IsString()
  @IsOptional()
  @Expose({ name: 'user_id' })
  userId?: string

  @IsString()
  @IsOptional()
  @Expose()
  @Transform(({ value }) => (value ? _.camelCase(value) : 'updatedAt'), {
    toClassOnly: true,
  })
  sort?: string
}

export class ApiKeysDto {
  @ApiProperty({ name: 'id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'id' })
  id: string

  @ApiProperty({ name: 'user_id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'user_id' })
  userId: string

  @ApiProperty({ name: 'api_key', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'api_key' })
  apiKey: string

  @ApiProperty({ name: 'api_name', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'api_name' })
  apiName: string

  @ApiProperty({ name: 'email', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'email' })
  email: string

  @ApiProperty({ name: 'status', type: Number })
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'status' })
  status: number

  @ApiProperty({ name: 'created_at', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'created_at' })
  createdAt: string

  @ApiProperty({ name: 'updated_at', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'updated_at' })
  updatedAt: string
}

export class GetApiKeysResponse extends BasePaginationDto<ApiKeysDto[]> {
  @ApiProperty({ name: 'data', type: [ApiKeysDto] })
  @Type(() => ApiKeysDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: ApiKeysDto[] = []
}

export class IDetailApiKey {
  @ApiProperty({ name: 'id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'id' })
  id: string
}

export class ApproveKeyRequest extends IDetailApiKey {
  @ApiProperty({ name: 'comment', type: String })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @Expose({ name: 'comment' })
  @Transform((params) => {
    if (isNumber(params?.value)) return params?.value
    return params?.value.trim()
  })
  comment: string
}

export class IApproveKeyRequest extends IDetailApiKey {
  @ApiProperty({ name: 'comment', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'comment' })
  comment: string

  @ApiProperty({ name: 'admin_id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'admin_id' })
  adminId: string
}

export class IStatusHistories {
  @ApiProperty({ name: 'api_key_id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'api_key_id' })
  apiKeyId: string
}

export class StatusHistoriesDto {
  @ApiProperty({ name: 'api_key_id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'api_key_id' })
  apiKeyId: string

  @ApiProperty({ name: 'admin_id', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'admin_id' })
  adminId: string

  @ApiProperty({ name: 'comment', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose()
  comment: string

  @ApiProperty({ name: 'before_status', type: Number })
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'before_status' })
  beforeStatus: number

  @ApiProperty({ name: 'after_status', type: Number })
  @IsNumber()
  @IsNotEmpty()
  @Expose({ name: 'after_status' })
  afterStatus: number

  @ApiProperty({ name: 'created_at', type: String })
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'created_at' })
  createdAt: string
}

export class GetStatusHistoriesResponse {
  @ApiProperty({ name: 'data', type: [StatusHistoriesDto] })
  @Type(() => StatusHistoriesDto)
  @ValidateNested({ each: true })
  @Expose({ name: 'data' })
  data: StatusHistoriesDto[] = []
}
