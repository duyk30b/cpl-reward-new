import { BaseResponseDto } from '@lib/grpc-client/grpc-client.dto'
import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcUserGrantPayout } from './user-grant-payout.interface'

export class GrpcUserGrantPayoutResponseDTO extends BaseResponseDto {
  data?: IGrpcUserGrantPayout
}

export class ListGrpcUserGrantPayoutResponseDTO extends BaseResponseDto {
  data?: {
    items: IGrpcUserGrantPayout[]
    meta: IPaginationMeta
  }
}

export class GrpcUserGrantPayoutDTO {
  @Expose()
  id: number

  @Expose({ name: 'userId' })
  user_id: number

  @Expose()
  email: string

  @Expose({ name: 'note' })
  note: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string

  @Expose()
  status: number
}
