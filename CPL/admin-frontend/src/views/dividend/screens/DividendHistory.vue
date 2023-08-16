<template>
  <div class="card" id="currency-setting-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">{{ $t('dividendScreen.dividendHistory') }}</div>
    </div>

    <div class="row mx-5 d-flex align-items-end">
      <div class="col-4">
        <label class="form-label"
          >{{ $t('dividendScreen.dividendDate') }}
        </label>
        <date-range-picker-options
          :start-placeholder="$t('exchangeHistory.startDate')"
          :end-placeholder="$t('exchangeHistory.endDate')"
          v-model="querySearch.dateRange"
          format="YYYY-MM-DD"
        ></date-range-picker-options>
      </div>

      <div class="col-2">
        <label class="form-label"
          >{{ $t('dividendScreen.dividendName') }}
        </label>
        <el-select
          class="form-select-solid"
          :placeholder="$t('dividendScreen.dividendName')"
          v-model="querySearch.dividend_id"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="dividend in dividendCampaigns"
            :value="dividend.id"
            :key="`dividend${dividend.id}`"
            :label="dividend.name"
          />
        </el-select>
      </div>

      <div class="col-4">
        <label class="form-label">{{ $t('search') }} </label>
        <div class="input-group text-search-group">
          <el-select
            class="form-select-solid"
            v-model="querySearch.selected_search"
            filterable
          >
            <el-option :value="SEARCH_TYPE.ALL" label="All" />
            <el-option
              :value="SEARCH_TYPE.DIVIDEND_NAME"
              :label="$t('dividendScreen.dividendName')"
            />
            <el-option :value="SEARCH_TYPE.USER" :label="$t('email')" />
          </el-select>

          <el-select
            class="input-group-search-key"
            v-model="querySearch.search_key"
            filterable
            clearable
            remote
            reserve-keyword
            :placeholder="$t('email')"
            remote-show-suffix
            :remote-method="getUsersRegistrant"
            :loading="remoteLoading"
            v-if="querySearch.selected_search === SEARCH_TYPE.USER"
          >
            <el-option
              v-for="user in users"
              :key="user.user_id"
              :label="user.email"
              :value="user.user_id"
            />
          </el-select>

          <el-input
            class="input-group-search-key"
            :placeholder="$t('keyword')"
            v-model="querySearch.search_key"
            clearable
            v-else
          />
        </div>
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

    <div class="card-body pt-5">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        ref="datatableRef"
      >
        <template v-slot:cell-no="{ idx, page, size }">
          {{ (page - 1) * size + idx + 1 }}
        </template>

        <template v-slot:cell-add_dividend_at="{ row: item }">
          <el-tooltip
            class="item"
            effect="dark"
            v-if="item.add_dividend_at"
            :content="
              $t('dividendScreen.addDividendAt', {
                addDividendAt: `${formatAddDividendAt(item.add_dividend_at)}`,
              })
            "
            placement="left"
          >
            <el-button type="info" :icon="InfoFilled" circle />
          </el-tooltip>
        </template>
      </datatable>
      <dividend-new-code
        @createDividendCodeSuccess="refreshTable"
        :dividend-name-selected="querySearch.dividend_id"
        ref="dividendNewCodeRef"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { InfoFilled } from '@element-plus/icons-vue'
</script>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import DividendNewCode from '@/views/dividend/components/DividendNewCode.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import { DividendService } from '@/views/dividend/services/DividendService'
import { UserService } from '@/services/UserService'
import {
  formatCurrencyAmount,
  formatTimeStamp,
  mulBigNumber,
  jsonToCsv,
} from '@/core/helpers/util'
import { GetDividendHistoriesRequest } from '@/views/dividend/definition/dividend.dto'
import { DividendHistory } from '@/views/dividend/definition/dividend.interface'
import { Mutations } from '@/store/enums/StoreEnums'
import {
  STATUS,
  DIVIDEND_CALCULATED_MODE,
  ALLOCATE_STATUS,
  DISTRIBUTE_TYPE,
} from '@/views/dividend/definition/dividend.enum'
import moment from 'moment'
import { debounce } from 'lodash'
const TYPE_GIFT = 'gift'
const TARGET_CURRENCY_ALL = 'all'

interface User {
  user_id: string
  email: string
}

enum SEARCH_TYPE {
  ALL = '',
  DIVIDEND_NAME = 'dividend_campaigns.name',
  USER = 'dividend_codes.user_id',
}

export default defineComponent({
  name: 'Dividend List',
  components: {
    Datatable,
    DividendNewCode,
  },
  data() {
    return {
      dividendCampaigns: [] as any[],
      searching: false as boolean,
      querySearch: {
        dividend_id: '',
        selected_search: SEARCH_TYPE.ALL,
        dateRange: [moment().subtract(1, 'month').toDate(), new Date()],
        search_key: '',
      },
      tableReloadKey: 1,
      STATUS,
      DIVIDEND_CALCULATED_MODE,
      ALLOCATE_STATUS,
      DISTRIBUTE_TYPE,
      SEARCH_TYPE,
      users: [] as User[],
      remoteLoading: false,
      tableConfig: {
        dataSource: (params) =>
          this.getDataSource({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'dividendScreen.no',
            sortable: false,
            class: 'td-w-50px align-middle text-center',
          },
          {
            key: 'name',
            title: 'dividendScreen.dividendName',
            sortable: true,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'email',
            title: 'dividendScreen.user',
            sortable: true,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'amount',
            title: 'dividendScreen.dividendAmount',
            sortable: true,
            render: (value, row) => this.renderAmount(value, row),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'usd_rate',
            title: 'dividendScreen.usdRate',
            sortable: true,
            render: (value, row) => this.renderUsdRate(value, row),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'ending_balance',
            title: 'dividendScreen.endingBalance',
            sortable: true,
            render: (value, row) => this.renderEndingBalance(value, row),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'dividend_rate',
            title: 'dividendScreen.dividendRate',
            sortable: true,
            render: (value, row) => this.renderDividendRate(value, row),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'target_amount',
            title: 'dividendScreen.targetAmount',
            sortable: true,
            render: (value, row) => this.renderTargetAmount(value, row),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'dividend_date',
            title: 'dividendScreen.dividendDate',
            sortable: true,
            render: (value) => {
              return formatTimeStamp(value)
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'add_dividend_at',
            title: '',
            sortable: false,
            render: () => {
              return ''
            },
            class: 'td-w-100px align-middle text-center',
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
    this.getDividendName()
  },
  mounted() {
    setCurrentPageBreadcrumbs('dividendScreen.dividendHistory', [])
  },
  computed: {
    query: function (): any {
      const queryObject = {}
      for (const [key, value] of Object.entries(this.querySearch)) {
        if (value) {
          queryObject[key] = value
        }
      }
      const [startDate, endDate] = this.querySearch.dateRange
      queryObject['start_date'] = moment(startDate.toString())
        .startOf('day')
        .format('x')
      queryObject['end_date'] = moment(endDate.toString())
        .endOf('day')
        .format('x')
      delete queryObject['dateRange']
      return queryObject
    },
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(params: GetDividendHistoriesRequest) {
      try {
        this.searching = true
        const { success, data } = await DividendService.getHistories(params)
        this.searching = false
        if (success) {
          return {
            status: HttpStatus.OK,
            data: {
              data: data.data,
              pagination: {
                page: params.page,
                size: params.limit,
                total: data.pagination.total,
              },
            },
          }
        }
      } catch (err) {
        this.searching = false
      }
    },

    async onSearch() {
      this.refreshTable()
    },

    async getDividendName() {
      const { success, data } = await DividendService.getDividendNames()
      if (success) {
        const dividendCampaigns = data?.data ?? []
        const campaigns: any[] = []
        for (const [id, name] of Object.entries(dividendCampaigns)) {
          campaigns.push({ id, name })
        }
        campaigns.sort((a, b) => {
          return a.name[0].localeCompare(b.name[0])
        })
        this.dividendCampaigns = campaigns
      }
    },

    formatAddDividendAt(timestamp) {
      if (!timestamp) {
        return ''
      }

      let format = 'YYYY-MM-DD'
      if (this.$i18n.locale === 'ja') {
        format = 'YYYY年MM月DD日'
      }

      return moment(timestamp, 'x').format(format)
    },

    changeCurrencyAll(value) {
      if (value) {
        return value === TARGET_CURRENCY_ALL ? 'usd' : value
      }
      return ''
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

    async handleDownloadCsv(params: GetDividendHistoriesRequest) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      try {
        let data = await this.getAllDataForDownload(params)

        const codes = data.map((item, index) => {
          return {
            no: index + 1,
            name: item.name,
            email: item.email,
            amount: this.renderAmount(item.amount, item),
            usd_rate: this.renderUsdRate(item.usd_rate, item),
            ending_balance: this.renderEndingBalance(item.ending_balance, item),
            dividend_rate: this.renderDividendRate(item.dividend_rate, item),
            target_amount: this.renderTargetAmount(item.target_amount, item),
            dividend_date: formatTimeStamp(item.dividend_date),
          }
        })
        await this.downloadCsv(codes)
      } catch (err) {
        this.$toastr.error(this.$t('dividendScreen.exportFileError'))
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async getAllDataForDownload(params: GetDividendHistoriesRequest) {
      const GET_ALL_LIMIT_PAGE = 5000
      params.page = 1
      params.limit = GET_ALL_LIMIT_PAGE

      const data: DividendHistory[] = []

      // 1. get data first page
      const { success, data: resultFirstPage } =
        await DividendService.getHistories(params)
      if (!success) {
        return data
      }
      data.push(...resultFirstPage.data)

      // 2. get total pages
      const pages = resultFirstPage.pagination.last_page

      // 3. get data other page
      while (params.page < pages) {
        params.page++
        const { success, data: resultEachPage } =
          await DividendService.getHistories(params)
        if (success) {
          data.push(...resultEachPage.data)
        }
      }
      return data
    },

    async downloadCsv(data) {
      const fileName = `${this.$t(
        'dividendScreen.dividendHistory',
      )}-${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`
      const headerTitle = [
        this.$t('dividendScreen.no'),
        this.$t('dividendScreen.dividendName'),
        this.$t('dividendScreen.user'),
        this.$t('dividendScreen.dividendAmount'),
        this.$t('dividendScreen.usdRate'),
        this.$t('dividendScreen.endingBalance'),
        this.$t('dividendScreen.dividendRate'),
        this.$t('dividendScreen.targetAmount'),
        this.$t('dividendScreen.dividendDate'),
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

    renderAmount(value, row) {
      return `${formatCurrencyAmount(
        value,
        row.distributed_currency,
        '0',
        null,
      )} ${row.distributed_currency.toUpperCase()}`
    },

    renderUsdRate(value, row) {
      if (row.type === 'gift') {
        return `${formatCurrencyAmount(
          row.amount,
          row.gift_currency,
          '0',
          null,
        )} ${row.gift_currency.toUpperCase()}`
      } else {
        return `${formatCurrencyAmount(
          row.amount,
          row.distributed_currency,
          '0',
          null,
        )} ${row.distributed_currency.toUpperCase()}`
      }
    },

    renderEndingBalance(value, row) {
      return `${formatCurrencyAmount(
        value,
        row.distributed_currency,
        '0',
        null,
      )} ${row.distributed_currency.toUpperCase()}`
    },

    renderDividendRate(value, row) {
      if (
        row.dividend_calculated_mode !==
          DIVIDEND_CALCULATED_MODE.NON_CONDITION &&
        row.type !== TYPE_GIFT
      ) {
        return `${mulBigNumber(value, 100)}%`
      } else if (row.type === TYPE_GIFT) {
        return this.$t('dividendScreen.gift')
      } else {
        return `${formatCurrencyAmount(
          value,
          row.distributed_currency,
          '0',
          null,
        )} ${row.distributed_currency.toUpperCase()}`
      }
    },

    renderTargetAmount(value, row) {
      if (row.target_currency === TARGET_CURRENCY_ALL) {
        return `${formatCurrencyAmount(
          value,
          row.target_currency,
          '0',
          null,
        )} USD`
      } else {
        return `${formatCurrencyAmount(
          value,
          row.target_currency,
          '0',
          null,
        )} ${this.changeCurrencyAll(row.target_currency).toUpperCase()}`
      }
    },
  },
  watch: {
    'querySearch.search_key': debounce(async function (
      this: any,
      newSearchKey,
    ) {
      if (!newSearchKey) {
        this.refreshTable()
      }
    },
    300),
    'querySearch.selected_search': function (currentType, beforeType) {
      if (beforeType === this.SEARCH_TYPE.USER && this.querySearch.search_key) {
        this.querySearch.search_key = ''
      }
    },
  },
})
</script>
