<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-10">
        <!-- mode -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.mode') }}:</label>
          <v-select
            :options="modeOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.mode')"
            v-model="mode"
            searchable
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- period -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.period') }}:</label>
          <v-select
            :options="periodOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.period')"
            v-model="period"
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
          ></v-select>
        </div>
        <!-- pair -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.pair') }}:</label>
          <v-select
            :options="pairOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="pairId"
            searchable
            :multiple="false"
            :can-deselect="true"
            :remote="false"
            :sourceFunction="false"
            v-on:change="handOnchangePair"
          ></v-select>
        </div>
        <!-- pair -->
        <div class="col-md-3">
          <label class="form-label">{{ $t('highLow.status') }}:</label>
          <v-select
            :options="statusOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.status')"
            v-model="status"
            searchable
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
    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-orderExpireTime="{ row: mode }">
          {{
            mode.mode === 'H' || mode.mode === 'HS'
              ? getExpiredTime(mode.orderExpireTime)
              : '-'
          }}
        </template>
        <template v-slot:cell-pairId="{ row: mode }">
          {{
            pairOptions.length > 0
              ? pairOptions.filter((elm) => elm.id === mode.pairId)[0].name
              : '-'
          }}
        </template>
        <template v-slot:cell-action="{ row: mode }">
          <a
            class="btn btn-sm btn-primary me-1 text-uppercase"
            @click="handleRedirectDetailPage(mode)"
          >
            {{ $t('detail') }}
          </a>
        </template>
        <template v-slot:cell-status="{ row: mode }">
          <span
            class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              name="notifications"
              v-model="mode.status"
              v-on:change="handleUpdateStatus(mode)"
            />
          </span>
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { defineComponent } from 'vue'
import BigNumber from 'bignumber.js'
import { HighLowService } from '@/services/HighLowService'
import store from '@/store'
import { getPeriodByValue } from '@/core/helpers/common.helper'
import { useI18n } from 'vue-i18n'
import { HttpStatus } from '@/core/variables/common.enum'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'settingTradingTradingMode',
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
  mounted() {
    this.getPeriod()
    this.getModes()
    this.getPairs()
    this.getParams()
  },
  data() {
    return {
      searchText: '',
      loading: false,
      tableReloadKey: 1,

      // mode
      mode: '',
      modeOptions: [...store.getters.getModes],

      // period
      period: '',
      periodOptions: [...store.getters.getPeriod],

      // pair
      pairId: '',
      pairOptions: [...store.getters.getPairs],

      status: '',
      statusOptions: [
        { id: '', name: 'All' },
        { id: '0', name: 'Disable' },
        { id: '1', name: 'Enable' },
      ],

      tableConfig: {
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
        dataSource: async (params) => {
          const result = await HighLowService.getTradingPair({
            ...params,
            ...this.query,
          })
          if (result.status === HttpStatus.OK) {
            // transform status to boolean
            result?.data?.data?.forEach((item) => {
              item.status = item.status === '1'
            })
            return result
          }
          return []
        },
        columns: [
          {
            key: 'id',
            title: 'no',
            sortable: true,
            class: 'text-center td-w-50px',
          },
          {
            key: 'pairId',
            title: 'highLow.pair',
            class: 'text-center td-w-50px',
          },
          {
            key: 'mode',
            title: 'mode',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              switch (value) {
                case 'H':
                  return 'High/Low'
                case 'HS':
                  return 'High/Low Spread'
                case 'T':
                  return 'Lightning'
                case 'TS':
                  return 'Lightning Spread'

                default:
                  break
              }
            },
          },
          {
            key: 'period',
            title: 'highLow.period',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              return getPeriodByValue(value)
            },
          },
          {
            key: 'startTime',
            title: 'highLow.transactionStartTime',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              const time = value.split(':')
              const hour = time[0]
              const minute = time[1]
              const second = time[2]
              const date = new Date(
                new Date().setUTCHours(hour, minute, second),
              )

              return (
                (date.getHours() < 10
                  ? '0' + date.getHours()
                  : date.getHours()) +
                ':' +
                (date.getMinutes() < 10
                  ? '0' + date.getMinutes()
                  : date.getMinutes()) +
                ':' +
                (date.getSeconds() < 10
                  ? '0' + date.getSeconds()
                  : date.getSeconds())
              )
            },
          },
          {
            key: 'endTime',
            title: 'highLow.transactionEndTime',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
            render: (value) => {
              const time = value.split(':')
              const hour = time[0]
              const minute = time[1]
              const second = time[2]
              const date = new Date(
                new Date().setUTCHours(hour, minute, second),
              )

              return (
                (date.getHours() < 10
                  ? '0' + date.getHours()
                  : date.getHours()) +
                ':' +
                (date.getMinutes() < 10
                  ? '0' + date.getMinutes()
                  : date.getMinutes()) +
                ':' +
                (date.getSeconds() < 10
                  ? '0' + date.getSeconds()
                  : date.getSeconds())
              )
            },
          },
          {
            key: 'payout',
            title: 'highLow.defaultPayout',
            sortable: true,
            class: 'text-center td-w-100px min-w-80px',
          },
          {
            key: 'limitOrderMin',
            title: 'highLow.orderAmountMinimum',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              return value + ' USDT'
            },
          },
          {
            key: 'orderExpireTime',
            title: 'highLow.expiryTimeBeforeReceivingOrder',
            sortable: true,
            class: 'td-w-100px min-w-80px',
          },
          {
            key: 'stopThresholdValue',
            title: 'highLow.tradingEmergencyStopThreshold',
            sortable: true,
            class: 'td-w-100px min-w-80px',
            render: (value) => {
              const temp = new BigNumber(value).toFormat()
              return temp + ' USDT'
            },
          },
          {
            key: 'action',
            class: 'text-center td-w-100px min-w-50px',
          },
          {
            key: 'status',
            class: 'text-center td-w-100px min-w-50px',
          },
        ],
        configPage: false,
        configColumn: false,
        activeExport: false,
        onSearch: true,
        tableName: 'trade-mode-table',
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

          let data = await HighLowService.exportTradingMode(query)

          if (data) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        },
      } as ITableConfig,
    }
  },
  computed: {
    query: function (): any {
      return {
        mode: this.mode || undefined,
        period: this.period || undefined,
        searchText: this.searchText || undefined,
        pair_id: this.$route.query?.pair || undefined,
        status: this.status || undefined,
      }
    },
  },
  methods: {
    getExpiredTime(value) {
      const [hours, mins, secs] = value.split(':')
      let results = ''
      if (+hours > 0) {
        if (+hours === 1) {
          results += `${+hours} Hour `
        } else {
          results += `${+hours} Hours `
        }
      }
      if (+mins > 0) {
        if (+mins === 1) {
          results += `${+mins} Minute `
        } else {
          results += `${+mins} Minutes `
        }
      }
      if (+secs > 0) {
        if (+secs === 1) {
          results += `${+secs} Second `
        } else {
          results += `${+secs} Seconds `
        }
      }
      return results.trim()
    },
    handOnchangePair() {
      this.$router.replace({
        name: 'high-low-setting-trading',
        query: {
          tab: 'trading-dev',
          pair: this.pairId,
        },
      })
    },
    async getParams() {
      const pair = this.$route.query?.pair
      this.pairId = pair ? pair.toString() : ''
    },
    async handleUpdateStatus(mode) {
      mode.status = !mode.status
      const message = `Are you sure ${
        mode.status ? 'DISABLE' : 'ENABLE'
      } this mode?`
      await Swal.fire({
        text: message,
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('Yes'),
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-secondary',
        },
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const body = {
            id: mode.id,
            status: mode.status ? '0' : '1',
          }
          const res = await HighLowService.updateTradingModeStatus(
            mode.id,
            body,
          )

          if (res && res.status == 200) {
            this.$toastr.success(this.$t('success'))
            this.refreshTable()
            return
          }
          return this.$toastr.error(this.$t('error'))
        },
      })
    },
    handleRedirectDetailPage(mode) {
      this.$router.push({
        name: 'high-low-setting-trading-detail',
        params: { id: mode.id, slug: 'view' },
        query: { type: 'view-dev' },
      })
    },
    getPeriod: async function () {
      this.periodOptions = []

      const response = await HighLowService.getPeriod()
      const { data } = response
      this.periodOptions.push({
        id: '',
        name: 'All',
      })
      data.data.forEach((item) => {
        const temp = {
          id: item.period,
          name: getPeriodByValue(item.period),
        }

        this.periodOptions.push(temp)
      })
    },
    getModes: async function () {
      this.modeOptions = []

      const response = await HighLowService.getSettingTradingModes({
        get_only: true,
      })
      const { data } = response
      this.modeOptions.push({
        id: '',
        name: 'All',
      })
      data.data.forEach((item) => {
        const temp = {
          id: item.mode,
          name: item.name,
        }

        this.modeOptions.push(temp)
      })
    },
    getPairs: async function () {
      this.pairOptions = []

      const response = await HighLowService.getSettingTradingPair({
        get_only: true,
      })
      const { data } = response
      this.pairOptions.push({
        id: '',
        name: 'All',
      })
      data.data.forEach((item) => {
        const temp = {
          id: item.id,
          name: item.symbol,
        }

        this.pairOptions.push(temp)
      })
    },
    onSearch() {
      this.refreshTable()
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    onReset() {
      this.mode = ''
      this.period = ''
      this.searchText = ''
      this.pairId = ''
      this.status = ''

      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
