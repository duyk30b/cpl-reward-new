import { Observable } from 'rxjs'
import {
  AppVersion,
  AppVersionsResponse,
  GetAppVersionRequestDto,
} from './dtos/app-version.dto'

export interface IGrpcAppVersion {
  getAppVersions: (
    appVersionRequest: GetAppVersionRequestDto,
  ) => Observable<AppVersionsResponse>
  saveAppVersion: (appVersion: AppVersion) => Observable<AppVersion>
  deleteAppVersion: (appVersion: AppVersion) => Observable<AppVersion>
}
