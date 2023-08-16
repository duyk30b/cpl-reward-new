import { Environment } from '@libs/util'
import { registerAs } from '@nestjs/config'

export default registerAs('kafka', () => ({
  env: process.env.ENV || Environment.DEV,
  brokers: (process.env.KAFKA_BROKERS || '').split(','),
  group: process.env.KAFKA_GROUP,
  event: {
    user: {
      login: process.env.KAFKA_USER_LOGIN_EVENT || 'auth_user_login',
      logout: process.env.KAFKA_USER_LOGOUT_EVENT || 'auth_user_logout',
      created: process.env.KAFKA_USER_CREATED_EVENT || 'auth_user_created',
      change_password:
        process.env.KAFKA_USER_CHANGE_PASSWORD_EVENT ||
        'auth_user_change_password',
      change_email:
        process.env.KAFKA_USER_CHANGE_EMAIL_EVENT || 'auth_user_change_email',
      authenticator_status_updated:
        process.env.KAFKA_USER_AUTHENTICATOR_STATUS_UPDATED_EVENT ||
        'auth_user_authenticator_status_updated',
      change_lv:
        process.env.KAFKA_USER_CHANGE_LV_EVENT || 'auth_user_change_lv',
      delete_account:
        process.env.KAFKA_USER_DELETE_ACCOUNT_EVENT ||
        'auth_user_delete_account',
      request_delete_account:
        process.env.KAFKA_USER_REQUEST_DELETE_ACCOUNT_EVENT ||
        'auth_user_request_delete_account',
    },
    user_kyc: {
      registered:
        process.env.KAFKA_USER_KYC_REGISTERED_EVENT ||
        'auth_user_kyc_registered',
      status_updated:
        process.env.KAFKA_USER_KYC_STATUS_UPDATED_EVENT ||
        'auth_user_kyc_status_updated',
    },
    bce: {
      deposit:
        process.env.KAFKA_BCE_DEPOSIT_EVENT || 'bce_notification_deposit',
      withdraw:
        process.env.KAFKA_BCE_WITHDRAW_EVENT || 'bce_notification_withdraw',
      trading:
        process.env.KAFKA_BCE_TRADING_EVENT || 'bce_notification_trading',
      dividend:
        process.env.KAFKA_BCE_DIVIDEND_EVENT || 'bce_notification_dividend',
    },
    highlow: {
      win: process.env.KAFKA_HIGH_LOW_WIN_EVENT || 'high_low_win',
      lose: process.env.KAFKA_HIGH_LOW_LOSE_EVENT || 'high_low_lose',
    },
    mt5: {
      account_created:
        process.env.KAFKA_MT5_ACCOUNT_CREATED_EVENT || 'mt5_account_created',
      account_change_password:
        process.env.KAFKA_MT5_ACCOUNT_CHANGE_PASSWORD_EVENT ||
        'mt5_account_change_password',
      trade_confirm_withdrawal:
        process.env.KAFKA_MT5_TRADE_CONFIRM_WITHDRAWAL_EVENT ||
        'mt5_trade_confirm_withdrawal',
      deposit_request:
        process.env.KAFKA_MT5_DEPOSIT_REQUEST_EVENT || 'mt5_deposit_request',
    },
    exchange: {
      order_match:
        process.env.KAFKA_EXCHANGE_ORDER_MATCH ||
        'exchange.confirm-order.match',
      open_order:
        process.env.KAFKA_EXCHANGE_OPEN_ORDER || 'exchange.api.open.order',
    },
    api_management: {
      api_key_change_status:
        process.env.KAFKA_API_KEY_CHANGE_STATUS ||
        'api_management_change_status',
    },
  },
}))
