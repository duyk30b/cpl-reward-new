import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcWinningRate } from './winning-rate.interface'
import { ApiProperty } from '@nestjs/swagger'

export class GrpcWinningRateDTO {
  @ApiProperty()
  @Expose({ name: 'key' })
  key: number

  @ApiProperty()
  @Expose({ name: 'count_down' })
  countDown: number

  @ApiProperty()
  @Expose({ name: 'count_up' })
  countUp: number

  @ApiProperty()
  @Expose({ name: 'count_up_rate' })
  countUpRate: number

  @ApiProperty()
  @Expose({ name: 'count_down_rate' })
  countDownRate: number
}

export class BaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcWinningRateResponseDTO extends BaseResponseDTO {
  data?: IGrpcWinningRate
}

export class ListGrpcWinningRateResponseDTO extends BaseResponseDTO {
  data?: {
    items: IGrpcWinningRate[]
    meta: IPaginationMeta
  }
}
