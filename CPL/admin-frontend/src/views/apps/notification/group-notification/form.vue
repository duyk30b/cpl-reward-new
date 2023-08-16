<template>
  <Form @submit="submit" v-slot="{ errors }" ref="formEl">
    <div
      class="d-flex align-items-center justify-content-center py-8"
      v-if="loadingNotification || loading.lang || loading.categories || !form"
    >
      <i class="fas fa-spinner fa-spin me-1"></i> {{ $t('loading') }}
    </div>
    <template v-else>
      <div class="row">
        <div class="col-xl-4">
          <div class="text-center">
            <upload-single-image-with-drag
              action="notification/upload-image"
              v-model="form.image"
            ></upload-single-image-with-drag>
          </div>
          <error-display :message="errors['image']"></error-display>
        </div>
        <div class="col-xl-8">
          <div class="form-group row">
            <div class="col-sm-3 d-flex align-items-center">
              {{ $t('active') }}
            </div>
            <div class="col-9">
              <el-switch
                v-model="form.isActive"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                inline-prompt
                :active-icon="Check"
                :inactive-icon="Close"
              />
            </div>
          </div>

          <div class="form-group row">
            <div class="col-sm-3 d-flex align-items-center">
              {{ $t('pushNotification') }}
            </div>
            <div class="col-9">
              <el-switch
                :disabled="form.isPublished"
                v-model="form.needSendPush"
                style="
                  --el-switch-on-color: #13ce66;
                  --el-switch-off-color: #ff4949;
                "
                inline-prompt
                :active-icon="Check"
                :inactive-icon="Close"
              />
            </div>
          </div>

          <div class="form-group row">
            <div class="col-sm-3 d-flex align-items-center">
              {{ $t('category') }}
            </div>
            <div class="col-9">
              <v-select
                :options="_notificationCategories"
                option-value="id"
                option-label="name"
                :placeholder="$t('category')"
                v-model="form.notificationCategoryId"
                :can-deselect="true"
              ></v-select>
              <error-display
                :message="errors[`notificationCategoryId`]"
              ></error-display>
            </div>
          </div>

          <div class="form-group row">
            <div class="col-sm-3 d-flex align-items-center">
              {{ $t('publish') }}
            </div>
            <div class="col-9">
              <div class="d-flex align-items-center flex-wrap">
                <template v-if="!form.isPublishTimePassed">
                  <label class="me-6 d-flex align-items-center">
                    <input
                      @change="form.publishAt = null"
                      type="radio"
                      class="me-3"
                      :value="true"
                      name="publishAt"
                      v-model="form.isPublishNow"
                    />
                    {{ $t('now') }}
                  </label>
                  <label class="me-3 d-flex align-items-center">
                    <input
                      @change="form.publishAt = null"
                      type="radio"
                      class="me-3"
                      :value="false"
                      name="publishAt"
                      v-model="form.isPublishNow"
                    />
                    {{ $t('laterAt') }}
                  </label>
                  <Field
                    v-model="form.publishAt"
                    name="publishAt"
                    v-slot="{ handleChange, value, field }"
                    :rules="`afterOrEqualNow`"
                  >
                    <date-picker
                      :disabledDate="disabledDate"
                      class="publish-at-picker"
                      v-bind="field"
                      :modelValue="value"
                      @update:modelValue="handleChange"
                      :mode="DatePickerMode.DATETIME"
                      inputFormat="YYYY/MM/DD HH:mm"
                      outputFormat="x"
                      :disabled="form.isPublishNow"
                    ></date-picker>
                  </Field>
                </template>
                <template v-else>
                  {{ $filters.convertTimestampToDate(form.publishAt) }}
                </template>
              </div>
              <error-display :message="errors[`publishAt`]"></error-display>
            </div>
          </div>

          <div class="form-group row" v-if="form.pushSentAt">
            <div class="col-sm-3 d-flex align-items-center">
              {{ $t('pushSentAt') }}
            </div>
            <div class="col-9">
              {{ $filters.convertTimestampToDate(form.pushSentAt) }}
            </div>
          </div>

          <div class="form-group row" v-if="form.mailSentAt">
            <div class="col-sm-3 d-flex align-items-center">
              {{ $t('mailSentAt') }}
            </div>
            <div class="col-9">
              {{ $filters.convertTimestampToDate(form.mailSentAt) }}
            </div>
          </div>
        </div>
      </div>

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
                  errors[`title.${lang}`] ||
                  errors[`content.${lang}`] ||
                  errors[`pushSchedule.content.${lang}`],
              }"
            >
              {{ $t(`lang.${lang}`) }}
              <i
                v-if="
                  errors[`title.${lang}`] ||
                  errors[`content.${lang}`] ||
                  errors[`pushSchedule.content.${lang}`]
                "
                class="fas fa-info-circle"
              ></i>
            </span>
          </a>
        </li>
      </ul>
      <div class="tab-content py-8 border-start border-end border-bottom px-6">
        <div
          class="tab-pane"
          v-for="(lang, index) in supportedLangs"
          :key="lang"
          :class="{ active: index == 0 }"
          :id="`lang-${lang}`"
        >
          <Field
            v-model="form.title[lang]"
            :name="`title.${lang}`"
            v-slot="{ field }"
            :rules="`maxLength:250`"
          >
            <div class="form-group">
              <label class="required">{{ $t('title') }}</label>
              <input type="text" class="form-control" v-bind="field" />
              <error-display :message="errors[`title.${lang}`]"></error-display>
            </div>
          </Field>

          <div class="form-group">
            <label class="required">{{ $t('contentForWeb') }}</label>
            <rich-text v-model="form.content[lang]"></rich-text>
            <error-display :message="errors[`content.${lang}`]"></error-display>
          </div>

          <div class="form-group" v-if="form.needSendPush">
            <Field
              v-model="form.pushSchedule.content[lang]"
              :name="`pushSchedule.content.${lang}`"
              v-slot="{ field }"
              :rules="`maxLength:250`"
            >
              <label class="required">{{
                $t('contentForPushNotification')
              }}</label>
              <textarea class="form-control" v-bind="field"></textarea>
              <error-display
                :message="errors[`pushSchedule.content.${lang}`]"
              ></error-display>
            </Field>
          </div>
        </div>
      </div>
      <div class="mt-5">
        <button
          class="btn btn-primary me-2"
          type="submit"
          :disabled="loadingSubmit"
        >
          <i v-if="loadingSubmit" class="fas fa-spinner fa-spin me-2"></i>
          {{ $t('submit') }}
        </button>
        <button class="btn btn-secondary" type="button" @click="$router.back()">
          {{ $t('cancel') }}
        </button>
      </div>
    </template>
  </Form>
</template>

<script setup lang="ts">
import { Check, Close } from '@element-plus/icons-vue'
</script>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import { NotificationService } from '@/services/NotificationService'
import { NotificationCategoryService } from '@/services/NotificationCategoryService'
import {
  GroupNotification,
  NotificationCategory,
} from '@/models/notification/Notification'
import { formatServerErrors } from '@/core/helpers/common.helper'
import { DatePickerMode } from '@/libs/DatePicker.vue'
import { MultiLanguageService } from '@/services/MultiLanguageService'
import { useI18n } from 'vue-i18n'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'group-notification-form',
  emits: ['update:modelValue', 'submit'],
  components: { Form, ErrorDisplay, Field },
  props: {
    loadingNotification: {
      type: Boolean,
      default: false,
    },
    loadingSubmit: {
      type: Boolean,
      default: false,
    },
    modelValue: {} as PropType<GroupNotification>,
    errors: null,
  },
  created() {
    this.getData()
  },
  watch: {
    errors() {
      ;(this.$refs.formEl as any).setErrors(formatServerErrors(this.errors))
    },
  },
  data() {
    return {
      loading: {
        lang: false,
        categories: false,
      },
      notificationCategories: [] as NotificationCategory[],
      categoryTranslates: {} as Record<string, any>,
      supportedLangs: [] as string[],
      disabledDate: (time: Date) => {
        return time.getTime() < new Date().setHours(0, 0, 0, 0)
      },
      DatePickerMode,
    }
  },
  computed: {
    form: {
      get() {
        return this.modelValue || new GroupNotification()
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
    _notificationCategories() {
      const i18n = useI18n()
      const currentLang = i18n.locale.value
      return this.notificationCategories.map((category) => ({
        id: category.id,
        name:
          this.categoryTranslates[category.name]?.[currentLang] ||
          this.categoryTranslates[category.name]?.['en'] ||
          category.name,
      }))
    },
  },
  methods: {
    async getData() {
      this.getCategories()
      this.getSupportedLangs()
    },
    async getCategories() {
      this.loading.categories = true
      const res = await NotificationCategoryService.getList()
      this.notificationCategories = res.data?.data || []
      const keys = this.notificationCategories.map((category) => category.name)
      const translates = await MultiLanguageService.getTranslatesByKeys({
        keys,
      })
      if (translates.status == HttpStatus.OK) {
        this.categoryTranslates = translates.data.reduce(
          (acc, cur) => ({ ...acc, [cur.key]: cur.translates }),
          {},
        )
      }
      this.loading.categories = false
    },
    async getSupportedLangs() {
      this.loading.lang = true
      this.supportedLangs = await NotificationService.getSupportedLangs()
      this.loading.lang = false
    },
    async submit() {
      this.$emit('submit', this.form)
    },
  },
})
</script>

<style lang="scss" scoped>
::v-deep .el-date-editor.publish-at-picker {
  width: unset !important;
  flex-grow: 1;
}
</style>
