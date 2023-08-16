<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t(`menu.futures.orderHistory`) }}
      </div>

      <div class="card-toolbar"></div>
    </div>

    <div class="card-body pt-0">
      <datatable :config="tableConfig" :soft-reload-key="softReloadKey">
        <template v-slot:cell-type="{ row: order }">
          <span :title="$t(`futures.common.orderTypeOptions.${order.type}`)">
            {{ $t(`futures.common.orderTypeOptions.${order.type}`) }}
          </span>
        </template>
        <template v-slot:cell-side="{ row: order }">
          <span
            :title="`${$t(`futures.common.orderSideOptions.${order.side}`)}`"
            :class="{
              'text-success': order.side === OrderSide.Buy,
              'text-danger': order.side === OrderSide.Sell,
            }"
          >
            {{ $t(`futures.common.orderSideOptions.${order.side}`) }}
          </span>
        </template>
        <template v-slot:cell-id="{ row: order }">
          {{ order.id }} / {{ order.coin.toUpperCase() }}/{{
            order.currency.toUpperCase()
          }}</template
        >
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { HttpStatus } from '@/core/variables/common.enum'
import { toFixed } from '@/core/helpers/util'
import { FutureService } from '@/services/FutureService'
import { UserService } from '@/services/UserService'
import { DateRangePickerMode } from '@/libs/DateRangePicker.vue'
import {
  OrderSide,
  OrderStatus,
  OrderType,
} from '@/core/variables/futures.enum'
import _ from 'lodash'
import { futureFilterParams } from '@/core/helpers/util'

export default defineComponent({
  name: 'futures-order-history',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.futures.orderHistory', [
      'menu.futures.title',
    ])
  },
  components: { Datatable },
  computed: {
    tableConfig(): ITableConfig {
      return {
        buttonSectionClass: 'col-auto mb-2 pt-8',
        identifyField: 'id',
        isShowLabelFilter: true,
        dataSource: (params) => {
          const filterParams = futureFilterParams({
            ..._.cloneDeep(params),
            ...{
              order_status: [
                OrderStatus.Canceling,
                OrderStatus.Canceled,
                OrderStatus.Error,
                OrderStatus.Filled,
              ],
            },
          })
          return FutureService.getOrderHistoryList(filterParams)
        },
        columns: [
          {
            key: 'create_time',
            title: 'futures.common.createAt',
            sortable: true,
            class: 'td-w-120px min-w-80px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'user_id',
            title: 'futures.common.userId',
            sortable: true,
            class: 'td-w-120px min-w-80px text-center',
          },
          {
            key: 'email',
            title: 'futures.common.email',
            sortable: false,
            class: 'td-w-200px min-w-100px',
          },
          {
            key: 'id',
            title: 'futures.common.orderId',
            sortable: true,
            class: 'td-w-300px min-w-200px text-center',
          },
          {
            key: 'side',
            title: 'futures.common.side',
            sortable: true,
            class: 'td-w-70px min-w-50px text-center',
          },
          {
            key: 'type',
            title: 'futures.common.type',
            class: 'td-w-70px min-w-50px text-center',
            sortable: true,
          },
          {
            key: 'price',
            title: 'futures.orderHistory.limitPrice',
            sortable: true,
            class: 'text-end td-w-120px min-w-80px',
            render: (value, order) => {
              return order.type == OrderType.Limit ||
                order.type == OrderType.StopLimit
                ? `${toFixed(value)} ${order.currency.toUpperCase()}`
                : '--'
            },
          },
          {
            key: 'volume',
            title: 'futures.common.amount',
            sortable: true,
            class: 'text-end td-w-120px min-w-80px',
            render: (value, order) => {
              return `${toFixed(value)} ${order.coin.toUpperCase()}`
            },
          },
          {
            key: 'pnl',
            title: 'futures.orderHistory.pnl',
            class: 'td-w-200px min-w-150px text-center',
            sortable: true,
          },
          {
            key: 'matching_price',
            title: 'futures.orderHistory.matchingPrice',
            class: 'td-w-200px min-w-150px text-center',
            sortable: true,
          },
        ],
        searchColumns: [
          {
            key: 'order_id',
            title: 'futures.common.orderId',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'user_id',
            title: 'futures.common.email',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async (text) => {
              const users = await UserService.searchByFilter({
                email: text,
              })
              if (!users) return []
              if (users.status !== HttpStatus.OK) {
                return []
              }
              return users.data.map((user) => {
                return { id: user.id, name: user.email }
              })
            },
          },
          {
            key: 'created_at_date',
            startPlaceholder: 'futures.common.startDate',
            endPlaceholder: 'futures.common.endDate',
            searchType: DatatableSearchType.DATE_RANGE,
            mode: DateRangePickerMode.DATE,
            title: 'futures.common.createAt',
          },
          {
            key: 'order_type',
            title: 'futures.common.orderType',
            searchType: DatatableSearchType.SELECT,
            options: [
              OrderType.Market,
              OrderType.Limit,
              OrderType.Liquidation,
              OrderType.TakeProfit,
              OrderType.StopLoss,
              OrderType.CloseMarket,
              OrderType.StopLimit,
              OrderType.StopMarket,
            ].map((e) => ({
              id: e,
              name: this.$t(`futures.common.orderTypeOptions.${e}`),
            })),
          },
          {
            key: 'order_side',
            title: 'futures.common.orderSide',
            searchType: DatatableSearchType.SELECT,
            options: [OrderSide.Buy, OrderSide.Sell].map((e) => ({
              id: e,
              name: this.$t(`futures.common.orderSideOptions.${e}`),
            })),
          },
          {
            key: 'coin_currency',
            title: 'futures.common.pair',
            searchType: DatatableSearchType.SELECT,
            remote: true,
            remoteOptions: async (coinCurrency) => {
              const [coin, currency] = coinCurrency.split('/')
              const result = await FutureService.getSettings({ coin, currency })
              if (result.status !== HttpStatus.OK || result.data.length < 1)
                return []
              return result.data.map((e) => ({
                id: `${e.coin}/${e.currency}`,
                name: `${e.coin.toUpperCase()}/${e.currency.toUpperCase()}`,
              }))
            },
          },
        ],
        configPage: true,
        configColumn: false,
        tableName: 'open-order-table',
      }
    },
  },
  data() {
    return {
      softReloadKey: 0,
      OrderSide,
      checkedOrders: [] as string[],
      OrderStatus,
    }
  },
  methods: {
    onSearch() {
      this.refreshTable()
    },
    refreshTable() {
      this.softReloadKey++
    },
  },
})
</script>
<style lang="scss" scoped>
.selected-price {
  background-color: #f5f8fa;
}
</style>
