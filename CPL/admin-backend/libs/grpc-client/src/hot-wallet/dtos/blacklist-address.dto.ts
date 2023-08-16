import { Expose } from 'class-transformer'
import { BaseEntity, GrpcHotWalletBaseResponse } from './base.dto'

export class UpdateBlacklistAddressQuery {
  @Expose()
  id: number

  @Expose()
  address: string

  @Expose({
    name: 'chain_code',
  })
  chainCode: string

  @Expose()
  symbol: string

  @Expose({
    name: 'user_id',
  })
  userId: number

  @Expose()
  risk: number

  @Expose()
  note: string

  @Expose()
  reason: string

  @Expose()
  source: string

  @Expose({
    name: 'is_ignore',
  })
  isIgnore: boolean
}

export class BlacklistAddressDto extends BaseEntity {
  @Expose()
  address: string

  @Expose({
    name: 'chain_code',
    toPlainOnly: true,
  })
  chainCode: string

  @Expose()
  symbol: string

  @Expose({
    name: 'user_id',
    toPlainOnly: true,
  })
  userId: number

  @Expose()
  risk: number

  @Expose()
  note: string

  @Expose()
  reason: string

  @Expose()
  source: string

  @Expose({
    name: 'is_ignore',
    toPlainOnly: true,
  })
  isIgnore: boolean
}

export class GrpcGetBlacklistAddressResponse extends GrpcHotWalletBaseResponse<
  BlacklistAddressDto[],
  any
> {
  data: BlacklistAddressDto[]
}

export class GrpcAddListBlacklistQuery {
  @Expose()
  data: UpdateBlacklistAddressQuery[]
}

export class GrpcUpdateBlacklistAddressResponse extends GrpcHotWalletBaseResponse<
  BlacklistAddressDto,
  any
> {
  data: BlacklistAddressDto
}

export class GrpcRemoveBlacklistAddressResponse extends GrpcHotWalletBaseResponse<
  boolean,
  any
> {
  data: boolean
}

export class GrpcUpdateIgnoreBlacklistQuery {
  @Expose()
  id: number

  @Expose({
    name: 'is_ignore',
  })
  isIgnore: boolean
}
