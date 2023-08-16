import { STRATEGY_STATUS } from '@/models/spot-grid-trading/enum'
import { Feature, Permission } from './common.enum'

export const FEATURE_MAP = {
  [Feature.REVIEW_KYC]: [
    Permission.USER_KYC_REVIEW,
    Permission.USER_GET_LIST,
    Permission.USER_READ,
    Permission.USER_KYC_READ,
    Permission.USER_INFO_READ,
    Permission.USER_KYC_READ_ENTERPRISE_INFO,
    Permission.USER_INFO_READ_HISTORY,
    Permission.USER_KYC_READ_ADMIN_DECISIONS,
    Permission.USER_KYC_READ_SCAN_DATA,
    Permission.USER_KYC_RENEW_SCAN_DATA,
  ],
  [Feature.MANAGE_MARKETING_FUNCTION]: [
    Permission.CAMPAIGN_GET_LIST,
    Permission.CAMPAIGN_CREATE,
    Permission.CAMPAIGN_UPDATE,
    Permission.CAMPAIGN_DELETE,
    Permission.CAMPAIGN_GET_DISPLAY_CONDITIONS,
    Permission.CAMPAIGN_GET_LIST_GRANT_TARGETS,
    Permission.CAMPAIGN_GET_LIST_KAFKA_EVENTS,
    Permission.CAMPAIGN_GET_LIST_USER_CONDITIONS,
    Permission.MISSION_CREATE,
    Permission.MISSION_READ,
    Permission.MISSION_UPDATE,
    Permission.CHANNEL_GET_LIST,
    Permission.CHANNEL_CREATE,
    Permission.CHANNEL_READ,
    Permission.CHANNEL_UPDATE,
    Permission.CHANNEL_DELETE,
    Permission.TAG_GET_LIST,
    Permission.TAG_CREATE,
    Permission.TAG_READ,
    Permission.TAG_UPDATE,
    Permission.TAG_DELETE,
    Permission.USER_MARKETING_GET_LIST,
    Permission.REWARD_LOG_GET_LIST,
    Permission.REWARD_LOG_COUNT,
    Permission.REWARD_LOG_RESOLVE,
    Permission.USER_TAG_CREATE,
    Permission.USER_TAG_READ,
    Permission.USER_TAG_DELETE,
  ],
  [Feature.MANAGE_ADMIN_ACCOUNT_AND_PERMISSION]: [
    Permission.ADMIN_GET_LIST,
    Permission.ADMIN_CREATE,
    Permission.ADMIN_READ,
    Permission.ADMIN_UPDATE,
    Permission.ADMIN_SET_PERMISSION,
    Permission.ROLE_GET_LIST,
    Permission.ROLE_CREATE,
    Permission.ROLE_READ,
    Permission.ROLE_UPDATE,
    Permission.ROLE_DELETE,
  ],
  [Feature.MANAGE_WALLET_SETTING]: [
    Permission.WALLET_SETTING_READ,
    Permission.WALLET_SETTING_UPDATE,
  ],
  [Feature.OBM_SETTING]: [
    Permission.OBM_SETTING_READ,
    Permission.OBM_SETTING_UPDATE,
    Permission.OBM_SETTING_DELETE,
  ],
  [Feature.EXCHANGE_ORDER]: [
    Permission.EXCHANGE_ORDER_READ,
    Permission.EXCHANGE_ORDER_UPDATE,
  ],
  [Feature.FUTURE]: [
    Permission.FUTURES_ORDER_READ,
    Permission.FUTURES_ORDER_UPDATE,
  ],
}

export const ORDER_TYPE = {
  1: 'orderSide.buy',
  2: 'orderSide.sell',
}

export const ORDER_CLASS = {
  1: 'orderType.market',
  2: 'orderType.limit',
  3: 'orderType.stopMarket',
  4: 'orderType.stopLimit',
}

export const ORDER_STATUS = {
  1: 'orderStatus.pending',
  2: 'orderStatus.filled',
  3: 'orderStatus.canceled',
  4: 'orderStatus.error',
  5: 'orderStatus.partialFilled',
  6: 'orderStatus.processingCancel',
  7: 'orderStatus.partialFill',
  8: 'orderStatus.stopping',
  9: 'orderStatus.rejected',
  10: 'orderStatus.canceledByAdmin',
}
export const MAX_DIGITS_LEFT_RIGHT = 16
export const MAX_DECIMAL_VOLUME_ROUND = 8
export const MAX_DECIMAL_TOTAL_ROUND = 10
export const MAX_DECIMAL_PRICE_ROUND = 10

export enum CANCEL_RESOURCE {
  UNDEFINED = 0,
  USER = 1,
  ADMIN = 2,
  SYSTEM = 3,
}

export const STRATEGY_STATUS_MAP_STRING: { [key in STRATEGY_STATUS]: string } =
  {
    [STRATEGY_STATUS.PENDING]: 'gridTrading.strategyStatus.pending',
    [STRATEGY_STATUS.RUNNING]: 'gridTrading.strategyStatus.running',
    [STRATEGY_STATUS.ENDING]: 'gridTrading.strategyStatus.ending',
    [STRATEGY_STATUS.END]: 'gridTrading.strategyStatus.end',
    [STRATEGY_STATUS.ERROR]: 'gridTrading.strategyStatus.error',
  }

export const ONE_DAY_MILLISECONDS = '86400000' // 60 * 60 * 24 * 1000
