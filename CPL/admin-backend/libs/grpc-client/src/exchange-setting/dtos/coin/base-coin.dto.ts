import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator'

export enum COIN_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export class BaseCoinNetWorkDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @Expose({ name: 'network' })
  network: string

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @Expose({ name: 'env' })
  env: string

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @Expose({ name: 'symbol' })
  symbol: string

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Expose({ name: 'confirmations' })
  confirmations: number

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @Expose({ name: 'decimal' })
  decimal: string

  @ApiProperty({
    enum: Object.values(COIN_STATUS).filter(
      (value) => typeof value === 'number',
    ),
    description: `${COIN_STATUS.INACTIVE} is inactive, ${COIN_STATUS.ACTIVE} is active`,
  })
  @Type(() => Number)
  @IsEnum(COIN_STATUS)
  @Expose({ name: 'status' })
  status: COIN_STATUS

  @Expose()
  @ApiProperty()
  @IsString()
  @Expose({ name: 'type' })
  type: string
}

export class BaseCoinSettingItemDto {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Expose({ name: 'coin' })
  coin: string

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @Expose({ name: 'name' })
  name: string

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @Expose({ name: 'icon' })
  icon: string

  @ApiProperty()
  @Type(() => Number)
  @IsEnum(COIN_STATUS)
  @Expose({ name: 'status' })
  status: COIN_STATUS

  @ApiProperty()
  @Type(() => BaseCoinNetWorkDto)
  @ValidateNested({ each: true })
  @IsArray()
  @Expose({ name: 'networks' })
  networks: BaseCoinNetWorkDto[]
}
