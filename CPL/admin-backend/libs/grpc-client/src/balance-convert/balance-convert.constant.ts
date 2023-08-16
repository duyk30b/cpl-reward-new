export class BalanceConvertConstant {
  public static GRPC_BALANCE_CONVERT_PACKAGE = 'BALANCE_CONVERT_PACKAGE'
}

export const BALANCE_CONVERT_SEARCH_FIELD_MAP = {
  coin_from: 'coin_from',
  coin_to: 'coin_to',
  fee_coin: 'fee_coin',
}

export const BALANCE_CONVERT_SEARCH_EQUAL_FIELD_MAP = {
  balance_type: 'balance_type',
  fee_type: 'fee_type',
  status: 'status',
}

export const BALANCE_CONVERT_SORT_FIELD_MAP = {
  id: 'id',
  coin_from: 'coin_from',
  coin_to: 'coin_to',
  balance_type: 'balance_type',
  fee_coin: 'fee_coin',
  fee_type: 'fee_type',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export const BALANCE_CONVERT_LOG_SEARCH_FIELD_MAP = {
  coin_from: 'coin_from',
  coin_to: 'coin_to',
  fee_coin: 'fee_coin',
}

export const BALANCE_CONVERT_LOG_SEARCH_EQUAL_FIELD_MAP = {
  balance_type: 'balance_type',
  fee_type: 'fee_type',
  status: 'status',
  config_by: 'config_by',
}

export const BALANCE_CONVERT_LOG_SORT_FIELD_MAP = {
  id: 'id',
  coin_from: 'coin_from',
  coin_to: 'coin_to',
  balance_type: 'balance_type',
  fee_coin: 'fee_coin',
  fee_type: 'fee_type',
  status: 'status',
  config_by: 'config_by',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export enum BALANCE_STATUS {
  ENABLE = 1,
  DISABLE = 2,
}

export const BALANCE_SORT_FIELD_MAP = {
  id: 'id',
  module: 'module',
  code: 'code',
  value: 'value',
  status: 'status',
  created_at: 'created_at',
  updated_at: 'updated_at',
}

export const BALANCE_SEARCH_FIELD_MAP = {
  module: 'module',
  value: 'value',
}

export const BALANCE_SEARCH_EQUAL_FIELD_MAP = {
  status: 'status',
}

export const BALANCE_MODULE = {
  CONVERT_SMALL_BALANCE: 'convert_small_balance',
}
