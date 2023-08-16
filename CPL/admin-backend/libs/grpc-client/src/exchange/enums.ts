export enum ORDER_CLASS {
  Market = 1,
  Limit = 2,
  StopMarket = 3,
  StopLimit = 4,
}

export enum ORDER_TYPE {
  Buy = 1,
  Sell = 2,
}
export enum ORDER_STATUS {
  Pending = 1,
  Filled = 2,
  Canceled = 3,
  ProcessingCancel = 6,
}

export enum ALL_STATUS_FOR_FE {
  Pending = 1,
  Filled = 2,
  Canceled = 3,
  Error = 4,
  PartialFilled = 5,
  ProcessingCancel = 6,
  PartialFill = 7,
  Stopping = 8,
}

export enum USER_TYPE {
  USER = 1,
  BOT_A = 2,
  BOT_P = 3,
  GATEKEEPER = 4,
}
