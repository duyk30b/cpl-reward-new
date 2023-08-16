import { Expose, Type } from 'class-transformer'
import { UserKycHistory } from './UserKyc'

export class BaseUserInfo {
  @Expose()
  id: string

  @Expose({ name: 'user_id' })
  userId: string

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

  get phoneNumber() {
    if (!this.phone) return ''
    return `+${this.phoneCountry || ''}${this.phone}`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tagChanged(tag: string) {
    return false
  }
}
export class UserInfo extends BaseUserInfo {
  @Expose({ name: 'user_info_history_id' })
  userInfoHistoryId: string
}

export class UserInfoHistory extends BaseUserInfo {
  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: number

  @Expose({ name: 'user_kyc_history' })
  @Type(() => UserKycHistory)
  userKycHistory: UserKycHistory

  modifiedTags: string[]

  get syncWithKycHistory() {
    return (
      this.userKycHistory && this.userKycHistory.userInfoHistoryId == this.id
    )
  }

  get userInfoHistoryId() {
    return this.id
  }

  tagChanged(tag: string) {
    return (this.modifiedTags || []).some((e) => e == tag)
  }
}

export enum Gender {
  MALE = 1,
  FEMALE = 2,
  OTHER = 3,
}

export class UpdateUserInfoDto extends UserInfo {
  @Expose({ name: 'id_document_no' })
  idDocumentNo?: string

  @Expose()
  remark: string
}
