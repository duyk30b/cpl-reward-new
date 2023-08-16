<template>
  <Form @submit="submit" v-slot="{ meta: formMeta, errors }" ref="formEl">
    <base-modal
      dialogClass="modal-xl"
      :show="show"
      @close="close"
      title="menu.systemPushNotificationSetting"
    >
      <template v-slot:body>
        <div
          class="d-flex align-items-center justify-content-center py-8"
          v-if="loading.setting || loading.types || loading.lang"
        >
          <i class="fas fa-spinner fa-spin me-1"></i> {{ $t('loading') }}
        </div>
        <template v-if="!loading.setting && !loading.types && !loading.lang">
          <div class="row border-bottom align-items-center mb-5 pb-5">
            <div class="col-lg-8 mb-3">
              <div class="d-flex align-items-center">
                <label class="me-5">{{ $t('type') }}</label>
                <input
                  class="form-control flex-grow-1"
                  :value="form.type"
                  disabled
                />
              </div>
            </div>
            <div class="col-lg-4 mb-3">
              <el-switch
                class="mx-2"
                v-model="form.isActive"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                inline-prompt
                :active-icon="Check"
                :inactive-icon="Close"
              />
              {{ $t('active') }}
            </div>
          </div>
          <div class="row">
            <div class="col-lg-8 mb-3">
              <ul
                class="nav nav-stretch nav-line-tabs fw-bold border-bottom"
                role="tablist"
              >
                <li
                  v-for="(lang, index) in supportedLangs"
                  :key="lang"
                  class="nav-item"
                >
                  <a
                    class="nav-link"
                    :class="{ active: index == 0 }"
                    data-bs-toggle="tab"
                    :href="`#lang-${lang}`"
                    role="tab"
                  >
                    <span
                      :class="{
                        'text-danger':
                          errors[`title.${lang}`] || errors[`content.${lang}`],
                      }"
                    >
                      {{ $t(`lang.${lang}`) }}
                      <i
                        v-if="
                          errors[`title.${lang}`] || errors[`content.${lang}`]
                        "
                        class="fas fa-info-circle"
                      ></i>
                    </span>
                  </a>
                </li>
              </ul>
              <div
                class="tab-content py-8 border-start border-end border-bottom px-6"
              >
                <div
                  class="tab-pane"
                  v-for="(lang, index) in supportedLangs"
                  :key="lang"
                  :class="{ active: index == 0 }"
                  :id="`lang-${lang}`"
                >
                  <Field
                    v-model="form.title[lang]"
                    type="text"
                    :name="`title.${lang}`"
                    v-slot="{ field, errorMessage }"
                    :rules="`required`"
                  >
                    <div class="form-group">
                      <label class="required">{{ $t('title') }}</label>
                      <input class="form-control" v-bind="field" />
                      <error-display :message="errorMessage"></error-display>
                    </div>
                  </Field>
                  <Field
                    v-model="form.content[lang]"
                    type="text"
                    :name="`content.${lang}`"
                    v-slot="{ field, errorMessage }"
                    :rules="`required`"
                  >
                    <div class="form-group">
                      <label class="required">{{ $t('content') }}</label>
                      <textarea
                        rows="3"
                        class="form-control"
                        v-bind="field"
                      ></textarea>
                      <error-display :message="errorMessage"></error-display>
                    </div>
                  </Field>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="fs-3 mb-3">{{ $t('variables') }}</div>
              <div v-if="!getVariables(form?.type)?.length">
                {{ $t('noData') }}
              </div>
              <ul v-if="getVariables(form?.type)?.length">
                <li
                  v-for="variable in getVariables(form?.type)"
                  :key="variable"
                >
                  {{ variable }}
                </li>
              </ul>
            </div>
          </div>
        </template>
      </template>

      <template v-slot:footer>
        <button
          class="btn btn-primary me-2"
          type="submit"
          :disabled="!formMeta.valid || loading.submit"
        >
          <i v-if="loading.submit" class="fas fa-spinner fa-spin me-2"></i>
          {{ $t('submit') }}
        </button>
        <button class="btn btn-secondary" type="button" @click="close">
          {{ $t('cancel') }}
        </button>
      </template>
    </base-modal>
  </Form>
</template>

<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import { Optional } from '@/models/common/Optional'
import { SystemPushNotificationSetting } from '@/models/notification/SystemPushSetting'
import { SystemPushSettingService } from '@/services/SystemPushSettingService'
import { SystemPushSettingType } from '@/models/notification/SystemPushSettingType'
import {
  getSubErrorCode,
  formatServerErrors,
} from '@/core/helpers/common.helper'
import { SubErrorCode } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'update-system-push-setting-modal',
  components: { BaseModal, Form, Field, ErrorDisplay },
  props: {
    show: {
      type: Boolean,
    },
    settingId: null,
  },
  watch: {
    settingId() {
      this.getSetting()
    },
  },
  mounted() {
    this.getData()
  },
  data() {
    return {
      loading: {
        setting: false,
        type: false,
        lang: false,
        submit: false,
      },
      form: null as Optional<SystemPushNotificationSetting>,
      types: [] as SystemPushSettingType[],
      supportedLangs: [] as string[],
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    getVariables(type) {
      if (!type || !this.types.length) return []
      return this.types.find((e) => e.name == type)?.variables || []
    },
    async getData() {
      this.getTypes()
      this.getSupportedLangs()
      this.getSetting()
    },
    async getSetting() {
      if (!this.settingId) return
      this.loading.setting = true
      this.form = await SystemPushSettingService.findById(this.settingId)
      this.loading.setting = false
    },
    async getTypes() {
      this.loading.type = true
      this.types = await SystemPushSettingService.getTypes()
      this.loading.type = false
    },
    async getSupportedLangs() {
      this.loading.lang = true
      this.supportedLangs = await SystemPushSettingService.getSupportedLangs()
      this.loading.lang = false
    },
    async submit() {
      if (!this.form) return
      this.loading.submit = true
      const res = await SystemPushSettingService.updateSetting(
        this.settingId,
        this.form,
      )
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$emit('submited', res)
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          ;(this.$refs.formEl as any).setErrors(formatServerErrors(res.errors))
        }
      }
      this.loading.submit = false
    },
  },
})
</script>
