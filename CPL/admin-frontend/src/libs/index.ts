import ElementPlus, { ElNotification } from 'element-plus'
import Select from './Select.vue'
import SelectI18n from './SelectWithI18.vue'
import DatePicker from './DatePicker.vue'
import TimePicker from './TimePicker.vue'
import DateRangePicker from './DateRangePicker.vue'
import DateTimePicker from './DateTimePicker.vue'
import DateRangePickerOptions from './DateRangePickerOptions.vue'
import ImageWithLargeView from './ImageWithLargeView.vue'
import UploadSingleImageWithDrag from './UploadSingleImageWithDrag.vue'
import { translate } from '@/core/helpers/common.helper'
import RichText from './RichText.vue'

export default (app) => {
  app.use(ElementPlus)

  app.component('v-select', Select)
  app.component('v18n-select', SelectI18n)
  app.component('date-picker', DatePicker)
  app.component('time-picker', TimePicker)
  app.component('date-range-picker', DateRangePicker)
  app.component('date-time-picker', DateTimePicker)
  app.component('date-range-picker-options', DateRangePickerOptions)
  app.component('img-with-large-view', ImageWithLargeView)
  app.component('upload-single-image-with-drag', UploadSingleImageWithDrag)
  app.component('rich-text', RichText)

  app.config.globalProperties.$toastr = ElNotification
  app.config.globalProperties.$t = translate
}
