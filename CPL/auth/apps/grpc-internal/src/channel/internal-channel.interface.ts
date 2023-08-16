export interface IAddChannel {
  name: string
  link: string
  tagIds?: string
}

export interface IUpdateChannel {
  id?: number
  name?: string
  link?: string
  tagIds?: string
}

export interface IFindOneChannel {
  id?: number
  link?: string
}

export interface IListChannel {
  page?: number
  limit?: number
  searchField?: string
  searchText?: string
  sort?: string
  sortType?: 'ASC' | 'DESC'
}

export interface IDeleteChannel {
  id: number
}
