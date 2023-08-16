import { Exclude } from 'class-transformer'

@Exclude()
export class UserItem {
  user_id: string
  email: string
  note: string
  reason: string
}

@Exclude()
export class UserItems {
  data: UserItem[]
  pagination: {
    page: number
    size: number
    total: number
  }
}

export class UserParam {
  page: number
  per_page: number
  keyword?: string
  sort_by?: string
  search_by_field?: string
  sort_type?: number
}
