<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.historySub.login') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig"></datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { UserHistoryService } from '@/services/UserHistoryService'
import moment from 'moment'
import { DatePickerMode } from '@/libs/DatePicker.vue'

export default defineComponent({
  name: 'history-login',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.historySub.login', ['history'])
  },
  components: {
    Datatable,
  },
  data() {
    return {
      tableConfig: {
        dataSource: (params) => {
          return UserHistoryService.getListLoginHistories({
            ...params,
            from_time: params.from_time
              ? moment(params.from_time).startOf('seconds').format('x')
              : null,
            to_time: params.to_time
              ? moment(params.to_time).endOf('seconds').format('x')
              : null,
          })
        },
        columns: [
          {
            key: 'created_at',
            title: 'date',
            sortable: true,
            class: 'td-w-250px',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'browser',
            title: 'browser',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'os',
            title: 'os',
            sortable: true,
            class: 'td-w-250px',
          },
          {
            key: 'ip',
            title: 'ipAddress',
            sortable: true,
            class: 'td-w-250px',
          },
        ],
        searchColumns: [
          {
            key: 'email',
            title: 'email',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'ip',
            title: 'ip',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'from_time',
            title: 'from',
            searchType: DatatableSearchType.DATE,
            mode: DatePickerMode.DATETIME,
          },
          {
            key: 'to_time',
            title: 'to',
            searchType: DatatableSearchType.DATE,
            mode: DatePickerMode.DATETIME,
          },
        ],
        configPage: true,
      } as ITableConfig,
      CONFIG,
    }
  },
})
</script>
