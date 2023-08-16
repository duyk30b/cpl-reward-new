import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import {
  BaseEntity,
  BasePaginationQuery,
  GrpcHotWalletBaseResponse,
} from './base.dto'

export class TrezorWalletEntity extends BaseEntity {
  symbol: string

  @Expose({ name: 'chain_code', toPlainOnly: true })
  chainCode: string

  address: string
  tag: string
  path: string
  balance: string
  status: string
}

export class GrpcGetTrezorWalletResponse extends GrpcHotWalletBaseResponse<
  TrezorWalletEntity[],
  any
> {
  data: TrezorWalletEntity[]
}

export class FilterTrezorWalletQuery extends BasePaginationQuery {
  @ApiProperty({
    example: 'balance',
    description: 'Sorted column name',
    required: false,
  })
  @Expose()
  sort: string

  @ApiProperty({
    example: 'ASC',
    description: 'Sort order type',
    required: false,
  })
  @Expose({ name: 'sort_type' })
  sortType: string

  @ApiProperty({
    example: 'PENDING',
    description: 'Status of wallet to filter',
    required: false,
  })
  @Expose()
  status: string

  @ApiProperty({
    example: 'btc',
    description: 'Symbol name to filter',
    required: false,
  })
  @Expose()
  symbol: string
}

export class CollectorAddress {
  chainCode: string
  address: string
  feeLimit: string
  feePrice: string
}

export class GrpcGetTrezorCollectorAddressResponse extends GrpcHotWalletBaseResponse<
  Array<CollectorAddress>,
  any
> {
  data: Array<CollectorAddress>
}

export class CreateTrezorTransactionParams {
  @ApiProperty({
    name: 'trezor_ids',
    example: '[1, 2]',
    description: 'Symbol name to filter',
    required: false,
    type: Array,
    isArray: true,
  })
  @Expose({ name: 'trezor_ids' })
  trezorIds: number[]

  @ApiProperty({
    example: 'btc',
    description: 'Transaction symbol',
    required: false,
  })
  @Expose()
  symbol: string

  @ApiProperty({
    name: 'chain_code',
    example: 'btc',
    description: 'Chain code of blockchain transaction',
    required: false,
  })
  @Expose({ name: 'chain_code' })
  chainCode: string

  @ApiProperty({
    example: 'hash',
    description: 'Transaction hash in blockchain network',
    required: false,
  })
  @Expose()
  hash: string
}

export class CreateTrezorTransactionResult {
  success: boolean
}

export class GrpcCreateTrezorTransactionResponse extends GrpcHotWalletBaseResponse<
  CreateTrezorTransactionResult,
  any
> {
  data: CreateTrezorTransactionResult
}
