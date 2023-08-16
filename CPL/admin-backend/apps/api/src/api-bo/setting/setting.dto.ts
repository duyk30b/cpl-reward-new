import { filterBaseDTO } from './../api-bo.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty, Length } from 'class-validator'

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class filterPairDTO extends filterBaseDTO {
  @ApiProperty({ name: 'get_only', required: false, enum: ['true', 'false'] })
  @Expose({ name: 'get_only' })
  getOnly: 'true' | 'false'
}

export class filterModeDTO extends filterBaseDTO {
  @ApiProperty({ name: 'get_only', required: false, enum: ['true', 'false'] })
  @Expose({ name: 'get_only' })
  getOnly: 'true' | 'false'
}

//BO Setting
export class ApiCreateBOSettingDTO {
  @ApiProperty({ required: false, name: 'code' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  code: string

  @ApiProperty({ required: false, name: 'value' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  value: string

  @ApiProperty({ required: false, name: 'active' })
  @Expose()
  @IsNotEmpty()
  active: number
}

export class ApiUpdateBOSettingDTO {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ required: false, name: 'code' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  code: string

  @ApiProperty({ required: false, name: 'value' })
  @Expose()
  @IsNotEmpty()
  @Length(0, 255)
  value: string

  @ApiProperty({ required: false, name: 'active' })
  @Expose()
  @IsNotEmpty()
  active: number
}

export class ApiDeleteBOSettingDTO {
  @ApiProperty()
  @Expose()
  id: number
}

export class FilterBTCTransferHistoryDTO {
  @ApiProperty({ required: false, name: 'page' })
  @Expose()
  @IsNotEmpty()
  page: string

  @ApiProperty({ required: false, name: 'limit' })
  @Expose()
  @IsNotEmpty()
  limit: string

  @ApiProperty({ required: false, name: 'start_date' })
  @Expose()
  startDate: string

  @ApiProperty({ required: false, name: 'end_date' })
  @Expose()
  endDate: string

  @ApiProperty({ required: false, name: 'sort' })
  @Expose()
  sort: string

  @ApiProperty({ required: false, name: 'sort_type' })
  @Expose()
  sortType: string
}

export class ApiFindOneBOMajorCoinDto {
  @ApiProperty()
  @Expose()
  coin: string
}

export class ApiUpdateBOMajorCoinDto {
  @ApiProperty()
  @Expose()
  coin: string

  @ApiProperty()
  @Expose()
  transferFee: number

  @ApiProperty()
  @Expose()
  transferMaxFee: number

  @ApiProperty()
  @Expose()
  transferMinFee: number

  @ApiProperty()
  @Expose()
  transferMaxAmount: number

  @ApiProperty()
  @Expose()
  transferMinAmount: number

  @ApiProperty()
  @Expose()
  transferFeeRatio: number

  @ApiProperty()
  @Expose()
  transferActive: boolean

  @ApiProperty()
  @Expose()
  transferMaxAmountPerDay: number
}

export class ApiCreateBOMajorCoinDto {
  @ApiProperty()
  @Expose()
  coin: string

  @ApiProperty()
  @Expose()
  transferFee: number

  @ApiProperty()
  @Expose()
  transferMaxFee: number

  @ApiProperty()
  @Expose()
  transferMinFee: number

  @ApiProperty()
  @Expose()
  transferMaxAmount: number

  @ApiProperty()
  @Expose()
  transferMinAmount: number

  @ApiProperty()
  @Expose()
  transferFeeRatio: number

  @ApiProperty()
  @Expose()
  transferActive: boolean

  @ApiProperty()
  @Expose()
  transferMaxAmountPerDay: number
}
