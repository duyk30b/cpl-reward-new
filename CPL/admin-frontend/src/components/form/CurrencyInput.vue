<template>
  <input
    ref="inputRef"
    :value="formattedValue"
    :placeholder="placeholder"
    :name="name"
  />
</template>

<script lang="ts">
import useCurrencyInput, { CurrencyInputOptions } from 'vue-currency-input'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CurrencyInput',
  props: {
    modelValue: Number,
    options: Object,
    placeholder: String,
    name: String,
  },
  watch: {
    options: {
      handler(newValue) {
        this.setOptions(newValue)
      },
      deep: true,
    },
  },
  setup(props) {
    const { inputRef, formattedValue, setOptions } = useCurrencyInput(
      props.options as CurrencyInputOptions,
    )

    return { inputRef, formattedValue, setOptions }
  },
})
</script>
