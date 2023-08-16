import { Expose } from 'class-transformer'

export class UserInfoDto {
  @Expose()
  id: string

  @Expose()
  userId: string

  @Expose()
  userInfoHistoryId: string

  @Expose()
  firstName: string

  @Expose()
  lastName: string

  @Expose()
  furigana1: string

  @Expose()
  furigana2: string

  @Expose()
  birthday: string

  @Expose()
  phone: string

  @Expose()
  phoneCountry: string

  @Expose()
  buildingRoom: string

  @Expose()
  address: string

  @Expose()
  city: string

  @Expose()
  stateRegion: string

  @Expose()
  zipCode: string

  @Expose()
  countryId: number

  @Expose()
  nationalityId: number

  @Expose()
  gender: number
}
