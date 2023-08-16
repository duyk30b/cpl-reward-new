<template>
  <el-date-picker
    v-model="inputVal"
    :type="mode"
    :format="_inputFormat"
    :value-format="_outputFormat"
    :placeholder="placeholder"
    :shortcuts="shortcuts"
    :disabled-date="disabledDate"
    :editable="false"
  >
  </el-date-picker>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export enum DatePickerMode {
  DATETIME = 'datetime',
  DATE = 'date',
  MONTH = 'month',
  YEAR = 'year',
}

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
    },
    className: {
      default: 'form-control',
    },
    placeholder: {
      default: '',
    },
    outputFormat: {
      type: String,
    },
    inputFormat: {
      type: String,
    },
    mode: {
      type: String,
      default: DatePickerMode.DATE,
    },
    disabledDate: {
      type: Function,
      default: () => false,
    },
  },
  computed: {
    _inputFormat() {
      if (!this.inputFormat) {
        if (this.mode == DatePickerMode.DATETIME) return 'DD/MM/YYYY HH:mm:ss'
        if (this.mode == DatePickerMode.DATE) return 'DD/MM/YYYY'
        if (this.mode == DatePickerMode.MONTH) return 'MM/YYYY'
        if (this.mode == DatePickerMode.YEAR) return 'YYYY'
        return 'DD/MM/YYYY'
      }
      return this.inputFormat
    },
    _outputFormat() {
      if (!this.outputFormat) {
        if (this.mode == DatePickerMode.DATETIME) return 'YYYY-MM-DD HH:mm:ss'
        if (this.mode == DatePickerMode.DATE) return 'YYYY-MM-DD'
        if (this.mode == DatePickerMode.MONTH) return 'YYYY-MM'
        if (this.mode == DatePickerMode.YEAR) return 'YYYY'
        return 'YYYY-MM-DD'
      }
      return this.outputFormat
    },
    inputVal: {
      get() {
        return this.modelValue || ''
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
    shortcuts() {
      // if (this.mode == DatePickerMode.DATE) {
      // 	return [{
      // 		text: 'Hôm qua',
      // 		value: (() => {
      // 			const date = new Date()
      // 			date.setTime(date.getTime() - 3600 * 1000 * 24)
      // 			return date;
      // 		})(),
      // 	}, {
      // 		text: 'Hôm nay',
      // 		value: new Date(),
      // 	}];
      // }
      return []
    },
  },
})
</script>
