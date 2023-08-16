export class Constants {
  public static GRPC_EXCHANGE_SETTING_TOKEN = 'GRPC_EXCHANGE_SETTING_TOKEN'
  // public static GRPC_PAIR_SETTING_PACKAGE = 'exchange'
  // public static GRPC_PAIR_CATEGORY_SETTING_PACKAGE = 'pair_category'
  // public static GRPC_COIN_SETTING_PACKAGE = 'coin'
  public static GRPC_COIN_SETTING_SERVICE = 'CoinSettingService'
  public static GRPC_PAIR_SETTING_SERVICE = 'PairSettingV2Service'
  public static GRPC_PAIR_CATEGORY_SETTING_SERVICE =
    'PairCategorySettingService'
  public static GRPC_SUB_CATEGORY_SERVICE = 'PairSubCategorySettingService'
  public static DEFAULT_DECIMAL_LIST = [
    '1',
    '0.1',
    '0.01',
    '0.001',
    '0.0001',
    '0.00001',
    '0.000001',
    '0.0000001',
    '0.00000001',
    '0.000000001',
    '0.0000000001',
  ]
  public static AMOUNT_DECIMAL_LIST = [
    '1',
    '0.1',
    '0.01',
    '0.001',
    '0.0001',
    '0.00001',
    '0.000001',
    '0.0000001',
    '0.00000001',
  ]
}
export const MAX_DECIMAL_TOTAL_ROUND = 10
export const MAX_DECIMAL_PRICE_ROUND = 10
export const MAX_DECIMAL_AMOUNT_ROUND = 8
