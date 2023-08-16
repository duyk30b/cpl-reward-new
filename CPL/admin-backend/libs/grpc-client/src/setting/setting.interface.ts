import { Observable } from 'rxjs'

export interface IGrpcSettingService {
  getAllCountry({}): Observable<ICountryCodeSetting>
}

export interface ICountryCodeSetting {
  data: ICountryCode[]
}

export interface ICountryCode {
  id: number
  name: string
  code: string
  nameArtemis: string
  imageLink: string
}
