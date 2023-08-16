<template>
  <div class="form-group" :class="{ 'has-error': !!errorMessage }">
    <label :for="name">{{ getLabel }}</label>
    <div
      class="input-wrapper"
      :style="{ backgroundColor: disabled ? '#cfcfcf' : '' }"
    >
      <imask-input
        :name="name"
        v-model:value="inputVal"
        :mask="mask"
        :disabled="disabled"
        placeholder=""
        class="text-right"
        ref="refInput"
      />
      <div v-if="suffix" class="suffix" @click="focusInput">
        {{ t(suffix) }}
      </div>
    </div>

    <p class="text-danger" v-show="errorMessage || meta.valid">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script>
import { ref, toRef, computed, nextTick } from 'vue'
import { useField } from 'vee-validate'
import { useI18n } from 'vue-i18n/index'
import { IMaskComponent } from 'vue-imask'

export default {
  components: { 'imask-input': IMaskComponent },
  emits: ['update:modelValue'],
  props: {
    type: {
      type: String,
      default: 'text',
    },
    modelValue: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    suffix: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const name = toRef(props, 'name')
    const {
      value: inputValue,
      errorMessage,
      handleBlur,
      handleChange,
      meta,
    } = useField(name, undefined, {
      initialValue: props.value,
    })

    const { t } = useI18n()
    const getLabel = computed(() => t(props.label))

    const inputVal = computed({
      get() {
        return props.modelValue
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const mask = /^([1-9]\d{0,5}|0)(\.\d{0,8})?$/

    const refInput = ref(null)

    const focusInput = () => refInput.value.$el.focus()

    return {
      handleChange,
      handleBlur,
      errorMessage,
      inputValue,
      meta,
      getLabel,
      mask,
      t,
      focusInput,
      refInput,
      inputVal,
    }
  },
}
</script>

<style lang="scss" scoped>
label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
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
  .text-right {
    text-align: right;
    padding-right: 4px;
  }
}
</style>
