export enum MarketMakerExchange {
  BITCASTLE = 'bitcastle',
  AZBIT = 'azbit',
  COINSBIT = 'coinsbit',
  P2PB2B = 'p2pb2b',
}

export enum MarketMakerExchangeStatusEnum {
  UNKNOWN = 0,
  ACTIVE = 1,
  MAINTAIN = 2,
  LOSS_CONNECTION = 3,
  INSUFFICIENT_BALANCE = 4,
  AUTHENTICATION_ERROR = 5,
}
