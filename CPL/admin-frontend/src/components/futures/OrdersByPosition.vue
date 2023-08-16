<template>
  <datatable :config="tableConfig">
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
  </datatable>
</template>

<script lang="ts">
import { convertTimestampToDate } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { toFixed } from '@/core/helpers/util'
import { FutureService } from '@/services/FutureService'
import {
  OrderSide,
  OrderStatus,
  OrderType,
} from '@/core/variables/futures.enum'
import _ from 'lodash'
import { futureFilterParams } from '@/core/helpers/util'

export default defineComponent({
  name: 'orders-by-position',
  components: { Datatable },
  props: {
    positionId: String,
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        defaultPageSize: 10,
        dataSource: (params) => {
          const filterParams = futureFilterParams({
            ..._.cloneDeep(params),
            position_id: this.positionId,
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
        configColumn: false,
        tableName: 'order-by-position-table',
      }
    },
  },
  data() {
    return {
      OrderSide,
      OrderStatus,
    }
  },
})
</script>
