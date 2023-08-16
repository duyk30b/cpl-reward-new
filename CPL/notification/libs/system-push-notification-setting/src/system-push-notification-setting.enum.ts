export enum ESystemPushNotificationType {
  KYC_ACCEPTED = 'kyc_accepted',
  KYC_REJECTED = 'kyc_rejected',
  DEPOSIT = 'deposit',
  ORDER_COMPLETED = 'order_completed',
  OPEN_STOP_LIMIT_ORDER = 'open_stop_limit_order',
  WITHDRAW_SUCCESS = 'withdraw_success',
  WITHDRAW_REJECTED = 'withdraw_rejected',
  DIVIDEND = 'dividend',
  HIGH_LOW_COMPLETE = 'high_low_complete',
}

export enum EDeeplink {
  KYC = 'account',
  BALANCE_TRANSACTION_HISTORIES = 'balance_transaction_histories',
  EXCHANGE = 'exchange',
  REWARDS_DIVIDEND_HISTORY = 'rewards_dividend_history',
  HIGH_LOW = 'highlow',
  NOTIFICATION_DETAIL = 'notification',
}
