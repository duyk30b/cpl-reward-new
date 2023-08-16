export enum ObmExchange {
  BINANCE = 'binance',
  FTX = 'ftx',
  KUCOIN = 'kucoin',
}

export enum ObmModule {
  BOT_A = 'bot_a',
  BOT_P = 'bot_p',
  OB_CRAWLER = 'crawler',
  MERGE_ORDERBOOK = 'merge_orderbook',
}

export enum ExchangeStatus {
  ACTIVE = 1,
  IN_ACTIVE = 2,
  MAINTAIN = 3,
  AUTHEN_ERROR = 7,
}

export enum PairStatus {
  ACTIVE = 1,
  IN_ACTIVE = 2,
  INSUFFICIENT_BALANCE = 5,
}

export enum PrecisionsList {
  _0 = '1',
  _1 = '0.1',
  _2 = '0.01',
  _3 = '0.001',
  _4 = '0.0001',
  _5 = '0.00001',
  _6 = '0.000001',
  _7 = '0.0000001',
  _8 = '0.00000001',
  _9 = '0.000000001',
  _10 = '0.0000000001',
  _11 = '0.00000000001',
}
