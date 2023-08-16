<template>
  <div>
    <input
      type="text"
      class="form-control"
      v-model="displayValue"
      ref="inputRef"
      @blur="isInputActive = false"
      @focus="isInputActive = true"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BigNumber from "bignumber.js";

export default defineComponent({
  name: 'VueCurrency',
  props: ['modelValue'],

  data() {
    return {
      isInputActive: false,
    }
  },
  computed: {
    displayValue: {
      get: function () {
        if (this.isInputActive) {
          // Cursor is inside the input field. unformat display value for user
          if (['number', 'string'].includes(typeof this.modelValue)) {
            return this.modelValue.toString()
          }
          return null
        } else {
          // User is not modifying now. Format display value for user interface
          return this.format(this.modelValue)
        }
      },
      set: function (modifiedValue) {
        // Recalculate value after ignoring "$" and "," in user input
        // Keep string for handle big number
        let newValue = String(modifiedValue.replace(/[^\d\\.]/g, ''))
        // Ensure that it is not NaN
        if (isNaN(parseFloat(newValue))) {
          this.$emit('update:modelValue', null)
          return
        }
        // Note: we cannot set this. modelValue as it is a "prop". It needs to be passed to parent component
        // $emit the event so that parent component gets it
        this.$emit('update:modelValue', newValue)
      },
    },
  },
  mounted() {
    const regexString = `^([0-9]{0,16}(\\.[0-9]{0,5})?)$`
    const regex = new RegExp(regexString)
    const inputRef = this.$refs.inputRef as any
    inputRef.addEventListener('beforeinput', (e) => {
      const updatedString =
        e.target.value.substring(0, e.target.selectionStart) +
        (e.data ? e.data : '') +
        e.target.value.substring(e.target.selectionEnd, e.target.value.length)

      if (!regex.test(updatedString) || isNaN(updatedString)) {
        e.preventDefault()
        return
      }
    })
  },
  methods: {
    format(val) {
      if (!val) {
        return null
      }

      const [integerNumber, decimal] = String(val).split('.')
      const formattedValue = new BigNumber(integerNumber).toFormat()

      if (!decimal) {
        return formattedValue
      }

      return formattedValue + '.' + decimal
    },
  },
})
</script>
