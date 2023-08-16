<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.reasonCategory') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0" v-if="tableConfig">
      <datatable
        :config="tableConfig"
        :force-reload-key="reloadKey"
        ref="reasonCategoryTable"
      >
        <template v-slot:button>
          <button
            type="button"
            class="btn btn-primary me-2 mb-1"
            @click="openModalAddCategory"
          >
            <i class="fas fa-plus fa-fw"></i>
            {{ $t('addReasonCategory') }}
          </button>
        </template>

        <template v-slot:cell-action="{ row: category }">
          <button
            class="btn btn-sm btn-flex btn-light-primary mx-2"
            type="button"
            @click="openModalEditCategory(category)"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/art/art005.svg" />
            </span>
            Edit
          </button>

          <button
            class="btn btn-sm btn-flex btn-light-danger mx-2"
            type="button"
            @click="deleteReasonCategory(category.id)"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/general/gen027.svg" />
            </span>
            Delete
          </button>
        </template>
      </datatable>
    </div>
  </div>

  <ReasonCategoryModal
    :show="displayModal"
    :reason-category-to-update="reasonCategoryToUpdate"
    :key="reloadReasonCategoryModalKey"
    @close="displayModal = false"
    @saved="saved()"
  ></ReasonCategoryModal>
</template>

<script lang="ts">
import { defineComponent, ref, nextTick } from 'vue'
import Datatable, {
  DatatableSearchType,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { getEnumValues, setPageFliud } from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { ReasonService } from '@/services/ReasonService'
import ReasonCategoryModal from '@/components/user-reason/ReasonCategoryModal.vue'
import { ElMessageBox, ElNotification } from 'element-plus/es'
import { useI18n } from 'vue-i18n'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'

export default defineComponent({
  name: 'list-reason-category',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.reasonCategory', ['menu.reasonManagement'])
  },
  components: {
    ReasonCategoryModal,
    Datatable,
  },
  data() {
    return {
      CONFIG,
    }
  },
  setup() {
    const { t } = useI18n()

    const reloadReasonCategoryModalKey = ref(0)
    const addReasonCategoryComponentRef = ref()
    const reasonCategoryToUpdate = ref()

    const reasonCategoryTable = ref()

    const reloadKey = ref(0)
    const displayModal = ref(false)

    const supportedLanguages = ref()
    const tableConfig = ref<ITableConfig | null>()
    ReasonService.getLanguage().then((result) => {
      supportedLanguages.value = result.data

      tableConfig.value = {
        identifyField: 'id',
        dataSource: (params) => ReasonService.getReasonCategoryList(params),
        columns: [
          ...supportedLanguages.value.map((lang, index) => ({
            key: `Category name (${lang})`,
            title: `Category name (${lang})`,
            hidden: index > 0,
            render: (value, row) => {
              return row.name[lang]
            },
            class: 'td-w-350px min-w-150px text-wrap',
          })),
          {
            key: 'type',
            title: 'Category type',
            sortable: true,
            render: (value) => {
              return t(`reasonCategoryTypes.${value}`)
            },
            class: 'td-w-350px min-w-150px text-wrap',
          },
          {
            key: 'action',
            title: 'Actions',
            class: 'text-center min-w-200px td-w-250px',
          },
        ],
        searchColumns: [
          ...supportedLanguages.value.map(
            (lang) =>
              ({
                key: `name_${lang}`,
                title: `Category name (${lang})`,
                searchType: DatatableSearchType.TEXT,
              } as any),
          ),
          {
            key: 'type',
            title: 'type',
            searchType: DatatableSearchType.SELECT,
            options: getEnumValues(ReasonCategoryTypeEnum).map((value) => ({
              id: value as string,
              name: t(`reasonCategoryTypes.${value}`),
            })),
          },
        ],
        configColumn: true,
        configPage: true,
      }
    })

    const openModalReasonCategory = () => {
      reloadReasonCategoryModalKey.value++
      nextTick(() => {
        displayModal.value = true
      })
    }

    const openModalAddCategory = () => {
      reasonCategoryToUpdate.value = {}
      openModalReasonCategory()
    }

    const openModalEditCategory = async (category) => {
      reasonCategoryToUpdate.value = category
      openModalReasonCategory()
    }

    const refreshDatatable = () => {
      if (reasonCategoryTable.value) {
        ;(reasonCategoryTable.value as IDatatableContext).getData()
      }
    }

    const saved = () => {
      refreshDatatable()
      displayModal.value = false
    }

    const deleteReasonCategory = async (id: string) => {
      ElMessageBox.confirm(t('walletGeneral.areYouSureToDelete')).then(
        async () => {
          const response = await ReasonService.deleteReasonCategory(id)

          if (response.data.success !== true) {
            ElNotification.error(
              response.data?.message || t('deleteReasonCategoryFail'),
            )
            return
          }

          ElNotification.success(t('deleteReasonCategorySuccess'))

          refreshDatatable()
        },
      )
    }

    return {
      openModalAddCategory,
      openModalEditCategory,
      deleteReasonCategory,
      refreshDatatable,
      saved,

      reasonCategoryTable,
      addReasonCategoryComponentRef,
      reloadReasonCategoryModalKey,
      reasonCategoryToUpdate,
      reloadKey,
      displayModal,
      tableConfig,
    }
  },
})
</script>
