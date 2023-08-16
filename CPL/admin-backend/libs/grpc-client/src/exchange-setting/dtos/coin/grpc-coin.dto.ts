import { BasePaginationDto } from '@app/common/base-pagination.dto'
import { Optional } from '@nestjs/common'
import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { IsString, ValidateNested } from 'class-validator'
import { GrpcBaseResponse } from '../base.dto'
import { BaseCoinNetWorkDto, BaseCoinSettingItemDto } from './base-coin.dto'

export class GrpcCoinNetworkDto extends BaseCoinNetWorkDto {
  @ApiProperty({ name: 'transaction_explorer' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'transaction_explorer', toPlainOnly: true })
  transactionExplorer: string

  @ApiProperty({ name: 'transaction_tx_path' })
  @Type(() => String)
  @IsString()
  @Expose({ name: 'transaction_tx_path', toPlainOnly: true })
  transactionTxPath: string

  @ApiProperty({ name: 'contract_address' })
  @Type(() => String)
  @IsString()
  @Optional()
  @Expose({ name: 'contract_address', toPlainOnly: true })
  contractAddress: string
}

export class GrpcCoinSettingDto extends BaseCoinSettingItemDto {
  @ApiProperty({ type: [GrpcCoinNetworkDto] })
  @Type(() => GrpcCoinNetworkDto)
  networks: GrpcCoinNetworkDto[]
}

export class GrpcCoinSetting extends GrpcBaseResponse<GrpcCoinSettingDto[]> {
  @Type(() => GrpcCoinSettingDto)
  @ValidateNested({ each: true })
  data: GrpcCoinSettingDto[]
}
export class GrpcCoinSettingPaginationResponse extends BasePaginationDto<
  GrpcCoinSettingDto[]
> {
  @ApiProperty({ name: 'data', type: [GrpcCoinSettingDto] })
  @Type(() => GrpcCoinSettingDto)
  @ValidateNested({ each: true })
  @ApiProperty({ name: 'data' })
  @Expose({ name: 'data' })
  data: GrpcCoinSettingDto[] = []
}

export class GrpcGetListCoinNameResponse extends BasePaginationDto<string[]> {
  @Type(() => String)
  @ValidateNested({ each: true })
  data: string[]
}
