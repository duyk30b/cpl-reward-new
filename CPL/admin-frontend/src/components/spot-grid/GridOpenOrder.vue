<template>
  <div class="container">
    <div class="row">
      <strong class="last-price"
        >Last Price: {{ formattedNumber('23923') }} USDT</strong
      >
    </div>
    <div class="row open-order">
      <div
        v-if="!openOrder?.bids?.length && !openOrder?.asks?.length"
        class="text-center"
      >
        No data
      </div>
      <div v-else class="d-flex justify-content-between">
        <div class="col-sm-12 col-md-6 buy">
          <div class="d-flex justify-content-between">
            <div>
              <div class="hidden">1</div>
              <ul>
                <li v-for="(_, index) in openOrder?.bids" :key="index">
                  {{ index + 1 }}
                </li>
              </ul>
            </div>
            <div class="flex-1">
              <div class="d-flex justify-content-between">
                <div>Amount({{ strategyDetail?.coin?.toUpperCase() }})</div>
                <div>Price({{ strategyDetail?.currency?.toUpperCase() }})</div>
              </div>
              <div class="wrapper-content">
                <p
                  class="d-flex justify-content-between"
                  v-for="(order, index) in openOrder?.bids"
                  :key="index"
                >
                  <span>{{ formattedNumber(toFixed(order?.amount)) }}</span>
                  <span>{{ formattedNumber(toFixed(order?.price)) }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 col-md-6 sell">
          <div class="d-flex justify-content-between">
            <div class="flex-1">
              <div class="d-flex justify-content-between">
                <div>Price({{ strategyDetail?.currency?.toUpperCase() }})</div>
                <div>Amount({{ strategyDetail?.coin?.toUpperCase() }})</div>
              </div>
              <div class="wrapper-content">
                <p
                  class="d-flex justify-content-between"
                  v-for="(order, index) in openOrder?.asks"
                  :key="index"
                >
                  <span>{{ formattedNumber(toFixed(order?.price)) }}</span>
                  <span>{{ formattedNumber(toFixed(order?.amount)) }}</span>
                </p>
              </div>
            </div>
            <div>
              <div class="hidden">1</div>
              <ul>
                <li v-for="(_, index) in openOrder?.asks" :key="index">
                  {{ index + 1 }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { formattedNumber, toFixed } from '@/core/helpers/util'
import { GetStrategyDetailResponse } from '@/models/spot-grid-trading/grid-detail.dto'
import { GetOpenOrderResponse } from '@/models/spot-grid-trading/grid-open-order.dto'
import { SpotGridTradingService } from '@/services/SpotGridTradingService'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'grid-open-order',
  props: {
    strategyId: {
      type: String,
      default: '',
    },
    strategyDetail: {
      type: GetStrategyDetailResponse,
      default: {},
    },
  },
  async mounted() {
    this.openOrder = await SpotGridTradingService.getOpenOrder(this.strategyId)
  },
  data() {
    return {
      toFixed,
      openOrder: {} as GetOpenOrderResponse,
      formattedNumber,
    }
  },
})
</script>

<style lang="scss">
.last-price {
  margin: 12px 0;
  font-size: 13px;
}
.modal-body {
  padding-top: 8px;
}
.hidden {
  visibility: hidden;
}
.buy {
  padding-right: 4px;
  .wrapper-content {
    p {
      background: #008554;
    }
  }
}
.sell {
  padding-left: 4px;
  .wrapper-content {
    p {
      background: #c12532ad;
    }
  }
}
.wrapper-content {
  p {
    margin-bottom: 4px;
    color: white;
    padding: 2px 6px;
  }
}
.open-order {
  ul {
    list-style: none;
    li {
      padding: 2px 6px;
      margin-bottom: 4px;
    }
    padding-left: 0;
  }
}
</style>
