<template>
  <div class="orderbook my-3">
    <div class="header d-flex">
      <v-select
        :options="pairList"
        option-value="id"
        option-label="name"
        :placeholder="$t('exchangeHistory.pair')"
        v-model="pairSelected"
        searchable
        :can-deselect="false"
        :isTranslate="false"
        @change="pairChange()"
      ></v-select>
      <div class="col-sm-6 d-flex icon">
        <a
          @click="changeViewOrderbook(enumOrderbookStatus.BUY)"
          class="btn btn-sm btn-flex btn-icon"
          :class="{ 'btn-light-primary': status === enumOrderbookStatus.BUY }"
        >
          <BuyOrderIcon width="14" height="14" />
        </a>
        <a
          @click="changeViewOrderbook(enumOrderbookStatus.SELL)"
          class="btn btn-sm btn-flex btn-icon"
          :class="{ 'btn-light-primary': status === enumOrderbookStatus.SELL }"
        >
          <SellOrderIcon width="14" height="14" />
        </a>
        <a
          @click="changeViewOrderbook(enumOrderbookStatus.BOTH)"
          class="btn btn-sm btn-flex btn-icon"
          :class="{ 'btn-light-primary': status === enumOrderbookStatus.BOTH }"
        >
          <BothOrderIcon width="14" height="14" />
        </a>
      </div>
    </div>
    <div class="title d-flex">
      <div class="price col-sm-4">
        Price
        <span>({{ pair.split('/')[1].toUpperCase() }})</span>
      </div>
      <div class="volume col-sm-4 d-flex">
        Amount <span>({{ pair.split('/')[0].toUpperCase() }})</span>
      </div>
      <div class="total col-sm-4 d-flex">
        Total <span>({{ pair.split('/')[1].toUpperCase() }})</span>
      </div>
    </div>
    <div class="content-orderbook" :class="status">
      <div class="sell-list">
        <OrderList
          :status="status"
          :side="enumOrderbookSide.SELL"
          :style="getHeightOrder(status === enumOrderbookStatus.SELL)"
          :orderList="sellList"
          :maxValue="maxTotalSell"
          :pairSetting="setting"
          @selectOrder="selectOrder($event)"
        />
      </div>
      <h4 class="match-block d-flex px-2">
        {{ !matchPrice || !matchPrice.length ? '--' : matchPrice }}
      </h4>
      <div class="buy-list">
        <OrderList
          :status="status"
          :side="enumOrderbookSide.BUY"
          :style="getHeightOrder(status === enumOrderbookStatus.BUY)"
          :orderList="buyList"
          :maxValue="maxTotalBuy"
          :pairSetting="setting"
          @selectOrder="selectOrder($event)"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { sortArrayOfObject, toNumber } from '@/core/helpers/util'
import { OrderbookSide } from '@/core/variables/common.enum'
import {
  OrderItem,
  OrderbookStatus,
  OrderBookItem,
} from '@/models/exchange-history/OpenOrder'
import { ExchangeHistoryService } from '@/services/ExchangeHistoryService'
import { plainToInstance } from 'class-transformer'
import { defineComponent } from 'vue'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import OrderList from './OrderList.vue'
import SellOrderIcon from './icon/SellOrderList.vue'
import BuyOrderIcon from './icon/BuyOrderList.vue'
import BothOrderIcon from './icon/BuySellOrderList.vue'
import CONFIG from '@/config'

const ORDER_BOTH = 11
const ORDER_ONLY = 22

export default defineComponent({
  components: { OrderList, SellOrderIcon, BuyOrderIcon, BothOrderIcon },
  name: 'orderbook-component',
  props: {
    pair: {
      type: String,
      default: 'btc/usdt',
    },
    pairList: {
      type: Array,
      default: () => {
        return [{ id: 'btc/usdt', name: 'BTC/USDT' }]
      },
    },
    setting: {
      type: Object,
      default: () => {
        return {
          coin: 'btc',
          currency: 'usdt',
          default_precision: '0.01',
          decimal_of_amount: '0.00000001',
        }
      },
    },
    forceReloadKey: {
      type: Number,
      default: 1,
    },
  },
  computed: {
    sellList(): OrderItem[] {
      if (this.status === OrderbookStatus.BUY) return []
      const sortOrderBookSell = sortArrayOfObject(
        this.orderbookData.sell,
        'price',
        false,
      )
      let result =
        this.status === OrderbookStatus.SELL
          ? sortOrderBookSell
          : sortOrderBookSell.slice(-ORDER_BOTH)
      const min = this.status === OrderbookStatus.BOTH ? ORDER_BOTH : ORDER_ONLY
      if (result.length < min) {
        const tempDataList = new Array(min - result.length).fill(
          plainToInstance(OrderItem, {
            price: undefined,
            volume: undefined,
          }),
        )
        result = [...tempDataList, ...result]
      }
      return plainToInstance(OrderItem, result)
    },
    buyList(): OrderItem[] {
      if (this.status === OrderbookStatus.SELL) return []
      const sortOrderBookBuy = sortArrayOfObject(
        this.orderbookData.buy,
        'price',
        false,
      )
      let result =
        this.status === OrderbookStatus.BUY
          ? sortOrderBookBuy
          : sortOrderBookBuy.slice(0, ORDER_BOTH)
      const min = this.status === OrderbookStatus.BOTH ? ORDER_BOTH : ORDER_ONLY
      if (result.length < min) {
        const tempDataList = new Array(min - result.length).fill(
          plainToInstance(OrderItem, {
            price: undefined,
            volume: undefined,
          }),
        )
        result = [...result, ...tempDataList]
      }
      return plainToInstance(OrderItem, result)
    },
    maxTotalBuy() {
      const sumBuy = [...this.buyList]
      let maxBuy = 0
      for (let i = 0; i < sumBuy.length; i++) {
        maxBuy = sumBuy[i].total.isGreaterThan(maxBuy)
          ? toNumber(sumBuy[i].total) || 0
          : maxBuy
      }
      return maxBuy
    },
    maxTotalSell() {
      const sumSell = [...this.sellList]
      let maxSell = 0
      for (let i = 0; i < sumSell.length; i++) {
        maxSell = sumSell[i].total.isGreaterThan(maxSell)
          ? toNumber(sumSell[i].total) || 0
          : maxSell
      }
      return maxSell
    },
  },
  data() {
    return {
      status: OrderbookStatus.BOTH,
      pairSelected: this.pair,
      enumOrderbookStatus: OrderbookStatus,
      enumOrderbookSide: OrderbookSide,
      matchPrice: '',
      intervalGetData: null as any,
      // pairList: this.pairOptions,
      pairSetting: [] as PairItem[],
      orderbookData: { buy: [], sell: [] } as OrderBookItem,
    }
  },
  watch: {
    pair: {
      handler() {
        this.pairSelected = this.pair
        this.getOrderbook()
      },
    },
    forceReloadKey: {
      handler() {
        this.getOrderbook()
      },
    },
  },
  async mounted() {
    await this.getOrderbook()
    this.intervalGetData = setInterval(
      this.getOrderbook,
      CONFIG.INTERVAL_RELOAD_ORDERBOOK || 3000,
    )
  },

  methods: {
    getHeightOrder(status: boolean) {
      if (status)
        return {
          'max-height': `660px`,
          overflow: 'auto',
        }
    },
    changeViewOrderbook(type: OrderbookStatus) {
      this.status = type
    },
    async getOrderbook() {
      const [coin, currency] = this.pair.split('/')
      const data = await ExchangeHistoryService.getOrderBookList({
        coin,
        currency,
        precision: '0',
      })
      this.matchPrice = data.current_price
      this.orderbookData = plainToInstance(OrderBookItem, data)
    },
    pairChange() {
      this.$emit('pairChange', this.pairSelected)
    },
    selectOrder(order) {
      this.$emit('selectOrder', order)
    },
  },
  unmounted() {
    clearInterval(this.intervalGetData)
  },
})
</script>
<style lang="scss" scoped>
.orderbook {
  border: 1px solid #ededed;
  border-radius: 10px;
  padding: 5px;
  .header {
    width: 100%;
    .pair-select {
      font-weight: 600;
    }
    .icon {
      justify-content: flex-end;
    }
  }
  .title {
    height: 30px;
    align-items: center;
    border-top: 1px solid #ededed;
    border-bottom: 1px solid #ededed;
  }
  .price {
    align-items: center;
  }
  .volume {
    justify-content: flex-end;
    align-items: center;
  }
  .total {
    justify-content: flex-end;
    align-items: center;
  }
  .content-orderbook {
    height: 700px;
    .match-block {
      height: 40px;
      align-items: center;
      background-color: #ededed;
      opacity: 0.5;
    }
  }
}
.hidden {
  display: none;
}
.btn-icon {
  width: 18px;
  height: 18px;
  border-radius: 50%;
}
</style>
