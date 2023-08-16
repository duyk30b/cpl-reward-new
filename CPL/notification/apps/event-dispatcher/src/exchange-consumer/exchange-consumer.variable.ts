export enum OrderType {
  BUY = 1,
  SELL = 2,
}

export enum OrderClass {
  MARKET = 1,
  LIMIT = 2,
  STOP_MARKET = 3,
  STOP_LIMIT = 4,
}

export enum OrderStatus {
  PENDING = 1,
  FILLED = 2,
  CANCELED = 3,
  ERROR = 4,
  PARTIAL_FILLED = 5,
  PROCESSING_CANCEL = 6,
  PARTIAL_FILL = 7,
  STOPPING = 8,
}

export enum ExchangeUserType {
  USER = 1,
  BOT_A = 2,
  BOT_P = 3,
  GATEKEEPER = 4,
}

export enum StopDirection {
  UNDEFINED = 0,
  UP = 1,
  DOWN = 2,
}
