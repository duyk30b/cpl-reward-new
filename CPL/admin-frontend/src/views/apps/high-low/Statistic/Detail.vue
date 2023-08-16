<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-6">
        <!-- Date range -->
        <div class="col-md-6">
          <label class="form-label">{{ $t('highLow.date') }}:</label>
          <date-range-picker-options
            :start-placeholder="$t('startDate')"
            :end-placeholder="$t('endDate')"
            v-model="dateRange"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
      </div>

      <div class="d-flex col-md-6 col-lg-4 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100 me-6"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="">{{ $t('search') }}</span>
        </button>
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onExport"
          :title="$t('export')"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <div class="">{{ $t('downloadCSV') }}</div>
        </button>
      </div>
    </div>
    <div class="card-body p-0">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
      ></datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { UserService } from '@/services/UserService'
import { defineComponent } from 'vue'
import CONFIG from '@/config'
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns'
import { HighLowService } from '@/services/HighLowService'
import { BigNumber } from 'bignumber.js'
import { getPeriodByValue } from '@/core/helpers/common.helper'
import loading from 'element-plus/es/components/loading'
import moment from 'moment'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'detail',
  components: {
    Datatable,
  },
  setup() {
    const i18n = useI18n()

    const getLang = () => i18n.locale.value
    return {
      getLang,
    }
  },
  data() {
    return {
      loading: false,
      tableReloadKey: 1,
      // date
      dateRange: [startOfDay(startOfYear(new Date())), endOfDay(new Date())],
      shortcuts: [
        {
          text: this.$t('highLow.lastMonth'),
          value: () => {
            const end = endOfMonth(subMonths(new Date(), 1))
            const start = startOfMonth(subMonths(new Date(), 1))
            return [start, end]
          },
        },
        {
          text: this.$t('highLow.thisMonth'),
          value: () => {
            const end = new Date()
            const start = startOfMonth(new Date())
            return [start, end]
          },
        },
      ],

      tableConfig: {
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

          table.pagination = res.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount) {
            table.getData(true)
          } else {
            table.data = res.data.data || []
            table.data.forEach((row, index) => {
              if (!row.id) row.id = index + 1
            })
            if (table.config.drawCallback) table.config.drawCallback()
          }
        },
        dataSource: (params) =>
          HighLowService.getUsersDetail({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'mode',
            title: 'highLow.mode',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              switch (value) {
                case 'H':
                  return 'High/Low'
                case 'HS':
                  return 'High/Low Spread'
                case 'T':
                  return 'Lightning'
                case 'TS':
                  return 'Lightning Spread'

                default:
                  break
              }
            },
          },
          {
            key: 'period',
            title: 'highLow.period',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              return getPeriodByValue(value)
            },
          },
          {
            key: 'orderTimes',
            title: 'highLow.orderTimes',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return new BigNumber(value).toFormat(0)
            },
          },
          {
            key: 'userWins',
            title: 'highLow.userWins',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return new BigNumber(value).toFormat(0)
            },
          },
          {
            key: 'userLoses',
            title: 'highLow.userLose',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return new BigNumber(value).toFormat(0)
            },
          },
          {
            key: 'userWinRate',
            title: 'highLow.userWinRates',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              let num = Number(value).toFixed(2)
              return parseFloat(num) + ' %'
            },
          },
          {
            key: 'in',
            title: 'highLow.in',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              let num = new BigNumber(value).toFormat(10)
              return num.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' USDT'
            },
          },
          {
            key: 'out',
            title: 'highLow.out',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              let num = new BigNumber(value).toFormat(2)
              return num.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' USDT'
            },
          },
          {
            key: 'payoutRate',
            title: 'highLow.payoutRate',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              let num = new BigNumber(value).toFormat(2)
              return num.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' %'
            },
          },
          {
            key: 'operatingProfit',
            title: 'highLow.operatingProfit',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              let num = new BigNumber(value).toFormat(2)
              return num.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' USDT'
            },
          },
        ],
        configPage: false,
        configColumn: false,
        activeExport: false,
        dateOption: true,
        onSearch: false,
        tableName: 'detail-table',
        // getExport: () => UserService.getUsersExport(),
        // createExport: (params) =>
        //   UserService.createUsersExport({
        //     ...params,
        //     ...this.query,
        //   }),
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
      }
    },
    fromTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) =>
          item ? moment(item).clone().startOf('day').format('x') : '',
        )[0]
        .toString()
    },
    toTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) =>
          item ? moment(item).clone().endOf('day').format('x') : '',
        )[1]
        .toString()
    },
  },
  methods: {
    onSearch() {
      this.refreshTable()
    },
    async onExport() {
      const query = {
        ...this.query,
        lang: this.getLang(),
      }
      const { data, status } = await HighLowService.exportUsersDetail(query)

      if (status === 200) {
        this.$toastr.success(this.$t('success'))
      }
    },
    validateDate(date: Date) {
      return date ? Math.floor(new Date(date).getTime() / 1000) : ''
    },
    onReset() {
      ;(this.dateRange = [startOfYear(new Date()), new Date()]),
        this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
