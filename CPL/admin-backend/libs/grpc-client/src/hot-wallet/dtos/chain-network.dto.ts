import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity, GrpcHotWalletBaseResponse } from './base.dto'

export class ChainNetworkDto extends BaseEntity {
  @Expose()
  @ApiProperty({
    example: 'btc',
    description: 'Chain network EG: btc, ltc, xrp',
  })
  code: string
}

export class SmartContractDto extends BaseEntity {
  @Expose()
  @ApiProperty({
    example: 'UNI',
  })
  coin: string

  @ApiProperty({
    example: 'Uniswap',
    name: 'coin_name',
  })
  @Expose({ name: 'coin_name', toPlainOnly: true })
  coinName: string

  @ApiProperty({
    example: 'kovan',
  })
  network: string

  @ApiProperty({
    example: 18,
  })
  decimal: number

  @ApiProperty({
    example: 20,
    name: 'require_confirmation',
  })
  @Expose({ name: 'require_confirmation', toPlainOnly: true })
  requireConfirmation: number

  @ApiProperty({
    example: 'https://etherscan.io',
    name: 'transaction_explorer',
  })
  @Expose({ name: 'transaction_explorer', toPlainOnly: true })
  transactionExplorer: string

  @ApiProperty({
    example: '/tx/{txid}',
    name: 'transaction_path',
  })
  @Expose({ name: 'transaction_path', toPlainOnly: true })
  transactionPath: string

  @ApiProperty({
    name: 'total_supply',
    example: '1000000000000000000000000000',
  })
  @Expose({ name: 'total_supply', toPlainOnly: true })
  totalSupply: string

  @ApiProperty({
    example: 'erc20',
    name: 'chain_code',
  })
  @Expose({ name: 'chain_code', toPlainOnly: true })
  chainCode: string
}

export class GrpcGetChainNetworkResponse extends GrpcHotWalletBaseResponse<
  ChainNetworkDto[],
  any
> {
  data: ChainNetworkDto[]
}

export class GrpcSmartContractResponse extends GrpcHotWalletBaseResponse<
  SmartContractDto,
  any
> {
  data: SmartContractDto
}
