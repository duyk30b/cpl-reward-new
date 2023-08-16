<template>
  <div class="card">
    <div class="card-body">
      <datatable :config="tableConfig" :soft-reload-key="softReloadKey">
        <template v-slot:cell-action="{ row: key }">
          <button
            @click="openDetailModal(key.id)"
            class="btn btn-sm btn-primary"
            style="margin-left: 0.25em"
          >
            {{ $t('detail') }}
          </button>
        </template>

        <template v-slot:cell-status="{ row: key }">
          <span
            class="badge"
            :class="{
              'badge-light-success': key.status === status.ENABLE,
              'badge-light-danger': key.status === status.DISABLE,
            }"
            >{{ getTextStatus(key.status) }}</span
          >
        </template>
      </datatable>
    </div>

    <DetailApiKeyModal
      @updated="softRefreshTable"
      @close="closeDetailModal"
      v-if="showDetail"
      :show="showDetail"
      :id="id"
    ></DetailApiKeyModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  checkPermission,
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { HttpStatus, Permission } from '@/core/variables/common.enum'
import { ApiManagementService } from '@/services/ApiManagementService'
import DetailApiKeyModal from '@/components/api-management/DetailApiKeyModal.vue'
import { UserService } from '@/services/UserService'

enum STATUS {
  ENABLE = 1,
  DISABLE = 2,
}

export default defineComponent({
  name: 'api-key-management-list',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.listApiKeyManagement', [
      'menu.apiKeyManagement',
    ])
  },
  components: {
    Datatable,
    DetailApiKeyModal,
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) => {
          params.key = params.search_text
          return ApiManagementService.getKeys(params)
        },
        columns: [
          {
            key: 'user_id',
            title: 'userId',
            class: 'td-w-100px text-center',
          },
          {
            key: 'email',
            title: 'email',
            class: 'td-w-250px',
          },
          {
            key: 'api_name',
            title: 'apiKeyManagement.apiName',
            class: 'td-w-250px',
          },
          {
            key: 'api_key',
            title: 'apiKeyManagement.apiKey',
            class: 'td-w-400px',
          },
          {
            key: 'status',
            title: 'status',
            class: 'td-w-100px text-center',
          },
          {
            key: 'created_at',
            title: 'createdAt',
            class: 'td-w-150px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
            sortable: true,
          },
          {
            key: 'updated_at',
            title: 'updatedAt',
            class: 'td-w-150px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
            sortable: true,
          },
          {
            key: 'action',
            title: 'Action',
            class: 'text-center td-w-100px',
          },
        ],
        searchColumns: [
          {
            key: 'key',
            title: 'apiKeyManagement.searchByApiName',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'user_id',
            title: 'apiKeyManagement.searchByEmail',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async (text) => {
              const result = await UserService.searchByFilter({
                email: text,
              })
              if (!result) return []
              if (result.status !== HttpStatus.OK) {
                console.log(result.data)
                return []
              }
              return result.data.map((user) => {
                return { id: user.id, name: user.email }
              })
            },
          },
        ],
        configPage: true,
      }
    },
  },
  data() {
    return {
      status: STATUS,
      categories: {},
      softReloadKey: 0,
      Permission,
      CONFIG,
      id: '',
      showDetail: false,
    }
  },
  methods: {
    getTextStatus(status: number) {
      if (status === STATUS.ENABLE)
        return this.$t('apiKeyManagement.enableStatus')
      if (status === STATUS.DISABLE)
        return this.$t('apiKeyManagement.disableStatus')
      return 'N/A'
    },
    checkPermission,
    softRefreshTable() {
      this.softReloadKey++
    },
    openDetailModal(id) {
      this.id = id
      this.showDetail = true
    },
    closeDetailModal() {
      this.showDetail = false
    },
  },
})
</script>

<style lang="scss" scoped>
:deep(td) {
  white-space: normal !important;
}
</style>
