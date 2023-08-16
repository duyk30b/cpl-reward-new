export interface IUserBanHistoryFilter {
  page?: number
  perPage?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}
