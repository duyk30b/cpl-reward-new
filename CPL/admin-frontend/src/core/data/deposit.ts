interface IDeposit {
  title: string
  key: string
  value: string
  show?: boolean
}
interface SettingData {
  chain_code: string
  settings: IDeposit[]
}

interface IPagination {
  page: number
  total: number
  rowsPerPage: number
}

interface IHeaderConfiguration {
  name?: string
  key: string
  sortingField?: string
  sortable?: boolean
  className?: string
}

interface ICurrency {
  key: string
  symbol: string
  chainCode: string
}

interface IBceManualDeposit {
  user_id: string
  tx_hash: string
  currency: string
  amount: string
  date: string
  to_address: string
  from_address: string
  destination_tag?: string
}

export {
  IDeposit,
  SettingData,
  IPagination,
  IHeaderConfiguration,
  ICurrency,
  IBceManualDeposit,
}
