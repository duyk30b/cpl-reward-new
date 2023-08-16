<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'grid-detail-modal'"
  >
    <template v-slot:body>
      <div class="summary">
        <div class="container">
          <div class="row">
            <strong class="pair-title">{{
              `${strategyDetail?.coin?.toUpperCase()}/${strategyDetail?.currency?.toUpperCase()}`
            }}</strong>
            <p><strong>Duration</strong> {{ millisecondToDate() }}</p>
          </div>
          <div class="row overview">
            <div
              class="col-sm-12 col-md-3"
              v-for="(overview, key) in overviews"
              :key="key"
            >
              <div>{{ overview.title }}</div>
              <div :class="overview.class">{{ overview.value }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="container">
        <div class="row tab">
          <button
            class="tablinks col-sm-12 col-md-4"
            v-for="(tab, index) in tabs"
            :key="index"
            @click="openTab($event, tab.value)"
            :class="tab.isActive ? 'active' : ''"
          >
            {{ tab.title }}
          </button>
        </div>
        <div
          class="row tabcontent"
          v-if="tabSelected === GRID_DETAIL_TAB.OPEN_ORDER"
        >
          <GridOpenOrder
            :strategyId="strategyId"
            :strategyDetail="strategyDetail"
          />
        </div>
        <div
          class="row tabcontent"
          v-else-if="tabSelected === GRID_DETAIL_TAB.TRADE_HISTORY"
        >
          <GridTradeHistory :strategyId="strategyId" :userId="ownerId" />
        </div>
        <div class="row tabcontent" v-else>
          <StrategyDetail :strategyDetail="strategyDetail" :userId="ownerId" />
        </div>
      </div>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import GridOpenOrder from '@/components/spot-grid/GridOpenOrder.vue'
import GridTradeHistory from '@/components/spot-grid/GridTradeHistory.vue'
import StrategyDetail from '@/components/spot-grid/StrategyDetail.vue'
import { SpotGridTradingService } from '@/services/SpotGridTradingService'
import { plainToInstance } from 'class-transformer'
import {
  GetGridDetailRequestDto,
  GetStrategyDetailResponse,
} from '@/models/spot-grid-trading/grid-detail.dto'
import {
  convertMillisecondToDateTime,
  formattedNumber,
  gt,
  subNumberString,
  toFixed,
} from '@/core/helpers/util'
import { STRATEGY_STATUS } from '@/models/spot-grid-trading/enum'
import { now } from 'moment'
import { HttpStatus } from '@/core/variables/common.enum'

interface IOverview {
  title: string
  value: string
  class: string
}

interface ITab {
  title: string
  value: GRID_DETAIL_TAB
  isActive: boolean
}

enum GRID_DETAIL_TAB {
  OPEN_ORDER = 1,
  TRADE_HISTORY = 2,
  DETAIL = 3,
}

export default defineComponent({
  name: 'grid-detail-modal',
  components: {
    BaseModal,
    GridOpenOrder,
    GridTradeHistory,
    StrategyDetail,
  },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    modalTitle: {
      type: String,
      default: 'Grid Detail',
    },
    strategyId: {
      type: String,
      default: '',
    },
    ownerId: {
      type: String,
      default: '',
    },
  },
  async mounted() {
    const response = await SpotGridTradingService.getStrategyDetail(
      plainToInstance(GetGridDetailRequestDto, {
        strategy_id: this.strategyId,
        user_id: this.ownerId,
      }),
    )
    if (response.status !== HttpStatus.OK) {
      this.$toastr.error(
        (response.data as any)?.message || 'Something went wrong',
      )
      return
    }

    this.strategyDetail = plainToInstance(
      GetStrategyDetailResponse,
      response.data,
    )
  },
  computed: {
    overviews(): IOverview[] {
      return [
        {
          title: 'Total Investment',
          value: formattedNumber(toFixed(this.strategyDetail.totalInvestment)),
          class: 'bold',
        },
        {
          title: 'Total Profit',
          value: this.buildTotalProfit(),
          class: `${
            gt(this.strategyDetail.totalProfit, '0') ? 'overview-positive' : ''
          } bold`,
        },
        {
          title: 'Float profit',
          value: this.buildFloatProfit(),
          class: `${
            gt(this.strategyDetail.floatProfit, '0') ? 'overview-positive' : ''
          } bold`,
        },
        {
          title: 'Current Balance',
          value: this.buildBalance(),
          class: 'bold',
        },
      ]
    },
  },
  data() {
    return {
      formattedNumber,
      toFixed,
      GRID_DETAIL_TAB,
      tabs: [
        {
          title: 'Open Order',
          value: GRID_DETAIL_TAB.OPEN_ORDER,
          isActive: true,
        },
        {
          title: 'Trade History',
          value: GRID_DETAIL_TAB.TRADE_HISTORY,
          isActive: false,
        },
        {
          title: 'Detail',
          value: GRID_DETAIL_TAB.DETAIL,
          isActive: false,
        },
      ] as ITab[],
      tabSelected: GRID_DETAIL_TAB.OPEN_ORDER,
      strategyDetail: {} as GetStrategyDetailResponse,
    }
  },
  methods: {
    millisecondToDate() {
      if (this.strategyDetail.status === STRATEGY_STATUS.PENDING) {
        return '0'
      } else if (this.strategyDetail.status === STRATEGY_STATUS.RUNNING) {
        return convertMillisecondToDateTime(
          subNumberString(
            now().toString(),
            this.strategyDetail.startTime || '0',
          ),
        )
      } else {
        return convertMillisecondToDateTime(
          subNumberString(
            this.strategyDetail.endTime || '0',
            this.strategyDetail.startTime || '0',
          ),
        )
      }
    },
    openTab(_event: any, tabSelected: GRID_DETAIL_TAB) {
      this.tabSelected = tabSelected
      this.tabs.forEach((item) => {
        if (item.value === tabSelected) {
          item.isActive = true
        } else {
          item.isActive = false
        }
      })
    },
    buildBalance() {
      if (!this.strategyDetail || !this.strategyDetail.balances) return ''

      const balanceCoin = this.strategyDetail.balances.find(
        (o) => o.currency === this.strategyDetail.coin,
      )
      const balanceCurrency = this.strategyDetail.balances.find(
        (o) => o.currency === this.strategyDetail.currency,
      )
      let template = ''
      if (balanceCoin) {
        template += `${formattedNumber(
          toFixed(balanceCoin.amount),
        )} ${balanceCoin.currency.toUpperCase()}`
      }
      if (balanceCurrency) {
        template += `${balanceCoin ? ' + ' : ''}${formattedNumber(
          toFixed(balanceCurrency.amount),
        )} ${balanceCurrency.currency.toUpperCase()}`
      }
      return template
    },
    buildFloatProfit() {
      let template = ''
      if (gt(this.strategyDetail.floatProfit, '0')) {
        template += '+'
      }
      template += `${formattedNumber(toFixed(this.strategyDetail.floatProfit))}`
      return template
    },
    buildTotalProfit() {
      let template = ''
      if (gt(this.strategyDetail.totalProfit, '0')) {
        template += '+'
      }
      template += `${formattedNumber(toFixed(this.strategyDetail.totalProfit))}`
      template += ` (${formattedNumber(
        toFixed(this.strategyDetail.roiPercent),
      )}%)`
      return template
    },
  },
  close() {
    this.$emit('close')
  },
})
</script>

<style lang="scss">
.pair-title {
  font-size: 18px;
  margin-bottom: 10px;
}
.grid-detail-modal {
  max-width: 1200px;
}
.overview-positive {
  color: #1dac1d;
}

.bold {
  font-weight: bold;
  font-size: 12px;
}

.overview {
  padding: 16px 12px;
  border: 2px solid #736c6c;
  border-radius: 12px;
}
/* Style the tabs */
.tab {
  overflow: hidden;
  border: 1px solid #ccc;
  max-width: 400px;
  margin-top: 12px;
  border: 2px solid #736c6c;
  border-radius: 12px;
}

.tab button {
  background-color: inherit;
  float: left;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 8px;
  transition: 0.3s;
}

.tab button:hover {
  background-color: #009ef7;
  color: white;
}

.tab button.active {
  background-color: #009ef7;
  color: white;
}

/* Style the tab content */
.tabcontent {
}
</style>
