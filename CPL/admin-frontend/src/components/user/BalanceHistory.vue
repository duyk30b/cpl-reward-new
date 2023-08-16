<template>
  <datatable
    :config="tableConfig"
    ref="tableBalanceHistory"
    :forceReloadKey="forceReloadKey"
  ></datatable>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { setPageFliud } from '@/core/helpers/common.helper'
import { UserBalanceService } from '@/services/UserBalanceService'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import moment from 'moment'
import {
  balanceTypeOption,
  formatNumberString,
  transactionTypeOption,
} from '@/core/helpers/util'
import store from '@/store'
import { Mutations } from '@/store/enums/StoreEnums'
import { MAX_HISTORY_DAYS } from './constants'
export default defineComponent({
  mounted() {
    ;(this.$refs.tableBalanceHistory as any).updateConfig()
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.basicInfo', ['users'])
  },
  components: {
    Datatable,
  },
  data() {
    return {
      forceReloadKey: 0,
      loading: false,
      tableConfig: {
        identifyField: 'balance_histories',
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'id',
            title: this.$t('id'),
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'balance_type',
            title: this.$t('service'),
            class: 'text-center align-middle',
          },
          {
            key: 'currency',
            title: this.$t('currency'),
            class: 'td-w-250px text-uppercase align-middle text-center',
          },
          {
            key: 'actual_balance_change',
            title: this.$t('balanceHistory.actualBalanceChange'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(
                value.includes('-') ? value : '+' + value,
              )
            },
          },
          {
            key: 'actual_balance',
            title: this.$t('balanceHistory.actualBalance'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(value)
            },
          },
          {
            key: 'available_balance_change',
            title: this.$t('balanceHistory.availableBalanceChange'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(
                value.includes('-') ? value : '+' + value,
              )
            },
          },
          {
            key: 'available_balance',
            title: this.$t('balanceHistory.availableBalance'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(value)
            },
          },
          {
            key: 'transaction_type',
            title: this.$t('event'),
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'reference_id',
            title: this.$t('referenceId'),
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'created_at',
            title: this.$t('createDate'),
            render: (value) => {
              return moment.unix(value / 1000).format('YYYY-MM-DD HH:mm:ss')
            },
            class: 'align-middle text-center',
          },
        ],
        notReset: true,
        searchColumns: [
          {
            key: 'balance_type',
            title: 'service',
            searchType: DatatableSearchType.SELECT,
            options: balanceTypeOption(),
            class: 'td-w-150px',
          },
          {
            key: 'transaction_type',
            title: 'event',
            searchType: DatatableSearchType.SELECT,
            options: transactionTypeOption(),
            class: 'td-w-200px',
          },
          {
            key: 'currency',
            title: 'currency',
            searchType: DatatableSearchType.SELECT,
            options: this.$store.getters.listCoin,
            class: 'td-w-150px',
          },
          {
            key: 'search_text',
            title: 'referenceId',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'date',
            searchType: DatatableSearchType.DATE_RANGE,
            startPlaceholder: moment()
              .startOf('date')
              .clone()
              .subtract(30, 'days')
              .format('DD/MM/YYYY'),
            endPlaceholder: moment().endOf('date').clone().format('DD/MM/YYYY'),
          },
        ],
        activeDownloadCsv: true,
        downloadCsv: (params) => this.downloadCsv(params),
        configPage: true,
        initFilter: {
          date: [
            moment()
              .startOf('date')
              .clone()
              .subtract(30, 'days')
              .format('YYYY/MM/DD'),
            moment().endOf('date').clone().format('YYYY/MM/DD'),
          ],
        },
      } as ITableConfig,
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    listCoin(): string[] {
      return this.$store.getters.listCoin
    },
  },
  methods: {
    async downloadCsv(params) {
      store.commit(Mutations.SHOW_API_LOADING, true)
      this.loading = true
      const response = await UserBalanceService.downloadBalanceHistory({
        ...this.convertParamQuery(params),
        user_id: this.$route.params.id,
      })
      store.commit(Mutations.SHOW_API_LOADING, false)
      this.loading = false

      return response
    },
    convertParamQuery(params) {
      //default search with 30 days
      const startDate =
        params.date && params.date[0]
          ? moment(params.date[0]).startOf('date')
          : moment().startOf('date').clone().subtract(30, 'days')
      const endDate =
        params.date && params.date[1]
          ? moment(params.date[1]).endOf('date')
          : moment().endOf('date').clone()

      params['start_date'] = startDate.startOf('date').format('x')
      params['end_date'] = endDate.endOf('date').format('x')

      return params
    },
    getDataSource(params) {
      //default search with 30 days
      const startDate =
        params.date && params.date[0]
          ? moment(params.date[0]).startOf('date')
          : moment().startOf('date').clone().subtract(30, 'days')
      const endDate =
        params.date && params.date[1]
          ? moment(params.date[1]).endOf('date')
          : moment().endOf('date').clone()

      const diffDays = startDate.diff(endDate, 'days')
      if (Math.abs(diffDays) > MAX_HISTORY_DAYS) {
        this.$toastr.error({
          message: this.$t('balanceHistory.invalidSearchDateMessage', {
            days: MAX_HISTORY_DAYS,
          }),
          duration: 5000,
        })
        return []
      }

      params['start_date'] = startDate.startOf('date').format('x')
      params['end_date'] = endDate.endOf('date').format('x')

      return UserBalanceService.getBalanceHistory({
        ...params,
        user_id: this.$route.params.id,
        size: params.per_page || 25,
      })
    },
  },
  watch: {
    userId: function (value) {
      if (!value) return
      if (this.tableConfig.initFilter) {
        this.tableConfig.initFilter.user_id = this.userId
      }
      ;(this.$refs.tableBalanceHistory as any).updateConfig()
    },
    listCoin: function () {
      if (!this.tableConfig.searchColumns) return

      const searchColumn: any = this.tableConfig.searchColumns.find(
        (e) => e.key === 'currency',
      )
      searchColumn.options = [
        ...this.$store.getters.listCoin.map((e) => ({
          id: e,
          name: e,
        })),
      ]
    },
  },
})
</script>
