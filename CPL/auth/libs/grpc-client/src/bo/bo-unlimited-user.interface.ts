import { Observable } from 'rxjs'

export interface IBOUnlimitedUserService {
  findOne(findOneRequest: FindOneRequest): Observable<BOUnlimitedUserResponse>
}

interface BOUnlimitedUser {
  id: string
  userId: string
  email: string
  name: string
  lastLogin: string
  createdAt: string
  updatedAt: string
}

// REQUEST
export interface FindOneRequest {
  userId: string
}

// RESPONSE
export interface BOUnlimitedUserResponse {
  success: boolean
  message?: string
  data?: BOUnlimitedUser
}
