import { Inject, Injectable } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'
import { plainToInstance } from 'class-transformer'
import { lastValueFrom } from 'rxjs'
import {
  ISystemPushNotificationSettingFilter,
  ISystemPushNotificationSettingService,
  IToggleActiveDto,
  IUpdateSystemPushNotificationSettingDto,
} from './system-push-notification-setting.interface'
import { SystemPushNotificationSettingDto } from './system-push-notification-setting.dto'

@Injectable()
export class SystemPushNotificationSettingService {
  private service: ISystemPushNotificationSettingService
  constructor(
    @Inject('SYSTEM_PUSH_NOTI_SETTING_PACKAGE') private client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.service =
      this.client.getService<ISystemPushNotificationSettingService>(
        'SystemPushNotificationSettingService',
      )
  }

  async findSettingById(id: string) {
    const req = this.service.findSettingById({ id })
    const result = await lastValueFrom(req)
    return result.data
      ? plainToInstance(SystemPushNotificationSettingDto, result.data, {
          ignoreDecorators: true,
        })
      : null
  }

  async updateSetting(
    updateSettingDto: IUpdateSystemPushNotificationSettingDto,
  ) {
    const req = this.service.updateSetting(updateSettingDto)
    const result = await lastValueFrom(req)
    return result
  }

  async toggleActive(toggleActiveDto: IToggleActiveDto) {
    const req = this.service.toggleActive(toggleActiveDto)
    const result = await lastValueFrom(req)
    return result
  }

  async getListSetting(settingFilter: ISystemPushNotificationSettingFilter) {
    const req = this.service.getListSetting(settingFilter)
    const data = await lastValueFrom(req)
    data.data = (data.data || []).map((item) =>
      plainToInstance(SystemPushNotificationSettingDto, item, {
        ignoreDecorators: true,
      }),
    )
    return data
  }

  async getTypes() {
    const req = this.service.getTypes({})
    const result = await lastValueFrom(req)
    return result.data
  }

  async getSupportedLangs() {
    const req = this.service.getSupportedLangs({})
    const result = await lastValueFrom(req)
    return result.data
  }
}
