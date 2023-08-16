<template>
  <el-select
    ref="select"
    v-model="inputVal"
    :filterable="searchable"
    :placeholder="placeholder"
    @change="select"
    :clearable="canDeselect"
    :disabled="disabled"
    :name="name"
    :multiple="multiple"
    :loading="loading"
    :remote-method="remoteMethod"
    :remote="remote"
    :reserve-keyword="reserveKeyword"
    :collapse-tags="collapseTags"
  >
    <template v-if="isObjectOptions">
      <el-option
        v-for="item in listOptions"
        :key="item[optionValue]"
        :label="
          isTranslate
            ? $t(`${item[optionLabel]}`, {
                otherOption,
              })
            : item[optionLabel]
        "
        :value="item[optionValue]"
      >
      </el-option>
    </template>
    <template v-else>
      <el-option
        v-for="(item, i) in listOptions"
        :key="i"
        :value="item"
      ></el-option>
    </template>
  </el-select>
</template>

<script lang="ts">
import { defineComponent, nextTick } from 'vue'
export default defineComponent({
  name: 'v-select',
  emits: ['change', 'update:modelValue'],
  props: {
    modelValue: {},
    disabled: {
      default: false,
    },
    empty: {
      default: '',
    },
    placeholder: {
      default: '',
    },
    name: {
      default: '',
    },
    options: {
      type: Array,
      default: [] as any,
    },
    searchable: {
      type: Boolean,
      default: false,
    },
    optionLabel: {
      type: String,
      default: 'name',
    },
    optionValue: {
      type: String,
      default: 'id',
    },
    otherOption: {
      type: Object,
    },
    canDeselect: {
      type: Boolean,
      default: true,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    remote: {
      type: Boolean,
      default: false,
    },
    reserveKeyword: {
      type: Boolean,
      default: false,
    },
    collapseTags: {
      type: Boolean,
      default: false,
    },
    sourceFunction: {
      type: Function,
    },
    isTranslate: {
      type: Boolean,
      default: true,
    },
    restoreOptionsKey: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      remoteOptions: [] as any[],
    }
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
    listOptions() {
      return this.remote ? this.remoteOptions : this.options
    },
    isObjectOptions() {
      if (!this.listOptions || !this.listOptions.length) return false
      return typeof this.listOptions[0] == 'object'
    },
  },
  async mounted() {
    if (this.remote) {
      await this.remoteMethod()
      if (this.restoreOptionsKey) {
        const savedOptions = JSON.parse(
          localStorage.getItem(this.restoreOptionsKey) || '[]',
        )
        savedOptions.forEach((o) => {
          if (
            !this.isEmptyOption(o) &&
            !this.remoteOptions.find((e) => this.isSameOption(e, o))
          ) {
            this.remoteOptions.push(o)
          }
        })
      }
    }
  },
  methods: {
    async remoteMethod(text = '') {
      if (!this.sourceFunction) return
      this.loading = true
      this.remoteOptions = await this.sourceFunction(text)
      this.loading = false
    },
    select(e) {
      this.$emit('change', e)
      this.saveSelectedOptions()
    },
    async saveSelectedOptions() {
      if (this.remote && this.restoreOptionsKey) {
        const selectedOptions = await this.getSelectedOptions()
        localStorage.setItem(
          this.restoreOptionsKey,
          JSON.stringify(selectedOptions),
        )
      }
    },
    async getSelectedOptions() {
      return new Promise((resolve) => {
        nextTick(() => {
          const selectEl = this.$refs.select as any
          if (!selectEl?.selected) return []
          let result = [] as any[]
          if (this.multiple) {
            result = selectEl.selected
          } else {
            result = [selectEl.selected]
          }
          if (this.isObjectOptions) {
            result = result.map((e) => ({
              [this.optionLabel as string]: e.currentLabel,
              [this.optionValue as string]: e.value,
            }))
          } else {
            result = result.map((e) => e.value)
          }
          resolve(result)
        })
      })
    },
    isSameOption(option1, option2) {
      if (this.isObjectOptions) {
        return option1[this.optionValue] == option2[this.optionValue]
      }
      return option1 == option2
    },
    isEmptyOption(option) {
      if (this.isObjectOptions) {
        return !option[this.optionValue]
      }
      return !option
    },
  },
})
</script>
