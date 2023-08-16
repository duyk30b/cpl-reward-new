import { BodyGeneric } from '@/models/common/MasterData'
import { PlatformItem } from '@/models/setting-exchange/AppVersion'
import ApiService from '@/core/services/ApiService'

export class AppVersionService {
  public static async getAppVersion(
    platform: string,
  ): Promise<BodyGeneric<PlatformItem[]>> {
    return await ApiService.get(`/api-app-version/${platform}`)
  }

  public static async patchAppVersion(body: PlatformItem): Promise<any> {
    return await ApiService.patch(`/api-app-version`, body)
  }

  public static async postAppVersion(body: PlatformItem): Promise<any> {
    return await ApiService.post(`/api-app-version`, body)
  }

  public static async deleteAppVersion(body: PlatformItem): Promise<any> {
    return await ApiService.post(`/api-app-version/delete`, body)
  }
}
