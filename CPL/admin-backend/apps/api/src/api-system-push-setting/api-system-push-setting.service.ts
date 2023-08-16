import { SystemPushNotificationSettingService } from '@lib/grpc-client/system-push-notification-setting'
import { Injectable } from '@nestjs/common'
import {
  UpdateSystemPushNotificationSettingDto,
  ToggleActiveDto,
  SystemPushSettingFilterDto,
} from './api-system-push-setting.dto'

@Injectable()
export class ApiSystemPushSettingService {
  constructor(
    private readonly systemPushNotificationSettingService: SystemPushNotificationSettingService,
  ) {}

  async getListSetting(settingFilter: SystemPushSettingFilterDto) {
    return await this.systemPushNotificationSettingService.getListSetting(
      settingFilter,
    )
  }

  async findSettingById(id: string) {
    return await this.systemPushNotificationSettingService.findSettingById(id)
  }

  async updateSetting(
    id: string,
    updateSettingDto: UpdateSystemPushNotificationSettingDto,
  ) {
    return await this.systemPushNotificationSettingService.updateSetting({
      id,
      ...updateSettingDto,
    })
  }

  async toggleActive(id: string, toggleActiveDto: ToggleActiveDto) {
    return await this.systemPushNotificationSettingService.toggleActive({
      id,
      ...toggleActiveDto,
    })
  }

  async getTypes() {
    return await this.systemPushNotificationSettingService.getTypes()
  }

  async getSupportedLangs() {
    return await this.systemPushNotificationSettingService.getSupportedLangs()
  }
}
