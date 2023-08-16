<template>
  <div class="container">
    <div class="row strategy-wrapper">
      <div class="col-sm-12 col-md-6">
        <div class="item">
          <span>Mode:</span> <span>{{ GRID_TYPE[strategyDetail?.mode] }}</span>
        </div>
        <div class="item">
          <span>Price Range:</span>
          <span>
            {{
              buildWithCurrency(
                strategyDetail?.lowerPrice,
                strategyDetail?.currency,
              )
            }}
            -
            {{
              buildWithCurrency(
                strategyDetail?.higherPrice,
                strategyDetail?.currency,
              )
            }}
          </span>
        </div>
        <div class="item">
          <span>Number of Grid:</span>
          <span>{{ strategyDetail?.gridNumber }}</span>
        </div>
        <div class="item">
          <span>Profit per Grid:</span>
          <span>
            {{ formattedNumber(toFixed(strategyDetail?.lowerProfitPerGrid)) }}%
            -
            {{ formattedNumber(toFixed(strategyDetail?.higherProfitPerGrid)) }}%
          </span>
        </div>
        <div class="item">
          <span>Strategy Start Price:</span>
          <span>{{
            buildWithCurrency(
              strategyDetail?.startPrice,
              strategyDetail?.currency,
            )
          }}</span>
        </div>
        <div class="item">
          <span>Initial Buy Quantity: </span>
          <span>{{
            buildWithCurrency(
              tradeHistorySummary?.initialBuyQuantity,
              strategyDetail?.coin,
            )
          }}</span>
        </div>
        <div class="item">
          <span>Sell Qty At Stop:</span
          ><span>{{
            buildWithCurrency(
              tradeHistorySummary?.sellQuantityAtStop,
              strategyDetail?.coin,
            )
          }}</span>
        </div>
        <div class="item">
          <span>Avg Sell Price At Stop:</span
          ><span>
            {{
              buildWithCurrency(
                tradeHistorySummary?.sellQuantityAtStop,
                strategyDetail?.coin,
              )
            }}</span
          >
        </div>
        <div class="item">
          <span>Strategy Stop Price:</span
          ><span>
            {{
              buildWithCurrency(
                strategyDetail?.stopPrice,
                strategyDetail?.currency,
              )
            }}</span
          >
        </div>
      </div>
      <div class="col-sm-12 col-md-6">
        <div class="item">
          <span>Trigger Price: </span>
          <span>
            {{
              buildWithCurrency(
                strategyDetail?.triggerPrice,
                strategyDetail?.currency,
              )
            }}</span
          >
        </div>
        <div class="item">
          <span>Break Higher Price: </span>
          <span>
            {{
              buildWithCurrency(
                strategyDetail?.takeProfitPoint,
                strategyDetail?.currency,
              )
            }}
          </span>
        </div>
        <div class="item">
          <span>Break Lower Price: </span>
          <span>{{
            buildWithCurrency(
              strategyDetail?.stopLossPoint,
              strategyDetail?.currency,
            )
          }}</span>
        </div>
        <div class="item">
          <span>Time Created: </span>
          <span>{{
            formatUTCDate(+strategyDetail?.createTime, 'YYYY-MM-DD HH:mm:ss')
          }}</span>
        </div>
        <div class="item">
          <span>Strategy ID: </span><span>{{ strategyDetail?.id }}</span>
        </div>
        <div class="item">
          <span>Copiers: </span> <span>{{ strategyDetail?.copiers }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { formatUTCDate } from '@/core/helpers/common.helper'
import { formattedNumber, toFixed } from '@/core/helpers/util'
import {
  ORDER_CLASS as ORDER_CLASS_MAP_TRANSLATE,
  ORDER_TYPE as ORDER_TYPE_MAP_TRANSLATE,
} from '@/core/variables/common.const'
import { ORDER_TYPE } from '@/models/exchange-history/TradeHistory'
import { GRID_TYPE } from '@/models/spot-grid-trading/enum'
import { GetStrategyDetailResponse } from '@/models/spot-grid-trading/grid-detail.dto'
import {
  GetTradeHistorySummaryRequest,
  GetTradeHistorySummaryResponse,
} from '@/models/spot-grid-trading/trade-history.dto'
import { SpotGridTradingService } from '@/services/SpotGridTradingService'
import { plainToInstance } from 'class-transformer'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'StrategyDetail',
  props: {
    strategyDetail: {
      type: GetStrategyDetailResponse,
      default: {},
    },
    userId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      orderTypeMap: ORDER_TYPE_MAP_TRANSLATE,
      orderClassMap: ORDER_CLASS_MAP_TRANSLATE,
      ORDER_TYPE: ORDER_TYPE,
      GRID_TYPE: GRID_TYPE,
      toFixed,
      formattedNumber,
      formatUTCDate,
      tradeHistorySummary: {
        initialBuyQuantity: '0',
        averageSellPriceAtStop: '0',
        sellQuantityAtStop: '0',
      } as GetTradeHistorySummaryResponse,
    }
  },
  async mounted() {
    await this.getTradeHistorySummary()
  },
  methods: {
    async getTradeHistorySummary() {
      this.tradeHistorySummary =
        await SpotGridTradingService.getTradeHistorySummary(
          plainToInstance(GetTradeHistorySummaryRequest, {
            strategy_id: this.strategyDetail.id,
            user_id: this.userId,
          }),
        )
    },
    buildWithCurrency(value: string, currency: string) {
      if (!Number(toFixed(value))) {
        return '--'
      }
      return formattedNumber(toFixed(value)) + ' ' + currency.toUpperCase()
    },
  },
})
</script>

<style lang="scss">
.strategy-wrapper {
  margin-top: 12px;
}
.item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  max-width: 85%;
}
</style>
