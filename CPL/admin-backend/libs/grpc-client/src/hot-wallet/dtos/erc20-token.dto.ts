import { Expose } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { BaseEntity, GrpcHotWalletBaseResponse } from './base.dto'

export class Erc20TokenDto extends BaseEntity {
  @Expose()
  @ApiProperty({
    example: 'nhop',
    description: 'Symbol of token eg: erc20, nhop, hop, etc...',
  })
  symbol: string

  @Expose()
  @ApiProperty({
    example: 'No Hope',
    description: 'Name of erc20 token',
  })
  name: string

  @Expose()
  @ApiProperty({
    example: '18',
    description: 'Decimal of token',
  })
  decimal: number

  @Expose()
  @ApiProperty({
    example: 'mainnet',
    description: 'Network of token',
  })
  network: string

  @Expose({
    name: 'contract_address',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '0x15F0Ca26781C3852f8166eD2ebce5D18265cceb7',
    description: 'contract address of erc20 token',
  })
  contractAddress: string
}

export class GrpcGetErc20TokenResponse extends GrpcHotWalletBaseResponse<
  Erc20TokenDto[],
  any
> {
  data: Erc20TokenDto[]
}
