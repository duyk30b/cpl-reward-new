import { Expose } from 'class-transformer'
import { BaseEntity, GrpcHotWalletBaseResponse } from './base.dto'

export class UpdateBlacklistUserQuery {
  @Expose()
  id: number

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

export class BlacklistUserDto extends BaseEntity {
  @Expose()
  note: string

  @Expose()
  reason: string

  @Expose()
  source: string

  @Expose({
    name: 'user_id',
    toPlainOnly: true,
  })
  userId: number

  @Expose()
  risk: number

  @Expose({
    name: 'is_ignore',
    toPlainOnly: true,
  })
  isIgnore: boolean

  @Expose()
  email: string
}

export class GrpcGetBlacklistUserResponse extends GrpcHotWalletBaseResponse<
  BlacklistUserDto[],
  any
> {
  data: BlacklistUserDto[]
}

export class GrpcAddListBlacklistUserQuery {
  @Expose()
  data: UpdateBlacklistUserQuery[]
}

export class GrpcUpdateBlacklistUserResponse extends GrpcHotWalletBaseResponse<
  BlacklistUserDto,
  any
> {
  data: BlacklistUserDto
}

export class GrpcRemoveBlacklistUserResponse extends GrpcHotWalletBaseResponse<
  boolean,
  any
> {
  data: boolean
}

export class GrpcUpdateIgnoreBlacklistUserQuery {
  @Expose()
  id: number

  @Expose({
    name: 'is_ignore',
  })
  isIgnore: boolean
}

export class GrpcCreateManualDepositResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  data: {
    result: boolean
  }
}

export class GrpcRetryDepositResponse extends GrpcHotWalletBaseResponse<
  any,
  any
> {
  data: {
    result: boolean
  }
}

export class GrpcExportResponse extends GrpcHotWalletBaseResponse<any, any> {
  data: {
    path: string
  }
}
