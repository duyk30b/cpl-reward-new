<template>
  <div class="card">
    <div class="card-body pt-0 d-flex">
      <div class="orderbook-container">
        <Orderbook
          :pair="pair"
          :pairList="pairList"
          :setting="getSettingPair"
          @pairChange="pairChange($event)"
          @selectOrder="selectOrder($event)"
          ref="orderBook"
        />
      </div>
      <div class="open-order-container">
        <div class="card p-3">
          <div class="row justify-content-between">
            <!-- Date range -->
            <div class="col-md-5">
              <label class="form-label"
                >{{ $t('exchangeHistory.fromTo') }}:</label
              >
              <date-range-picker-options
                :start-placeholder="$t('exchangeHistory.startDate')"
                :end-placeholder="$t('exchangeHistory.endDate')"
                v-model="dateRange"
                format="YYYY-MM-DD"
              ></date-range-picker-options>
            </div>
            <div class="col-md-3">
              <label class="form-label"
                >{{ $t('exchangeHistory.type') }}:</label
              >
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
              <label class="form-label"
                >{{ $t('exchangeHistory.side') }}:</label
              >
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
              <label class="form-label"
                >{{ $t('exchangeHistory.userType') }}:</label
              >
              <v-select
                :options="userTypeList"
                option-value="id"
                option-label="name"
                :placeholder="$t('exchangeHistory.userType')"
                v-model="userType"
                searchable
                :can-deselect="false"
                :isTranslate="false"
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
            <div class="col-sm-4">
              <label class="form-label"
                >{{ $t('exchangeHistory.keyword') }}:</label
              >
              <input
                class="form-control"
                v-model="keyword"
                @keyup.enter="onSearch()"
              />
            </div>
            <div class="col-sm-4 align-self-end text-end">
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
          <div class="row justify-content-start mt-4">
            <div
              class="d-flex col-md-12 align-self-center justify-content-between"
            >
              <div>
                <button
                  @click="cancelOrder(checkedOrders)"
                  class="btn btn-danger"
                  :disabled="checkedOrders.length == 0"
                  :title="$t('exchangeHistory.cancelOrders')"
                >
                  <span>{{ $t('exchangeHistory.cancelOrders') }}</span>
                </button>
                <button
                  @click="onSearch()"
                  class="btn btn-primary mx-3"
                  :title="$t('exchangeHistory.reload')"
                >
                  <span>{{ $t('exchangeHistory.reload') }}</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Search -->
          <div
            v-if="selectedPrice"
            class="selected-price d-flex align-items-center rounded p-2 mt-3"
          >
            <div class="flex-grow-1">
              <span class="text-muted fw-bold d-block">{{
                $t('exchangeHistory.notificationSelectPrice', {
                  side: $t(`${orderType[selectedSide]}`),
                  price: selectedPrice,
                  currency: pair.split('/')[1].toUpperCase(),
                })
              }}</span>
            </div>
            <div>
              <button
                @click="deletePriceSelected()"
                class="btn btn-sm btn-flex btn-light-danger"
              >
                <span class="svg-icon svg-icon-3">
                  <inline-svg src="media/icons/duotune/general/gen040.svg" />
                </span>
              </button>
            </div>
          </div>
          <div class="card-body p-0">
            <datatable
              :config="tableConfig"
              @checkAll="handleCheckAll"
              :forceReloadKey="tableReloadKey"
              ref="openOrder"
            >
              <template v-slot:cell-checkbox="{ row: order }">
                <div
                  class="form-check form-check-sm form-check-custom form-check-solid"
                >
                  <div v-if="order.status === orderStatus.PROCESSING_CANCEL">
                    <div class="loading-area">
                      <slot name="loading">
                        <div class="spinner-border text-primary" role="status">
                          <span class="visually-hidden">{{
                            $t('loading')
                          }}</span>
                        </div>
                      </slot>
                    </div>
                  </div>
                  <input
                    v-else
                    type="checkbox"
                    class="me-3"
                    :value="!order.error_count ? order.order_id : undefined"
                    data-kt-user-tag="check"
                    v-model="checkedOrders"
                    :disabled="!canCancelOrder(order)"
                  />
                </div>
              </template>
              <template v-slot:cell-order_type="{ row: order }">
                <div
                  :class="{
                    'text-success': order.order_type == 1,
                    'text-danger': order.order_type == 2,
                  }"
                  :title="$t(`${orderType[order.order_type]}`)"
                >
                  {{ $t(`${orderType[order.order_type]}`) }}
                </div>
              </template>
              <template v-slot:cell-order_class="{ row: order }">
                <span :title="`${$t(orderClass[order.order_class])}`">
                  {{ $t(`${orderClass[order.order_class]}`) }}
                </span>
              </template>
              <template v-slot:cell-action="{ row: order }">
                <span
                  v-if="order.status === orderStatus.PROCESSING_CANCEL"
                  class="d-none d-md-inline-block"
                >
                  {{ $t('exchangeHistory.cancelling') }}
                </span>
                <button
                  v-else-if="canCancelOrder(order)"
                  class="btn btn-sm btn-danger"
                  @click="cancelOrder([order.order_id])"
                >
                  <span class="d-none d-md-inline-block">
                    {{ $t('exchangeHistory.cancel') }}
                  </span>
                </button>
                <div v-else style="cursor: not-allowed">
                  <button disabled class="btn btn-sm btn-secondary">
                    <span class="d-none d-md-inline-block">{{
                      $t('exchangeHistory.cancel')
                    }}</span>
                  </button>
                </div>
              </template>
            </datatable>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { formatUTCDate, setPageFliud } from '@/core/helpers/common.helper'
import Orderbook from '@/components/exchange-history/Orderbook.vue'
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import CONFIG from '@/config'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import {
  HttpStatus,
  ORDER_STATUS,
  OrderType,
} from '@/core/variables/common.enum'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import { plainToInstance } from 'class-transformer'
import { ExchangeHistoryService } from '@/services/ExchangeHistoryService'
import { mulNumberString, toFixed } from '@/core/helpers/util'
import Swal from 'sweetalert2'
import { ORDER_CLASS, ORDER_TYPE } from '@/core/variables/common.const'
import { onUpdateOrderSocket } from '@/apis/socketOrder'
import {
  ORDER_DROPDOWN_SEARCH_KEY,
  OpenOrderItem,
} from '@/models/exchange-history/OpenOrder'

export default defineComponent({
  name: 'open-order',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.openOrder', ['menu.exchange'])
    await this.getPairList()
    onUpdateOrderSocket(this.onSocketUpdate)
  },
  components: { Orderbook, Datatable },
  computed: {
    getSettingPair(): PairItem {
      const [coin, currency] = this.pair.split('/')
      const setting = this.pairSetting.find((item) => {
        return item.coin == coin && item.currency == currency
      })
      return (
        setting ||
        plainToInstance(PairItem, {
          coin: 'btc',
          currency: 'usdt',
          default_precision: '0.01',
          decimal_of_amount: '0.00000001',
          precisions: ['0.00000001'],
        })
      )
    },
    query: function (): any {
      const [coin, currency] = this.pair.split('/')
      const [from, to] = this.dateRange || ['', '']
      if (this.selectedPrice) {
        return {
          coin,
          currency,
          price: this.selectedPrice,
          selected_side: this.selectedSide,
        }
      }
      return {
        coin,
        currency,
        from,
        to,
        side: this.side,
        type: this.type,
        user_type: this.userType,
        keywordType: this.keywordType,
        keyword: this.keyword,
      }
    },
  },
  data() {
    return {
      orderStatus: ORDER_STATUS,
      orderType: ORDER_TYPE,
      orderClass: ORDER_CLASS,
      pair: 'btc/usdt',
      pairList: [{ id: 'btc/usdt', name: 'BTC/USDT' }],
      type: '',
      side: '',
      keyword: '',
      userType: '',
      selectedPrice: '',
      selectedSide: '',
      keywordType: ORDER_DROPDOWN_SEARCH_KEY.ALL,
      dateRange: null,
      checkedOrders: [] as string[],
      pairSetting: [] as PairItem[],
      userTypeList: [
        { id: '', name: this.$t('exchangeHistory.allUser') },
        {
          id: 1,
          name: 'User',
        },
        {
          id: 2,
          name: 'Bot A',
        },
        {
          id: 3,
          name: 'Bot P',
        },
        {
          id: 4,
          name: 'Bot G',
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
        identifyField: 'order_id',
        isOpenOrder: true,
        dataSource: (params) =>
          ExchangeHistoryService.getOpenOrderList({
            ...params,
            ...this.query,
          } as any),
        columns: [
          {
            key: 'checkbox',
            title: '',
            sortable: false,
            class: 'text-center td-w-50px min-w-50px',
          },
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
            class: 'td-w-120px min-w-100px',
          },
          {
            key: 'email',
            title: 'exchangeHistory.email',
            sortable: true,
            class: 'td-w-120px min-w-100px',
          },
          {
            key: 'order_id',
            title: 'exchangeHistory.orderId',
            sortable: true,
            class: 'td-w-180px min-w-150px',
          },
          {
            key: 'order_type',
            title: 'exchangeHistory.side',
            sortable: true,
            class: 'td-w-70px min-w-50px',
          },
          {
            key: 'order_class',
            title: 'exchangeHistory.type',
            class: 'td-w-120px min-w-100px',
            sortable: true,
          },
          {
            key: 'price',
            title: 'exchangeHistory.price',
            sortable: true,
            class: 'text-end td-w-120px min-w-80px',
            render: (value, order) => {
              return order.order_class == OrderType.LIMIT ||
                order.order_class == OrderType.STOP_LIMIT
                ? `${toFixed(value)} ${order.currency.toUpperCase()}`
                : '--'
            },
          },
          {
            key: 'volume',
            title: 'exchangeHistory.amount',
            sortable: true,
            class: 'text-end td-w-120px min-w-80px',
            render: (value, order) => {
              return `${toFixed(value)} ${order.coin.toUpperCase()}`
            },
          },
          {
            key: 'total',
            title: 'exchangeHistory.total',
            sortable: false,
            class: 'text-end td-w-120px min-w-80px',
            render: (value, order) => {
              return order.order_class == OrderType.LIMIT ||
                order.order_class == OrderType.STOP_LIMIT
                ? `${mulNumberString(
                    order.price,
                    order.volume,
                  )} ${order.currency.toUpperCase()}`
                : '--'
            },
          },
          {
            key: 'action',
            title: '',
            sortable: false,
            class: 'text-center td-w-120px min-w-80px',
          },
        ],
        configPage: true,
        configColumn: false,
        tableName: 'open-order-table',
      } as ITableConfig,
      CONFIG,
      isSubmitting: false,
    }
  },
  methods: {
    canCancelOrder(order: OpenOrderItem) {
      return (
        [ORDER_STATUS.PENDING, ORDER_STATUS.PARTIAL_FILL].includes(
          order.status,
        ) && !order.error_count
      )
    },
    async cancelOrder(orderID: Array<string>) {
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to cancel ${
          orderID.length < 2 ? 'this order' : 'these orders'
        }?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await ExchangeHistoryService.cancelOrder({
            order_ids: orderID,
          })
          if (result.status != HttpStatus.OK) {
            this.$toastr.error(this.$t('exchangeHistory.error'))
            return
          }
          setTimeout(() => {
            this.refreshTable()
          }, 1000)
        }
      })
    },
    async getPairList() {
      const pairData = await SettingExchangeService.getListPairName()
      if (pairData.status != HttpStatus.OK) {
        this.pairList = [{ id: 'btc/usdt', name: 'BTC/USDT' }]
        this.pairSetting = []
        return
      }
      this.pairList = pairData.data['data']
        .sort((a: any, b: any) => {
          return a.coin < b.coin ? -1 : 1
        })
        .map((item) => {
          return {
            id: `${item.coin}/${item.currency}`,
            name: `${item.coin.toUpperCase()}/${item.currency.toUpperCase()}`,
          }
        })
      this.pairSetting = pairData.data['data']
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
    async onExportFile() {
      if (this.isSubmitting) {
        return
      }
      this.isSubmitting = true
      const response = await ExchangeHistoryService.exportOpenOrder({
        ...this.query,
      })
      if (response.status !== HttpStatus.OK) {
        this.$toastr.error(
          this.$t((response?.data as unknown as any)?.message) ||
            'Something went wrong',
        )
      } else {
        this.$toastr.success(
          'Send file export request for open order successfully.\nThe file download link will be sent to the email address',
        )
      }
      setTimeout(() => {
        this.isSubmitting = false
      }, 5000)
    },
    onReset() {
      this.keyword = ''
      this.dateRange = null
      this.type = ''
      this.side = ''
      this.userType = ''
      this.selectedPrice = ''
      this.selectedSide = ''
      this.pair = 'btc/usdt'
      this.keywordType = ORDER_DROPDOWN_SEARCH_KEY.ALL
      this.refreshTable()
    },
    handleCheckAll(data) {
      if (!data.checked) {
        if (data.data && data.data.length) {
          this.checkedOrders = data.data
            .filter((item) => this.canCancelOrder(item))
            .map((o) => o.order_id)
        } else {
          this.checkedOrders = []
        }
      } else {
        this.checkedOrders = []
      }
    },
    selectOrder(order) {
      this.selectedPrice = order.price
      this.selectedSide = order.side
      this.refreshTable()
    },
    deletePriceSelected() {
      this.selectedPrice = ''
      this.selectedSide = ''
      this.refreshTable()
    },
    async onSocketUpdate(wsResponse: {
      data: Record<string, any>
      last_update: string
    }) {
      const { data } = wsResponse
      if (!data) return
      if (
        !this.$refs.openOrder ||
        !(this.$refs.openOrder as any)['data'].length
      ) {
        return
      }
      ;(this.$refs.openOrder as any)['data'].forEach((item, index) => {
        if (item.order_id === wsResponse.data.order_id) {
          if (wsResponse.data.status === ORDER_STATUS.PROCESSING_CANCEL) {
            ;(this.$refs.openOrder as any)['data'][index].status =
              ORDER_STATUS.PROCESSING_CANCEL
          } else if (
            [ORDER_STATUS.CANCELED, ORDER_STATUS.PARTIAL_FILLED].includes(
              wsResponse.data.status,
            )
          ) {
            ;(this.$refs.openOrder as any)['data'].splice(index, 1)
          }
        }
      })
    },
  },
})
</script>
<style lang="scss" scoped>
.orderbook-container {
  width: 310px;
  height: 804px;
  margin-right: 20px;
}
.open-order-container {
  width: calc(100% - 310px - 20px);
}
.selected-price {
  background-color: #f5f8fa;
}
</style>
