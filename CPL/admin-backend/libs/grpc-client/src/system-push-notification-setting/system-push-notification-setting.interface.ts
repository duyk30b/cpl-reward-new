import { Observable } from 'rxjs'
import { MultiLanguageFieldDto } from '../grpc-client.dto'
import {
  IBaseFilter,
  IDataById,
  IGetResponse,
  IPostResponse,
  IResponseWithPagination,
} from '../grpc-client.interface'

export interface ISystemPushNotificationSettingFilter extends IBaseFilter {
  lang?: string
  isActive?: boolean
  type?: string
}

export interface ISystemPushNotificationSettingDto {
  id: string
  type: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
}

export interface IUpdateSystemPushNotificationSettingDto {
  id: string
  title: MultiLanguageFieldDto
  content: MultiLanguageFieldDto
  isActive: boolean
}

export interface IToggleActiveDto {
  id: string
  isActive: boolean
}

export interface ISystemPushType {
  name: string
  variables: string[]
}

export interface IListTypes {
  data: ISystemPushType[]
}

export interface ISystemPushNotificationSettingService {
  getListSetting(
    settingFilter: ISystemPushNotificationSettingFilter,
  ): Observable<IResponseWithPagination<ISystemPushNotificationSettingDto>>
  findSettingById(
    dataById: IDataById,
  ): Observable<IGetResponse<ISystemPushNotificationSettingDto>>
  updateSetting(
    updateSettingDto: IUpdateSystemPushNotificationSettingDto,
  ): Observable<IPostResponse>
  toggleActive(toggleActiveDto: IToggleActiveDto): Observable<IPostResponse>
  getTypes({}): Observable<IListTypes>
  getSupportedLangs({}): Observable<{ data: string[] }>
}
