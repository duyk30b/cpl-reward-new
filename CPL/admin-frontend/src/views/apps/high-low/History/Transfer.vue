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
        <!-- From -->
        <div class="col-md-2">
          <label class="form-label">{{ $t('highLow.from') }}:</label>
          <v-select
            :options="fromOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.from')"
            v-model="from"
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
          :placeholder="$t('keyword')"
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
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-amount="{ row: item }">
          <span>
            {{ displayAmount(item) }}
          </span>
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import CONFIG from '@/config'
import { HighLowService } from '@/services/HighLowService'
import moment from 'moment'
import { BigNumber } from 'bignumber.js'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'transfer',
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
  data() {
    return {
      searchText: '',
      loading: false,
      tableReloadKey: 1,
      // date
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

      // currency
      currency: '',
      currencyOptions: [
        { id: '', name: 'all' },
        { id: 'USDT', name: 'USDT' },
        { id: 'BCAST', name: 'BCAST' },
      ],

      // from
      from: '',
      fromOptions: [
        { id: '', name: 'all' },
        { id: 'bitcastle', name: 'bitcastle' },
        { id: 'HIGH/LOW', name: 'HIGH/LOW' },
      ],

      // Status
      status: '',
      statusOptions: [
        { id: '', name: 'all' },
        { id: '0', name: this.$t('highLow.failed') },
        { id: '1', name: this.$t('highLow.success') },
        { id: '2', name: this.$t('highLow.pending') },
      ],

      tableConfig: {
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

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
        dataSource: (params) =>
          HighLowService.getTransfers({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'email',
            title: 'email',
            sortable: false,
            class: 'td-w-300px min-w-100px',
          },
          {
            key: 'balanceTypeFrom',
            title: 'highLow.from',
            sortable: true,
            class: 'text-center td-w-100px min-w-100px',
            render: (value) => {
              if (value === 'EXCHANGE') {
                return 'bitcastle'
              }

              return 'HIGH/LOW'
            },
          },
          {
            key: 'balanceTypeTo',
            title: 'highLow.to',
            sortable: true,
            class: 'text-center td-w-100px min-w-100px',
            render: (value) => {
              if (value === 'EXCHANGE') {
                return 'bitcastle'
              }

              return 'HIGH/LOW'
            },
          },
          {
            key: 'amount',
            title: 'highLow.amount',
            sortable: true,
            class: 'text-center td-w-100px min-w-100px',
          },
          {
            key: 'status',
            title: 'status',
            class: 'text-center td-w-100px min-w-100px',
            sortable: false,
            render: (value) => {
              return value
            },
          },
          {
            key: 'updatedAt',
            title: 'highLow.transferDate',
            sortable: true,
            class: 'text-center td-w-150px min-w-100px',
            render: (value) => {
              if (value) {
                return moment(value, 'x').format('DD-MM-y HH:mm:ss')
              }
              return ''
            },
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: true,
        dateOption: true,
        onSearch: true,
        tableName: 'transfer-table',
        // getExport: () => UserService.getUsersExport(),
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
          }

          let data = await HighLowService.exportTransfers(query)

          if (data) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        },
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
        status: this.status || undefined,
        from: this.from || undefined,
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
  methods: {
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
      this.from = ''
      this.status = ''
      this.searchText = ''
      this.currency = ''

      this.refreshTable()
    },
    refreshTable() {
      this.loading = true
      this.tableReloadKey++
    },
    displayAmount(item) {
      if (item.amount == 0) {
        return '--'
      }

      let num = new BigNumber(item.amount).toFormat(18)

      if (item.currency == 'bcast') {
        return num.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' BCAST'
      }

      return num.replace(/(\.0*|(?<=(\..*))0*)$/, '') + ' USDT'
    },
  },
})
</script>
