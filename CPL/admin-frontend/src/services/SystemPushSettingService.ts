import ApiService from '@/core/services/ApiService'
import { HttpStatus } from '@/core/variables/common.enum'
import { Optional } from '@/models/common/Optional'
import { PostResponse } from '@/models/common/Response'
import {
  SystemPushNotificationSetting,
  UpdateSystemPushSettingRequest,
} from '@/models/notification/SystemPushSetting'
import { SystemPushSettingType } from '@/models/notification/SystemPushSettingType'
import { instanceToPlain, plainToInstance } from 'class-transformer'

export class SystemPushSettingService {
  public static async findById(
    id: string,
  ): Promise<Optional<SystemPushNotificationSetting>> {
    const response = await ApiService.get(`/system-push-setting/${id}`)
    if (response.status != HttpStatus.OK) {
      return null
    }
    return plainToInstance(SystemPushNotificationSetting, response.data)
  }

  public static async getListSettings(params) {
    return await ApiService.get(`/system-push-setting`, { params })
  }

  public static async updateSetting(
    id: string,
    params: UpdateSystemPushSettingRequest,
  ): Promise<PostResponse> {
    const response = await ApiService.post(
      `/system-push-setting/${id}`,
      instanceToPlain(params),
    )
    return response.data
  }

  public static async toggleActive(
    id: string,
    active: boolean,
  ): Promise<PostResponse> {
    const response = await ApiService.post(
      `/system-push-setting/${id}/toggle-active`,
      { is_active: active },
    )
    return response.data
  }

  public static async getTypes(): Promise<SystemPushSettingType[]> {
    const response = await ApiService.get(`/system-push-setting/types`)
    if (response.status != HttpStatus.OK) {
      return []
    }
    return response.data
  }

  public static async getSupportedLangs(): Promise<string[]> {
    const response = await ApiService.get(
      `/system-push-setting/supported-langs`,
    )
    if (response.status != HttpStatus.OK) {
      return []
    }
    return response.data
  }
}
