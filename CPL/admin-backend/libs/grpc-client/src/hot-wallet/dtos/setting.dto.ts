import { ApiProperty } from '@nestjs/swagger'
import { Expose, Type } from 'class-transformer'
import { GrpcHotWalletBaseResponse } from './base.dto'

export class SettingBaseDto {
  @Expose()
  @ApiProperty()
  key: string

  @Expose()
  @ApiProperty()
  value: string
}

export class SettingDTO extends SettingBaseDto {
  @Expose()
  @ApiProperty()
  title: string

  @Expose()
  @ApiProperty()
  show = false

  @Expose()
  @ApiProperty()
  type: string
}

export class SettingResponse {
  @Expose({
    name: 'chain_code',
    toPlainOnly: true,
  })
  @ApiProperty({
    example: 'eth, btc, bch,...',
    description: 'Name of blockchain chain group',
  })
  chainCode: string

  @Expose()
  @ApiProperty()
  @Type(() => SettingDTO)
  settings: SettingDTO[]
}

export class GrpcGetSettingQuery {
  @Expose()
  category?: string
}

export class GrpcGetSettingResponse extends GrpcHotWalletBaseResponse<
  SettingResponse[],
  any
> {
  data: SettingResponse[]
}

export class GrpcUpdateSettingBody {
  @Expose({
    name: 'wallet_settings',
  })
  @ApiProperty({
    example: {
      wallet_settings: [
        {
          key: 'SETTING_EXAMPLE',
          value: 'example',
        },
      ],
    },
    description: 'Update multiple settings',
  })
  @Type(() => SettingBaseDto)
  walletSettings: SettingBaseDto[]
}

export class UpdateSettingResponse {
  [k: string]: boolean
}

export class GrpcUpdateSettingResponse extends GrpcHotWalletBaseResponse<
  UpdateSettingResponse,
  any
> {
  data: UpdateSettingResponse
}
