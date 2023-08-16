<template>
  <el-time-picker
    v-model="inputVal"
    :placeholder="placeholder"
    :picker-options="{
      selectableRange: selectableRange,
    }"
  >
  </el-time-picker>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

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
      type: String,
      default: 'Arbitrary time',
    },
    selectableRange: {
      type: String,
      default: '',
    },
  },
  computed: {
    inputVal: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
})
</script>
