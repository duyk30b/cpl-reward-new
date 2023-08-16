<template>
  <div class="card p-8">
    <div class="card-header border-0 pt-6" style="padding-left: 0">
      <div class="card-title">
        {{ $t('List - Export') }}
      </div>
    </div>
    <div class="card-body p-0">
      <datatable :config="tableConfig" ref="exportTable">
        <template v-slot:cell-link="{ row: exportLog }">
          <a :href="exportLog.link" target="_blank">
            {{ exportLog.name }}
          </a>
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'

import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { HighLowService } from '@/services/HighLowService'
import moment from 'moment'

export default defineComponent({
  name: 'export',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.export', ['highLow.highLow'])
  },
  components: { Datatable },
  data() {
    return {
      loading: false,
      tableReloadKey: 0,
      datetime: new Date(),
      tableConfig: {
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

          table.pagination = res.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount)
            table.getData(true)
          else {
            table.data = res.data.data || []
            table.pagination.total = res.data.data.length
            table.pagination.page = 1
            table.pagination.size = table.pagination.total

            if (table.config.drawCallback) table.config.drawCallback()
          }
        },
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        dataSource: (params) => HighLowService.getExport(),
        columns: [
          {
            key: 'no',
            title: 'no',
            class: 'text-center td-w-50px',
            render: (value) => {
              return value
            },
          },
          {
            key: 'link',
            title: 'fileName',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'time',
            title: 'time',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              return moment.utc(value).local().format('YYYY-MM-DD HH:mm:ss')
            },
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: false,
        dateOption: false,
        onSearch: false,
        tableName: 'export-table',
      } as ITableConfig,
    }
  },
  computed: {
    query: function (): any {
      return {}
    },
  },
  methods: {
    onSearch() {
      this.loading = true
      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
