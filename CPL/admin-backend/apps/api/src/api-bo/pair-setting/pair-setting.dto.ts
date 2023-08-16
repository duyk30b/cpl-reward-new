import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class FindOneByIdDTO {
  @ApiProperty()
  @Expose()
  id: number
}

//Pair Setting

export class ApiListPairSettingDTO {
  @ApiProperty({ required: false, name: 'page' })
  @Expose()
  page: number

  @ApiProperty({ required: false, name: 'limit' })
  @Expose()
  limit: number

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
  sortType: 'ASC' | 'DESC'

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class ApiCreatePairSettingDTO {
  @ApiProperty({ required: false, name: 'pair_id' })
  @Expose()
  @IsNotEmpty()
  pairId: number

  @ApiProperty({ required: false, name: 'decimal_part' })
  @Expose()
  @IsNotEmpty()
  decimalPart: number

  @ApiProperty({ required: false, name: 'highlow_spread' })
  @Expose()
  @IsNotEmpty()
  highlowSpread: number

  @ApiProperty({ required: false, name: 'turbo_spread' })
  @Expose()
  @IsNotEmpty()
  turboSpread: number

  @ApiProperty({ required: false, name: 'emergency_threshold' })
  @Expose()
  @IsNotEmpty()
  emergencyThreshold: number
}

export class ApiUpdatePairSettingDTO {
  @ApiProperty()
  @Expose()
  id: number

  @ApiProperty({ required: false, name: 'pair_id' })
  @Expose()
  @IsNotEmpty()
  pairId: number

  @ApiProperty({ required: false, name: 'decimal_part' })
  @Expose()
  @IsNotEmpty()
  decimalPart: number

  @ApiProperty({ required: false, name: 'highlow_spread' })
  @Expose()
  @IsNotEmpty()
  highlowSpread: number

  @ApiProperty({ required: false, name: 'turbo_spread' })
  @Expose()
  @IsNotEmpty()
  turboSpread: number

  @ApiProperty({ required: false, name: 'emergency_threshold' })
  @Expose()
  @IsNotEmpty()
  emergencyThreshold: number
}

export class ApiDeletePairSettingDTO {
  @ApiProperty()
  @Expose()
  id: number
}
