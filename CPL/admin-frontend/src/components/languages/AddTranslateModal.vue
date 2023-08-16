<template>
  <BaseModal
    :title="$t('languageSetting.addTranslate')"
    :show="show"
    @close="close"
    :dialog-class="`modal-lg`"
  >
    <template v-slot:body>
      <form ref="translateForm" @submit="saveTranslate">
        <div class="form-group row">
          <div class="col-lg-6">
            <label for="key" class="form-label required">
              {{ $t('languageSetting.key') }} :
            </label>
            <input
              required
              type="text"
              class="form-control form-control-sm px-5"
              name="name"
              v-model="addTranslate.key"
              maxlength="255"
            />
          </div>
        </div>

        <div class="form-group row">
          <label class="form-label">
            {{ $t('languageSetting.content') }} :
          </label>
          <div
            class="col-lg-12"
            v-for="language of activeLanguages"
            :key="language"
          >
            <label
              class="col-lg-12 fw-bold text-muted mt-2"
              :class="{
                required: ['en', 'ja'].includes(language.languageCode),
              }"
            >
              {{ language.name }}
            </label>
            <textarea
              :required="
                ['en', 'ja'].includes(language.languageCode) ? `required` : null
              "
              type="text"
              class="form-control form-control-lg px-5"
              name="en_content"
              maxlength="65535"
              v-model="addTranslate[language.languageCode]"
              rows="10"
            />
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
import { HttpStatus } from '@/core/variables/common.enum'
import { MultiLanguageService } from '@/services/MultiLanguageService'

export default defineComponent({
  name: 'add-translate-modal',
  components: { BaseModal },
  computed: {
    addTranslate() {
      const translates = { key: '' }
      for (const language of this.activeLanguages) {
        translates[language.languageCode] = ''
      }
      return translates
    },
  },
  props: {
    show: Boolean,
    activeLanguages: null,
  },
  data() {
    return {
      loading: false,
      listCodeLanguages: JSON.parse(
        window.localStorage.getItem('list-code-languages') || '{}',
      ),
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submitForm() {
      const translateForm = this.$refs.translateForm as HTMLFormElement
      translateForm.requestSubmit()
    },
    async saveTranslate(e) {
      e.preventDefault()
      this.loading = true
      const credentials = {
        key: this.addTranslate.key,
        translates: {},
      }
      for (const language of this.activeLanguages) {
        credentials.translates[language.languageCode] =
          this.addTranslate[language.languageCode]
      }
      const result = await MultiLanguageService.setTranslate(credentials)
      this.loading = false

      if (result.status !== HttpStatus.CREATED) {
        return this.$toastr.error(
          this.$t('languageSetting.createTranslateFailed'),
        )
      }

      this.$toastr.success(this.$t('languageSetting.createTranslateSuccess'))
      this.$emit('updated')
      return this.close()
    },
  },
})
</script>
