<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'app-version-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="appVersionForm">
        <div class="row gy-5 g-xl-8 mb-5">
          <div class="token-base">
            <div class="d-flex flex-stack mb-3">
              <div class="me-5 col-sm-4">
                <label class="fs-6 fw-bold">{{ $t('setting.platform') }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="platform"
                  as="select"
                  :disabled="!isNew"
                  v-model="versionItem.platform"
                  class="form-control"
                >
                  <option value="ios">ios</option>
                  <option value="android">android</option>
                </Field>
              </div>
            </div>
            <div class="d-flex flex-stack mb-3">
              <div class="me-5 col-sm-4">
                <label class="fs-6 fw-bold">{{ $t('setting.version') }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="version"
                  as="input"
                  v-model="versionItem.version"
                  :disabled="!isNew"
                  rules="required"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="version" class="text-danger" />
              </div>
            </div>
            <div class="d-flex flex-stack mb-3">
              <div class="me-5 col-sm-4">
                <label class="fs-6 fw-bold">{{
                  $t('setting.releaseDate')
                }}</label>
              </div>
              <div class="col-sm-8 date-app-version">
                <date-picker
                  placeholder="date"
                  v-model="versionItem.release_date"
                ></date-picker>
              </div>
            </div>
            <div class="d-flex flex-stack mb-3">
              <div class="me-5 col-sm-4">
                <label class="fs-6 fw-bold">{{
                  $t('setting.changeLog')
                }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="change_log"
                  as="textarea"
                  rows="5"
                  v-model="versionItem.change_log"
                  rules="required"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="change_log" class="text-danger" />
              </div>
            </div>
            <div class="d-flex flex-stack mb-3">
              <div class="me-5 col-sm-4">
                <label class="fs-6 fw-bold">{{
                  $t('setting.forceUpdate')
                }}</label>
              </div>
              <label
                class="col-md-8 form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="force_update"
                  type="checkbox"
                  v-model="versionItem.force_update"
                  :id="`force_update${ver.verion}`"
                  :true-value="true"
                  :false-value="false"
                />
              </label>
            </div>
          </div>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="submitForm">
        {{ $t('setting.save') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { plainToInstance } from 'class-transformer'
import { PlatformItem } from '@/models/setting-exchange/AppVersion'
import { HttpStatus } from '@/core/variables/common.enum'
import { AppVersionService } from '@/services/AppVersionService'

export default defineComponent({
  name: 'edit-app-verion',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    ver: {
      type: Object,
      default: new PlatformItem(),
    },
    show: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      versionItem: plainToInstance(PlatformItem, this.ver),
    }
  },
  computed: {
    modalTitle() {
      return this.isNew
        ? 'setting.appVersionAddTitle'
        : 'setting.appVersionEditTitle'
    },
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async submitForm() {
      const form = await (this.$refs.appVersionForm as any).validate()
      if (!form.valid) {
        return
      }
      const method = this.isNew ? 'postAppVersion' : 'patchAppVersion'
      const result = await AppVersionService[method](this.versionItem)
      if (result.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.error'))
        return
      }
      this.$toastr.success(this.$t('setting.success'))
      this.close()
      this.$emit('updated')
    },
  },
})
</script>
<style lang="scss" scoped>
.network-item {
  border-bottom: 1px solid lightgray;
}
.date-app-version::v-deep .el-input__inner {
  padding-left: 25px !important;
}
</style>
