export enum WALLET_TYPE {
  SPOT = 'spot',
  REWARD = 'reward',
}

export enum SETTING_TYPE {
  COMMON = 'common',
  CASTLE = 'castle',
}

export enum CURRENCY {
  CASTLE = 'castle',
  ETH = 'eth',
  BTC = 'btc',
  USDT = 'usdt',
}

export enum SETTING_STATUS {
  ENABLE = 1,
  DISABLE = 2,
}

export enum SWAP_MODULE_TYPE {
  SWAP_SPOT_COMMON = 'swap_spot_common',
  SWAP_SPOT_CASTLE = 'swap_spot_castle',
  SWAP_REWARD_COMMON = 'swap_reward_common',
}

export const SWAP_COMMON = 'swap_common'

export enum SWAP_STATUS {
  CREATED = 1,
  COMPLETED = 2,
  PENDING = 3,
  FAILED = 4,
}
