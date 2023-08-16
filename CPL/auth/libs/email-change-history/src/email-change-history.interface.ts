export interface ICreateEmailChangeHistoryDto {
  userId: string
  oldEmail?: string
  newEmail: string
  isModifiedByUser: boolean
}

export interface IEmailChangeHistoryFilter {
  userId: string
  page?: number
  limit?: number
  isModifiedByUser?: boolean
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}
