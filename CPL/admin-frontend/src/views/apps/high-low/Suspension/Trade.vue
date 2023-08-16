<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-10">
        <!-- mode -->
        <div class="col-md-4">
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
            @change="selectMode"
          ></v-select>
        </div>
        <!-- period -->
        <div class="col-md-4">
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
        <div class="col-md-4">
          <label class="form-label">{{ $t('highLow.pair') }}:</label>
          <v-select
            :options="pairOptions"
            option-value="id"
            option-label="name"
            :placeholder="$t('highLow.pair')"
            v-model="pairId"
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
      <div class="col-md-6">
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
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
      ></datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { defineComponent } from 'vue'
import Swal from 'sweetalert2'
import store from '@/store'
import { HighLowService } from '@/services/HighLowService'
import { getPeriodByValue } from '@/core/helpers/common.helper'
import { format } from 'date-fns'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'tradeMode',
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
    this.getTradingModes()
    this.getPeriod()
    this.getModes()
    this.getPairs()
  },
  data() {
    return {
      searchText: '',
      loading: false,
      tableReloadKey: 1,

      tradingModes: [],

      // mode
      mode: '',
      modeOptions: [...store.getters.getModes],

      // period
      period: '',
      periodOptions: [...store.getters.getPeriod],

      // pair
      pairId: '',
      pairOptions: [...store.getters.getPairs],

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
        dataSource: (params) =>
          HighLowService.getTradeMode({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'id',
            title: 'no',
            class: 'text-center td-w-50px',
          },
          {
            key: 'mode',
            title: 'mode',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
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
            class: 'td-w-200px min-w-150px',
            render: (value) => {
              return getPeriodByValue(value)
            },
          },
          {
            key: 'symbol',
            title: 'highLow.pair',
            sortable: true,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'stopThresholdValue',
            title: 'highLow.tradingEmergency',
            sortable: true,
            class: 'td-w-200px min-w-150px',
            render: (value) => {
              const temp = new BigNumber(value).toFormat()
              return temp + ' USDT'
            },
          },
          {
            key: 'sumProfit',
            title: 'highLow.tradingUserProfit',
            sortable: true,
            class: 'td-w-200px min-w-150px',
            render: (value) => {
              const temp = new BigNumber(Number(value).toFixed(2)).toFormat()
              return temp + ' USDT'
            },
          },
          {
            key: 'createdAt',
            title: 'highLow.restrictDate',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              if (value) {
                return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
              }

              return ''
            },
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: true,
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

          let data = await HighLowService.exportSuspensionTradeMode(query)

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
        pair: this.pairId || undefined,
        search_text: this.searchText.trim()
          ? this.searchText.trim()
          : undefined,
      }
    },
  },
  methods: {
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
    getTradingModes: async function () {
      const response = await HighLowService.getSettingTradingModes({})
      this.tradingModes = response.data.data
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
    selectMode: async function () {
      this.periodOptions = []

      this.periodOptions.push({
        id: '',
        name: 'All',
      })

      this.tradingModes.forEach((item: any) => {
        const temp = {
          id: item.period,
          name: getPeriodByValue(item.period),
        }

        if (this.mode == '') {
          this.periodOptions.push(temp)
        }

        if (this.mode != '' && item.mode == this.mode) {
          this.periodOptions.push(temp)
        }
      })
    },
    removeSuspension: async function (id: number) {
      if (id) {
        const { isConfirmed } = await Swal.fire({
          text: this.$t('confirmSaveMessage'),
          icon: 'question',
          buttonsStyling: false,
          showCancelButton: true,
          confirmButtonText: this.$t('save'),
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-secondary',
          },
        })

        if (!isConfirmed) {
          return
        }

        this.loading = true
        // const result = await ApiService.patch(
        //   `campaign/${this.campaign.id}`,
        //   instanceToPlain(this.campaign),
        // )
        this.loading = false

        // if (result.status == HttpStatus.OK) {
        //   this.$toastr.success(this.$t('success'))
        //   this.$emit('saved', result.data)
        //   return
        // }

        // if (result.data?.errors?.[0]?.property) {
        //   this.$toastr.error(
        //     'Please check field: ' + result.data.errors[0].property,
        //   )
        //   return
        // }

        // this.$toastr.error(result.data.message)
        return
      }

      this.loading = true
      //   const result = await ApiService.post(
      //     'campaign',
      //     instanceToPlain(this.campaign),
      //   )
      this.loading = false
      //   if (!result || result.data.errors) {
      //     this.$toastr.error(
      //       'Please check field: ' + result.data.errors[0].property,
      //     )
      //   } else {
      //     this.$emit('saved', result.data)
      //   }
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

      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
