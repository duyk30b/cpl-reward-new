<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-10">
        <!-- Date range -->
        <div class="col-md-4">
          <label class="form-label">{{ $t('highLow.date') }}:</label>
          <date-range-picker-options
            :start-placeholder="$t('startDate')"
            :end-placeholder="$t('endDate')"
            v-model="dateRange"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
        <!-- currency -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.currency') }}:</label>
          <v-select
            :options="currencyOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.currency')"
            v-model="currency"
            searchable
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- Status -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.status') }}:</label>
          <v-select
            :options="statusOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="status"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
      </div>

      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
      </div>
    </div>

    <!-- Search -->
    <div class="row justify-content-between mt-4">
      <div class="col-md-4">
        <input
          class="form-control"
          placeholder="Email"
          v-model="searchText"
          @keyup="(e) => e.keyCode == 13 && onSearch()"
        />
      </div>
      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onReset"
          :title="$t('reset')"
        >
          <i v-if="!loading" class="fas fa-sync fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
        </button>
      </div>
    </div>
    <div class="card-body p-0">
      <datatable :config="tableConfig" :force-reload-key="tableReloadKey">
        <template v-slot:cell-amount="{ row: item }">
          <span class="text-uppercase">{{ item.amount }}</span>
        </template>
        <template v-slot:cell-coin="{ row: item }">
          <span class="text-uppercase">{{ item.coin }}</span>
        </template>
        <template v-slot:cell-price="{ row: item }">
          <span
            v-if="item.status === STATUS.CREATE || item.status === STATUS.FAILED"
            >--</span
          >
          <span v-else
            >{{ getPrice(item.price, item.amount, item.fee) }} USDT</span
          >
        </template>
        <template v-slot:cell-status="{ row: item }">
          <span :class="formatClass(item.status)">
            {{ formatStatus(item.status) }}
          </span>
        </template>
        <template v-slot:cell-updated_at="{ row: item }">
          <span>{{ formatTime(item.updated_at) }}</span>
        </template>
        <template v-slot:cell-fee="{ row: item }">
          <span>{{ item.fee || 0 }} USDT</span>
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { HighLowService } from '@/services/HighLowService'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { useI18n } from 'vue-i18n'

export enum STATUS {
  CREATE = 0,
  FINISH = 1,
  PENDING = 2,
  FAILED = 3,
}

export default defineComponent({
  name: 'TransferMajorHistory',
  components: {
    Datatable,
  },

  setup() {
    const i18n = useI18n()

    const getLang = () => i18n.locale.value
    return {
      getLang,
    }
  },
  computed: {
    query: function (): any {
      return {
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
        status: this.status || undefined,
        currency: this.currency || undefined,
        search_text: this.searchText.trim()
          ? this.searchText.trim()
          : undefined,
      }
    },
    fromTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => {
          let startDate = item
          if (item) {
            startDate = item + ' 00:00:00'
          }
          return this.validateDate(startDate)
        })[0]
        .toString()
    },
    toTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => {
          let endDate = item
          if (item) {
            endDate = item + ' 23:59:59'
          }

          return this.validateDate(endDate)
        })[1]
        .toString()
    },
  },
  data() {
    return {
      searchText: '',
      loading: false,
      dateRange: [
        '2022-01-01',
        new Date().getFullYear() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getDate(),
      ],
      shortcuts: [
        {
          text: this.$t('highLow.lastMonth'),
          value: () => {
            const end = endOfMonth(subMonths(new Date(), 1))
            const start = startOfMonth(subMonths(new Date(), 1))
            return [start, end]
          },
        },
        {
          text: this.$t('highLow.thisMonth'),
          value: () => {
            const end = new Date()
            const start = startOfMonth(new Date())
            return [start, end]
          },
        },
      ],
      currencyOptions: [
        { id: '', name: 'all' },
        { id: 'AAVE', name: 'AAVE' },
        { id: 'ADA', name: 'ADA' },
        { id: 'ATOM', name: 'ATOM' },
        { id: 'AVAX', name: 'AVAX' },
        { id: 'BCH', name: 'BCH' },
        { id: 'BNB', name: 'BNB' },
        { id: 'BTC', name: 'BTC' },
        { id: 'CASTLE', name: 'CASTLE' },
        { id: 'COMP', name: 'COMP' },
        { id: 'DOT', name: 'DOT' },
        { id: 'DOGE', name: 'DOGE' },
        { id: 'ETH', name: 'ETH' },
        { id: 'LINK', name: 'LINK' },
        { id: 'LTC', name: 'LTC' },
        { id: 'MATIC', name: 'MATIC' },
        { id: 'QNT', name: 'QNT' },
        { id: 'SHIB', name: 'SHIB' },
        { id: 'SOL', name: 'SOL' },
        { id: 'SUSHI', name: 'SUSHI' },
        { id: 'TRX', name: 'TRX' },
        { id: 'UNI', name: 'UNI' },
        { id: 'XRP', name: 'XRP' },
      ],
      currency: '',
      // Status
      status: '',
      statusOptions: [
        { id: '', name: 'all' },
        { id: '0', name: this.$t('highLow.created') },
        { id: '1', name: this.$t('highLow.success') },
        { id: '2', name: this.$t('highLow.pending') },
        { id: '3', name: this.$t('highLow.failed') },
      ],
      tableConfig: {
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

          // transform object
          if (res.data.meta) {
            table.pagination = {
              size: res.data.meta.itemsPerPage,
              page: res.data.meta.currentPage,
              total: res.data.meta.totalItems,
            }
          } else {
            table.pagination = {
              size: 0,
              page: 0,
              total: 0,
            }
          }
          if (table.pageCount && table.pagination.page > table.pageCount)
            table.getData(true)
          else {
            table.data = res.data.items || []
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
        dataSource: (params) => {
          return HighLowService.getBTCTransferHistory({
            ...params,
            ...this.query,
            search_field: 'email', // fix search by email
          })
        },
        columns: [
          {
            key: 'email',
            title: 'highLow.tableBTC.user',
            sortable: false,
            class: 'td-w-200px',
          },
          {
            key: 'amount',
            title: 'highLow.tableBTC.BTCTransferAmount',
            sortable: true,
            class: 'td-w-100px',
            render: (value) => {
              return new BigNumber(value).toFormat()
            },
          },
          {
            key: 'coin',
            title: 'highLow.tableBTC.BTCTransferCoin',
            sortable: true,
            class: 'td-w-50px',
          },
          {
            key: 'receive',
            title: 'highLow.tableBTC.USDTReceiveAmount',
            sortable: true,
            class: 'td-w-150px',
            render: (value) => {
              if (parseFloat(value) >= 0) {
                return new BigNumber(value).toFormat()
              }

              return '--'
            },
          },
          {
            key: 'updated_at',
            title: 'highLow.tableBTC.time',
            sortable: true,
            class: 'td-w-200px text-center',
            render: (value) => {
              if (value) {
                return value
              }

              return ''
            },
          },
          {
            key: 'status',
            title: 'status',
            sortable: true,
            class: 'td-w-100px text-center',
          },
          {
            key: 'fee',
            title: 'highLow.tableBTC.feeAmount',
            sortable: true,
            class: 'td-w-100px',
          },
        ],
        configPage: true,
        onSearch: true,
        dateOption: true,
        activeExport: true,
        createExport: async (params) => {
          let query = {
            lang: this.getLang(),
          }
          if (params) {
            query = {
              ...params,
              ...this.query,
              lang: this.getLang(),
            }
            if (query['search_text']) {
              query['search_field'] = 'email' // fix search by email
            }
          }

          let data = await HighLowService.exportSwaps(query)
          if (data.status === 200) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        },
      } as ITableConfig,
      tableReloadKey: 0,
      dataUpdate: [],
      STATUS: STATUS,
    }
  },
  methods: {
    refreshTable() {
      this.loading = true
      this.tableReloadKey++
    },
    onSearch() {
      this.refreshTable()
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    onReset() {
      this.dateRange = [
        '2022-01-01',
        new Date().getFullYear() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getDate(),
      ]
      this.status = ''
      this.searchText = ''
      this.currency = ''

      this.refreshTable()
    },
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH:mm:ss')
    },
    formatStatus(status) {
      switch (status) {
        case STATUS.CREATE:
          return this.$t('highLow.tableBTC.created')
        case STATUS.FINISH:
          return this.$t('highLow.tableBTC.success')
        case STATUS.PENDING:
          return this.$t('highLow.tableBTC.pending')
        case STATUS.FAILED:
          return this.$t('highLow.tableBTC.failed')
        default:
          return ''
      }
    },
    formatClass(status) {
      switch (status) {
        case STATUS.CREATE:
          return 'Create'
        case STATUS.FINISH:
          return 'Success'
        case STATUS.PENDING:
          return 'Pending'
        case STATUS.FAILED:
          return 'Failed'
        default:
          return ''
      }
    },
    getPrice(price, amount, fee) {
      const p = new BigNumber(price)
      const a = new BigNumber(amount)
      const f = new BigNumber(fee)
      if (!fee) {
        return p.multipliedBy(a)
      }
      if (p.multipliedBy(a).minus(f).toNumber() < 0) {
        return 0
      }
      return p.multipliedBy(a).minus(f)
    },
  },
})
</script>
<style lang="scss">
.title {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

label {
  display: block;
  margin-bottom: 4px;
  width: 100%;
}

.pr-2 {
  padding-right: 4px;
}

.white-space {
  white-space: nowrap;
}

.pt-3 {
  padding-top: 12px;
}

.Create {
  background-color: rgba(32, 201, 151, 0.1);
  color: #20c997;
  padding: 4px;
  border-radius: 4px;
}

.Pending {
  background-color: rgba(255, 193, 7, 0.1);
  color: #ffc107;
  padding: 4px;
  border-radius: 4px;
}

.Success {
  color: #009ef7;
  background-color: rgba(0, 158, 247, 0.1);
  padding: 4px;
  border-radius: 4px;
}

.Failed {
  background-color: rgba(220, 53, 69, 0.1);
  color: #dc3545;
  padding: 4px;
  border-radius: 4px;
}

.fz-13 {
  font-size: 13px;
}
</style>
