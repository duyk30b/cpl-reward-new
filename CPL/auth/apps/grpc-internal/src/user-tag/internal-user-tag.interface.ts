export interface ICreateUserTags {
  userTags: {
    userId: number
    tagIds: number[]
  }[]
}
export interface IListUserTags {
  page?: number
  limit?: number
  userIds?: number[]
}

export interface IUserTagById {
  id: number
}

export interface IUserTagByUserId {
  userId: number
}

export interface IDeleteUserTagByIds {
  ids: number[]
}
export interface IDeleteUserTagByUsers {
  userIds: number[]
}

export interface IDeleteById {
  id: number
}
