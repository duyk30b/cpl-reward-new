<template>
  <el-date-picker
    v-model="inputVal"
    type="datetime"
    :format="_format"
    :placeholder="placeholder"
    :shortcuts="shortcuts"
  >
  </el-date-picker>
</template>

<script lang="ts">
import { formatDate } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

export enum DateRangePickerMode {
  DATE = 'daterange',
  DATETIME = 'datetimerange',
  DATETIMEWITHOUTRANGE = 'datetime',
}

export default defineComponent({
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: Date,
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
    format: {
      type: String,
    },
    mode: {
      type: String,
      default: DateRangePickerMode.DATETIMEWITHOUTRANGE,
    },
  },
  computed: {
    _format() {
      if (!this.format) {
        return 'YYYY-MM-DD HH:mm'
      }
      return this.format
    },
    inputVal: {
      get() {
        return this.modelValue
      },
      set(val) {
        val = val ? new Date(val) : ''
        this.$emit('update:modelValue', val)
      },
    },
    shortcuts() {
      return []
    },
  },
})
</script>
