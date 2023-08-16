<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">
        {{ $t('balanceTransferHistoryScreen.title') }}
      </div>
    </div>

    <div class="card-body">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        ref="datatableRef"
      >
        <template v-slot:cell-no="{ idx, page, size }">
          {{ (page - 1) * size + idx + 1 }}
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { convertTimestampToDate } from '@/core/helpers/common.helper'
import {
  formatCurrencyAmount,
  balanceTypeOption,
  jsonToCsv,
} from '@/core/helpers/util'
import { HttpStatus } from '@/core/variables/common.enum'
import { BalanceTransferHistoryService } from '@/views/apps/balance-transfer-history/services/BalanceTransferHistoryService'
import moment from 'moment'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { UserService } from '@/services/UserService'
import { Actions, Mutations } from '@/store/enums/StoreEnums'

export default defineComponent({
  name: 'BalanceTransferHistoryHistory',
  components: {
    Datatable,
  },
  data() {
    return {
      querySearch: {},
      tableReloadKey: 1,
      searching: false as boolean,
      tableConfig: {
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'no',
            title: 'balanceTransferHistoryScreen.no',
            sortable: false,
            class: 'td-w-50px align-middle text-center',
          },
          {
            key: 'email',
            title: 'email',
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'currency',
            title: 'currency',
            render: (value) => {
              return value.toUpperCase()
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'balance_type_from',
            title: 'balanceTransferHistoryScreen.from',
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'balance_type_to',
            title: 'balanceTransferHistoryScreen.to',
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'amount',
            title: 'amount',
            sortable: true,
            render: (value, row) => {
              return formatCurrencyAmount(value, row.currency, '0', 18)
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'created_at',
            title: 'balanceTransferHistoryScreen.time',
            sortable: true,
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
        ],
        searchColumns: [
          {
            key: 'from',
            title: 'balanceTransferHistoryScreen.from',
            searchType: DatatableSearchType.SELECT,
            options: balanceTypeOption(),
            class: 'td-w-150px',
          },
          {
            key: 'to',
            title: 'balanceTransferHistoryScreen.to',
            searchType: DatatableSearchType.SELECT,
            options: balanceTypeOption(),
            class: 'td-w-150px',
          },
          {
            key: 'currency',
            title: 'currency',
            searchType: DatatableSearchType.SELECT,
            options: this.$store.getters.listCoin,
            class: 'td-w-150px',
          },
          {
            key: 'date',
            searchType: DatatableSearchType.DATE_RANGE,
            startPlaceholder: moment()
              .startOf('date')
              .clone()
              .subtract(180, 'days')
              .format('YYYY-MM-DD'),
            endPlaceholder: moment().endOf('date').clone().format('YYYY-MM-DD'),
            inputFormat: 'YYYY-MM-DD',
            getDataOnChange: true,
            class: 'td-w-350px',
          },
          {
            key: 'user_ids',
            title: 'email',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async function (text) {
              const result = await UserService.getListUsers({
                search_field: 'email',
                search_text: text.trim(),
              })
              return result?.data?.data.map((item) => ({
                id: item.user_id,
                name: item.email,
              }))
            },
            multiple: true,
            reserveKeyword: true,
            collapseTags: true,
          },
        ],
        isRemoveSearch: true,
        configPage: true,
        configColumn: true,
        activeDownloadCsv: true,
        downloadCsv: (params) => this.handleDownloadCsv(params),
      } as ITableConfig,
    }
  },
  computed: {
    listCoin(): string[] {
      return this.$store.getters.listCoin
    },
  },
  mounted() {
    setCurrentPageBreadcrumbs('balanceTransferHistoryScreen.title', [])
    if (!this.$store.getters.listCoin.length) {
      this.$store.dispatch(Actions.FETCH_LIST_COIN)
    }
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(rootParams: any) {
      try {
        const params = this.transformParams(rootParams)

        this.searching = true
        const data =
          await BalanceTransferHistoryService.listBalanceTransferHistory(params)
        this.searching = false
        return {
          status: HttpStatus.OK,
          data: {
            data: data.data,
            pagination: {
              page: params.page,
              size: params.limit,
              total: data.pagination.total,
            },
          },
        }
      } catch (err) {
        this.searching = false
      }
    },

    async onSearch() {
      this.refreshTable()
    },

    transformParams(rootParams) {
      const params = { ...rootParams }
      if ('limit' in params && params.limit) {
        params.size = params.limit
      }

      if ('date' in params && params.date.length > 0) {
        const startDate = params.date[0]
          ? moment(params.date[0]).startOf('date')
          : moment().startOf('date').clone().subtract(180, 'days')
        const endDate = params.date[1]
          ? moment(params.date[1]).endOf('date')
          : moment().endOf('date').clone()

        params['start_date'] = startDate.startOf('date').format('x')
        params['end_date'] = endDate.endOf('date').format('x')
        delete params.date
      }

      if ('from' in params && params.from) {
        params['balance_types_from'] = [params.from]
        delete params.from
      }

      if ('to' in params && params.to) {
        params['balance_types_to'] = [params.to]
        delete params.to
      }

      if ('currency' in params && params.currency) {
        params['currencies'] = [params.currency.toLowerCase()]
        delete params.currency
      }
      return params
    },

    async handleDownloadCsv(rootParams: any) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const params = this.transformParams(rootParams)
      try {
        let data =
          await BalanceTransferHistoryService.getAllUserBalanceChangeHistory(
            params,
          )
        const transferHistoryData = data.map((item, index) => {
          return {
            no: index + 1,
            email: item.email,
            currency: item.currency.toUpperCase(),
            balance_type_from: item.balance_type_from,
            balance_type_to: item.balance_type_to,
            amount: formatCurrencyAmount(item.amount, item.currency, '0', 18),
            created_at: convertTimestampToDate(
              item.created_at,
              'YYYY-MM-DD HH:mm:ss',
            ),
          }
        })
        await this.downloadCsv(transferHistoryData)
      } catch (err) {
        this.$toastr.error(
          this.$t('balanceTransferHistoryScreen.exportFileError'),
        )
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async downloadCsv(data) {
      const fileName = `${this.$t(
        'balanceTransferHistoryScreen.title',
      )}-${moment().format('YYYY-MM-DD')}.csv`
      const headerTitle = [
        this.$t('balanceTransferHistoryScreen.no'),
        this.$t('email'),
        this.$t('currency'),
        this.$t('balanceTransferHistoryScreen.from'),
        this.$t('balanceTransferHistoryScreen.to'),
        this.$t('amount'),
        this.$t('balanceTransferHistoryScreen.time'),
      ]
      const dataToCsv = jsonToCsv(data, headerTitle)
      const url = window.URL.createObjectURL(new Blob([dataToCsv]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
  },
  watch: {
    listCoin: function () {
      if (!this.tableConfig.searchColumns) return

      const searchColumn: any = this.tableConfig.searchColumns.find(
        (e) => e.key === 'currency',
      )
      searchColumn.options = this.$store.getters.listCoin.map((e) => ({
        id: e,
        name: e,
      }))
    },
  },
})
</script>
