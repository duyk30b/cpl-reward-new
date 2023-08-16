<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'big-category-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="bigCategoryForm">
        <div class="row g-xl-8">
          <div class="mb-5 flex-stack">
            <label for="language_key" class="form-label">
              {{ $t('setting.key') }}
            </label>
            <router-link
              class="create-key cursor-pointer"
              :to="{ name: 'languageSetting.list' }"
            >
              (Create new key)
            </router-link>
            <el-autocomplete
              v-model="editBigCategory.language_key"
              :fetch-suggestions="querySearch"
              :trigger-on-focus="true"
              :placeholder="$t('setting.keyLanguageSelect')"
              @change="handleSelect"
              @select="handleSelect"
              class="d-block"
            />
            <Field
              name="language_key"
              type="text"
              as="input"
              v-model="editBigCategory.language_key"
              class="form-control hide-input"
              :rules="`required|contains:${listKeys}`"
            >
            </Field>
            <ErrorMessage name="language_key" class="text-danger" />
          </div>
        </div>
        <template v-if="editBigCategory.language_key">
          <div class="row g-xl-8" v-for="(item, i) in languages" :key="i">
            <div class="flex-stack">
              <label for="language" class="form-label mt-1 text-uppercase">
                {{ item.key }}
              </label>
              <input
                name="language"
                class="form-control"
                type="text"
                v-model="item.value"
                readonly
                disabled
              />
            </div>
          </div>
        </template>
        <div class="row g-xl-8 mt-2">
          <div class="flex-stack">
            <label for="status" class="form-label">
              {{ $t('setting.status') }}
            </label>
            <div class="form-switch">
              <input
                name="status"
                class="form-check-input"
                type="checkbox"
                v-model="editBigCategory.status"
                true-value="1"
                false-value="0"
              />
              <label class="form-check-label" for="status"></label>
            </div>
          </div>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="submitForm">
        {{ $t('setting.saveCategory') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import {
  GetListLanguageRequest,
  LanguageItemDto,
} from '@/models/setting-exchange/Language'
import {
  BigCategory,
  CreateBigCategory,
  UpdateBigCategory,
} from '@/models/setting-exchange/CategorySetting'
import { HttpStatus } from '@/core/variables/common.enum'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { maxBy } from 'lodash'
import { CategoryTranslateState } from '@/store/state/translate.state'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'edit-big-category-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    bigCategory: {
      type: Object,
      default: () => {
        return {
          language_key: '',
          status: 0,
          index: 0,
        }
      },
    },
    bigCategoryList: {
      type: Array,
      default: () => {
        return [] as BigCategory[]
      },
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
      editBigCategory: this.bigCategory,
      languages: [] as Array<{ [key: string]: string }>,
      listKeys: [] as Array<string>,
    }
  },
  mounted() {
    ////
    if (this.bigCategory.language_key) {
      this.listKeys = [this.bigCategory.language_key]
      const translate = this.categoryTranslateState.translates.find(
        (item) =>
          item.key.toUpperCase() ===
          this.bigCategory.language_key?.toUpperCase(),
      )
      if (!translate) return

      this.fillData(translate)
    }
  },
  computed: {
    modalTitle() {
      return this.isNew
        ? 'setting.bigCategoryAddTitle'
        : 'setting.bigCategoryEditTitle'
    },
    categoryTranslateState(): CategoryTranslateState {
      return this.$store.getters.categoryTranslatesState
    },
    listCodeLanguagesActive(): string[] {
      return this.$store.getters.codeLanguagesActive
    },
  },
  methods: {
    handleSelect(item) {
      this.fillData(item.data)
    },
    async querySearch(keyword: string, cb) {
      const translates: any[] = await this.getTranslatesByKey(keyword).then(
        (result) =>
          result.map((item) => ({
            data: item,
            value: item.key,
          })),
      )
      this.listKeys = translates.map((item) => item.value)
      cb(translates)
    },
    fillData(item: LanguageItemDto) {
      if (!item) {
        return
      }
      this.editBigCategory['language_key'] = item.key
      const plainLanguage = instanceToPlain(item)
      if (plainLanguage['key']) {
        delete plainLanguage['key']
      }

      this.languages = this.listCodeLanguagesActive.map((item) => ({
        key: item,
        value: plainLanguage[item] || '',
      }))
    },
    async getTranslatesByKey(languageKey: string): Promise<LanguageItemDto[]> {
      const response = await SettingExchangeService.getLanguage(
        plainToInstance(
          GetListLanguageRequest,
          {
            key: languageKey,
          },
          { exposeDefaultValues: true },
        ),
      )
      if (response.status !== HttpStatus.OK) return []

      const translates: LanguageItemDto[] = response.data?.data || []

      return translates.filter((translate) =>
        translate.key.toUpperCase().includes(languageKey.toUpperCase()),
      )
    },
    close() {
      this.$emit('close')
    },
    async submitForm() {
      const form = await (this.$refs.bigCategoryForm as any).validate()
      if (!form.valid) {
        return
      }

      let result: any
      if (this.isNew) {
        const categoryIndex = this.bigCategoryList?.length
          ? (maxBy(this.bigCategoryList, 'index') as BigCategory)?.index + 1
          : this.bigCategoryList?.length || 0

        result = await SettingExchangeService.postCategorySetting(
          plainToInstance(
            CreateBigCategory,
            {
              ...this.editBigCategory,
              status: Number(this.editBigCategory.status) || 0,
              index: categoryIndex,
            },
            { excludeExtraneousValues: true },
          ),
        )
      } else {
        result = await SettingExchangeService.patchCategorySetting(
          plainToInstance(
            UpdateBigCategory,
            {
              ...this.editBigCategory,
              status: Number(this.editBigCategory.status) || 0,
            },
            { excludeExtraneousValues: true },
          ),
        )
      }
      if (result.status != HttpStatus.OK) {
        if (result.data && result.data.message) {
          return this.$toastr.error(result.data.message)
        }
        return this.$toastr.error(this.$t('setting.saveCategoryError'))
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
      this.close()
      // Refresh category translate from cache
      this.$store.dispatch(Actions.FETCH_CATEGORY_TRANSLATES)

      this.$emit('updated')
    },
  },
})
</script>

<style lang="scss" scoped>
.hide-input {
  display: none;
}
.create-key {
  padding-left: 8px;
}
</style>
