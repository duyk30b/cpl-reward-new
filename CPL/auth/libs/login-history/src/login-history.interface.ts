export interface ICreateLoginHistoryDto {
  userId: string
  deviceId: string
  browser: string
  os: string
  ip: string
}

export interface ILoginHistoryFilter {
  fromTime?: string
  toTime?: string
  page?: number
  perPage?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface ILoginHistoryFilterOld {
  email?: string
  ip?: string
  fromTime?: number
  toTime?: number
  page?: number
  perPage?: number
  selectedSearch?: string
  searchKey?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface ICountUserSameIpFilter {
  fromTime?: number
  toTime?: number
}
