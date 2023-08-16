import { Expose } from 'class-transformer'

export class PermissionDto {
  @Expose()
  id: number

  @Expose()
  module: string

  @Expose()
  subModule?: string
}
