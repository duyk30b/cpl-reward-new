import { BaseResponseDto } from '@lib/grpc-client/grpc-client.dto'
import { IPaginationMeta } from '@lib/grpc-client/grpc-client.interface'
import { Expose } from 'class-transformer'

export class GrpcPairSettingDTO {
  @Expose()
  id: number

  @Expose()
  pairId: number

  @Expose()
  decimalPart: number

  @Expose()
  highlowSpread: number

  @Expose()
  turboSpread: number

  @Expose()
  emergencyThreshold: number

  @Expose()
  createdAt: number

  @Expose()
  updatedAt: number

  @Expose()
  status: boolean
}

export class GrpcBaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcPairSettingResponseDTO extends GrpcBaseResponseDTO {
  data?: GrpcPairSettingDTO
}

export class GrpcPairSettingListResponseDTO extends GrpcBaseResponseDTO {
  data?: {
    data: GrpcPairSettingDTO[]
    meta: IPaginationMeta
  }
}
