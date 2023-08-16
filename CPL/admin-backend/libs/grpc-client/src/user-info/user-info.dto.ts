import { TransformDate } from '@lib/util'
import { Expose, Type } from 'class-transformer'

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
  @TransformDate()
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

export class KycFileDto {
  @Expose()
  id: string

  @Expose()
  name: string

  @Expose()
  metadata: string

  @Expose()
  path: string

  @Expose({ name: 'is_image' })
  isImage: boolean
}

export class UserKycHistoryDto {
  @Expose()
  id: string

  @Expose({ name: 'user_info_history_id' })
  userInfoHistoryId: string

  @Expose({ name: 'user_id' })
  userId: string

  @Expose({ name: 'id_document_type' })
  idDocumentType: number

  @Expose()
  status: number

  @Expose()
  type: number

  @Expose()
  provider: number

  @Expose()
  @Type(() => KycFileDto)
  files: KycFileDto[]

  @Expose({ name: 'id_document_no' })
  idDocumentNo: string

  @Expose()
  remark: string

  @Expose({ name: 'country_id' })
  countryId: number

  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: number

  @Expose({ name: 'image_provider' })
  imageProvider: number

  @Expose({ name: 'risk_scan_provider' })
  riskScanProvider: number
}

export class UserInfoHistoryDto {
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
  @TransformDate()
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

  @Expose({ name: 'is_modified_by_user' })
  isModifiedByUser: number

  @Expose({ name: 'user_kyc_history' })
  @Type(() => UserKycHistoryDto)
  userKycHistory: UserKycHistoryDto
}
