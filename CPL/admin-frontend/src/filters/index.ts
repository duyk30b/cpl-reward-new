import {
  convertDateFormat,
  convertTimestampToDate,
  fixedNumber,
  formatFieldByLocale,
  getCountryName,
} from '@/core/helpers/common.helper'

export default (app) => {
  app.config.globalProperties.$filters = {
    formatFieldByLocale,
    fixedNumber,
    convertDateFormat,
    convertTimestampToDate,
    getCountryName,
  }
}
