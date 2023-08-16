<template>
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-start">
        <!-- Date range -->
        <div class="col-md-5">
          <label class="form-label">{{ $t('exchangeHistory.fromTo') }}:</label>
          <date-range-picker-options
            :start-placeholder="$t('exchangeHistory.startDate')"
            :end-placeholder="$t('exchangeHistory.endDate')"
            v-model="dateRange"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
        <!-- Mode -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('exchangeHistory.pair') }}:</label>
          <v-select
            :options="pairList"
            option-value="id"
            option-label="name"
            :placeholder="$t('exchangeHistory.pair')"
            v-model="pair"
            searchable
            :can-deselect="false"
            :isTranslate="false"
            @change="pairChange(pair)"
          ></v-select>
        </div>
      </div>
      <div class="row justify-content-start mt-4">
        <div class="col-sm-2">
          <label class="form-label"
            >{{ $t('exchangeHistory.searchType') }}:</label
          >
          <v-select
            :options="keywordList"
            option-value="id"
            option-label="name"
            v-model="keywordType"
            searchable
            :can-deselect="false"
            :isTranslate="false"
          ></v-select>
        </div>
        <div class="col-sm-3">
          <label class="form-label">{{ $t('exchangeHistory.keyword') }}:</label>
          <input
            class="form-control"
            v-model="keyword"
            @keyup.enter="onSearch()"
          />
        </div>
        <div class="col-sm-6 align-self-end">
          <button @click="onSearch()" class="btn btn-primary">
            <span>{{ $t('search') }}</span>
          </button>
          <button @click="onReset()" class="btn btn-primary mx-3">
            <span>{{ $t('reset') }}</span>
          </button>
          <button
            @click="onExportFile()"
            class="btn btn-primary"
            :disabled="isSubmitting"
          >
            <span>{{ $t('exportFile') }}</span>
          </button>
        </div>
      </div>
      <div class="card-body p-0">
        <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
          <template v-slot:cell-id="{ row: trade }">
            <span :title="trade.trade_id">{{ trade.trade_id }}</span>
          </template>
          <template v-slot:cell-buy_email="{ row: trade }">
            <span :title="trade.buy_order_id">{{ trade.buy_order_id }}</span>
            /<br />
            <span :title="trade.buy_email">{{ trade.buy_email }}</span>
          </template>
          <template v-slot:cell-sell_email="{ row: trade }">
            <span :title="trade.sell_order_id">{{ trade.sell_order_id }}</span>
            /<br />
            <span :title="trade.sell_email">{{ trade.sell_email }}</span>
          </template>
          <template v-slot:cell-coin="{ row: trade }">
            {{ trade.coin.toUpperCase() }}/{{ trade.currency.toUpperCase() }}
          </template>
          <template v-slot:cell-price="{ row: trade }">
            <span
              :title="`${toFixed(trade.price)} ${trade.currency.toUpperCase()}`"
              >{{ toFixed(trade.price) }}
              {{ trade.currency.toUpperCase() }}</span
            >
          </template>
          <template v-slot:cell-gross_volume="{ row: trade }">
            <span
              :title="`${toFixed(trade.filled)} ${trade.coin.toUpperCase()}`"
              >{{ toFixed(trade.filled) }} {{ trade.coin.toUpperCase() }}</span
            >
          </template>
          <template v-slot:cell-buy_fee="{ row: trade }">
            <span
              :title="`${toFixed(trade.buy_fee)} ${trade.coin.toUpperCase()}`"
            >
              {{ toFixed(trade.buy_fee) }}
              {{ trade.coin.toUpperCase() }}
              <br />
              <span v-if="transactionFeeWalletType[trade.buy_fee_wallet_type]">
                {{
                  $t(
                    `exchangeHistory.${
                      transactionFeeWalletType[trade.buy_fee_wallet_type]
                    }`,
                  )
                }}
              </span>
            </span>
          </template>
          <template v-slot:cell-sell_fee="{ row: trade }">
            <span
              :title="`${toFixed(
                trade.sell_fee,
              )} ${trade.currency.toUpperCase()}`"
            >
              {{ toFixed(trade.sell_fee) }}
              {{ trade.currency.toUpperCase() }}
              <br />
              <span v-if="transactionFeeWalletType[trade.sell_fee_wallet_type]">
                {{
                  $t(
                    `exchangeHistory.${
                      transactionFeeWalletType[trade.sell_fee_wallet_type]
                    }`,
                  )
                }}
              </span>
            </span>
          </template>
        </datatable>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { formatUTCDate, setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import CONFIG from '@/config'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { HttpStatus } from '@/core/variables/common.enum'
import { ExchangeHistoryService } from '@/services/ExchangeHistoryService'
import BigNumber from 'bignumber.js'
import { toFixed } from '@/core/helpers/util'
import moment from 'moment'
import {
  DROPDOWN_SEARCH_KEY,
  TRANSACTION_FEE_WALLET_TYPE,
} from '@/models/exchange-history/TradeHistory'

export default defineComponent({
  name: 'trading-history',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.tradeHistory', ['menu.exchange'])
    await this.getPairList()
  },
  components: { Datatable },
  computed: {
    query: function (): any {
      const [coin, currency] = this.pair.split('/')
      const [from, to] = this.dateRange
      return {
        coin,
        currency,
        from,
        to,
        keywordType: this.keywordType,
        keyword: this.keyword,
      }
    },
  },
  data() {
    return {
      pair: '',
      pairList: [{ id: '', name: this.$t('exchangeHistory.allPair') }] as {
        id: string
        name: string
      }[],
      keyword: '',
      keywordType: DROPDOWN_SEARCH_KEY.ALL,
      dateRange: [
        moment().subtract(1, 'day').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      transactionFeeWalletType: TRANSACTION_FEE_WALLET_TYPE,
      keywordList: [
        {
          id: DROPDOWN_SEARCH_KEY.ALL,
          name: 'All',
        },
        {
          id: DROPDOWN_SEARCH_KEY.BUY_ORDER_ID,
          name: 'Buy order ID',
        },
        {
          id: DROPDOWN_SEARCH_KEY.BUY_EMAIL,
          name: 'Buy email',
        },
        {
          id: DROPDOWN_SEARCH_KEY.SELL_ORDER_ID,
          name: 'Sell order ID',
        },
        {
          id: DROPDOWN_SEARCH_KEY.SELL_EMAIL,
          name: 'Sell email',
        },
        {
          id: DROPDOWN_SEARCH_KEY.TRADE_ID,
          name: 'Trade ID',
        },
      ],
      tableReloadKey: 1,
      tableConfig: {
        dataSource: (params) =>
          ExchangeHistoryService.getTradeHistoryList({
            ...params,
            ...this.query,
          } as any),
        columns: [
          {
            key: 'create_time',
            title: 'exchangeHistory.createAt',
            sortable: true,
            class: 'td-w-150px min-w-80px',
            render: (value) => {
              return formatUTCDate(+value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'id',
            title: 'exchangeHistory.tradeId',
            sortable: true,
            class: 'td-w-100px min-w-60px',
          },
          {
            key: 'buy_email',
            title: 'exchangeHistory.buyOrderOrEmail',
            sortable: false,
            class: 'td-w-180px min-w-150px',
          },
          {
            key: 'sell_email',
            title: 'exchangeHistory.sellOrderOrEmail',
            class: 'td-w-180px min-w-150px',
            sortable: false,
          },
          {
            key: 'coin',
            title: 'exchangeHistory.pair',
            sortable: true,
            class: 'td-w-120px min-w-100px',
          },
          {
            key: 'price',
            title: 'exchangeHistory.price',
            sortable: true,
            class: 'text-end td-w-150px min-w-100px',
          },
          {
            key: 'gross_volume',
            title: 'exchangeHistory.filled',
            sortable: true,
            class: 'text-end td-w-150px min-w-100px',
          },
          {
            key: 'buy_fee',
            title: 'exchangeHistory.buyFee',
            sortable: false,
            class: 'text-end td-w-150px min-w-100px',
          },
          {
            key: 'sell_fee',
            title: 'exchangeHistory.sellFee',
            sortable: false,
            class: 'text-end td-w-150px min-w-100px',
          },
          {
            key: 'total',
            title: 'exchangeHistory.total',
            sortable: false,
            class: 'text-end td-w-150px min-w-100px',
            render: (value, order) => {
              return `${new BigNumber(order.price).multipliedBy(
                order.filled,
              )} ${order.currency.toUpperCase()}`
            },
          },
        ],
        configPage: true,
        configColumn: false,
        tableName: 'order-history-table',
      } as ITableConfig,
      CONFIG,
      isSubmitting: false,
    }
  },
  methods: {
    async getPairList() {
      const pairData = await SettingExchangeService.getListPairName()
      this.pairList = [{ id: '', name: this.$t('exchangeHistory.allPair') }]
      if (pairData.status != HttpStatus.OK) {
        return
      }
      const pairMap = pairData.data['data']
        .sort((a: any, b: any) => {
          return a.coin < b.coin ? -1 : 1
        })
        .map((item) => {
          return {
            id: `${item.coin}/${item.currency}`,
            name: `${item.coin.toUpperCase()}/${item.currency.toUpperCase()}`,
          }
        })
      this.pairList.push(...pairMap)
    },
    pairChange(pair) {
      this.pair = pair
      this.refreshTable()
    },
    onSearch() {
      this.refreshTable()
    },
    async onExportFile() {
      if (this.isSubmitting) {
        return
      }
      this.isSubmitting = true

      const response = await ExchangeHistoryService.exportTradeHistory({
        ...this.query,
      })
      if (response.status !== HttpStatus.OK) {
        this.$toastr.error(
          this.$t((response?.data as unknown as any)?.message) ||
            'Something went wrong',
        )
      } else {
        this.$toastr.success(
          'Send file export request for trade history successfully.\nThe file download link will be sent to the email address',
        )
      }

      setTimeout(() => {
        this.isSubmitting = false
      }, 5000)
    },
    refreshTable() {
      this.tableReloadKey++
    },
    onReset() {
      this.keyword = ''
      this.dateRange = [
        moment().subtract(1, 'day').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
      this.pair = ''
      this.keywordType = DROPDOWN_SEARCH_KEY.ALL
      this.refreshTable()
    },
    toFixed(value: string) {
      return toFixed(value)
    },
  },
})
</script>
