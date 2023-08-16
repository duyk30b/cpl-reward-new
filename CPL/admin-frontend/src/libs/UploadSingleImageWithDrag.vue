<template>
  <el-upload
    ref="form"
    drag
    :action="buildUrl(baseUrl, action)"
    :method="method"
    :headers="headers"
    :before-upload="beforeUpload"
    :on-success="onSuccess"
    :on-error="onError"
    :on-remove="() => (inputVal = '')"
    accept=".jpg,.png,.jpeg"
  >
    <template v-if="!inputVal">
      <el-icon class="el-icon--upload"><upload-filled /></el-icon>
      <div class="el-upload__text px-15 pb-10">
        {{ $t('dropFileHereOrClickToUpload') }}
      </div>
    </template>
    <template v-else>
      <img class="img-auto-height" :src="inputVal" />
    </template>
  </el-upload>
  <error-display
    v-for="(e, key) in errors"
    :key="key"
    :message="e"
  ></error-display>
</template>

<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import CONFIG from '@/config'
import JwtService from '@/core/services/JwtService'
import { buildUrl, formatServerErrors } from '@/core/helpers/common.helper'
import ErrorDisplay from '@/components/ErrorDisplay.vue'

const defaultGetUrlFunction = (response) => response.data

export default defineComponent({
  name: 'upload-single-image-with-drag',
  components: { ErrorDisplay },
  props: {
    action: String,
    method: {
      type: String,
      default: 'post',
    },
    name: {
      type: String,
      default: 'file',
    },
    modelValue: {
      type: String,
      default: '',
    },
    getUrlFunction: null,
  },
  computed: {
    inputVal: {
      get() {
        return this.modelValue || ''
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
    _getUrlFunction() {
      return this.getUrlFunction || defaultGetUrlFunction
    },
    headers() {
      return {
        Authorization: `Bearer ${this.token}`,
      }
    },
  },
  data() {
    return {
      baseUrl: CONFIG.API_URL,
      token: JwtService.getToken(),
      errors: {} as any,
    }
  },
  methods: {
    buildUrl,
    beforeUpload() {
      this.token = JwtService.getToken()
      ;(this.$refs.form as any).clearFiles()
    },
    onSuccess(response) {
      this.inputVal = this._getUrlFunction(response)
    },
    onError(e: Error) {
      try {
        const detail = JSON.parse(e.message)
        this.$toastr.error(this.$t(detail.message))
        this.errors = formatServerErrors(detail.errors)
      } catch (err) {
        this.$toastr.error(this.$t('serverError'))
      }
    },
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-upload-dragger {
  width: unset !important;
  height: unset !important;
  max-width: 100%;
}
</style>
