<template>
  <div class="order-list" ref="ordersList" :class="containerClasses">
    <div
      v-for="order of orderList"
      :key="order"
      @click="selectPrice(order)"
      :class="{ 'no-event': !order.price, 'cursor-pointer': order.price }"
      class="orderbook-item d-flex"
    >
      <div class="price px-2 col-sm-4 d-flex">
        <span class="text-limit" :class="textClasses">
          {{ order.price || '--' }}
        </span>
      </div>
      <div class="volume px-2 col-sm-4 d-flex">
        <span class="text-limit">
          {{ order.volume || '--' }}
        </span>
      </div>
      <div class="total px-2 col-sm-4 d-flex">
        <span class="text-limit">
          {{
            order.volume && order.price
              ? mulNumberString(order.volume, order.price)
              : '--'
          }}
        </span>
      </div>
      <div class="background-order d-flex">
        <div :class="volumeClasses()" :style="volumeStyles(order)"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { isFalsy, mulNumberString } from '@/core/helpers/util'
import {
  OrderBookItem,
  OrderbookStatus,
  OrderItem,
} from '@/models/exchange-history/OpenOrder'
import { defineComponent } from 'vue'
import { BigNumber } from 'bignumber.js'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import { OrderbookSide } from '@/core/variables/common.enum'

export default defineComponent({
  components: {},
  name: 'order-list',
  props: {
    orderList: {
      type: Object,
      default: [] as OrderBookItem[],
    },
    status: {
      type: String,
      default: OrderbookStatus.BOTH,
    },
    side: {
      type: Number,
      default: OrderbookSide.BUY,
    },
    maxValue: {
      type: Number,
      default: 0,
    },
    pairSetting: {
      type: Object,
      default: PairItem,
    },
  },
  data() {
    return {
      pairSelected: this.pair,
    }
  },
  watch: {
    status: {
      handler(newVal) {
        if (newVal !== OrderbookStatus.SELL) return
        this.$nextTick(function () {
          const container = this.$refs.ordersList as HTMLElement
          container.scrollTop = container.scrollHeight
        })
      },
    },
  },
  computed: {
    containerClasses() {
      return {
        'order-list-hidden':
          (this.side === OrderbookSide.SELL &&
            this.status === OrderbookStatus.BUY) ||
          (this.side === OrderbookSide.BUY &&
            this.status === OrderbookStatus.SELL),
        'overflow-hidden': this.status === OrderbookStatus.BOTH,
      }
    },
    textClasses() {
      return {
        'text-buy': this.side === OrderbookSide.BUY,
        'text-sell': this.side === OrderbookSide.SELL,
      }
    },
  },
  methods: {
    volumeStyles(item: OrderItem) {
      if (isFalsy(item?.total)) return { width: '0%' }
      return {
        width: `${new BigNumber(item.total)
          .dividedBy(this.maxValue)
          .multipliedBy(100)}%`,
      }
    },

    volumeClasses() {
      return {
        'bg-error-darker': this.side === OrderbookSide.SELL,
        'bg-success-darker': this.side === OrderbookSide.BUY,
      }
    },

    mulNumberString(a: string, b: string) {
      return mulNumberString(a, b)
    },

    selectPrice(order) {
      this.$emit('selectOrder', { price: order.price, side: this.side })
    },
  },
})
</script>
<style lang="scss" scoped>
.no-event {
  pointer-events: none;
}
.text-sell {
  color: #e63332;
}
.text-buy {
  color: #11a111;
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
.orderbook-item {
  height: 30px;
  position: relative;
  &:hover {
    background-color: darkgray;
    span {
      color: aliceblue !important;
    }
  }
  .background-order {
    width: 100%;
    height: 100%;
    position: absolute;
    justify-content: flex-end;
    pointer-events: none;
    .bg-error-darker {
      width: 100%;
      height: 100%;
      opacity: 0.1;
      background-color: #e63332;
    }
    .bg-success-darker {
      width: 100%;
      height: 100%;
      opacity: 0.1;
      background-color: #11a111;
    }
  }
}
.order-list-hidden {
  display: none;
}
</style>
