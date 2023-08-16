import { SUPPORTED_LANGS } from '@libs/common'
import {
  ESystemPushNotificationType,
  ISystemPushNotificationSettingFilter,
  IToggleActiveDto,
  IUpdateSystemPushNotificationSettingDto,
  SystemPushNotificationSettingService,
} from '@libs/system-push-notification-setting'
import { IDataById } from '@libs/util/interfaces/common.interface'
import { Injectable } from '@nestjs/common'

@Injectable()
export class GrpcSystemPushNotificationSettingService {
  constructor(
    private readonly systemPushNotificationSettingService: SystemPushNotificationSettingService,
  ) {}

  async getListSetting(settingFilter: ISystemPushNotificationSettingFilter) {
    return await this.systemPushNotificationSettingService.getListSetting(
      settingFilter,
    )
  }

  async findSettingById(dataById: IDataById) {
    const setting = await this.systemPushNotificationSettingService.findById(
      dataById.id,
    )
    return {
      data: setting,
    }
  }

  async updateSetting(
    updateSettingDto: IUpdateSystemPushNotificationSettingDto,
  ) {
    await this.systemPushNotificationSettingService.updateSetting(
      updateSettingDto,
    )
    return { success: true }
  }

  async toggleActive(toggleActiveDto: IToggleActiveDto) {
    await this.systemPushNotificationSettingService.toggleActive(
      toggleActiveDto,
    )
    return { success: true }
  }

  async getTypes() {
    return {
      data: [
        {
          name: ESystemPushNotificationType.DEPOSIT,
          variables: ['Deposit_Currency', 'Deposit_Quantity'],
        },
        {
          name: ESystemPushNotificationType.WITHDRAW_SUCCESS,
          variables: [
            'Withdrawal_Currency',
            'Withdrawal_Quantity',
            'Withdrawal_Fee_Currency',
            'Withdrawal_Fee',
            'Withdrawal_Status',
          ],
        },
        {
          name: ESystemPushNotificationType.WITHDRAW_REJECTED,
          variables: [
            'Withdrawal_Currency',
            'Withdrawal_Quantity',
            'Withdrawal_Fee_Currency',
            'Withdrawal_Fee',
            'Withdrawal_Status',
          ],
        },
        {
          name: ESystemPushNotificationType.ORDER_COMPLETED,
          variables: [
            'ExOrder_Pair',
            'ExOrder_Type',
            'ExOrder_Side',
            'ExOrder_Status',
          ],
        },
        {
          name: ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER,
          variables: ['ExOrder_Pair', 'ExOrder_Type', 'ExOrder_Side'],
        },
        {
          name: ESystemPushNotificationType.DIVIDEND,
          variables: ['Dividend_Currency', 'Dividend_Amount'],
        },
        {
          name: ESystemPushNotificationType.KYC_ACCEPTED,
          variables: [],
        },
        {
          name: ESystemPushNotificationType.KYC_REJECTED,
          variables: [],
        },
        {
          name: ESystemPushNotificationType.HIGH_LOW_COMPLETE,
          variables: ['Mode', 'TimeFrame', 'Pair', 'Status'],
        },
      ],
    }
  }

  async getSupportedLangs() {
    return { data: SUPPORTED_LANGS }
  }
}
