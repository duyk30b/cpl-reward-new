import { DateRangePickerMode } from '@/libs/DateRangePicker.vue'

export interface IColumnConfig {
  key: string
  title: string
  class?: string
  sortKey?: string
  sortable?: boolean
  hidden?: boolean
  hiddenTitle?: boolean
  render?: (value, row?) => string
}

export interface IBaseSearchColumnConfig {
  searchType: string
  key: string
  title: string
  class?: string
}

export interface ISelectSearchColumnConfig extends IBaseSearchColumnConfig {
  remote?: boolean
  options?: Array<{ id: string | number; name: string }>
  remoteOptions?: (
    keyword,
  ) => Promise<Array<{ id: string | number; name: string }>>
  multiple?: boolean
  reserveKeyword?: boolean
  collapseTags?: boolean
}

export interface IDateRangeSearchColumnConfig extends IBaseSearchColumnConfig {
  startPlaceholder: string
  endPlaceholder: string
  mode: DateRangePickerMode
  inputFormat?: string
  getDataOnChange?: boolean
}
