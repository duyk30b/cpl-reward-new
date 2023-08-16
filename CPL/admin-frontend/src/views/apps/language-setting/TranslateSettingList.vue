<template>
  <div class="card">
    <div class="card-body">
      <datatable
        :config="tableConfig"
        :soft-reload-key="softReloadKey"
        v-if="dynamicColumns?.length"
      >
        <template v-slot:right-toolbar>
          <div
            class="d-flex justify-content-end align-items-center btn-action-groups"
            data-kt-user-table-toolbar="selected"
          >
            <button class="btn btn-success me-2 mb-1" @click="addTranslate()">
              <span class="svg-icon svg-icon-2">
                <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
              </span>
              {{ $t('add') }}
            </button>

            <button
              class="btn btn-danger me-2 mb-1"
              @click="exportAll"
              :disabled="isExportAll"
              :data-kt-indicator="isExportAll ? 'on' : ''"
            >
              <span class="indicator-label">
                {{ $t('languageSetting.actionExport') }}
              </span>
              <span class="indicator-progress">
                {{ $t('languageSetting.actionExport') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>

            <button
              class="btn btn-primary me-2 mb-1"
              @click="importFile"
              :disabled="isImportingFile"
              :data-kt-indicator="isImportingFile ? 'on' : ''"
            >
              <span class="indicator-label">
                {{ $t('languageSetting.actionImport') }}
              </span>
              <span class="indicator-progress">
                {{ $t('languageSetting.actionImport') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>

            <input
              type="file"
              class="d-none"
              ref="fileUpload"
              @change="readFileExcel"
            />
          </div>

          <button
            v-if="importResult.key !== ''"
            class="btn btn-warning me-2 mb-1"
            @click="previewImportedFile"
            :disabled="isImportingFile"
            :data-kt-indicator="isImportingFile ? 'on' : ''"
          >
            <span class="indicator-label">
              {{ $t('languageSetting.previewImportedFile') }}
            </span>
            <span class="indicator-progress">
              {{ $t('languageSetting.previewImportedFile') }}
              <span
                class="spinner-border spinner-border-sm align-middle ms-2"
              ></span>
            </span>
          </button>
        </template>

        <template
          v-slot:cell-action="{ row: translate }"
          v-if="this.activeLanguages?.length > 0"
        >
          <button
            @click="editTranslate(translate)"
            class="btn btn-sm btn-success"
            style="margin-left: 0.25em"
          >
            {{ $t('edit') }}
          </button>
        </template>
      </datatable>
    </div>

    <!--begin::Footer-->
    <div class="card-footer text-center">
      <button
        v-if="importResult.key !== ''"
        class="btn btn-primary me-2 mb-1"
        @click="applyAll"
        :disabled="isImportingFile"
        :data-kt-indicator="isImportingFile ? 'on' : ''"
      >
        <span class="indicator-label">
          {{ $t('languageSetting.applyAll') }}
        </span>
        <span class="indicator-progress">
          {{ $t('languageSetting.applyAll') }}
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
    </div>
    <!--end::Footer-->
    <EditTranslateModal
      @updated="softRefreshTable"
      :translate="translateModal"
      :active-languages="activeTxtLanguages"
      @close="closeEditModal"
      v-if="showEdit"
      :show="showEdit"
    ></EditTranslateModal>

    <AddTranslateModal
      @updated="softRefreshTable"
      :active-languages="activeTxtLanguages"
      @close="closeAddModal"
      v-if="showAdd"
      :show="showAdd"
    ></AddTranslateModal>
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
import { Permission } from '@/core/variables/common.enum'
import { MultiLanguageService } from '@/services/MultiLanguageService'
import EditTranslateModal from '@/components/languages/EditTranslateModal.vue'
import AddTranslateModal from '@/components/languages/AddTranslateModal.vue'
import _ from 'lodash'
import Swal from 'sweetalert2'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'language-setting-list',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.listTranslateSetting', [
      'menu.multiLanguageSetting',
    ])
  },
  setup() {
    const store = useStore()
    return {
      store,
    }
  },
  async beforeMount() {
    const languages = await MultiLanguageService.getLanguagesByType({
      type: 'active',
    })
    this.dynamicColumns = await this.configLanguageColumns(
      _.cloneDeep(languages),
    )
    this.activeTxtLanguages = this.getActiveTxtLanguages(_.cloneDeep(languages))
    this.activeLanguages = _.cloneDeep(languages)
  },
  components: {
    Datatable,
    EditTranslateModal,
    AddTranslateModal,
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) => {
          params.key = params.search_text
          return MultiLanguageService.getTranslates(params)
        },
        columns: this.dynamicColumns,
        searchColumns: [
          {
            key: 'key',
            title: 'search',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configColumn: true,
        configPage: true,
        tableName: 'translate-v2',
        usingId: false,
      }
    },
  },
  data() {
    return {
      activeLanguages: [] as any[],
      activeTxtLanguages: [] as any[],
      dynamicColumns: [] as {
        title: string
        key: string
        class: string
        render?: any
      }[],
      categories: {},
      isImportingFile: false,
      softReloadKey: 0,
      Permission,
      CONFIG,
      translateModal: null,
      showEdit: false,
      showAdd: false,
      importResult: {
        key: '',
        adminActionId: '',
      },
      isExportAll: false,
    }
  },
  methods: {
    getActiveTxtLanguages(languages: any[]) {
      const defaultLanguages = [] as any[]
      const otherLanguages = [] as any[]
      for (const language of languages) {
        if (!['en', 'ja'].includes(language.languageCode)) {
          otherLanguages.push(language)
          continue
        }
        defaultLanguages.push(language)
      }
      return [...defaultLanguages, ...otherLanguages]
    },
    async configLanguageColumns(configActiveLanguages: any[]) {
      const columns = [
        {
          key: 'key',
          title: 'Key',
          class: 'td-w-300px',
        },
      ] as [{ key: string; title: string; class: string; hidden?: boolean }]
      for (const language of configActiveLanguages) {
        columns.push({
          title: `${language.name}`,
          key: `${language.languageCode}`,
          class: 'td-w-500px',
          hidden: !['en', 'ja'].includes(language.languageCode),
        })
      }

      columns.push({
        title: 'action',
        key: 'action',
        class: 'text-center',
      })
      return columns
    },
    async exportAll() {
      this.isExportAll = true
      try {
        const uploadResult = await MultiLanguageService.exportAll()
        if (uploadResult.status === 201) {
          this.$toastr.success(this.$t('success'))

          let blob = new Blob([uploadResult.data], { type: 'text/csv' }),
            url = window.URL.createObjectURL(blob)
          const date = new Date()
          const link = document.createElement('a')
          link.href = url
          link.setAttribute(
            'download',
            `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(
              -2,
            )}-${('0' + date.getDate()).slice(
              -2,
            )}-export-all-${date.valueOf()}.csv`,
          )
          document.body.appendChild(link)
          link.click()
        } else {
          this.$toastr.error(
            this.$t(`languageSetting.${uploadResult.data.message}`),
          )
          console.log(uploadResult)
        }
      } catch (err) {
        this.$toastr.error(this.$t('error'))
      }

      this.isExportAll = false
    },
    checkPermission,
    softRefreshTable() {
      this.softReloadKey++

      this.store.dispatch(Actions.FETCH_CATEGORY_TRANSLATES)
      this.store.dispatch(Actions.FETCH_CODE_LANGUAGES_ACTIVE)
    },
    resetImportResult() {
      this.importResult = {
        key: '',
        adminActionId: '',
      }
    },
    async applyAll() {
      this.isImportingFile = true
      try {
        const applyAllResult = await MultiLanguageService.applyAll(
          this.importResult.key,
        )
        if (applyAllResult.status === 201) {
          await Swal.fire({
            text: this.$t(`languageSetting.applyAllSuccess`),
            icon: 'success',
            buttonsStyling: false,
            showCancelButton: false,
            confirmButtonText: this.$t('confirm'),
            customClass: {
              confirmButton: 'btn btn-primary',
            },
          })
        } else {
          this.$toastr.error(
            this.$t(`languageSetting.${applyAllResult.data.message}`),
          )
          console.log(applyAllResult)
        }
      } catch (err) {
        this.$toastr.error(this.$t('error'))
      }

      this.isImportingFile = false
      this.softRefreshTable()
      this.resetImportResult()
    },
    async previewImportedFile() {
      this.isImportingFile = true
      try {
        const uploadResult = await MultiLanguageService.previewFile(
          this.importResult.key,
        )
        if (uploadResult.status === 201) {
          this.$toastr.success(this.$t('success'))

          let blob = new Blob([uploadResult.data], { type: 'text/csv' }),
            url = window.URL.createObjectURL(blob)
          const date = new Date()
          const link = document.createElement('a')
          link.href = url
          link.setAttribute(
            'download',
            `${date.getFullYear()}-${('0' + (date.getMonth() + 1)).slice(
              -2,
            )}-${('0' + date.getDate()).slice(
              -2,
            )}-export-translate-${date.valueOf()}.csv`,
          )
          document.body.appendChild(link)
          link.click()
        } else {
          this.$toastr.error(
            this.$t(`languageSetting.${uploadResult.data.message}`),
          )
          console.log(uploadResult)
        }
      } catch (err) {
        this.$toastr.error(this.$t('error'))
      }

      this.isImportingFile = false
    },
    async readFileExcel(event) {
      this.isImportingFile = true
      const file = event.target.files[0]
      const extension = file.name.split('.').pop()
      if (!['csv'].includes(extension)) {
        this.$toastr.error(
          this.$t('languageSetting.UPLOAD_FILE.WRONG_FILE_TYPE'),
        )
        this.isImportingFile = false
        this.clearFileInput()
        return
      }

      if (file.size === 0) {
        this.$toastr.error(this.$t('languageSetting.UPLOAD_FILE.BLANK_FILE'))
        this.isImportingFile = false
        this.clearFileInput()
        return
      }

      try {
        const uploadResult = await MultiLanguageService.importFile(file)
        if (uploadResult.status !== 201) {
          this.$toastr.error(
            this.$t(`languageSetting.${uploadResult.data.message}`),
          )
          console.log(uploadResult)
          this.isImportingFile = false
          this.clearFileInput()
          return
        }

        this.$toastr.success(this.$t('success'))
        this.importResult.key = uploadResult.data.key
        this.importResult.adminActionId = uploadResult.data.admin_action_id
      } catch (err) {
        this.$toastr.error(this.$t('error'))
      }

      this.isImportingFile = false
      this.clearFileInput()
    },
    clearFileInput() {
      ;(this.$refs['fileUpload'] as any).value = null
    },
    importFile() {
      ;(this.$refs['fileUpload'] as any).click()
    },
    editTranslate(translate) {
      this.translateModal = _.cloneDeep(translate)
      this.showEdit = true
    },
    closeEditModal() {
      this.showEdit = false
    },
    closeAddModal() {
      this.showAdd = false
    },
    addTranslate() {
      this.showAdd = true
    },
  },
})
</script>

<style lang="scss" scoped>
:deep(td) {
  white-space: normal !important;
}
</style>
