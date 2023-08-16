import { Expose } from 'class-transformer'

export class BasePaginationQuery {
  @Expose()
  page?: number

  @Expose()
  size?: number
}
