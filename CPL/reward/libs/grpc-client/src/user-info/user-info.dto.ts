import { Expose } from 'class-transformer'

export class UserInfoDto {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'user_info_history_id' })
  userInfoHistoryId: string

  @Expose({ name: 'first_name' })
  firstName: string

  @Expose({ name: 'last_name' })
  lastName: string

  @Expose({ name: 'full_name' })
  fullName: string

  @Expose({ name: 'furigana_1' })
  furigana1: string

  @Expose({ name: 'furigana_2' })
  furigana2: string

  @Expose()
  birthday: string

  @Expose()
  phone: string

  @Expose({ name: 'phone_country' })
  phoneCountry: string

  @Expose({ name: 'building_room' })
  buildingRoom: string

  @Expose()
  address: string

  @Expose()
  city: string

  @Expose({ name: 'state_region' })
  stateRegion: string

  @Expose({ name: 'zip_code' })
  zipCode: string

  @Expose({ name: 'country_id' })
  countryId: number

  @Expose({ name: 'nationality_id' })
  nationalityId: number

  @Expose()
  gender: number
}
