<template>
  <BaseModal
    :title="$t('languageSetting.editLanguage')"
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
              v-model="editLanguage.language_code"
              option-value="key"
              option-label="value"
              :disabled="true"
            >
            </v-select>
          </div>
          <div class="col-lg-6">
            <label for="key" class="form-label required">
              {{ $t('languageSetting.languageName') }}
            </label>
            <input
              type="text"
              class="form-control px-5"
              name="name"
              v-model="editLanguage.name"
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
import { LanguageSetting } from '@/core/data/language/language-setting'
import _ from 'lodash'

export default defineComponent({
  name: 'edit-language-modal',
  components: { BaseModal },
  props: {
    show: Boolean,
    language: {
      type: LanguageSetting,
      default: new LanguageSetting(),
    },
  },
  beforeMount() {
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
      editLanguage: this.language,
      loading: false,
      validateResult: {
        languageName: '',
      },
    }
  },
  methods: {
    resetValidateResult() {
      this.validateResult = {
        languageName: '',
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
    async saveLanguage(e) {
      e.preventDefault()
      this.loading = true
      const result = await MultiLanguageService.setLanguage({
        language_code: this.editLanguage?.language_code,
        language_name: this.editLanguage?.name,
        is_active: this.editLanguage?.is_active,
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
          this.$t('languageSetting.updateLanguageFailed'),
        )
      }

      this.$toastr.success(this.$t('languageSetting.updateLanguageSuccess'))
      this.$emit('created')
      this.resetValidateResult()
      return this.close()
    },
  },
})
</script>
