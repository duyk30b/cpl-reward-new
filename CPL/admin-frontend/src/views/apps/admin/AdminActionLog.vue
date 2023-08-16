<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.actionLog') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-request="{ row }">
          <input
            class="form-control"
            @focus="$event.target?.select()"
            :value="row.request"
          />
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { AdminActionLogService } from '@/services/AdminActionLogService'
import { AdminService } from '@/services/AdminService'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'action-log',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.actionLog', ['history'])
  },
  components: {
    Datatable,
  },

  data() {
    return {
      tableConfig: {
        dataSource: (params) => AdminActionLogService.getListActionLog(params),
        columns: [
          {
            key: 'admin_email',
            title: 'admin',
            class: 'td-w-250px',
          },
          {
            key: 'ip',
            title: 'IP',
            class: 'td-w-150px',
          },
          {
            key: 'endpoint',
            title: 'endpoint',
            class: 'td-w-250px',
          },
          {
            key: 'method',
            title: 'method',
            class: 'td-w-100px text-center',
          },
          {
            key: 'request',
            title: 'request',
            class: 'td-w-350px',
          },
          {
            key: 'status_code',
            title: 'statusCode',
            class: 'td-w-100px text-end',
          },
          {
            key: 'time_processed',
            title: 'timeProcessed',
            class: 'td-w-100px text-end',
          },
          {
            key: 'created_at',
            title: 'createdAt',
            class: 'td-w-200px text-end',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
        ],
        searchColumns: [
          {
            key: 'admin_id',
            title: 'admin',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async (text) => {
              const result = await AdminService.getListAdmins({
                searchText: text,
                searchField: 'email',
              })
              return result?.data?.data.map((item) => ({
                id: item.id,
                name: item.email,
              }))
            },
          },
          {
            key: 'endpoint',
            title: 'endpoint',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig,
      tableReloadKey: 1,
    }
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
