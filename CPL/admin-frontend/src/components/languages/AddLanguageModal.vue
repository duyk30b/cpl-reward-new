<template>
  <BaseModal
    :title="$t('languageSetting.addLanguage')"
    :show="show"
    @close="close"
    :dialog-class="`modal-xl`"
  >
    <template v-slot:body>
      <form ref="languageForm" @submit="saveLanguage">
        <div class="form-group row">
          <div class="col-lg-6">
            <label for="key" class="form-label required">
              {{ $t('languageSetting.languageCode') }}
            </label>
            <v-select
              :options="languagesData"
              v-model="languageData.code"
              option-value="key"
              option-label="value"
              :can-deselect="false"
              @change="changeLanguageCode"
              searchable
              :class="{
                'input-language-fail': validateResult.languageCode !== '',
              }"
            >
            </v-select>
            <span
              style="color: red"
              v-if="validateResult.languageCode !== ''"
              >{{ validateResult.languageCode }}</span
            >
          </div>
          <div class="col-lg-6">
            <label for="key" class="form-label required">
              {{ $t('languageSetting.languageName') }}
            </label>
            <input
              type="text"
              class="form-control px-5"
              name="name"
              v-model="languageData.name"
              maxlength="255"
              :class="{
                'input-language-fail': validateResult.languageName !== '',
              }"
            />
            <span
              style="color: red"
              v-if="validateResult.languageName !== ''"
              >{{ validateResult.languageName }}</span
            >
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        @click="submitForm"
        :data-kt-indicator="loading ? 'on' : ''"
        :disabled="loading"
      >
        {{ $t('save') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { MultiLanguageService } from '@/services/MultiLanguageService'
import { HttpStatus } from '@/core/variables/common.enum'
import _ from 'lodash'

export default defineComponent({
  name: 'add-language-modal',
  components: { BaseModal },
  props: {
    show: Boolean,
  },
  async beforeMount() {
    const result = await MultiLanguageService.getCodeLanguages({
      type: '',
    })
    const existLanguages =
      result.data === undefined || result.data.length === 0 ? [] : result.data
    this.languagesData = this.languagesData.filter(
      (language) => !existLanguages.includes(language.key),
    )
    this.resetValidateResult()
  },
  data() {
    return {
      languagesData: _.map(
        JSON.parse(window.localStorage.getItem('list-code-languages') || '{}'),
        (value, key) => {
          return { key, value: `${value} - ${key}`, name: value }
        },
      ),
      loading: false,
      languageData: {
        code: '',
        name: '',
      },
      validateResult: {
        languageCode: '',
        languageName: '',
      },
    }
  },
  methods: {
    changeLanguageCode(currentValue) {
      for (let key in this.languagesData) {
        const language = this.languagesData[key]
        if (language.key === currentValue)
          this.languageData.name = language.name
      }
    },
    close() {
      this.$emit('close')
    },
    submitForm() {
      this.resetValidateResult()
      const languageForm = this.$refs.languageForm as HTMLFormElement
      languageForm.requestSubmit()
    },
    resetValidateResult() {
      this.validateResult = {
        languageCode: '',
        languageName: '',
      }
    },
    async saveLanguage(e) {
      e.preventDefault()
      this.loading = true
      const result = await MultiLanguageService.setLanguage({
        language_code: this.languageData.code,
        language_name: this.languageData.name,
      })
      this.loading = false

      if (result.status !== HttpStatus.CREATED) {
        const data = result.data
        if (
          data.status_code === HttpStatus.BAD_REQUEST &&
          data.message === 'VALIDATION.FAIL'
        ) {
          const errors = data.errors
          for (const error of errors) {
            this.validateResult[error.property] = error.msg
          }
        }
        return this.$toastr.error(
          this.$t('languageSetting.createLanguageFailed'),
        )
      }

      this.$toastr.success(this.$t('languageSetting.createLanguageSuccess'))
      this.$emit('created')
      this.resetValidateResult()
      return this.close()
    },
  },
})
</script>

<style lang="scss">
.input-language-fail,
.input-language-fail input {
  border-color: red;
}
</style>
