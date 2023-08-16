import { Expose } from 'class-transformer'
import { IPaginationMeta } from '../../grpc-client.interface'
import { IGrpcNews } from './news.interface'

export class GrpcNewsDTO {
  @Expose()
  id: number

  @Expose({ name: 'text_en' })
  textEn: string

  @Expose({ name: 'text_jp' })
  textJp: string

  @Expose({ name: 'link_text' })
  linkText: string

  @Expose({ name: 'created_at' })
  createdAt: Date

  @Expose({ name: 'updated_at' })
  updatedAt: Date

  @Expose({ name: 'deleted_at' })
  deletedAt: Date
}

export class BaseResponseDTO {
  @Expose()
  status: string

  @Expose()
  message: string
}

export class GrpcNewsResponseDTO extends BaseResponseDTO {
  data?: IGrpcNews
}

export class ListGrpcNewsResponseDTO extends BaseResponseDTO {
  data?: {
    items: IGrpcNews[]
    meta: IPaginationMeta
  }
}
