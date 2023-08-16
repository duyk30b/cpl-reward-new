import { BaseResponseDto } from '@lib/grpc-client/grpc-client.dto'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcUserBalance } from './user-balance.interface'

export class GrpcUserBalanceDTO {
  @Expose()
  id: number

  @Expose()
  userId: number

  @Expose()
  sessionId: number

  @Expose()
  bcastBalance: number

  @Expose()
  bcastAvailableBalance: number

  @Expose()
  usdtBalance: number

  @Expose()
  usdtAvailableBalance: number

  @Expose()
  ipAddress: string

  @Expose()
  accountType: number

  @Expose()
  createdAt: Date

  @Expose()
  updatedAt: Date
}

export class BaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcUserBalanceResponseDTO extends BaseResponseDTO {
  data?: IGrpcUserBalance
}

export class ListGrpcUserBalanceResponseDTO extends BaseResponseDTO {
  data?: {
    items: IGrpcUserBalance[]
    meta: IPaginationMeta
  }
}

export class FilterHistoryTransferDTO {
  @ApiProperty({ required: false, example: 1 })
  @Expose()
  page: number

  @ApiProperty({ required: false, example: 20 })
  @Expose()
  limit: number

  @ApiProperty({ required: false })
  @Expose({ name: 'search_text' })
  searchText: string

  @ApiProperty({ name: 'start_date', required: false })
  @Expose({ name: 'start_date' })
  startDate: string

  @ApiProperty({ name: 'end_date', required: false })
  @Expose({ name: 'end_date' })
  endDate: string

  @ApiProperty({ name: 'currency', required: false })
  @Expose({ name: 'currency' })
  currency: string

  @ApiProperty({ name: 'from', required: false })
  @Expose({ name: 'from' })
  from: string

  @ApiProperty({ name: 'status', required: false })
  @Expose({ name: 'status' })
  status: string

  @ApiProperty({ required: false })
  @Expose()
  sort: string

  @ApiProperty({ name: 'sort_type', required: false, enum: ['ASC', 'DESC'] })
  @Expose({ name: 'sort_type' })
  sortType: 'ASC' | 'DESC'

  @ApiProperty({ name: 'lang', required: false })
  @Expose({ name: 'lang' })
  lang: string
}

export class HistoryTransferDTO {
  @Expose()
  id: string

  @Expose()
  coin: string

  @Expose()
  amount: string

  @Expose()
  transferFrom: string

  @Expose()
  transferTo: string

  @Expose()
  status: string

  @Expose()
  email: string

  @Expose()
  createdAt: string

  @Expose()
  updatedAt: string
}

export class HistoryTransferResponseDTO extends BaseResponseDto {
  success: boolean
  message?: string
  data?: {
    items: HistoryTransferDTO[]
  }
}
