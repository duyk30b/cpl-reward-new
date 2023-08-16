<template>
  <el-date-picker
    v-model="inputVal"
    :type="mode"
    align="right"
    unlink-panels
    :range-separator="$t('datePickerSeparator')"
    :format="_inputFormat"
    :start-placeholder="startPlaceholder"
    :end-placeholder="endPlaceholder"
    :shortcuts="pickerOptions"
  >
  </el-date-picker>
</template>

<script lang="ts">
import { formatDate } from '@/core/helpers/common.helper'
import { defineComponent, PropType } from 'vue'

export enum DateRangePickerMode {
  DATE = 'daterange',
  DATETIME = 'datetimerange',
}

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Array as PropType<Array<string>>,
    },
    className: {
      default: 'form-control',
    },
    startPlaceholder: {
      default: '',
    },
    endPlaceholder: {
      default: '',
    },
    outputFormat: {
      type: String,
    },
    inputFormat: {
      type: String,
    },
    shortcuts: {
      type: Object,
    },
    mode: {
      type: String,
      default: DateRangePickerMode.DATE,
    },
  },
  computed: {
    _inputFormat() {
      if (!this.inputFormat) {
        if (this.mode == DateRangePickerMode.DATE) return 'DD/MM/YYYY'
        if (this.mode == DateRangePickerMode.DATETIME) {
          return 'DD/MM/YYYY HH:mm:ss'
        }
        return 'DD/MM/YYYY'
      }
      return this.inputFormat
    },
    _outputFormat() {
      if (!this.outputFormat) {
        if (this.mode == DateRangePickerMode.DATE) return 'YYYY-MM-DD'
        if (this.mode == DateRangePickerMode.DATETIME) {
          return 'YYYY-MM-DD HH:mm:ss'
        }
        return 'YYYY-MM-DD'
      }
      return this.outputFormat
    },
    inputVal: {
      get() {
        return this.modelValue
          ? this.modelValue.map((time) => new Date(time))
          : ['', '']
      },
      set(val) {
        val = val
          ? val.map((time) => formatDate(time, this._outputFormat))
          : ['', '']
        this.$emit('update:modelValue', val)
      },
    },
    pickerOptions() {
      return this.shortcuts
    },
  },
})
</script>
