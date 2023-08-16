<template>
  <div>
    <label v-if="label" :id="name" class="label">{{ getLabel }}</label>
    <div
      class="input-wrapper"
      :style="{ backgroundColor: disabled ? '#cfcfcf' : '' }"
    >
      <input
        :style="{
          textAlign: textAlign === 'left' ? 'left' : 'right',
          fontWeight: fw,
        }"
        :name="name"
        type="text"
        v-model="inputVal"
        :maxlength="maxLength"
        :placeholder="placeholder ? getLabel : ''"
        :disabled="disabled"
        :readonly="readonly"
      />
      <div v-if="suffix" class="suffix">{{ $t(getSuffix) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  emits: ['update:modelValue'],
  name: 'CustomInputText',
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
      default: '',
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
      default: '',
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
      type: String,
    },
    fw: {
      type: Number,
      default: 700,
    },
    readonly: {
      type: Boolean,
      default: false,
    }
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
}
</style>
