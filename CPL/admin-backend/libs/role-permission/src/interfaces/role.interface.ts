export interface ISearchRoleDto {
  page: number
  limit: number
  searchField: string
  searchText: string
  sort: string
  sortType: 'ASC' | 'DESC'
}

export interface ICreateRoleDto {
  name: string
  description?: string
  permissions?: number[]
}

export interface IUpdateRoleDto {
  name: string
  description?: string
  permissions?: number[]
  screens?: number[]
}
