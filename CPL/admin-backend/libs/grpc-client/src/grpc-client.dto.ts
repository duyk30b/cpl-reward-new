import { ValidationError } from '@lib/util'
import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class BaseResponseDto {
  success: boolean
  message?: string
}

export class PaginationMetaDto {
  @Expose({ name: 'item_count' })
  itemCount: number

  @Expose({ name: 'total_items' })
  totalItems?: number

  @Expose({ name: 'items_per_page' })
  itemsPerPage: number

  @Expose({ name: 'total_pages' })
  totalPages?: number

  @Expose({ name: 'current_page' })
  currentPage: number
}

export class PaginationResultDto {
  @Expose()
  page: number

  @Expose()
  size: number

  @Expose()
  total: number
}

export class PostResponseDto {
  success: boolean
  message?: string
  data?: string
  errorCode?: number
}

export class MultiLanguageFieldDto {
  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  en: string

  @ApiProperty()
  @Expose()
  @IsNotEmpty({ message: ValidationError.REQUIRED })
  ja: string

  // @ApiProperty({ name: 'zh_cn' })
  // @Expose({ name: 'zh_cn' })
  // zhCn: string
}
