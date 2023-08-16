<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">
        {{ $t('balanceSwapHistoryScreen.title') }}
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
import { formatCurrencyAmount, jsonToCsv } from '@/core/helpers/util'
import { HttpStatus } from '@/core/variables/common.enum'
import { SwapHistoryService } from '@/views/apps/swap-setting/services/SwapHistoryService'
import moment from 'moment'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { UserService } from '@/services/UserService'
import { Actions, Mutations } from '@/store/enums/StoreEnums'
import { SWAP_STATUS } from '@/views/apps/swap-setting/definition/swap-setting.enum'
import { BALANCE_TYPE } from '@/enums/balance.enum'
import { isString } from 'lodash'

export default defineComponent({
  name: 'BalanceSwapHistoryHistory',
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
            title: 'balanceSwapHistoryScreen.no',
            sortable: false,
            class: 'td-w-50px align-middle text-center',
          },
          {
            key: 'email',
            title: 'email',
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'coin_from',
            title: 'balanceSwapHistoryScreen.from',
            render: (value) => {
              return value.toUpperCase()
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'coin_to',
            title: 'balanceSwapHistoryScreen.to',
            render: (value) => {
              return value.toUpperCase()
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'status',
            title: 'status',
            class: 'td-w-100px align-middle text-center',
          },
          {
            key: 'balance_type',
            title: 'balanceSwapHistoryScreen.walletType',
            render: (value) => {
              if (
                value === BALANCE_TYPE.EXCHANGE ||
                value === BALANCE_TYPE[BALANCE_TYPE.EXCHANGE]
              ) {
                return 'SPOT'
              }
              return value
            },
            class: 'td-w-100px align-middle text-center',
          },
          {
            key: 'created_at',
            title: 'balanceSwapHistoryScreen.time',
            sortable: true,
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'amount',
            title: 'amount',
            sortable: true,
            render: (value, row) => {
              return formatCurrencyAmount(value, row.coin_from, '0', 18)
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'fee',
            title: 'balanceSwapHistoryScreen.fee',
            sortable: true,
            render: (value) => {
              return formatCurrencyAmount(value, 'usd', '0', 18)
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'rate',
            title: 'balanceSwapHistoryScreen.rate',
            sortable: true,
            render: (value) => {
              return formatCurrencyAmount(value, 'usd', '0', null)
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'received',
            title: 'balanceSwapHistoryScreen.received',
            sortable: true,
            render: (value, row) => {
              return formatCurrencyAmount(value, row.coin_to, '0', 18)
            },
            class: 'td-w-250px align-middle text-center',
          },
        ],
        searchColumns: [
          {
            key: 'coin_from',
            title: 'balanceSwapHistoryScreen.from',
            searchType: DatatableSearchType.SELECT,
            options: this.$store.getters.listCoin,
            class: 'td-w-150px',
          },
          {
            key: 'coin_to',
            title: 'balanceSwapHistoryScreen.to',
            searchType: DatatableSearchType.SELECT,
            options: this.$store.getters.listCoin,
            class: 'td-w-150px',
          },
          {
            key: 'status',
            title: 'balanceSwapHistoryScreen.status',
            searchType: DatatableSearchType.SELECT,
            options: Object.values(SWAP_STATUS)
              .filter(isString)
              .map((item) => {
                return { id: SWAP_STATUS[item], name: item }
              })
              .sort((a, b) => a.name.localeCompare(b.name)),
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
    setCurrentPageBreadcrumbs('balanceSwapHistoryScreen.title', [])
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
        const data = await SwapHistoryService.listBalanceSwapHistory(params)
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
      return params
    },

    async handleDownloadCsv(rootParams: any) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const params = this.transformParams(rootParams)
      try {
        let data = await SwapHistoryService.getAllUserBalanceChangeHistory(
          params,
        )
        const swapHistoryData = data.map((item, index) => {
          return {
            no: index + 1,
            email: item.email,
            coin_from: item.coin_from.toUpperCase(),
            coin_to: item.coin_to.toUpperCase(),
            status: item.status,
            balance_type:
              item.balance_type === BALANCE_TYPE.EXCHANGE ||
              item.balance_type === BALANCE_TYPE[BALANCE_TYPE.EXCHANGE]
                ? 'SPOT'
                : item.balance_type,
            created_at: convertTimestampToDate(
              item.created_at,
              'YYYY-MM-DD HH:mm:ss',
            ),
            amount: formatCurrencyAmount(item.amount, item.coin_from, '0', 18),
            fee: formatCurrencyAmount(item.fee, 'usd', '0', 18),
            rate: formatCurrencyAmount(item.rate, 'usd', '0', null),
            received: formatCurrencyAmount(
              item.received,
              item.coin_to,
              '0',
              18,
            ),
          }
        })
        await this.downloadCsv(swapHistoryData)
      } catch (err) {
        this.$toastr.error(this.$t('balanceSwapHistoryScreen.exportFileError'))
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async downloadCsv(data) {
      const fileName = `${this.$t(
        'balanceSwapHistoryScreen.title',
      )}-${moment().format('YYYY-MM-DD')}.csv`
      const headerTitle = [
        this.$t('balanceSwapHistoryScreen.no'),
        this.$t('email'),
        this.$t('balanceSwapHistoryScreen.from'),
        this.$t('balanceSwapHistoryScreen.to'),
        this.$t('status'),
        this.$t('balanceSwapHistoryScreen.walletType'),
        this.$t('balanceSwapHistoryScreen.time'),
        this.$t('amount'),
        this.$t('balanceSwapHistoryScreen.fee'),
        this.$t('balanceSwapHistoryScreen.rate'),
        this.$t('balanceSwapHistoryScreen.received'),
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

      const searchColumnCoinFrom: any = this.tableConfig.searchColumns.find(
        (e) => e.key === 'coin_from',
      )

      searchColumnCoinFrom.options = this.$store.getters.listCoin.map((e) => ({
        id: e,
        name: e,
      }))

      const searchColumnCoinTo: any = this.tableConfig.searchColumns.find(
        (e) => e.key === 'coin_to',
      )

      searchColumnCoinTo.options = this.$store.getters.listCoin.map((e) => ({
        id: e,
        name: e,
      }))
    },
  },
})
</script>
