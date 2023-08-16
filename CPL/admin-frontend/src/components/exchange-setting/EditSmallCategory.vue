<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'small-category-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="smallCategoryForm">
        <div class="row gy-5 g-xl-8">
          <div class="flex-stack">
            <div class="me-5">
              <label class="fs-6 fw-bold mb-2">
                {{ $t('setting.bigCategory') }}
              </label>
              <router-link
                class="create-key cursor-pointer"
                :to="{ name: 'languageSetting.list' }"
              >
                (Create new key)
              </router-link>
            </div>
            <v-select
              :options="bigCategoryOptions"
              option-value="value"
              option-label="name"
              placeholder="Choose a big category"
              v-model="bigCategoryIdSelected"
              searchable
              :can-deselect="false"
              :disabled="!isNew"
            ></v-select>
            <Field
              name="bigCategory"
              type="text"
              as="input"
              rules="required"
              v-model="bigCategoryIdSelected"
              class="form-control hide-input"
            />
            <ErrorMessage name="bigCategory" class="text-danger" />
          </div>
          <div class="flex-stack">
            <div class="me-5">
              <label class="fs-6 fw-bold mb-2">
                {{ $t('setting.key') }}
              </label>
              <router-link
                class="create-key cursor-pointer"
                :to="{ name: 'languageSetting.list' }"
              >
                (Create new key)
              </router-link>
            </div>
            <el-autocomplete
              v-model="smallCategory.language_key"
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
              :rules="`required|contains:${listKeys}`"
              v-model="smallCategory.language_key"
              class="form-control hide-input"
            />
            <ErrorMessage name="language_key" class="text-danger" />
          </div>
          <template v-if="smallCategory.language_key">
            <div class="flex-stack" v-for="(item, i) in languages" :key="i">
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
          <!-- <div class="row g-xl-8 mt-2">
            <div class="flex-stack">
              <label for="status" class="form-label">
                {{ $t('setting.status') }}
              </label>
              <div class="form-switch">
                <input
                  name="status"
                  class="form-check-input"
                  type="checkbox"
                  v-model="smallCategory.status"
                  value="0"
                  true-value="1"
                  false-value="0"
                />
                <label class="form-check-label" for="status"></label>
              </div>
            </div>
          </div> -->
          <PickPairCategory ref="pick_pair" :smallCategory="smallCategory" />
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button :disabled="isLoading" class="btn btn-primary" @click="submitForm">
        {{ $t('setting.saveCategory') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import {
  BigCategory,
  CreateSubCategory,
  SubCategorySetting,
  UpdateSubCategory,
} from '@/models/setting-exchange/CategorySetting'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import PickPairCategory from './PickPairCategory.vue'
import { instanceToPlain, plainToInstance } from 'class-transformer'
import { HttpStatus, PAIR_STATUS } from '@/core/variables/common.enum'
import {
  GetListLanguageRequest,
  LanguageItemDto,
} from '@/models/setting-exchange/Language'
import { cloneDeep, isEmpty } from 'lodash'
import { AxiosResponse } from 'axios'
import { maxBy } from 'lodash'
import { CategoryTranslateState } from '@/store/state/translate.state'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'edit-small-category-modal',
  components: { BaseModal, Form, ErrorMessage, PickPairCategory, Field },
  props: {
    bigCategory: {
      type: BigCategory,
      default: plainToInstance(BigCategory, {
        language_key: '',
        status: PAIR_STATUS.INACTIVE,
        sub_category: [],
      }),
    },
    bigCategoryList: {
      type: [],
      default: [] as Array<BigCategory>,
    },
    smallCategoryIndex: {
      type: Number,
      default: 0,
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
      isLoading: false,
      editBigCategory: {} as BigCategory,
      bigCategoryIdSelected: '' as string,
      smallCategory: {} as UpdateSubCategory,
      languages: [] as Array<{ [key: string]: string }>,
      bigCategoryOptions: [] as Array<{
        name: string
        value: string
      }>,
      listKeys: [] as Array<string>,
    }
  },
  computed: {
    modalTitle() {
      return this.isNew
        ? 'setting.smallCategoryAddTitle'
        : 'setting.smallCategoryEditTitle'
    },
    listCodeLanguagesActive(): string[] {
      return this.$store.getters.codeLanguagesActive
    },
    categoryTranslateState(): CategoryTranslateState {
      return this.$store.getters.categoryTranslatesState
    },
  },
  async mounted() {
    this.handleFillSubCategory()
    this.handleTranslateBigCategory()
  },
  methods: {
    async handleTranslateBigCategory() {
      ;(this.bigCategoryList as unknown as BigCategory[]).forEach((item) => {
        const translate = this.categoryTranslateState.translates.find(
          (t) => t.key === item.language_key,
        )
        if (translate) {
          this.bigCategoryOptions.push({
            name: translate['en'] || item.language_key,
            value: item.id,
          })
        }
      })
    },

    async handleFillSubCategory() {
      if (!this.isNew) {
        this.editBigCategory = cloneDeep(
          plainToInstance(BigCategory, this.bigCategory, {
            excludeExtraneousValues: true,
          }),
        )
        this.smallCategory = plainToInstance(
          SubCategorySetting,
          this.editBigCategory.sub_category[this.smallCategoryIndex],
          {
            excludeExtraneousValues: true,
          },
        )
        this.listKeys = [this.smallCategory.language_key]
        this.bigCategoryIdSelected = this.editBigCategory.id
        this.fetchToFillTranslate()
      }
    },

    async fetchToFillTranslate() {
      if (this.smallCategory.language_key) {
        const translate = this.categoryTranslateState.translates.find(
          (item) =>
            item.key.toUpperCase() ===
            this.smallCategory.language_key?.toUpperCase(),
        )
        if (!translate) return
        this.fillData(translate)
      }
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
    handleSelect(item) {
      if (!item || !item.data || !item.data.key) return

      this.smallCategory.language_key = item.data.key
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
      const plainLanguage = instanceToPlain(item)
      if (plainLanguage['key']) {
        delete plainLanguage['key']
      }

      this.languages = this.listCodeLanguagesActive.map((item) => ({
        key: item,
        value: plainLanguage[item] || '',
      }))
    },
    close() {
      this.$emit('close')
    },
    async submitForm() {
      this.isLoading = true
      const form = await (this.$refs.smallCategoryForm as any).validate()
      if (!form.valid) {
        this.isLoading = false
        return
      }
      const pickPairData = (
        (await this.$refs.pick_pair) as any
      ).getPairSelected()
      this.smallCategory.pairs = pickPairData

      const bigCategory = (
        (this.bigCategoryList as unknown as BigCategory[]) || []
      ).find((item) => item.id === this.bigCategoryIdSelected)
      if (!bigCategory) {
        this.$toastr.error(this.$t('setting.bigCategoryNotExist'))
        return
      }
      if (isEmpty(this.smallCategory)) {
        return
      }

      let result: AxiosResponse<SubCategorySetting>
      if (this.isNew) {
        const subCategoryIndex = bigCategory?.sub_category?.length
          ? (maxBy(bigCategory?.sub_category, 'index') as SubCategorySetting)
              ?.index + 1
          : bigCategory?.sub_category?.length || 0
        result = await SettingExchangeService.createSubCategorySetting(
          plainToInstance(
            CreateSubCategory,
            {
              ...this.smallCategory,
              parent_id: this.bigCategoryIdSelected,
              index: subCategoryIndex,
            },
            {
              excludeExtraneousValues: true,
              exposeDefaultValues: true,
            },
          ),
        )
      } else {
        result = await SettingExchangeService.patchSubCategorySetting(
          plainToInstance(
            UpdateSubCategory,
            {
              ...this.smallCategory,
              parent_id: this.bigCategoryIdSelected,
            },
            {
              excludeExtraneousValues: true,
              exposeDefaultValues: true,
            },
          ),
        )
      }
      if (result.status !== HttpStatus.OK) {
        this.isLoading = false
        if (result.data && result.data && (result.data as any).message) {
          return this.$toastr.error((result.data as any).message)
        }
        return this.$toastr.error(this.$t('setting.saveCategoryError'))
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
      this.isLoading = false

      // Refresh category translate from cache
      this.$store.dispatch(Actions.FETCH_CATEGORY_TRANSLATES)

      this.close()
      this.$emit('updated')
    },
  },
})
</script>
<style lang="scss">
.small-category-modal {
  max-width: 700px;
  .modal-content {
    width: 700px;
  }
}
.hide-input {
  display: none;
}
.create-key {
  padding-left: 8px;
}
</style>
