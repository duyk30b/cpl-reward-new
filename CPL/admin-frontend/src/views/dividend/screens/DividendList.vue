<template>
  <div class="card" id="currency-setting-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">{{ $t('dividendScreen.dividendList') }}</div>

      <div class="card-toolbar d-flex">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#new-dividend-modal"
          @click.prevent="createNewDividend"
        >
          {{ $t('dividendScreen.createNew') }}
        </button>
      </div>
    </div>

    <div class="row mx-5 d-flex align-items-end">
      <div class="col-2">
        <label class="form-label"
          >{{ $t('dividendScreen.targetCurrency') }}
        </label>
        <el-select
          class="form-select-solid"
          :placeholder="$t('dividendScreen.targetCurrency')"
          v-model="querySearch.target_currency"
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

      <div class="col-3">
        <label class="form-label"
          >{{ $t('dividendScreen.distributedCurrency') }}
        </label>
        <el-select
          class="form-select-solid"
          :placeholder="$t('dividendScreen.distributedCurrency')"
          v-model="querySearch.distributed_currency"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="currency in currencyOptions"
            :value="currency"
            :key="`distributed${currency}`"
            :label="currency.toUpperCase()"
          />
        </el-select>
      </div>

      <div class="col-2">
        <label class="form-label"> {{ $t('dividendScreen.status') }}</label>
        <el-select
          class="form-select-solid"
          :placeholder="$t('dividendScreen.status')"
          v-model="querySearch.dividend_status"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="sts in STATUS"
            :value="sts"
            :key="sts"
            :label="uppercaseFirst($t(`dividendScreen.statusList.${sts}`))"
          />
        </el-select>
      </div>

      <div class="col-3">
        <label class="form-label">{{ $t('search') }} </label>
        <el-input
          :placeholder="$t('keyword')"
          v-model="querySearch.search_key"
          clearable
        />
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

        <template v-slot:cell-accumulated_dividend="{ row: item }">
          {{
            this.formatCurrencyAmount(
              item.accumulated_dividend,
              item.target_currency,
              0,
            )
          }}
          {{ item.distributed_currency.toUpperCase() }}
        </template>

        <template v-slot:cell-total_target_balance="{ row: item }">
          <span v-if="item.target_currency !== 'all'">
            {{
              this.formatCurrencyAmount(
                item.total_target_balance,
                item.target_currency,
                0,
              )
            }}
            {{ item.target_currency.toUpperCase() }}
          </span>

          <span v-else>
            {{
              this.formatCurrencyAmount(
                item.total_target_balance,
                item.target_currency,
                0,
              )
            }}
            USD
          </span>
        </template>

        <template v-slot:cell-dividend_rate="{ row: item }">
          <span
            v-if="
              item.dividend_calculated_mode ===
              DIVIDEND_CALCULATED_MODE.NON_CONDITION
            "
          >
            {{
              this.formatCurrencyAmount(
                item.dividend_rate,
                item.distributed_currency,
                0,
              )
            }}
            {{ item.distributed_currency.toUpperCase() }}
          </span>

          <span v-else>
            {{ this.percentNoDecimal(item.dividend_rate) }}
          </span>
        </template>

        <template v-slot:cell-action="{ row: item, page, size }">
          <router-link
            :to="{
              name: 'dividend.codeListScreen',
              query: { id: item.id },
            }"
          >
            <button class="btn btn-sm btn-primary me-2">
              {{ $t('dividendScreen.btnCodeList') }}
            </button>
          </router-link>
          <router-link
            :to="{
              name: 'dividend.detailScreen',
              params: { id: item.id },
              query: { page, size },
            }"
          >
            <button class="btn btn-sm btn-primary me-2">
              {{ $t('dividendScreen.btnDetail') }}
            </button>
          </router-link>

          <button
            class="btn btn-sm btn-primary"
            @click="cancelDividend(item)"
            :disabled="item.status === STATUS.CANCELLED"
          >
            {{ $t('dividendScreen.btnCancel') }}
          </button>
        </template>
      </datatable>
      <dividend-new
        @createDividendSuccess="refreshTable"
        ref="dividendNewRef"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import DividendNew from '@/views/dividend/components/DividendNew.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import { DividendService } from '@/views/dividend/services/DividendService'
import {
  formatCurrencyAmount as formatCurrencyAmountHelper,
  jsonToCsv,
} from '@/core/helpers/util'
import { GetDividendListRequest } from '@/views/dividend/definition/dividend.dto'
import { Currency } from '@/views/dividend/definition/dividend.interface'
import {
  STATUS,
  DIVIDEND_CALCULATED_MODE,
} from '@/views/dividend/definition/dividend.enum'
import { DividendCampaign } from '@/views/dividend/definition/dividend.interface'
import numeral from 'numeral'
import { startCase } from 'lodash'
import Swal from 'sweetalert2'
import { Mutations } from '@/store/enums/StoreEnums'
import moment from 'moment'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'Dividend List',
  components: {
    Datatable,
    DividendNew,
  },
  data() {
    return {
      listCurrency: [] as Currency[],
      searching: false as boolean,
      querySearch: {
        target_currency: '',
        distributed_currency: '',
        dividend_status: '',
        search_key: '',
      },
      tableReloadKey: 1,
      STATUS,
      DIVIDEND_CALCULATED_MODE,
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
            key: 'target_currency',
            title: 'dividendScreen.targetCurrency',
            sortable: true,
            render: (value) => {
              return value.toUpperCase()
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'distributed_currency',
            title: 'dividendScreen.distributedCurrency',
            sortable: true,
            render: (value) => {
              return value.toUpperCase()
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'status',
            title: 'dividendScreen.status',
            sortable: true,
            render: (value) => {
              if (Object.values(STATUS).includes(value)) {
                return this.$t(`dividendScreen.statusList.${value}`)
              }
              return value
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'accumulated_dividend',
            title: 'dividendScreen.accumulateDividend',
            sortable: false,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'total_target_balance',
            title: 'dividendScreen.totalTargetBalance',
            sortable: false,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'dividend_calculated_mode',
            title: 'dividendScreen.interestRateType',
            sortable: true,
            render: (value) => {
              if (Object.values(DIVIDEND_CALCULATED_MODE).includes(value)) {
                return this.$t(`dividendScreen.calculatedMode.${value}`)
              }
              return value
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'dividend_rate',
            title: 'dividendScreen.dividendRate',
            sortable: true,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'action',
            title: '',
            sortable: false,
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
  },
  mounted() {
    setCurrentPageBreadcrumbs('dividendScreen.dividendList', [])
    this.setPageLimit()
  },
  computed: {
    query: function (): any {
      const queryObject = {}
      for (const [key, value] of Object.entries(this.querySearch)) {
        if (value) {
          queryObject[key] = value
        }
      }
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

    async getDataSource(params: GetDividendListRequest) {
      try {
        this.searching = true
        const { success, data } = await DividendService.getDividends(params)
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

    async getListCurrency() {
      const data = await DividendService.getListCurrency()
      this.listCurrency = data ?? []
    },

    async cancelDividend(dividend) {
      const confirm = await Swal.fire({
        icon: 'warning',
        text: this.$t('dividendScreen.cancelDividendConfirm', {
          dividendName: `${dividend.name}`,
        }),
        showCancelButton: true,
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
      })
      if (confirm.isConfirmed) {
        const { success, data } = await DividendService.cancelDividend({
          id: +dividend.id,
        })
        if (success && data.data.success) {
          this.refreshTable()
          this.$toastr.success(this.$t('success'))
        } else {
          this.$toastr.error(this.$t('error'))
        }
      }
    },

    async handleDownloadCsv(params: GetDividendListRequest) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      try {
        let data = await this.getAllDataForDownload(params)

        const campaigns = data.map((item, index) => {
          return {
            no: index + 1,
            name: item.name,
            target_currency: item.target_currency.toUpperCase(),
            distributed_currency: item.distributed_currency.toUpperCase(),
            status: this.renderStatus(item.status),
            accumulated_dividend: this.renderAccumulatedDividend(
              item.accumulated_dividend,
              item,
            ),
            total_target_balance: this.renderTotalTargetBalance(
              item.total_target_balance,
              item,
            ),
            dividend_calculated_mode: this.renderDividendCalculatedMode(
              item.dividend_calculated_mode,
            ),
            dividend_rate: this.renderDividendRate(item.dividend_rate, item),
          }
        })
        await this.downloadCsv(campaigns)
      } catch (err) {
        this.$toastr.error(this.$t('dividendScreen.exportFileError'))
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async getAllDataForDownload(params: GetDividendListRequest) {
      const GET_ALL_LIMIT_PAGE = 5000
      params.page = 1
      params.limit = GET_ALL_LIMIT_PAGE

      const data: DividendCampaign[] = []

      // 1. get data first page
      const { success, data: resultFirstPage } =
        await DividendService.getDividends(params)
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
          await DividendService.getDividends(params)
        if (success) {
          data.push(...resultEachPage.data)
        }
      }
      return data
    },

    async downloadCsv(data) {
      const fileName = `${this.$t(
        'dividendScreen.dividendList',
      )}-${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`
      const headerTitle = [
        this.$t('dividendScreen.no'),
        this.$t('dividendScreen.dividendName'),
        this.$t('dividendScreen.targetCurrency'),
        this.$t('dividendScreen.distributedCurrency'),
        this.$t('dividendScreen.status'),
        this.$t('dividendScreen.accumulateDividend'),
        this.$t('dividendScreen.totalTargetBalance'),
        this.$t('dividendScreen.interestRateType'),
        this.$t('dividendScreen.dividendRate'),
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

    // reset form before open modal
    createNewDividend() {
      const dividendNewRef = this.$refs.dividendNewRef as any
      dividendNewRef.resetForm()
    },

    // init page, size if route has query
    setPageLimit() {
      if (this.$route.query.page && this.$route.query.size) {
        const datatableRef = this.$refs.datatableRef as any
        datatableRef.pagination.size = +this.$route.query.size
        datatableRef.choosePage(+this.$route.query.page)
      }
    },

    formatCurrencyAmount(
      amount,
      currency,
      zeroValue,
      numberOfDecimalDigits = null,
    ) {
      return formatCurrencyAmountHelper(
        amount,
        currency,
        zeroValue,
        numberOfDecimalDigits,
      )
    },

    percentNoDecimal(value, currency = 'btc') {
      return `${formatCurrencyAmountHelper(
        numeral(value * 100).format('0.00000000'),
        currency,
        null,
        null,
      )}%`
    },

    uppercaseFirst(value) {
      return startCase(value)
    },

    renderStatus(value) {
      if (Object.values(STATUS).includes(value)) {
        return this.$t(`dividendScreen.statusList.${value}`)
      }
      return value
    },

    renderDividendCalculatedMode(value) {
      if (Object.values(DIVIDEND_CALCULATED_MODE).includes(value)) {
        return this.$t(`dividendScreen.calculatedMode.${value}`)
      }
      return value
    },

    renderAccumulatedDividend(value, item) {
      return `${this.formatCurrencyAmount(
        value,
        item.target_currency,
        0,
      )} ${item.distributed_currency.toUpperCase()}`
    },

    renderTotalTargetBalance(value, item) {
      if (item.target_currency !== 'all') {
        return `${this.formatCurrencyAmount(
          value,
          item.target_currency,
          0,
        )} ${item.target_currency.toUpperCase()}`
      } else {
        return `${this.formatCurrencyAmount(
          value,
          item.target_currency,
          0,
        )} USD`
      }
    },

    renderDividendRate(value, item) {
      if (
        item.dividend_calculated_mode === DIVIDEND_CALCULATED_MODE.NON_CONDITION
      ) {
        return `${this.formatCurrencyAmount(
          value,
          item.distributed_currency,
          0,
        )} ${item.distributed_currency.toUpperCase()}`
      } else {
        return `${this.percentNoDecimal(value)}`
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
  },
})
</script>
