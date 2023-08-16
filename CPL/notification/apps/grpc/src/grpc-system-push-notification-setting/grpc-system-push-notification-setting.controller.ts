import {
  ISystemPushNotificationSettingFilter,
  IToggleActiveDto,
  IUpdateSystemPushNotificationSettingDto,
} from '@libs/system-push-notification-setting'
import { IDataById } from '@libs/util/interfaces/common.interface'
import { Controller } from '@nestjs/common'
import { GrpcMethod } from '@nestjs/microservices'
import { GrpcSystemPushNotificationSettingService } from './grpc-system-push-notification-setting.service'

@Controller('SystemPushNotificationSetting')
export class GrpcSystemPushNotificationSettingController {
  constructor(
    private readonly grpcSystemPushNotificationSettingService: GrpcSystemPushNotificationSettingService,
  ) {}

  @GrpcMethod('SystemPushNotificationSettingService')
  async getListSetting(settingFilter: ISystemPushNotificationSettingFilter) {
    return await this.grpcSystemPushNotificationSettingService.getListSetting(
      settingFilter,
    )
  }

  @GrpcMethod('SystemPushNotificationSettingService')
  async findSettingById(dataById: IDataById) {
    return await this.grpcSystemPushNotificationSettingService.findSettingById(
      dataById,
    )
  }

  @GrpcMethod('SystemPushNotificationSettingService')
  async updateSetting(
    updateSettingDto: IUpdateSystemPushNotificationSettingDto,
  ) {
    return await this.grpcSystemPushNotificationSettingService.updateSetting(
      updateSettingDto,
    )
  }

  @GrpcMethod('SystemPushNotificationSettingService')
  async toggleActive(toggleActiveDto: IToggleActiveDto) {
    return await this.grpcSystemPushNotificationSettingService.toggleActive(
      toggleActiveDto,
    )
  }

  @GrpcMethod('SystemPushNotificationSettingService')
  async getTypes() {
    return await this.grpcSystemPushNotificationSettingService.getTypes()
  }

  @GrpcMethod('SystemPushNotificationSettingService')
  async getSupportedLangs() {
    return await this.grpcSystemPushNotificationSettingService.getSupportedLangs()
  }
}
