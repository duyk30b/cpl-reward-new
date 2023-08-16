export interface PaginationDto<T> {
  take: number
  page: number
  sortField?: keyof T
  sortType?: 'ASC' | 'DESC'
  searchField?: keyof T
  searchText?: string
}
