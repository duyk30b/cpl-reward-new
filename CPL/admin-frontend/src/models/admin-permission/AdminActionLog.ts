import { Expose, Transform } from 'class-transformer'

export interface IAdminActionLogParams {
  searchText?: string
  perPage?: number
  limit?: number
  page?: number
  draw?: number
}

export class AdminActionLogPayloadModel {
  @Expose({ name: 'searchText' })
  search_text: string

  @Expose({ name: 'perPage' })
  @Transform(({ value }) => value || 25)
  per_page: string

  @Expose({ name: 'limit' })
  @Transform(({ value }) => value || 25)
  limit: string

  @Expose({ name: 'page' })
  @Transform(({ value }) => value || 1)
  page: string

  @Expose({ name: 'draw' })
  @Transform(({ value }) => value || 1)
  draw: string
}
