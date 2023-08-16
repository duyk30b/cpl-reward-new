<template>
  <div>
    <label v-if="label" :id="name" class="label"
      >{{ getLabel }} <span class="required" v-if="required"></span>
    </label>
    <div
      class="input-wrapper"
      :style="{ backgroundColor: disabled ? '#cfcfcf' : '' }"
    >
      <input
        :style="{
          textAlign: textAlign === 'left' ? 'left' : 'right',
          ...inputClass,
        }"
        @blur="handleBlur"
        :required="required"
        :name="name"
        type="text"
        v-model="inputVal"
        :maxlength="maxLength"
        :placeholder="placeholder ? getLabel : ''"
        :disabled="disabled"
        :onkeypress="type === 'number' && onlyNumberKey"
      />
      <div v-if="suffix" class="suffix">{{ $t(getSuffix) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BigNumber from 'bignumber.js'

export default defineComponent({
  emits: ['update:modelValue'],
  name: 'CustomInput',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    maxLength: {
      type: String,
      default: '16',
    },
    suffix: {
      type: String,
    },
    label: {
      type: String,
    },
    name: {
      type: String,
    },
    subtrans: {
      type: String,
      default: '',
    },
    subtransValue: {
      type: String,
    },
    type: {
      type: String,
      default: '',
    },
    textAlign: {
      type: String,
      default: 'right',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: Object,
    },
    required: {
      type: Boolean,
    },
    isPositive: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    getSuffix() {
      return this.suffix
    },
    getLabel() {
      return this.$t(this.label || '', {
        [this.subtrans]: this.subtransValue,
      })
    },
    inputVal: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
  methods: {
    handleBlur() {
      this.inputVal = this.inputVal
        ? new BigNumber(this.inputVal.replaceAll(',', '')).toFormat()
        : ''
    },
    onlyNumberKey(evt) {
      const ASCIICode = evt.which ? evt.which : evt.keyCode
      if (this.type === 'number' && this.isPositive) {
        return ASCIICode === 46 || (ASCIICode >= 48 && ASCIICode <= 57)
      }
      // Only ASCII character in that range allowed
      if (ASCIICode < 40 || ASCIICode > 57) return false
      return true
    },
  },
})
</script>
<style lang="scss" scoped>
label {
  margin-bottom: 1rem;
}
.input-wrapper {
  display: flex;
  border-radius: 0.475rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid #e4e6ef;
  input {
    font-weight: 700;
    width: 100%;
    outline: none;
    border: none;
  }
  input::placeholder {
    font-weight: 500;
    font-size: 14px;
    color: #ccc;
  }
  input:disabled {
    background-color: #cfcfcf;
  }
  .suffix {
    color: gray;
  }
  .required {
    color: red;
  }
}
</style>
