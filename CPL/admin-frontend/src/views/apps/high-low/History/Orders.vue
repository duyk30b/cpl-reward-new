<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-10">
        <!-- Date range -->
        <div class="col-md-4">
          <label class="form-label">{{ $t('highLow.date') }}:</label>
          <date-range-picker-options
            :start-placeholder="$t('startDate')"
            :end-placeholder="$t('endDate')"
            v-model="dateRange"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
        <!-- Mode -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.mode') }}:</label>
          <v-select
            :options="modeOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="mode"
            searchable
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- Pair -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.pair') }}:</label>
          <v-select
            :options="pairOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="pair"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- Win / Lose -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.winLose') }}:</label>
          <v-select
            :options="winLoseOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="winLose"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- Status -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.status') }}:</label>
          <v-select
            :options="statusOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="status"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
      </div>

      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="row justify-content-between mt-4">
      <div class="col-md-4">
        <input
          class="form-control"
          :placeholder="$t('keyword')"
          v-model="searchText"
          @keyup="(e) => e.keyCode == 13 && onSearch()"
        />
      </div>
      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onReset"
          :title="$t('reset')"
        >
          <i v-if="!loading" class="fas fa-sync fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
        </button>
      </div>
    </div>

    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { getPeriodByValue } from '@/core/helpers/common.helper'
import CONFIG from '@/config'
import { HighLowService } from '@/services/HighLowService'
import { format } from 'date-fns'
import { BigNumber } from 'bignumber.js'
import store from '@/store'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'orders',
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
  mounted() {
    this.getModes()
    this.getPairs()
  },
  data() {
    return {
      searchText: '',
      loading: false,
      tableReloadKey: 1,
      // date
      dateRange: [
        '2022-01-01',
        new Date().getFullYear() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getDate(),
      ],
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

      // mode
      mode: '',
      modeOptions: [...store.getters.getModes],

      // period
      pair: '',
      pairOptions: [
        { id: '', name: 'all' },
        { id: 'BTC/USD', name: 'BTC/USD' },
        { id: 'ETH/USD', name: 'ETH/USD' },
        { id: 'BCH/USD', name: 'BCH/USD' },
        { id: 'XRP/USD', name: 'XRP/USD' },
        { id: 'LTC/USD', name: 'LTC/USD' },
      ],

      // Win / lose
      winLose: '',
      winLoseOptions: [
        { id: '', name: 'all' },
        { id: 'win', name: 'highLow.win' },
        { id: 'lose', name: 'highLow.lose' },
      ],

      // Status
      status: '',
      statusOptions: [
        { id: '', name: 'all' },
        { id: 'opened', name: 'highLow.opened' },
        { id: 'closed', name: 'highLow.closed' },
      ],

      tableConfig: {
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

          table.pagination = res.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount)
            table.getData(true)
          else {
            table.data = res.data.data || []
            table.data.forEach((row, index) => {
              if (!row.id)
                row.id =
                  index +
                  1 +
                  (table.pagination.page - 1) * table.pagination.size
            })
            if (table.config.drawCallback) table.config.drawCallback()
          }
        },
        dataSource: (params) =>
          HighLowService.getHistoriesOrders({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'email',
            title: 'email',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
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
            title: 'highLow.timeFrame',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              return getPeriodByValue(value)
            },
          },
          {
            key: 'symbol',
            title: 'highLow.pair',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'id',
            title: 'highLow.orderID',
            class: 'text-center td-w-100px min-w-80px',
            sortable: true,
          },
          {
            key: 'strike',
            title: 'highLow.strike',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              let num = new BigNumber(value).toFormat(10)
              return num.replace(/(\.0*|(?<=(\..*))0*)$/, '')
            },
          },
          {
            key: 'buy_time',
            title: 'highLow.startTime',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              const temp =
                value && format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
              return temp
            },
          },
          {
            key: 'expire_time',
            title: 'highLow.expiry',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
            },
          },
          {
            key: 'closing_rate',
            title: 'highLow.closingRate',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              if (value) {
                let num = new BigNumber(value).toFormat(10)
                return num.replace(/(\.0*|(?<=(\..*))0*)$/, '')
              }
              return '--'
            },
          },
          {
            key: 'invest',
            title: 'highLow.investment',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
          },
          {
            key: 'cashback_transaction_id',
            title: 'highLow.investmentType',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return !value ? 'Balance' : 'Cashback'
            },
          },
          {
            key: 'expire_payout',
            title: 'highLow.expiryPayout',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
          },
          {
            key: 'buy_payout',
            title: 'highLow.buyPayout',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
          },
          {
            key: 'bcast_use',
            title: 'highLow.bscastNeed',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return value ? value : '--'
            },
          },
          {
            key: 'sell_payout',
            title: 'highLow.sellPayout',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return value || '--'
            },
          },
          {
            key: 'cashback_profit',
            title: 'highLow.cashback',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return value
                ? value + ' ' + this.$t('highLow.usdt')
                : 0 + ' ' + this.$t('highLow.usdt')
            },
          },
          {
            key: 'profit',
            title: 'highLow.balance',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              return `${value} ${this.$t('highLow.usdt')}`
            },
          },
          {
            key: 'status',
            title: 'status',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px capitalize',
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: true,
        tableName: 'orders-table',
        // getExport: () => HighLowService.getHistoryOrdersExport(),
        createExport: async (params) => {
          let query = {
            lang: this.getLang(),
          }
          if (params) {
            query = {
              ...params,
              ...this.query,
              lang: this.getLang(),
            }
          }

          let data = await HighLowService.exportHistoriesOrders(query)

          if (data) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        },
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
        winLose: this.winLose || undefined,
        status: this.status || undefined,
        pair: this.pair || undefined,
        mode: this.mode || undefined,
        search_text: this.searchText.trim()
          ? this.searchText.trim()
          : undefined,
      }
    },
    fromTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => {
          let startDate = item
          if (item) {
            startDate = item + ' 00:00:00'
          }

          return this.validateDate(startDate)
        })[0]
        .toString()
    },
    toTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => {
          let endDate = item
          if (item != '') {
            endDate = item + ' 23:59:59'
          }

          return this.validateDate(endDate)
        })[1]
        .toString()
    },
  },
  methods: {
    getPairs: async function () {
      this.pairOptions = []

      const response = await HighLowService.getSettingTradingPair({
        get_only: true,
      })
      const { data } = response
      this.pairOptions.push({
        id: '',
        name: 'all',
      })
      data.data.forEach((item) => {
        const temp = {
          id: item.symbol,
          name: item.symbol,
        }

        this.pairOptions.push(temp)
      })
    },
    onSearch() {
      this.refreshTable()
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    getModes: async function () {
      this.modeOptions = []

      const response = await HighLowService.getSettingTradingModes({
        get_only: true,
      })
      const { data } = response
      this.modeOptions.push({
        id: '',
        name: 'All',
      })
      data.data.forEach((item) => {
        const temp = {
          id: item.mode,
          name: item.name,
        }

        this.modeOptions.push(temp)
      })
    },
    onReset() {
      this.searchText = ''
      ;(this.dateRange = [
        '2022-01-01',
        new Date().getFullYear() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getDate(),
      ]),
        (this.winLose = '')
      this.status = ''
      this.pair = ''
      this.mode = ''

      this.refreshTable()
    },
    refreshTable() {
      this.loading = true
      this.tableReloadKey++
    },
  },
})
</script>
