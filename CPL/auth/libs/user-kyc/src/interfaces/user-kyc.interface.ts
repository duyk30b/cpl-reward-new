export interface IUserKycFilter {
  page?: number
  perPage?: number
  status?: number
  selectedSearch?: string
  searchKey?: string
  userId?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
  type?: string
}
