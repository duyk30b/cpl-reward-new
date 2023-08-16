export interface IAdminFilterDto {
  page: number
  limit: number
  searchField: string
  searchText: string
  sort: string
  sortType: 'ASC' | 'DESC'
}

export interface ICreateAdminDto {
  email: string
  name: string
}
