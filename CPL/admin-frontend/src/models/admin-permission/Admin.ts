import { Expose, Transform } from 'class-transformer'

export interface IAdminParams {
  searchText?: string
  searchField?: string
  perPage?: number
  limit?: number
  page?: number
  draw?: number
}

export class AdminListPayloadModel {
  @Expose({ name: 'searchText' })
  search_text: string

  @Expose({ name: 'searchField' })
  search_field: string

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
export class Admin {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  email: string

  @Expose()
  roles: string[]

  @Expose({ name: 'direct_permissions' })
  directPermissions: number[]

  @Expose()
  permissions: number[]

  @Expose({ name: 'direct_screens' })
  directScreens: number[]

  @Expose()
  screens: number[]

  get displayName() {
    return this.name || this.email
  }
}
