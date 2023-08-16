export const KAFKA_TOPIC_METADATA = '__kafka-topic'

export const KAFKA_EVENTS = {
  AUTH_USER_AUTHENTICATOR_STATUS_UPDATED: 'auth_user_authenticator_status_updated',
  AUTH_USER_CHANGE_EMAIL: 'auth_user_change_email',
  AUTH_USER_CHANGE_INFO: 'auth_user_change_info',
  AUTH_USER_CHANGE_LV: 'auth_user_change_lv',
  AUTH_USER_CHANGE_PASSWORD: 'auth_user_change_password',
  AUTH_USER_CREATED: 'auth_user_created',
  AUTH_USER_KYC_AUTO_KYC_FINISHED: 'auth_user_kyc_auto_kyc_finished',
  AUTH_USER_KYC_REGISTERED: 'auth_user_kyc_registered',
  AUTH_USER_KYC_STATUS_UPDATED: 'auth_user_kyc_status_updated',
  AUTH_USER_LOGIN: 'auth_user_login',
  AUTH_USER_LOGOUT: 'auth_user_logout',

  // BCE
  BCE_TRADING_MATCHED: 'bce_trading_matched',
  BCE_DEPOSIT: 'bce_deposit',
  BCE_WITHDRAW: 'bce_withdraw',

  // New Exchange
  EXCHANGE_CONFIRM_ORDER_MATCH: 'exchange_confirm_order_match',

  // BO
  HIGH_LOW_CANCEL: 'high_low_cancel',
  HIGH_LOW_CREATE: 'high_low_create',
  HIGH_LOW_LOSE: 'high_low_lose',
  HIGH_LOW_TRANSFER_BALANCE: 'high_low_transfer_balance',
  HIGH_LOW_WIN: 'high_low_win',

  // reward
  REWARD_USER_CHECK_IN: 'reward_user_check_in',
}
