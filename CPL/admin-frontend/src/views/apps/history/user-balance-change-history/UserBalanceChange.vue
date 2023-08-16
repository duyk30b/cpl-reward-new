<template>
  <div class="card" id="user-balance-change-history-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">{{ $t('userBalanceChangeScreen.title') }}</div>
    </div>

    <div class="row mx-5 d-flex align-items-end">
      <div class="col-4">
        <label class="form-label"
          >{{ $t('userBalanceChangeScreen.createdAt') }}
        </label>
        <date-range-picker-options
          :start-placeholder="$t('exchangeHistory.startDate')"
          :end-placeholder="$t('exchangeHistory.endDate')"
          v-model="querySearch.date_range"
          format="YYYY-MM-DD"
        ></date-range-picker-options>
      </div>

      <div class="col-2">
        <label class="form-label"
          >{{ $t('userBalanceChangeScreen.currency') }}
        </label>
        <el-select
          class="form-select-solid"
          :placeholder="$t('userBalanceChangeScreen.currency')"
          v-model="querySearch.currency"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="currency in currencyOptions"
            :value="currency"
            :key="`target${currency}`"
            :label="currency.toUpperCase()"
          />
        </el-select>
      </div>

      <div class="col-4">
        <label class="form-label">{{ $t('email') }} </label>
        <el-select
          v-model="querySearch.user_ids"
          multiple
          collapse-tags
          filterable
          clearable
          remote
          reserve-keyword
          :placeholder="$t('email')"
          remote-show-suffix
          :remote-method="getUsersRegistrant"
          :loading="remoteLoading"
        >
          <el-option
            v-for="user in users"
            :key="user.user_id"
            :label="user.email"
            :value="user.user_id"
          />
        </el-select>
      </div>

      <div class="col-2">
        <button
          class="btn btn-primary w-100"
          :disabled="searching"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!searching" class="fas fa-search fa-fw"></i>
          <i v-if="searching" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
      </div>
    </div>

    <div class="row mx-5 mt-5">
      <el-radio-group v-model="querySearch.transaction_type">
        <el-radio
          :label="USER_BALANCE_CHANGE_TYPE_ALL"
          :key="USER_BALANCE_CHANGE_TYPE_ALL"
        >
          {{ $t(`userBalanceChangeScreen.transactionTypes.ALL`) }}
        </el-radio>
        <el-radio
          :label="TRANSACTION_TYPE.MANUALLY"
          :key="TRANSACTION_TYPE.MANUALLY"
        >
          {{
            $t(
              `userBalanceChangeScreen.transactionTypes.${
                TRANSACTION_TYPE[TRANSACTION_TYPE.MANUALLY]
              }`,
            )
          }}
        </el-radio>
        <el-radio
          :label="TRANSACTION_TYPE.IMPORT_EXCEL"
          :key="TRANSACTION_TYPE.IMPORT_EXCEL"
        >
          {{
            $t(
              `userBalanceChangeScreen.transactionTypes.${
                TRANSACTION_TYPE[TRANSACTION_TYPE.IMPORT_EXCEL]
              }`,
            )
          }}
        </el-radio>
      </el-radio-group>
    </div>

    <div class="card-body pt-5">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        ref="datatableRef"
      >
        <template v-slot:cell-no="{ idx, page, size }">
          {{ (page - 1) * size + idx + 1 }}
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import { UserBalanceChangeService } from '@/views/apps/history/user-balance-change-history/UserBalanceChangeService'
import { UserService } from '@/services/UserService'
import {
  Currency,
  BalanceChangeHistoryRequest,
} from '@/views/apps/history/user-balance-change-history/balance.interface'
import { Mutations } from '@/store/enums/StoreEnums'
import moment from 'moment'
import { debounce } from 'lodash'
import {
  formatCurrencyAmount,
  formatTimeStamp,
  jsonToCsv,
} from '@/core/helpers/util'
import { TRANSACTION_TYPE } from '@/enums/balance.enum'
const USER_BALANCE_CHANGE_TYPE_ALL = 0

export default defineComponent({
  name: 'User Balance Change History',
  components: {
    Datatable,
  },
  data() {
    return {
      listCurrency: [] as Currency[],
      searching: false as boolean,
      querySearch: {
        user_ids: [],
        currency: '',
        date_range: [moment().startOf('year').toDate(), moment().toDate()],
        transaction_type: USER_BALANCE_CHANGE_TYPE_ALL,
      },
      TRANSACTION_TYPE,
      USER_BALANCE_CHANGE_TYPE_ALL,
      users: [],
      remoteLoading: false,
      tableReloadKey: 1,
      tableConfig: {
        dataSource: (params) =>
          this.getDataSource({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'userBalanceChangeScreen.no',
            sortable: false,
            class: 'td-w-100px align-middle text-center',
          },
          {
            key: 'email',
            title: 'userBalanceChangeScreen.email',
            sortable: false,
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'type',
            title: 'userBalanceChangeScreen.type',
            sortable: true,
            render: (value) => {
              return this.$t(
                `userBalanceChangeScreen.transactionTypes.${TRANSACTION_TYPE[value]}`,
              )
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'amount',
            title: 'userBalanceChangeScreen.amount',
            sortable: true,
            render: (value, row) => {
              return `${formatCurrencyAmount(
                value,
                row.currency,
                '0',
                null,
              )} ${row.currency.toUpperCase()}`
            },
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'currency',
            title: 'userBalanceChangeScreen.currency',
            sortable: true,
            render: (value) => {
              return value.toUpperCase()
            },
            class: 'td-w-100px align-middle text-center',
          },
          {
            key: 'createdAt',
            title: 'userBalanceChangeScreen.createdAt',
            sortable: true,
            sortKey: 'created_at',
            class: 'td-w-200px align-middle text-center',
            render: (value) => {
              return formatTimeStamp(value)
            },
          },
        ],
        configPage: true,
        activeDownloadCsv: true,
        downloadCsv: (params) =>
          this.handleDownloadCsv({
            ...params,
            ...this.query,
          }),
      } as ITableConfig,
    }
  },
  created() {
    this.getListCurrency()
    this.getUsersRegistrant('')
  },
  mounted() {
    setCurrentPageBreadcrumbs('userBalanceChangeScreen.title', [])
  },
  computed: {
    query: function (): any {
      const queryObject = {}
      for (const [key, value] of Object.entries(this.querySearch)) {
        if (value) {
          queryObject[key] = value
        }
      }
      const [startDate, endDate] = this.querySearch.date_range
      queryObject['start_date'] = moment(startDate.toString())
        .startOf('day')
        .format('x')
      queryObject['end_date'] = moment(endDate.toString())
        .endOf('day')
        .format('x')
      delete queryObject['date_range']
      return queryObject
    },
    currencyOptions: function (): string[] {
      const allSymbols: string[] = []
      for (let currency of this.listCurrency) {
        if (currency.coin !== 'b-usdt') {
          allSymbols.push(currency.coin)
        }
      }
      return [...new Set(allSymbols)]
    },
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(params: BalanceChangeHistoryRequest) {
      try {
        this.searching = true
        const { status_code, data } =
          await UserBalanceChangeService.getUserBalanceChangeHistories(params)
        this.searching = false
        if (status_code === HttpStatus.OK) {
          return {
            status: HttpStatus.OK,
            data,
          }
        }
      } catch (err) {
        this.searching = false
      }
    },

    async onSearch() {
      this.refreshTable()
    },

    async getListCurrency() {
      const data = await UserBalanceChangeService.getListCurrency()
      this.listCurrency = data ?? []
    },

    async handleDownloadCsv(params: BalanceChangeHistoryRequest) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const { status_code, data } =
        await UserBalanceChangeService.getAllUserBalanceChangeHistories(params)
      if (status_code === HttpStatus.OK) {
        const transactions = data.data.map((item, index) => {
          return {
            no: index + 1,
            email: item.email,
            type: this.$t(
              `userBalanceChangeScreen.transactionTypes.${
                TRANSACTION_TYPE[item.type]
              }`,
            ),
            amount: `${formatCurrencyAmount(
              item.amount,
              item.currency,
              '0',
              null,
            )} ${item.currency.toUpperCase()}`,
            currency: item.currency.toUpperCase(),
            created_at: formatTimeStamp(item.createdAt),
          }
        })

        await this.downloadCsv(transactions)
      } else {
        this.$toastr.error(this.$t('userBalanceChangeScreen.exportFileError'))
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async downloadCsv(data) {
      const fileName = `User-Balance-Change-History-${moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}.csv`
      const headerTitle = [
        this.$t('userBalanceChangeScreen.no'),
        this.$t('userBalanceChangeScreen.email'),
        this.$t('userBalanceChangeScreen.type'),
        this.$t('userBalanceChangeScreen.amount'),
        this.$t('userBalanceChangeScreen.currency'),
        this.$t('userBalanceChangeScreen.createdAt'),
      ]
      const dataToCsv = jsonToCsv(data, headerTitle)
      const url = window.URL.createObjectURL(new Blob([dataToCsv]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },
    async getUsersRegistrant(query) {
      this.remoteLoading = true
      const data = await UserService.getListUsers({
        search_field: 'email',
        search_text: query,
      })
      this.remoteLoading = false
      this.users = data?.data?.data ?? []
    },
  },
  watch: {
    'querySearch.user_ids': debounce(async function (this: any) {
      this.refreshTable()
    }, 300),
    'querySearch.transaction_type': function () {
      this.refreshTable()
    },
  },
})
</script>
