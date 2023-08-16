<template>
  <div class="card p-8">
    <div class="row">
      <!-- Targer date -->
      <div class="col-md-4">
        <label class="form-label">Target time:</label>
        <date-time-picker v-model="datetime" />
      </div>
      <!-- Pair -->
      <div class="col-md-4">
        <label class="form-label">{{ $t('highLow.pair') }}:</label>
        <v18n-select
          :options="pairOptions"
          option-value="id"
          option-label="name"
          :placeholder="$t('highLow.pair')"
          v-model="pair"
          searchable
          :multiple="false"
          :can-deselect="true"
          :remote="false"
          :sourceFunction="false"
        ></v18n-select>
      </div>
      <!-- Exchange -->
      <div class="col-md-4">
        <label class="form-label">{{ $t('highLow.exchange') }}:</label>
        <v18n-select
          :options="exchangeOptions"
          option-value="id"
          option-label="name"
          :placeholder="$t('highLow.pair')"
          v-model="exchange"
          :multiple="false"
          :can-deselect="true"
          :remote="false"
          :sourceFunction="false"
        ></v18n-select>
      </div>
    </div>
    <div class="row mt-4">
      <!-- Global -->
      <div class="col-md-4">
        <label class="form-label">{{ $t('highLow.global') }}:</label>
        <v18n-select
          :options="globalOptions"
          option-value="id"
          option-label="name"
          :placeholder="$t('highLow.exchange')"
          v-model="global"
          searchable
          :multiple="false"
          :can-deselect="true"
          :remote="false"
          :sourceFunction="false"
        ></v18n-select>
      </div>
      <!-- Forced Flag -->
      <div class="col-md-4">
        <label class="form-label">{{ $t('highLow.forcedFlag') }}:</label>
        <v18n-select
          :options="forcedOptions"
          option-value="id"
          option-label="name"
          :placeholder="$t('highLow.exchange')"
          v-model="forced"
          searchable
          :multiple="false"
          :can-deselect="true"
          :remote="false"
          :sourceFunction="false"
        ></v18n-select>
      </div>
      <!-- Search -->
      <div class="col-md-4 align-self-end">
        <div>
          <button
            class="btn btn-primary me-2 w-100"
            :title="$t('search')"
            :disabled="loading"
            @click="onSearch"
          >
            <i v-if="!loading" class="fas fa-search fa-fw"></i>
            <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="">{{ $t('search') }}</span>
          </button>
        </div>
      </div>
    </div>
    <div class="card-body p-0">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
      ></datatable>
    </div>
    <div class="card-footer">
      <nav>
        <ul class="pagination justify-content-center">
          <li class="page-item">
            <button
              @click="handlePaging(-1)"
              :disabled="loading"
              class="page-link"
            >
              Previous
            </button>
          </li>
          <li class="page-item">
            <button
              @click="handlePaging(1)"
              :disabled="loading"
              class="page-link"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import moment from 'moment'

import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { HighLowService } from '@/services/HighLowService'
import { format } from 'date-fns/esm'
import BigNumber from 'bignumber.js'
import { getTime } from 'date-fns'

export default defineComponent({
  name: 'crypto_crawler',
  components: { Datatable },
  data() {
    return {
      loading: false,
      tableReloadKey: 0,
      datetime: new Date(new Date(new Date().setHours(0)).setMinutes(0)),

      pageOptions: [60],

      // Pair
      pair: 'BTC/USD',
      pairOptions: [
        { id: 'BTC/USD', name: 'BTC/USD' },
        { id: 'ETH/USD', name: 'ETH/USD' },
        { id: 'BCH/USD', name: 'BCH/USD' },
        { id: 'XRP/USD', name: 'XRP/USD' },
        { id: 'LTC/USD', name: 'LTC/USD' },
      ],

      // Exchange
      exchange: '',
      exchangeOptions: [
        { id: '', name: 'all' },
        { id: 'internal', name: 'highLow.internal' },
        { id: 'binance', name: 'Binance' },
        { id: 'huobi', name: 'Huobi' },
        { id: 'coinbase', name: 'Coinbase' },
      ],

      // Global
      global: '',
      globalOptions: [
        { id: '', name: 'all' },
        { id: 'same', name: 'highLow.same' },
        { id: 'up', name: 'highLow.up' },
        { id: 'down', name: 'highLow.down' },
      ],

      // Forced flag
      forced: '',
      forcedOptions: [
        { id: '', name: 'all' },
        { id: 'blank', name: 'highLow.blank' },
        { id: 'same-exchange', name: 'highLow.sameExchange' },
        {
          id: 'internal-activation',
          name: 'highLow.internalActivition',
        },
        {
          id: '5s',
          name: 'highLow.5s',
        },
        {
          id: 'same-price',
          name: 'highLow.samePrice',
        },
      ],

      tableConfig: {
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading
          this.$data['pageOptions'] = [60]

          table.pagination = res.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount)
            table.getData(true)
          else {
            table.data = res.data.data || []
            table.data.forEach((row, index) => {
              if (!row.id)
                row.id =
                  index +
                  1 +
                  (table.pagination.page - 1) * table.pagination.size
            })
            if (table.config.drawCallback) table.config.drawCallback()
          }
        },
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        dataSource: (params) =>
          HighLowService.getStatisticCrawler({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'timestamp',
            title: 'highLow.time',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              return format(new Date(+value), 'yyyy-MM-dd HH:mm:ss')
            },
          },
          {
            key: 'price',
            title: 'highLow.finalPrice',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              const temp = new BigNumber(Number(value)).toFormat(2)
              return temp.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' USDT'
            },
          },
          {
            key: 'prices',
            title: 'highLow.internal',
            sortable: false,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              const temp =
                value && value.find((item) => item.exchange === 'internal')

              const newVal =
                temp && new BigNumber(Number(temp.price)).toFormat(2)

              return newVal.replace(/(\.0*|(?<=(\..*))0*)$/, '')
            },
          },
          {
            key: 'prices',
            title: 'binance',
            class: 'td-w-100px min-w-80px',
            sortable: false,
            render: (value) => {
              const temp =
                value && value.find((item) => item.exchange === 'binance')
              const newVal =
                temp && new BigNumber(Number(temp.price)).toFormat()
              return newVal
            },
          },
          {
            key: 'prices',
            title: 'Huobi',
            sortable: false,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              const temp =
                value && value.find((item) => item.exchange === 'huobi')
              const newVal =
                temp && new BigNumber(Number(temp.price)).toFormat()
              return newVal
            },
          },
          {
            key: 'prices',
            title: 'Coinbase',
            sortable: false,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              const temp =
                value && value.find((item) => item.exchange === 'coinbase')
              const newVal =
                temp && new BigNumber(Number(temp.price)).toFormat()
              return newVal
            },
          },
          {
            key: 'adjustment_rate',
            title: 'highLow.adjustmentRate',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'buffer_rate',
            title: 'highLow.bufferRate',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'selected_exchange',
            title: 'highLow.selecedExchange',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'source',
            title: 'highLow.exchange',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'global_trend',
            title: 'highLow.globalTrend',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'force_flag',
            title: 'highLow.forcedFlag',
            sortable: false,
            class: 'td-w-100px min-w-80px',
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: false,
        dateOption: false,
        onSearch: false,
        pageOptions: [60],
        tableName: 'statistic-crawler-table',
      } as ITableConfig,
    }
  },
  computed: {
    query: function (): any {
      return {
        target_date: this.datetime
          ? getTime(new Date(this.datetime as Date))
          : undefined,
        source: this.exchange || undefined,
        global_trend: this.global || undefined,
        forced_flag: this.forced || undefined,
        pair: this.pair || undefined,
      }
    },
  },
  methods: {
    onSearch() {
      this.loading = true
      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
    handlePaging(value) {
      const newDateTime = moment(this.datetime.getTime()).add(value, 'minutes')
      this.datetime = newDateTime.toDate()
      this.onSearch()
    },
  },
})
</script>
