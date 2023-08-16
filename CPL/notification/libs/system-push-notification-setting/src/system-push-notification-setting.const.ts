import {
  EDeeplink,
  ESystemPushNotificationType,
} from './system-push-notification-setting.enum'

export const EVENT_VARIABLE_TRANSLATE = {}

export const DEEP_LINK_MAP = {
  [ESystemPushNotificationType.KYC_ACCEPTED]: EDeeplink.EXCHANGE,
  [ESystemPushNotificationType.KYC_REJECTED]: EDeeplink.KYC,
  [ESystemPushNotificationType.DEPOSIT]:
    EDeeplink.BALANCE_TRANSACTION_HISTORIES,
  [ESystemPushNotificationType.WITHDRAW_SUCCESS]:
    EDeeplink.BALANCE_TRANSACTION_HISTORIES,
  [ESystemPushNotificationType.WITHDRAW_REJECTED]:
    EDeeplink.BALANCE_TRANSACTION_HISTORIES,
  [ESystemPushNotificationType.ORDER_COMPLETED]: EDeeplink.EXCHANGE,
  [ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER]: EDeeplink.EXCHANGE,
  [ESystemPushNotificationType.DIVIDEND]: EDeeplink.REWARDS_DIVIDEND_HISTORY,
  [ESystemPushNotificationType.HIGH_LOW_COMPLETE]: EDeeplink.HIGH_LOW,
}
