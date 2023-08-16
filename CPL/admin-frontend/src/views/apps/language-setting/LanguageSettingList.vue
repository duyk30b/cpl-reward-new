<template>
  <div class="card">
    <div class="card-body">
      <datatable :config="tableConfig" :soft-reload-key="softReloadKey">
        <template v-slot:right-toolbar>
          <button class="btn btn-primary me-2 mb-1" @click="addLanguage()">
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('add') }}
          </button>
        </template>

        <template v-slot:cell-action="{ row: language }">
          <button
            @click="editLanguage(language)"
            class="btn btn-sm btn-light-primary"
            style="margin-left: 0.5em"
          >
            {{ $t('edit') }}
          </button>

          <button
            @click="updateStatusLanguage(language)"
            class="btn btn-sm"
            style="margin-left: 0.5em"
            :class="{
              'btn-danger': language.is_active === true,
              'btn-success': language.is_active === false,
            }"
          >
            {{ getTextButtonStatus(language.is_active) }}
          </button>
        </template>

        <template v-slot:cell-is_active="{ row: language }">
          <span
            class="badge"
            :class="{
              'badge-light-success': language.is_active === true,
              'badge-light-danger': language.is_active === false,
            }"
            >{{ getTextStatus(language.is_active) }}</span
          >
        </template>
      </datatable>
    </div>
    <AddLanguageModal
      @created="softRefreshTable"
      @close="closeAddModal"
      v-if="showAdd"
      :show="showAdd"
    ></AddLanguageModal>
    <EditLanguageModal
      @created="softRefreshTable"
      @close="closeEditModal"
      v-if="showEdit"
      :show="showEdit"
      :language="languageModal"
    ></EditLanguageModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { checkPermission, setPageFliud } from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { HttpStatus, Permission } from '@/core/variables/common.enum'
import { MultiLanguageService } from '@/services/MultiLanguageService'
import AddLanguageModal from '@/components/languages/AddLanguageModal.vue'
import EditLanguageModal from '@/components/languages/EditLanguageModal.vue'
import { plainToInstance } from 'class-transformer'
import { LanguageSetting } from '@/core/data/language/language-setting'

export default defineComponent({
  name: 'language-setting-lost',
  async beforeMount() {
    const result = await MultiLanguageService.getListCodeLanguages()
    localStorage.setItem('list-code-languages', JSON.stringify(result.data))
  },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.listLanguageSetting', [
      'menu.multiLanguageSetting',
    ])
  },
  components: {
    Datatable,
    AddLanguageModal,
    EditLanguageModal,
  },
  data() {
    return {
      softReloadKey: 0,
      tableConfig: {
        dataSource: (params) => {
          params.key = params.search_text
          return MultiLanguageService.getLanguages(params)
        },
        columns: [
          {
            key: 'language_code',
            title: 'languageSetting.languageCode',
            class: 'td-w-300px text-center',
          },
          {
            key: 'name',
            title: 'languageSetting.languageName',
            class: 'td-w-500px text-center',
          },
          {
            key: 'is_active',
            title: 'status',
            sortable: true,
            class: 'td-w-200px text-center',
          },
          {
            title: 'action',
            key: 'action',
            class: 'td-w-200px text-center',
          },
        ],
        searchColumns: [
          {
            key: 'key',
            title: 'search',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig,
      Permission,
      CONFIG,
      languageModal: new LanguageSetting(),
      showEdit: false,
      showAdd: false,
    }
  },
  methods: {
    getTextStatus(isActive: boolean) {
      if (isActive) return this.$t('languageSetting.enableLanguage')
      if (!isActive) return this.$t('languageSetting.disableLanguage')
      return 'N/A'
    },
    getTextButtonStatus(isActive: boolean) {
      if (!isActive) return this.$t('languageSetting.enableLanguage')
      if (isActive) return this.$t('languageSetting.disableLanguage')
      return 'N/A'
    },
    checkPermission,
    softRefreshTable() {
      this.softReloadKey++
    },
    closeEditModal() {
      this.showEdit = false
    },
    addLanguage() {
      this.showAdd = true
    },
    closeAddModal() {
      this.showAdd = false
    },
    editLanguage(language) {
      this.languageModal = plainToInstance(LanguageSetting, language)
      this.showEdit = true
    },
    async updateStatusLanguage(language) {
      const result = await MultiLanguageService.setLanguage({
        language_code: language.language_code,
        language_name: language.name,
        is_active: !language.is_active,
      })

      if (result.status !== HttpStatus.CREATED) {
        return this.$toastr.error(
          this.$t('languageSetting.updateLanguageFailed'),
        )
      }

      this.$toastr.success(this.$t('languageSetting.updateLanguageSuccess'))
      this.softRefreshTable()
    },
  },
})
</script>

<style lang="scss" scoped>
:deep(td) {
  white-space: normal !important;
}
</style>
