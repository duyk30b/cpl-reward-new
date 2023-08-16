import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  BaseEntity,
  BaseFilterQuery,
  GrpcHotWalletBaseResponse,
} from './base.dto'

export enum BALANCE_TYPE {
  MOTHER = 'MOTHER',
  USER = 'USER',
}

export class WalletDto extends BaseEntity {
  address: string

  @ApiProperty({
    example: 'MOTHER | USER',
    description: 'Type of wallet',
  })
  type: BALANCE_TYPE

  @Expose({
    name: 'chain_code',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: 'eth, btc, bch,...',
    description: 'Name of blockchain chain group',
  })
  chainCode: string

  @ApiProperty({
    example: 'eth, btc, bch, jpi...',
    description: 'Name of blockchain symbol',
  })
  symbol: string

  @ApiProperty({
    example: '10.05',
    description: 'Wallet balance',
  })
  balance: string

  @Expose({
    name: 'pending_balance',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '10.05',
    description: 'Wallet pending balance',
  })
  pendingBalance: string

  @Expose({
    name: 'user_id',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: '58317',
    description: 'User Id',
  })
  userId: number
}

export class GrpcGetWalletQuery extends BaseFilterQuery {
  @Expose()
  keyword?: string

  @Expose()
  symbol?: string

  @Expose()
  type?: string

  @Expose({
    name: 'search_address',
  })
  searchAddress?: string

  @Expose({
    name: 'search_from_balance',
  })
  searchFromBalance?: string

  @Expose({
    name: 'search_to_balance',
  })
  searchToBalance?: string

  @Expose({
    name: 'search_user_id',
  })
  searchUserId?: string
}

export class GrpcGetWalletResponse extends GrpcHotWalletBaseResponse<
  WalletDto[],
  any
> {
  data: WalletDto[]
}
