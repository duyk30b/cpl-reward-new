import { Observable } from 'rxjs'

export interface IExchangeUserUnlimitedService {
  checkUserIsUnlimited(
    checkUserIsUnlimitedRequest: ICheckUserIsUnlimitedRequest,
  ): Observable<ICheckUserIsUnlimitedResponse>
}

// REQUEST
export interface ICheckUserIsUnlimitedRequest {
  userId: string
}

// RESPONSE
export interface ICheckUserIsUnlimitedResponse {
  isUnlimited: boolean
}
