<template>
  <div class="container">
    <div class="row">
      <div class="summary d-flex">
        <div class="grid-profit">
          Grid Profit:
          <strong class="positive">{{
            toFixed(tradeHistorySummary?.gridProfit)
          }}</strong>
        </div>
        <div>
          Total Matched Trade:
          {{ formattedNumber(toFixed(tradeHistorySummary?.totalMatchedTrade)) }}
        </div>
      </div>
    </div>
    <!-- FOR LOOP TRADES -->
    <template v-if="tradeHistoriesResponse?.data?.length">
      <div class="row">
        <div class="list-trades" ref="scrollContainer" @scroll="handleScroll">
          <div
            class="row trade-item"
            v-for="item in tradeHistoriesResponse?.data"
            :key="item?.tradeId"
            :data-id="item?.tradeId"
          >
            <template v-if="item?.buy || item?.sell">
              <div class="d-flex justify-content-between">
                <strong>{{
                  formatUTCDate(+item?.createTime, 'YYYY-MM-DD HH:mm:ss')
                }}</strong>
                <div>
                  Profit:
                  <strong class="positive">{{ toFixed(item?.profit) }}</strong>
                </div>
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Side</th>
                    <th>Order Type</th>
                    <th>Avg Price</th>
                    <th>Filled Volume</th>
                    <th>Total</th>
                    <th>Fee</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="item?.buy">
                    <td>
                      {{
                        formatUTCDate(
                          +item?.buy?.createTime,
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      }}
                    </td>
                    <td class="buy">
                      {{ $t(orderTypeMap[item?.buy?.side]) }}
                    </td>
                    <td>{{ $t(orderClassMap[item?.buy?.orderClass]) }}</td>
                    <td>{{ formattedNumber(item?.buy?.avgPrice) }}</td>
                    <td>{{ formattedNumber(item?.buy?.filledAmount) }}</td>
                    <td>
                      {{ formattedNumber(item?.buy?.total) }} ({{
                        item?.buy?.totalCurrency?.toUpperCase()
                      }})
                    </td>
                    <td>
                      {{ formattedNumber(item?.buy?.fee) }} ({{
                        item?.buy?.feeCurrency?.toUpperCase()
                      }})
                    </td>
                  </tr>
                  <tr v-if="item?.sell">
                    <td>
                      {{
                        formatUTCDate(
                          +item?.sell?.createTime,
                          'YYYY-MM-DD HH:mm:ss',
                        )
                      }}
                    </td>
                    <td class="sell">
                      {{ $t(orderTypeMap[item?.sell?.side]) }}
                    </td>
                    <td>{{ $t(orderClassMap[item?.sell?.orderClass]) }}</td>
                    <td>{{ formattedNumber(item?.sell?.avgPrice) }}</td>
                    <td>{{ formattedNumber(item?.sell?.filledAmount) }}</td>
                    <td>
                      {{ formattedNumber(item?.sell?.total) }} ({{
                        item?.sell?.totalCurrency?.toUpperCase()
                      }})
                    </td>
                    <td>
                      {{ formattedNumber(item?.sell?.fee) }} ({{
                        item?.sell?.feeCurrency?.toUpperCase()
                      }})
                    </td>
                  </tr>
                </tbody>
              </table>
            </template>
          </div>
          <div class="d-flex justify-content-center">
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
              v-if="isFetching"
            >
            </span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script lang="ts">
import { formatUTCDate } from '@/core/helpers/common.helper'
import { formattedNumber, toFixed } from '@/core/helpers/util'
import {
  ORDER_CLASS as ORDER_CLASS_MAP_TRANSLATE,
  ORDER_TYPE as ORDER_TYPE_MAP_TRANSLATE,
} from '@/core/variables/common.const'
import { HttpStatus } from '@/core/variables/common.enum'
import { ORDER_TYPE } from '@/models/exchange-history/TradeHistory'
import {
  GetTradeHistoryRequestDto,
  GetTradeHistoryResponse,
  GetTradeHistorySummaryRequest,
  GetTradeHistorySummaryResponse,
  TradeHistoryItemDto,
} from '@/models/spot-grid-trading/trade-history.dto'
import { SpotGridTradingService } from '@/services/SpotGridTradingService'
import { plainToInstance } from 'class-transformer'
import { concat, debounce } from 'lodash'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'grid-trade-history',
  props: {
    strategyId: {
      type: String,
      default: '',
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
      toFixed,
      formattedNumber,
      items: [],
      pageNo: 1,
      isFetching: false,
      tradeHistorySummary: {
        gridProfit: '0',
        totalMatchedTrade: '0',
      } as GetTradeHistorySummaryResponse,
      tradeHistoriesResponse: {
        data: [] as TradeHistoryItemDto[],
        links: {},
      } as GetTradeHistoryResponse,
      formatUTCDate,
      queryTradeHistory: plainToInstance(GetTradeHistoryRequestDto, {
        strategy_id: this.strategyId,
        take: 10,
      }),
      shouldLoadMore: true,
    }
  },
  async mounted() {
    await Promise.all([this.getTradeHistorySummary(), this.getTradeHistory()])
  },
  methods: {
    async getTradeHistorySummary() {
      this.tradeHistorySummary =
        await SpotGridTradingService.getTradeHistorySummary(
          plainToInstance(GetTradeHistorySummaryRequest, {
            strategy_id: this.strategyId,
            user_id: this.userId,
          }),
        )
    },
    async getTradeHistory() {
      const response = await SpotGridTradingService.getTradeHistory(
        this.queryTradeHistory,
      )
      if (response.status !== HttpStatus.OK) {
        this.$toastr.error(
          (response.data as any)?.message || 'Something went wrong',
        )
        return
      }
      const tradeHistoryResult = plainToInstance(
        GetTradeHistoryResponse,
        response.data,
      )
      if (!this.tradeHistoriesResponse.data.length) {
        this.tradeHistoriesResponse = tradeHistoryResult
      } else {
        this.tradeHistoriesResponse.data = concat(
          this.tradeHistoriesResponse.data,
          tradeHistoryResult.data,
        )
        this.tradeHistoriesResponse.links = tradeHistoryResult.links
      }
    },
    async handleScroll() {
      const scrollContainer = this.$refs.scrollContainer as any
      const distanceToBottom =
        scrollContainer.scrollHeight -
        scrollContainer.clientHeight -
        scrollContainer.scrollTop

      if (distanceToBottom >= 10 || this.isFetching) return

      const urlParams = new URLSearchParams(
        this.tradeHistoriesResponse.links.next,
      )
      const fromValue = urlParams.get('from')
      if (!fromValue) {
        return
      }
      this.queryTradeHistory.from = fromValue

      this.isFetching = true
      await this.getTradeHistory()
      await new Promise((resolve) => setTimeout(resolve, 500))
      this.isFetching = false
    },
  },
})
</script>

<style lang="scss">
.list-trades {
  max-height: 450px;
  overflow-y: scroll;
}
.trade-item {
  margin-bottom: 18px;
  &:last-child {
    margin-bottom: 0;
  }
}
.summary {
  margin: 12px 0;
}
.grid-profit {
  padding-right: 16px;
}
.container {
  margin: 12px 0;
}
table {
  border-collapse: collapse;
  width: 100%;
  .sell {
    color: #c12532ad;
  }
  .buy {
    color: #008554;
  }
}

.positive {
  color: #008554;
}
.negative {
  color: #c12532ad;
}

th,
td {
  padding: 8px;
  text-align: center;
  border-bottom: 1px solid #ddd;
}

thead th {
  background-color: #f2f2f2;
  font-weight: bold;
}
</style>
