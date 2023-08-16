export enum OrderSide {
  Buy = 1,
  Sell = 2,
}

export enum OrderType {
  Market = 1,
  Limit = 2,
  Liquidation = 3,
  TakeProfit = 4,
  StopLoss = 5,
  CloseMarket = 6,
  StopLimit = 7,
  StopMarket = 8,
}

export enum OrderStatus {
  Open = 1,
  Canceled = 3,
  Canceling = 2,
  Filled = 4,
  Error = 5,
}

export enum UserType {
  User = 1,
  FutureCore = 2,
  BotP = 3,
}

export enum CollateralType {
  UsdM = 1,
  CoinM = 2,
}

export enum OrderMode {
  Isolate = 1,
  Cross = 2,
}

export enum OrderTransactionStatus {
  Pending = 1,
  Filled = 2,
  Error = 5,
}

export enum FeeStatus {
  Pending = 1,
  Success = 2,
}

export enum FeeType {
  OrderFee = 1,
  MarginFee = 2,
  InsuranceFee = 3,
  PositionFee = 4,
}

export enum PositionSide {
  Long = 'long',
  Short = 'short',
}
export enum PositionType {
  Isolated = 'isolated',
  Cross = 'cross',
}
export enum PositionStatus {
  Open = 'open',
  Close = 'close',
}
