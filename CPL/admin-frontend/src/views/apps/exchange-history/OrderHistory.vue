<template>
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <!-- Date range -->
        <div class="col-md-4">
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
        <div class="col-md-2">
          <label class="form-label">{{ $t('exchangeHistory.type') }}:</label>
          <v-select
            :options="typeList"
            option-value="id"
            option-label="name"
            :placeholder="$t('exchangeHistory.type')"
            v-model="type"
            searchable
            :can-deselect="false"
          ></v-select>
        </div>
        <div class="col-md-2">
          <label class="form-label">{{ $t('exchangeHistory.side') }}:</label>
          <v-select
            :options="sideList"
            option-value="id"
            option-label="name"
            :placeholder="$t('exchangeHistory.side')"
            v-model="side"
            searchable
            :can-deselect="false"
          ></v-select>
        </div>
        <div class="col-md-2">
          <label class="form-label">{{ $t('exchangeHistory.status') }}:</label>
          <v-select
            :options="statusList"
            option-value="id"
            option-label="name"
            v-model="status"
            searchable
            :can-deselect="false"
          ></v-select>
        </div>
      </div>
      <div class="row justify-content-between mt-4">
        <div class="row col-md-6">
          <div class="col-sm-6">
            <label class="form-label">
              {{ $t('exchangeHistory.searchBy') }}:
            </label>
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
          <div class="col-sm-6">
            <label class="form-label">
              {{ $t('exchangeHistory.keyword') }}:
            </label>
            <input
              class="form-control"
              v-model="keyword"
              @keyup.enter="onSearch()"
            />
          </div>
        </div>
        <div class="col-sm-6 align-self-end text-end">
          <button @click="onSearch()" class="btn btn-primary mx-3">
            <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
          </button>
          <button @click="onReset()" class="btn btn-primary">
            <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
          </button>
        </div>
      </div>
      <!-- Search -->
      <div class="row justify-content-between mt-4"></div>

      <div class="card-body p-0">
        <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
          <template v-slot:cell-coin="{ row: order }">
            <span :title="order.order_id">{{ order.order_id }}</span> /<br />
            {{ order.coin.toUpperCase() }}/{{ order.currency.toUpperCase() }}
          </template>
          <template v-slot:cell-filled_price="{ row: order }">
            <span :title="formatPriceTable(order.filled_price, order.currency)">
              {{ formatPriceTable(order.filled_price, order.currency) }}
            </span>
          </template>
          <template v-slot:cell-stop_price="{ row: order }">
            <span
              data-bs-toggle="tooltip"
              :title="formatPriceTable(order.price, order.currency)"
            >
              {{ formatPriceTable(order.price, order.currency, true) }}
            </span>
            <span
              v-if="+order.stop_price"
              data-bs-toggle="tooltip"
              :title="formatPriceTable(order.stop_price, order.currency)"
            >
              /<br />
              <span>
                <span class="pl-2">
                  {{
                    // eslint-disable-next-line vue/no-parsing-error
                    order.stop_direction === 1 ? '>=' : '<='
                  }}
                </span>
                {{ formatPriceTable(order.stop_price, order.currency) }}
              </span>
            </span>
          </template>
          <template v-slot:cell-filled_volume="{ row: order }">
            <span :title="formatVolume(order.volume, order.coin)">
              {{ formatVolume(order.volume, order.coin) }}
            </span>
            /<br />
            <span
              data-bs-toggle="tooltip"
              :title="
                getPercentageTotalFilled(order.filled_volume, order.volume)
              "
            >
              {{ getPercentageTotalFilled(order.filled_volume, order.volume) }}
            </span>
          </template>
          <template v-slot:cell-fee_order="{ row: order }">
            <div v-if="!order?.fee?.length">--</div>
            <div v-for="fee of order?.fee" :key="fee" v-else>
              <span :title="formatNumberTable(fee.value, fee.currency)">
                {{ formatNumberTable(fee.value, fee.currency) }}</span
              >
            </div>
          </template>
          <template v-slot:cell-type_side="{ row: order }">
            <div
              :class="{
                'text-success': order.order_type == 1,
                'text-danger': order.order_type == 2,
              }"
            >
              {{ $t(`${orderType[order.order_type]}`) }}
            </div>
            <div>
              {{ $t(`${orderClass[order.order_class]}`) }}
            </div>
          </template>
          <template v-slot:cell-status="{ row: order }">
            <div
              data-bs-toggle="tooltip"
              :title="$t(`${orderStatus[order.status]}`)"
            >
              {{ $t(`${orderStatus[order.status]}`) }}
              <span v-if="order.cancelled">
                <span v-if="order.cancelled.resource == cancelResource.ADMIN"
                  >(admin {{ order.cancelled.id }})</span
                >
                <span
                  v-else-if="order.cancelled.resource == cancelResource.SYSTEM"
                  >(system)</span
                >
              </span>
            </div>
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
import {
  HttpStatus,
  ORDER_STATUS as STATUS,
  OrderType,
} from '@/core/variables/common.enum'
import { ExchangeHistoryService } from '@/services/ExchangeHistoryService'
import {
  toFixed,
  divNumberString,
  mulNumberString,
  getPrecision,
} from '@/core/helpers/util'
import {
  ORDER_CLASS,
  ORDER_STATUS,
  ORDER_TYPE,
  MAX_DECIMAL_VOLUME_ROUND,
  MAX_DECIMAL_TOTAL_ROUND,
  MAX_DECIMAL_PRICE_ROUND,
  CANCEL_RESOURCE,
} from '@/core/variables/common.const'
import moment from 'moment'
import { ORDER_DROPDOWN_SEARCH_KEY } from '@/models/exchange-history/OpenOrder'

export default defineComponent({
  name: 'order-history',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.orderHistory', ['menu.exchange'])
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
        side: this.side,
        type: this.type,
        status: this.status,
        keywordType: this.keywordType,
        keyword: this.keyword,
      }
    },
  },
  data() {
    return {
      orderType: ORDER_TYPE,
      orderClass: ORDER_CLASS,
      orderStatus: ORDER_STATUS,
      cancelResource: CANCEL_RESOURCE,
      pair: '',
      pairList: [{ id: '', name: this.$t('exchangeHistory.allPair') }] as {
        id: string
        name: string
      }[],
      type: '',
      side: '',
      keyword: '',
      keywordType: ORDER_DROPDOWN_SEARCH_KEY.ALL,
      status: '',
      dateRange: [
        moment().subtract(1, 'day').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      statusList: [
        { id: '', name: 'orderStatus.allStatus' },
        {
          id: 1,
          name: 'orderStatus.pending',
        },
        {
          id: 2,
          name: 'orderStatus.filled',
        },
        {
          id: 3,
          name: 'orderStatus.canceled',
        },
        {
          id: 4,
          name: 'orderStatus.error',
        },
        {
          id: 5,
          name: 'orderStatus.partialFilled',
        },
        {
          id: 6,
          name: 'orderStatus.processingCancel',
        },
        {
          id: 7,
          name: 'orderStatus.partialFill',
        },
        {
          id: 8,
          name: 'orderStatus.stopping',
        },
        {
          id: 10,
          name: 'orderStatus.canceledByAdmin',
        },
      ],
      typeList: [
        { id: '', name: 'orderType.allType' },
        {
          id: 2,
          name: 'orderType.limit',
        },
        {
          id: 1,
          name: 'orderType.market',
        },
        {
          id: 4,
          name: 'orderType.stopLimit',
        },
        {
          id: 3,
          name: 'orderType.stopMarket',
        },
      ],
      keywordList: [
        {
          id: ORDER_DROPDOWN_SEARCH_KEY.ALL,
          name: 'All',
        },
        {
          id: ORDER_DROPDOWN_SEARCH_KEY.ORDER_ID,
          name: 'Order ID',
        },
        {
          id: ORDER_DROPDOWN_SEARCH_KEY.EMAIL,
          name: 'Email',
        },
      ],
      sideList: [
        { id: '', name: 'orderSide.allSide' },
        {
          id: 1,
          name: 'orderSide.buy',
        },
        {
          id: 2,
          name: 'orderSide.sell',
        },
      ],
      tableReloadKey: 1,
      tableConfig: {
        dataSource: (params) =>
          ExchangeHistoryService.getOrderHistoryList({
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
            key: 'user_id',
            title: 'exchangeHistory.userId',
            sortable: true,
            class: 'td-w-80px min-w-80px',
          },
          {
            key: 'email',
            title: 'exchangeHistory.email',
            sortable: true,
            class: 'td-w-120px min-w-100px',
          },
          {
            key: 'coin',
            title: 'exchangeHistory.orderIdAndPair',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'type_side',
            sortKey: 'order_type', // column name in db is supported to sort
            title: 'exchangeHistory.typeAndSide',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'filled_price',
            title: 'exchangeHistory.average',
            class: 'text-end td-w-150px min-w-100px',
            sortable: false,
            hiddenTitle: true,
          },
          {
            key: 'stop_price',
            sortKey: 'price',
            title: 'exchangeHistory.priceAndStop',
            sortable: true,
            class: 'text-end td-w-150px min-w-80px',
            hiddenTitle: true,
          },
          {
            key: 'filled_volume',
            title: 'exchangeHistory.amountAndFilled',
            sortKey: 'volume',
            sortable: true,
            class: 'text-end td-w-150px min-w-80px',
            hiddenTitle: true,
          },
          {
            key: 'fee_order',
            title: 'exchangeHistory.fee',
            sortable: false,
            class: 'text-end td-w-150px min-w-80px',
          },
          {
            key: 'total',
            title: 'exchangeHistory.total',
            sortable: false,
            class: 'text-end td-w-150px min-w-120px',
            render: (value, order) => {
              if (!Number(order.filled_price) || !Number(order.filled_volume))
                return '--'
              if (
                order.order_class == OrderType.LIMIT ||
                order.order_class == OrderType.STOP_LIMIT ||
                order.status == STATUS.FILLED ||
                order.status == STATUS.PARTIAL_FILLED
              ) {
                const total = mulNumberString(
                  order.filled_price,
                  order.filled_volume,
                )
                if (getPrecision(total) > MAX_DECIMAL_TOTAL_ROUND) {
                  return (
                    toFixed(total, MAX_DECIMAL_TOTAL_ROUND) +
                    ' ' +
                    order.currency.toUpperCase()
                  )
                }
                return toFixed(total) + ' ' + order.currency.toUpperCase()
              }
              return '--'
            },
          },
          {
            key: 'status',
            title: 'exchangeHistory.status',
            sortable: false,
            class: 'td-w-150px min-w-120px',
          },
        ],
        configPage: true,
        configColumn: false,
        tableName: 'order-history-table',
      } as ITableConfig,
      CONFIG,
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
    refreshTable() {
      this.tableReloadKey++
    },
    onReset() {
      this.keyword = ''
      this.dateRange = [
        moment().subtract(1, 'day').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
      this.type = ''
      this.side = ''
      this.status = ''
      this.pair = ''
      this.keywordType = ORDER_DROPDOWN_SEARCH_KEY.ALL
      this.refreshTable()
    },
    toFixed(value) {
      return toFixed(value)
    },
    multiPly(value1: string, value2: string) {
      return mulNumberString(value1, value2)
    },
    dividend(value1: string, value2: string) {
      return divNumberString(value1, value2)
    },
    formatPriceTable(value: string, currency: string) {
      if (!Number(value)) {
        return '--'
      }
      if (getPrecision(value) > MAX_DECIMAL_PRICE_ROUND) {
        return (
          toFixed(value, MAX_DECIMAL_PRICE_ROUND) + ' ' + currency.toUpperCase()
        )
      }
      return toFixed(value) + ' ' + currency.toUpperCase()
    },
    formatNumberTable(value, currency) {
      if (!Number(value)) {
        return '--'
      }
      if (getPrecision(value) > MAX_DECIMAL_VOLUME_ROUND) {
        return (
          toFixed(value, MAX_DECIMAL_VOLUME_ROUND) +
          ' ' +
          currency.toUpperCase()
        )
      }
      return toFixed(value) + ' ' + currency.toUpperCase()
    },
    formatVolume(price, currency) {
      if (!Number(price)) {
        return '--'
      }
      if (getPrecision(price) > MAX_DECIMAL_VOLUME_ROUND) {
        return (
          toFixed(price, MAX_DECIMAL_VOLUME_ROUND) +
          ' ' +
          currency.toUpperCase()
        )
      }
      return toFixed(price) + ' ' + currency.toUpperCase()
    },
    getPercentageTotalFilled(filled_volume: string, volume: string) {
      const value = this.multiPly(this.dividend(filled_volume, volume), '100')
      if (getPrecision(value) > MAX_DECIMAL_VOLUME_ROUND) {
        return toFixed(value, MAX_DECIMAL_VOLUME_ROUND) + ' %'
      }
      return toFixed(value) + ' %'
    },
  },
})
</script>
