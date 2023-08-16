import { Expose } from 'class-transformer'
import {
  BasePaginationQueryDto,
  PaginationDto,
} from '../common/response-pagination.dto'

export class GetListLanguageRequest extends BasePaginationQueryDto {
  @Expose({ name: 'key' })
  key: string
}

export class LanguageItemDto {
  @Expose()
  key: string;

  [language: string]: string
}

export class GetListLanguageResponse {
  data: LanguageItemDto[]
  pagination: PaginationDto
}

export interface ILanguage {
  [key: string]: string
}
