<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t(`menu.futures.openOrder`) }}
      </div>

      <div class="card-toolbar"></div>
    </div>

    <div class="card-body pt-0">
      <datatable
        :config="tableConfig"
        @checkAll="handleCheckAll"
        @cancelFutureOrder="cancelOrder"
        :soft-reload-key="softReloadKey"
        :checked-future-orders="checkedOrders"
      >
        <template v-slot:cell-checkbox="{ row: order }">
          <div
            class="form-check form-check-sm form-check-custom form-check-solid"
          >
            <div v-if="order.status === OrderStatus.Canceling">
              <div class="loading-area">
                <slot name="loading">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">{{ $t('loading') }}</span>
                  </div>
                </slot>
              </div>
            </div>
            <input
              v-else
              type="checkbox"
              class="form-check-input"
              :value="order.id"
              data-kt-user-tag="check"
              v-model="checkedOrders"
              :disabled="!canCancelOrder(order)"
            />
          </div>
        </template>
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
        <!--        <template v-slot:cell-action="{ row: order }">-->
        <!--          <span-->
        <!--            v-if="order.status === orderStatus.Canceling"-->
        <!--            class="d-none d-md-inline-block"-->
        <!--          >-->
        <!--            {{ $t('futures.openOrder.cancelling') }}-->
        <!--          </span>-->
        <!--                  <button-->
        <!--                    v-else-if="canCancelOrder(order)"-->
        <!--                    class="btn btn-sm btn-danger"-->
        <!--                    @click="cancelOrder([order.id])"-->
        <!--                  >-->
        <!--                    <span class="d-none d-md-inline-block">-->
        <!--                      {{ $t('futures.openOrder.cancel') }}-->
        <!--                    </span>-->
        <!--                  </button>-->
        <!--          <div v-else style="cursor: not-allowed">-->
        <!--            <button disabled class="btn btn-sm btn-secondary">-->
        <!--              <span class="d-none d-md-inline-block">{{-->
        <!--                $t('futures.openOrder.cancel')-->
        <!--              }}</span>-->
        <!--            </button>-->
        <!--          </div>-->
        <!--        </template>-->
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
import { mulNumberString, toFixed } from '@/core/helpers/util'
import Swal from 'sweetalert2'
import { Order } from '@/models/future/OpenOrder'
import { FutureService } from '@/services/FutureService'
import { UserService } from '@/services/UserService'
import { DateRangePickerMode } from '@/libs/DateRangePicker.vue'
import {
  UserType,
  OrderType,
  OrderSide,
  OrderStatus,
} from '@/core/variables/futures.enum'
import _ from 'lodash'
import { futureFilterParams } from '@/core/helpers/util'

export default defineComponent({
  name: 'futures-open-order',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.futures.openOrder', ['menu.futures.title'])
  },
  components: { Datatable },
  computed: {
    tableConfig(): ITableConfig {
      return {
        buttonSectionClass: 'col-auto mb-2 pt-8',
        isFutureCancelOrder: true,
        identifyField: 'id',
        isShowLabelFilter: true,
        dataSource: (params) => {
          const filterParams = futureFilterParams({
            ..._.cloneDeep(params),
            ...{ order_status: [OrderStatus.Open] },
          })
          return FutureService.getOpenOrderList(filterParams)
        },
        columns: [
          {
            key: 'checkbox',
            title: '',
            sortable: false,
            class: 'text-center td-w-50px min-w-50px',
          },
          {
            key: 'create_time',
            title: 'futures.common.createAt',
            sortable: false,
            class: 'td-w-150px min-w-80px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'user_id',
            title: 'futures.common.userId',
            sortable: false,
            class: 'td-w-120px min-w-100px text-center',
          },
          {
            key: 'email',
            title: 'futures.common.email',
            sortable: false,
            class: 'td-w-120px min-w-100px',
          },
          {
            key: 'id',
            title: 'futures.common.orderId',
            sortable: true,
            class: 'td-w-180px min-w-150px text-center',
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
            class: 'td-w-120px min-w-100px text-center',
            sortable: true,
          },
          {
            key: 'price',
            title: 'futures.openOrder.price',
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
            key: 'leverage',
            title: 'futures.common.leverage',
            class: 'td-w-120px min-w-100px text-center',
            sortable: true,
          },
          {
            key: 'total',
            title: 'futures.common.total',
            sortable: false,
            class: 'text-end td-w-120px min-w-80px',
            render: (value, order) => {
              return order.type == OrderType.Limit ||
                order.type == OrderType.StopLimit
                ? `${mulNumberString(
                    order.price,
                    order.volume,
                  )} ${order.currency.toUpperCase()}`
                : '--'
            },
          },
          // {
          //   key: 'action',
          //   title: '',
          //   sortable: false,
          //   class: 'text-center td-w-120px min-w-80px',
          // },
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
            key: 'user_type',
            title: 'futures.openOrder.userType',
            searchType: DatatableSearchType.SELECT,
            options: [UserType.User, UserType.FutureCore, UserType.BotP].map(
              (e) => ({
                id: e,
                name: this.$t(`futures.openOrder.userTypeOptions.${e}`),
              }),
            ),
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
    canCancelOrder(order: Order) {
      return [OrderStatus.Open].includes(order.status)
    },
    async cancelOrder(orderIDs: Array<string>) {
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to cancel ${
          orderIDs.length < 2 ? 'this order' : 'these orders'
        }?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (!result.isConfirmed) return

        if (orderIDs.length < 1) {
          this.$toastr.warning(this.$t('futures.openOrder.cancelEmptyWarning'))
          return
        }

        const cancelledOrders = await FutureService.cancelOrder({
          order_id: orderIDs,
        })
        if (cancelledOrders.status != HttpStatus.OK) {
          this.$toastr.error(this.$t('futures.openOrder.cancelError'))
          return
        }
        this.$toastr.success(this.$t('futures.openOrder.cancelSuccess'))
        setTimeout(() => {
          this.refreshTable()
        }, 1000)
      })
    },
    onSearch() {
      this.refreshTable()
    },
    refreshTable() {
      this.softReloadKey++
    },
    onReset() {
      this.refreshTable()
    },
    handleCheckAll(data) {
      if (!data.checked) {
        if (data.data && data.data.length) {
          this.checkedOrders = data.data
            .filter((item) => this.canCancelOrder(item))
            .map((o) => o.id)
        } else {
          this.checkedOrders = []
        }
      } else {
        this.checkedOrders = []
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.selected-price {
  background-color: #f5f8fa;
}
</style>
