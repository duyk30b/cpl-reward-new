<template>
  <div class="card">
    <div class="card-body">
      <div class="row justify-content-between">
        <div class="col-md-2">
          <label class="form-label">{{ $t('pair') }}:</label>
          <select name="pair" v-model="pairSelect" class="form-control">
            <option
              v-for="pair of pairList"
              :key="`${pair.coin}/${pair.currency}`"
              :value="pair"
            >
              {{ `${pair.coin.toUpperCase()}/${pair.currency.toUpperCase()}` }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">{{ $t('status') }}:</label>
          <select name="pair" v-model="status" class="form-control">
            <option
              v-for="item of statusList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.label }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label">{{ $t('obmMonitor.module') }}:</label>
          <select name="pair" v-model="moduleType" class="form-control">
            <option
              v-for="item of moduleList"
              :key="item.key"
              :value="item.key"
            >
              {{ item.label }}
            </option>
          </select>
        </div>
        <div class="col-md-2">
          <label class="form-label"
            >{{ $t('obmMonitor.exchangeTarget') }}:</label
          >
          <select name="pair" v-model="exchange" class="form-control">
            <option v-for="item of exchangeList" :key="item" :value="item">
              {{ item.toUpperCase() }}
            </option>
          </select>
        </div>
        <div class="col-md-4">
          <label class="form-label"
            >{{ $t('obmMonitor.bceCounterOrderId') }}:</label
          >
          <input class="form-control" v-model="bceOrderId" />
        </div>
      </div>
      <div class="row justify-content-end mt-4">
        <div class="col-sm-6 align-self-end text-end">
          <button @click="onSearch()" class="btn btn-primary mx-3">
            <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
          </button>
          <button @click="onReset()" class="btn btn-primary">
            <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" ref="counterTable">
        <template v-slot:cell-pair="{ row: order }">
          {{ order.coin.toUpperCase() }}/{{ order.currency.toUpperCase() }}
        </template>
        <template v-slot:cell-order_type="{ row: order }">
          <div v-if="order.order_type == 'sell'" class="text-danger">
            {{ order.order_type.toUpperCase() }}
          </div>
          <div v-else class="text-success">
            {{ order.order_type.toUpperCase() }}
          </div>
        </template>
        <template v-slot:cell-targetRecoveryId="{ row: order }">
          {{ order.recovery_order?.receive_id }}
        </template>
        <template v-slot:cell-recoveryStatus="{ row: order }">
          {{ order.recovery_order?.status }}
        </template>
        <template v-slot:cell-profit_actual="{ row: order }">
          <span
            :class="{
              'text-success': +order.profit_actual >= 0,
              'text-danger': +order.profit_actual < 0,
            }"
          >
            {{ numberToString(order.profit_actual) }}
          </span>
          ({{ order.currency.toUpperCase() }})
        </template>
        <template v-slot:cell-profit_percent="{ row: order }">
          <span
            :class="{
              'text-success': +order.profit_actual >= 0,
              'text-danger': +order.profit_actual < 0,
            }"
          >
            {{
              order.profit_percent ? (+order.profit_percent).toFixed(2) : ''
            }} </span
          >%
        </template>
        <template v-slot:cell-action="{ row: item }">
          <a
            class="btn btn-sm btn-primary"
            @click="openDetailModal(item.id, item.recovery_order_id)"
            target="_blank"
          >
            {{ $t('detail') }}
          </a>
        </template>
      </datatable>
    </div>
  </div>
  <RecoveryDetailModal
    v-if="showDetail"
    :show="showDetail"
    :counterId="counterDetailId"
    :recoveryId="recoveryDetailId"
    @updated="refreshTable"
    @close="closeEditModal"
  />
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { formatUTCDate, setPageFliud } from '@/core/helpers/common.helper'
import RecoveryDetailModal from './RecoveryDetailModal.vue'
import { defineComponent } from 'vue'
import Datatable, {
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import CONFIG from '@/config'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import { MonitorOBMService } from '@/services/MonitorOBMService'
import { numberToString, sortPairFn, toFixed } from '@/core/helpers/util'
import { SettingOBMService } from '@/services/SettingOBMService'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'obm-monitor',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.monitorObm', ['obmMonitor.counterOrder'])
    this.getOBMPairList()
    this.getOBMExchangeList()
  },
  components: {
    Datatable,
    RecoveryDetailModal,
  },
  data() {
    return {
      showDetail: false,
      tradingModal: new PairItem(),
      isNew: true,
      CONFIG,
      listCoinName: [] as any[],
      pairList: [] as { coin: string; currency: string }[],
      pairSelect: {} as { coin: string; currency: string },
      statusList: [
        { key: 'waiting_merge', label: 'Waiting Merge' },
        { key: 'executed', label: 'Executed' },
      ],
      status: '',
      moduleList: [
        { key: 'gatekeeper', label: 'Gatekeeper' },
        { key: 'bot_a', label: 'Bot A' },
      ],
      moduleType: '',
      exchangeList: [] as string[],
      exchange: '',
      bceOrderId: '',
      counterDetailId: '',
      recoveryDetailId: '',
    }
  },
  computed: {
    query: function (): any {
      const { coin, currency } = this.pairSelect
      return {
        coin,
        currency,
        exchange: this.exchange,
        status: this.status,
        module: this.moduleType,
        bceOrderId: this.bceOrderId,
      }
    },
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) =>
          MonitorOBMService.getCounterOrder({ ...params, ...this.query }),
        columns: [
          {
            key: 'id',
            title: 'obmMonitor.counterId',
            sortable: false,
            class: 'td-w-70px text-center',
          },
          {
            key: 'recovery_order_id',
            title: 'obmMonitor.recoveryId',
            sortable: false,
            class: 'td-w-70px text-center',
          },
          {
            key: 'pair',
            title: 'pair',
            sortable: false,
            class: 'td-w-250px text-center',
          },
          {
            key: 'order_type',
            title: 'side',
            sortable: false,
            class: 'td-w-70px text-center',
          },
          {
            key: 'receive_id',
            title: 'obmMonitor.bceCounterOrderId',
            sortable: false,
            class: 'td-w-200px text-center',
          },
          {
            key: 'send_id',
            title: 'obmMonitor.bceCounterTargetId',
            class: 'td-w-200px text-center',
            sortable: false,
          },
          {
            key: 'targetRecoveryId',
            title: 'obmMonitor.targetExchangeRecoveryId',
            sortable: false,
            class: 'td-w-200px text-center',
          },
          {
            key: 'targetMatchPrice',
            title: 'obmMonitor.targetMatchPrice',
            class: 'td-w-150px text-center',
            sortable: false,
            render: (_value, row) => {
              return row.recovery_order?.actual_price
                ? toFixed(row.recovery_order?.actual_price)
                : ''
            },
          },
          {
            key: 'actual_price',
            title: 'obmMonitor.bceMatchPrice',
            class: 'td-w-150px text-center',
            sortable: false,
            render: (value) => {
              return value ? toFixed(value) : ''
            },
          },
          {
            key: 'targetMatchVolume',
            title: 'obmMonitor.targetMatchVolume',
            class: 'td-w-150px text-center',
            sortable: false,
            render: (_value, row) => {
              return row.recovery_order?.actual_volume
                ? toFixed(row.recovery_order?.actual_volume)
                : ''
            },
          },
          {
            key: 'actual_volume',
            title: 'obmMonitor.bceMatchVolume',
            class: 'td-w-150px text-center',
            sortable: false,
            render: (value) => {
              return value ? toFixed(value) : ''
            },
          },
          {
            key: 'recoveryStatus',
            title: 'obmMonitor.recoveryStatus',
            class: 'td-w-150px text-center',
            sortable: false,
          },
          {
            key: 'profit_actual',
            title: 'obmMonitor.takeProfit',
            class: 'td-w-200px text-center',
            sortable: false,
          },
          {
            key: 'profit_percent',
            title: 'obmMonitor.rate',
            class: 'td-w-150px text-center',
            sortable: false,
          },
          {
            key: 'send_time',
            title: 'obmMonitor.counterCreateDate',
            class: 'td-w-200px text-center',
            sortable: false,
            render: (value) => {
              return formatUTCDate(+value, 'YYYY-MM-DD HH:mm:ss') || ''
            },
          },
          {
            key: 'recoveryTime',
            title: 'obmMonitor.recoveryTime',
            class: 'td-w-200px text-center',
            sortable: false,
            render: (value, row) => {
              return (
                formatUTCDate(
                  +row.recovery_order?.send_time,
                  'YYYY-MM-DD HH:mm:ss',
                ) || ''
              )
            },
          },
          {
            key: 'action',
            class: 'text-center',
            title: 'detail',
          },
        ],
        isRemoveSearch: true,
        configPage: true,
      }
    },
  },
  methods: {
    async getOBMExchangeList() {
      const exchangeData = await SettingOBMService.getObmExchangeList()
      if (exchangeData.status != HttpStatus.OK) {
        this.exchangeList = []
        return
      }
      this.exchangeList = exchangeData.data?.data?.map((item) => {
        return item.exchange
      })
    },
    async getOBMPairList() {
      const pairData = await SettingOBMService.getObmPairList()
      if (pairData.status != HttpStatus.OK) {
        this.pairList = []
        return
      }
      this.pairList = pairData.data?.data?.map((item) => {
        return {
          coin: item.coin,
          currency: item.currency,
        }
      })
      this.pairList.sort((a, b) => {
        const pair1 = [a.coin, a.currency]
        const pair2 = [b.coin, b.currency]
        return sortPairFn(pair1, pair2) as any
      })
    },
    openDetailModal(counterId, recoveryId) {
      this.showDetail = true
      this.counterDetailId = counterId
      this.recoveryDetailId = recoveryId
    },
    refreshTable() {
      if (this.$refs.counterTable) {
        ;(this.$refs.counterTable as IDatatableContext).getData()
      }
    },
    closeEditModal() {
      this.showDetail = false
    },
    onSearch() {
      this.refreshTable()
    },
    onReset() {
      this.pairSelect = {} as { coin: string; currency: string }
      this.exchange = ''
      this.moduleType = ''
      this.bceOrderId = ''
      this.status = ''
      this.refreshTable()
    },
    numberToString(value) {
      return value ? numberToString(value) : ''
    },
  },
})
</script>
