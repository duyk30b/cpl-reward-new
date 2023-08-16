export enum EUserEvent {
  LOGIN = 'user.login',
  LOGOUT = 'user.logout',
  CREATED = 'user.created',
  VERIFIED = 'user.verified',
  CHANGE_PASSWORD = 'user.change_password',
  CHANGE_EMAIL = 'user.change_email',
  AUTHENTICATOR_STATUS_UPDATED = 'user.authenticator_status_updated',
  CHANGE_LV = 'user.change_lv',
  DELETE_ACCOUNT = 'user.delete_account',
  REQUEST_DELETE_ACCOUNT = 'user.request_delete_account',
}

export enum EUserKycEvent {
  REGISTERED = 'user_kyc.registered',
  STATUS_UPDATED = 'user_kyc.status_updated',
}

export enum EBceEvent {
  DEPOSIT = 'bce.deposit',
  WITHDRAW = 'bce.withdraw',
  TRADING = 'bce.trading',
  DIVIDEND = 'bce.dividend',
}

export enum EHighLowEvent {
  WIN = 'highlow.win',
  LOSE = 'highlow.lose',
}

export enum EMt5Event {
  ACCOUNT_CREATED = 'mt5.account_created',
  ACCOUNT_CHANGE_PASSWORD = 'mt5.account_change_password',
  TRADE_CONFIRM_WITHDRAWAL = 'mt5.trade_confirm_withdrawal',
  DEPOSIT_REQUEST = 'mt5.deposit_request',
}

export enum EExchangeEvent {
  ORDER_MATCH = 'exchange.order_match',
  OPEN_ORDER = 'exchange.open_order',
}

export enum EApiManagementEvent {
  API_KEY_CHANGE_STATUS = 'api_management.api_key_change_status',
}
