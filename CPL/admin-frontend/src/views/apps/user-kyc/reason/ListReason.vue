<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.reason') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0" v-if="tableConfig">
      <datatable
        :config="tableConfig"
        :force-reload-key="reloadKey"
        ref="reasonTable"
      >
        <template v-slot:button>
          <button
            type="button"
            class="btn btn-primary me-2 mb-1"
            @click="openModalAddReason"
          >
            <i class="fas fa-plus fa-fw"></i>
            {{ $t('addReason') }}
          </button>
        </template>

        <template v-slot:cell-action="{ row: category }">
          <button
            class="btn btn-sm btn-flex btn-light-primary mx-2"
            type="button"
            @click="openModalEditReason(category)"
          >
            <span class="svg-icon svg-icon-3">
              <inline-svg src="/media/icons/duotune/art/art005.svg" />
            </span>
            Edit
          </button>

          <button
            class="btn btn-sm btn-flex btn-light-danger mx-2"
            type="button"
            @click="deleteReason(category.id)"
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

  <ReasonModal
    :show="displayModal"
    :reason-to-update="reasonToUpdate"
    :key="reloadReasonModalKey"
    ref="addReasonComponentRef"
    @close="displayModal = false"
    @saved="saved()"
  ></ReasonModal>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref } from 'vue'
import Datatable, {
  DatatableSearchType,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { setPageFliud } from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { ReasonService } from '@/services/ReasonService'
import ReasonModal from '@/components/user-reason/ReasonModal.vue'
import { ElMessageBox, ElNotification } from 'element-plus/es'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'list-reason',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.reason', ['menu.reasonManagement'])
  },
  components: {
    ReasonModal,
    Datatable,
  },
  data() {
    return {
      CONFIG,
    }
  },
  setup() {
    const { t } = useI18n()

    const reloadReasonModalKey = ref(0)
    const addReasonComponentRef = ref()
    const reasonToUpdate = ref()

    const reasonTable = ref()

    const reloadKey = ref(0)
    const displayModal = ref(false)

    const supportedLanguages = ref()
    const tableConfig = ref<ITableConfig | null>()

    ReasonService.getLanguage().then((result) => {
      supportedLanguages.value = result.data

      tableConfig.value = {
        identifyField: 'id',
        dataSource: (params) => ReasonService.getReasonList(params),
        columns: [
          ...supportedLanguages.value.map((lang, index) => ({
            key: `Reason name (${lang})`,
            title: `Reason name (${lang})`,
            hidden: index > 0,
            render: (value, row) => {
              return row.name[lang]
            },
            class: 'min-w-300px text-wrap',
          })),
          ...supportedLanguages.value.map((lang, index) => ({
            key: `Category name (${lang})`,
            title: `Category name (${lang})`,
            hidden: index > 0,
            render: (value, row) => {
              return row.category.name[lang]
            },
            class: 'min-w-300px text-wrap',
          })),
          {
            key: 'action',
            title: 'Actions',
            class: 'text-center min-w-200px td-w-250px',
          },
        ],
        searchColumns: [
          {
            key: 'category_id',
            title: t('searchReasonCategory'),
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async function (text) {
              const result = await ReasonService.getReasonCategoryList({
                search_text: text,
                search_field: 'name',
                sort: 'created_at',
                sort_type: 'DESC',
              })
              return result?.data?.data.map((category) => {
                return {
                  name: category.name.en,
                  id: category.id,
                }
              })
            },
          },
          ...supportedLanguages.value.map(
            (lang) =>
              ({
                key: `name_${lang}`,
                title: `Reason name (${lang})`,
                searchType: DatatableSearchType.TEXT,
              } as any),
          ),
        ],
        configPage: true,
        configColumn: true,
      }
    })

    const openModalReason = () => {
      reloadReasonModalKey.value++
      nextTick(() => {
        displayModal.value = true
      })
    }

    const refreshDatatable = () => {
      if (reasonTable.value) {
        ;(reasonTable.value as IDatatableContext).getData()
      }
    }

    const openModalAddReason = () => {
      reasonToUpdate.value = {}
      openModalReason()
    }

    const openModalEditReason = async (category) => {
      reasonToUpdate.value = category
      openModalReason()
    }

    const deleteReason = async (id: string) => {
      ElMessageBox.confirm(t('walletGeneral.areYouSureToDelete')).then(
        async () => {
          const response = await ReasonService.deleteReason(id)

          if (response.data.success !== true) {
            ElNotification.error(t('deleteReasonFail'))
            return
          }

          ElNotification.success(t('deleteReasonSuccess'))

          refreshDatatable()
        },
      )
    }

    const saved = () => {
      refreshDatatable()
      displayModal.value = false
    }

    return {
      openModalAddReason,
      openModalEditReason,
      deleteReason,
      refreshDatatable,
      saved,

      reasonTable,
      addReasonComponentRef,
      reloadReasonModalKey,
      reasonToUpdate,
      reloadKey,
      displayModal,
      tableConfig,
    }
  },
})
</script>
