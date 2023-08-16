import { Observable } from 'rxjs'

export interface IAuthSettingService {
  getAllCountry({}): Observable<IListCountryResponse>
  getCountryByCode(
    getCountryByCodeRequest: IGetCountryByCodeRequest,
  ): Observable<ICountryResponse>
  getCountryById(
    getCountryById: IGetCountryByIdRequest,
  ): Observable<ICountryResponse>
}

// REQUEST
export interface IGetCountryByCodeRequest {
  code: string
}

export interface IGetCountryByIdRequest {
  id: number
}

// RESPONSE
export interface ICountryResponse {
  id: number
  name: string
  code: string
  nameArtemis: string
  imageLink?: string
}

export interface IListCountryResponse {
  data: ICountryResponse[]
}
