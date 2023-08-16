import { Lang } from '@libs/common'
import { ESystemPushNotificationType } from '@libs/system-push-notification-setting'
import {
  OrderClass,
  OrderStatus,
  OrderType,
} from 'apps/event-dispatcher/src/exchange-consumer/exchange-consumer.variable'

export const VARIABLE_LANG_MAP = {
  [Lang.EN]: {
    [ESystemPushNotificationType.WITHDRAW_SUCCESS]: {
      Withdrawal_Status: {
        success: 'done',
        rejected: 'disapproval',
      },
    },
    [ESystemPushNotificationType.WITHDRAW_REJECTED]: {
      Withdrawal_Status: {
        success: 'done',
        rejected: 'disapproval',
      },
    },
    [ESystemPushNotificationType.ORDER_COMPLETED]: {
      ExOrder_Type: {
        stop_limit: 'Stop limit',
        stop_market: 'Stop market',
        limit: 'Limit',
        market: 'Market',
        [OrderClass.STOP_LIMIT]: 'Stop limit',
        [OrderClass.STOP_MARKET]: 'Stop market',
        [OrderClass.LIMIT]: 'Limit',
        [OrderClass.MARKET]: 'Market',
      },
      ExOrder_Side: {
        buy: 'Buy',
        sell: 'Sell',
        [OrderType.BUY]: 'Buy',
        [OrderType.SELL]: 'Sell',
      },
      ExOrder_Status: {
        canceled: 'Canceled',
        executed: 'Filled',
        [OrderStatus.CANCELED]: 'Canceled',
        [OrderStatus.FILLED]: 'Filled',
      },
    },
    [ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER]: {
      ExOrder_Type: {
        stop_limit: 'Stop limit',
        stop_market: 'Stop market',
        limit: 'Limit',
        market: 'Market',
        [OrderClass.STOP_LIMIT]: 'Stop limit',
        [OrderClass.STOP_MARKET]: 'Stop market',
        [OrderClass.LIMIT]: 'Limit',
        [OrderClass.MARKET]: 'Market',
      },
      ExOrder_Side: {
        buy: 'Buy',
        sell: 'Sell',
        [OrderType.BUY]: 'Buy',
        [OrderType.SELL]: 'Sell',
      },
    },
  },
  [Lang.JA]: {
    [ESystemPushNotificationType.WITHDRAW_SUCCESS]: {
      Withdrawal_Status: {
        success: '完了',
        rejected: '非承認',
      },
    },
    [ESystemPushNotificationType.WITHDRAW_REJECTED]: {
      Withdrawal_Status: {
        success: '完了',
        rejected: '非承認',
      },
    },
    [ESystemPushNotificationType.ORDER_COMPLETED]: {
      ExOrder_Type: {
        stop_limit: 'ストップ指値',
        stop_market: 'ストップ成行',
        limit: '指値',
        market: '成行',
        [OrderClass.STOP_LIMIT]: 'ストップ指値',
        [OrderClass.STOP_MARKET]: 'ストップ成行',
        [OrderClass.LIMIT]: '指値',
        [OrderClass.MARKET]: '成行',
      },
      ExOrder_Side: {
        buy: '買い',
        sell: '売り',
        [OrderType.BUY]: '買い',
        [OrderType.SELL]: '売り',
      },
      ExOrder_Status: {
        canceled: 'キャンセル',
        executed: '全約定',
        [OrderStatus.CANCELED]: 'キャンセル',
        [OrderStatus.FILLED]: '全約定',
      },
    },
    [ESystemPushNotificationType.OPEN_STOP_LIMIT_ORDER]: {
      ExOrder_Type: {
        stop_limit: 'ストップ指値',
        stop_market: 'ストップ成行',
        limit: '指値',
        market: '成行',
        [OrderClass.STOP_LIMIT]: 'ストップ指値',
        [OrderClass.STOP_MARKET]: 'ストップ成行',
        [OrderClass.LIMIT]: '指値',
        [OrderClass.MARKET]: '成行',
      },
      ExOrder_Side: {
        buy: '買い',
        sell: '売り',
        [OrderType.BUY]: '買い',
        [OrderType.SELL]: '売り',
      },
    },
    [ESystemPushNotificationType.HIGH_LOW_COMPLETE]: {
      Status: {
        Win: '勝ち',
        Lose: '負け',
      },
      TimeFrame: {
        '1 DAY': '1 日',
        '4 HOURS': '4 時間',
        '1 HOUR': '1 時間',
        '30 MIN': '30 分',
        '15 MIN': '15 分',
        '5 MIN': '5 分',
        '3 MIN': '3 分',
        '1 MIN': '1 分',
        '30 SEC': '30 秒',
        '10 SEC': '10 秒',
        '5 SEC': '5 秒',
      },
    },
  },
}
