import { Observable } from 'rxjs'

export interface IUserTagService {
  addUserTags(data: AddUserTagInput): Observable<any>
}

export interface AddUserTagInput {
  userTags: Array<UserTag>
}

interface UserTag {
  userId: number
  tagIds: Array<number>
}
