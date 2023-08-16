<template>
  <el-select
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
  >
    <template v-if="isObjectOptions">
      <el-option
        v-for="item in listOptions"
        :key="item[optionValue]"
        :label="$t(`${item[optionLabel]}`)"
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
import { defineComponent } from 'vue'
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
    },
    optionValue: {
      type: String,
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
    sourceFunction: {
      type: Function,
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
  mounted() {
    if (this.remote) this.remoteMethod()
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
    },
  },
})
</script>
