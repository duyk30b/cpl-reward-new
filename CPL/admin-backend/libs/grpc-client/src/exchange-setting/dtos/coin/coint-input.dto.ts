import { BasePaginationQueryDto } from '@app/common/base-pagination.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Transform, Type } from 'class-transformer'
import { IsString } from 'class-validator'
import { BaseCoinNetWorkDto, BaseCoinSettingItemDto } from './base-coin.dto'

export class CreatCoinNetworkDto extends BaseCoinNetWorkDto {
  @ApiProperty({ name: 'transaction_explorer' })
  @Expose({ name: 'transaction_explorer' })
  @Type(() => String)
  @IsString()
  transactionExplorer: string

  @ApiProperty({ name: 'transaction_tx_path' })
  @Expose({ name: 'transaction_tx_path' })
  @Type(() => String)
  @IsString()
  transactionTxPath: string
}

export class CreateCoinSettingDto extends BaseCoinSettingItemDto {
  @ApiProperty({ type: [CreatCoinNetworkDto] })
  @Type(() => CreatCoinNetworkDto)
  networks: Array<CreatCoinNetworkDto>
}

export class GetCoinSettingRequest {
  @Type(() => String)
  @ApiProperty()
  @Transform(({ value }) => (value as string)?.toLowerCase())
  @Expose({ name: 'coin' })
  coin: string
}

export class GetListCoinNameRequest extends BasePaginationQueryDto {
  @ApiProperty()
  @Expose()
  @Type(() => String)
  @Transform(({ value }) => (value as string)?.toLowerCase())
  coin?: string
}

export class DeleteCoinSetting extends GetCoinSettingRequest {}

export class EditCoinSettingDto extends CreateCoinSettingDto {}

export class DeleteCoinSettingDto extends GetCoinSettingRequest {}
