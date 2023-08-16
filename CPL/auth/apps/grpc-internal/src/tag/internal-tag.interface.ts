export interface ICreateTags {
  names: string[]
}

export interface ICreateTag {
  name: string
}

export interface IUpdateTag {
  id: number
  name: string
}

export interface IFindTagsByIds {
  ids: number[]
}

export interface ISearchTags {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IDeleteTagsByIds {
  ids: number[]
}

export interface IDeleteTagById {
  id: number
}
