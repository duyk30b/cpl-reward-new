import { Expose, Transform, Type } from 'class-transformer'
import { IsNotEmpty, IsString, IsEnum } from 'class-validator'

export enum COIN_STATUS {
  INACTIVE = 0,
  ACTIVE = 1,
}

export class CoinSettingItem {
  @Expose()
  id: string

  @Expose()
  @IsString()
  @Transform((item) => item.value.toLowerCase())
  coin: string

  @Expose()
  @IsString()
  name: string

  @Expose()
  @IsString()
  icon: string

  @Expose()
  @Type(() => CoinNetwork)
  @IsNotEmpty()
  networks: CoinNetwork[] = []

  @Expose()
  @IsEnum(COIN_STATUS)
  status: COIN_STATUS
}

export class CoinSetting {
  @Expose()
  name: string

  @Expose()
  @Type(() => CoinSettingItem)
  data: CoinSettingItem[]
}

export class CoinNetwork {
  @Type(() => String)
  @IsString()
  @Expose()
  network: string

  @Type(() => String)
  @IsString()
  @Expose()
  env: string

  @Type(() => String)
  @IsString()
  @Expose()
  symbol: string

  @Type(() => Number)
  @Expose()
  confirmations: number

  @Type(() => String)
  @IsString()
  @Expose()
  decimal: string

  @Type(() => Number)
  @IsEnum(COIN_STATUS)
  @Expose()
  status: COIN_STATUS

  @IsString()
  @Expose()
  type: string
}
