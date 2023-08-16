<template>
  <div class="card" id="currency-setting-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">{{ $t('dividendScreen.dividendCodeList') }}</div>

      <div class="card-toolbar d-flex">
        <button
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#new-dividend-code-modal"
          @click.prevent="createNewDividendCode"
        >
          {{ $t('dividendScreen.createNew') }}
        </button>
      </div>
    </div>

    <div class="row mx-5 d-flex align-items-end">
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

      <div class="col-2">
        <label class="form-label">{{ $t('dividendScreen.status') }} </label>
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

      <div class="col-2">
        <label class="form-label">
          {{ $t('dividendScreen.allocateStatus') }}</label
        >
        <el-select
          class="form-select-solid"
          :placeholder="$t('dividendScreen.allocateStatus')"
          v-model="querySearch.dividend_allocate_status"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="sts in ALLOCATE_STATUS"
            :value="sts"
            :key="sts"
            :label="$t(`dividendScreen.allocateStatusList.${sts}`)"
          />
        </el-select>
      </div>

      <div class="col-4">
        <label class="form-label">{{ $t('search') }} </label>
        <div class="input-group text-search-group">
          <el-select class="form-select-solid" v-model="searchType" filterable>
            <el-option :value="SEARCH_TYPE.ALL" label="All" />
            <el-option :value="SEARCH_TYPE.EMAIL" :label="$t('email')" />
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
            v-if="searchType === SEARCH_TYPE.EMAIL"
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

        <template v-slot:cell-action="{ row: item }">
          <button
            :class="[
              'btn btn-sm',
              item.is_disable === 1 ? 'btn-danger' : 'btn-primary',
            ]"
            @click="toggleDividendCode(item)"
          >
            {{
              item.is_disable === 1
                ? $t('dividendScreen.enable')
                : $t('dividendScreen.disable')
            }}
          </button>
        </template>
      </datatable>
      <dividend-new-code
        @createDividendCodeSuccess="refreshTable"
        :dividend-id-selected="querySearch.dividend_id"
        ref="dividendNewCodeRef"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import DividendNewCode from '@/views/dividend/components/DividendNewCode.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import { DividendService } from '@/views/dividend/services/DividendService'
import {
  formatCurrencyAmount as formatCurrencyAmountHelper,
  formatTimeStamp,
  convertDatetimeToMilliseconds,
  jsonToCsv,
} from '@/core/helpers/util'
import { GetDividendCodesRequest } from '@/views/dividend/definition/dividend.dto'
import { DividendCode } from '@/views/dividend/definition/dividend.interface'
import { Mutations } from '@/store/enums/StoreEnums'
import {
  STATUS,
  DIVIDEND_CALCULATED_MODE,
  ALLOCATE_STATUS,
  DISTRIBUTE_TYPE,
} from '@/views/dividend/definition/dividend.enum'
import numeral from 'numeral'
import { startCase } from 'lodash'
import Swal from 'sweetalert2'
import { debounce } from 'lodash'
import moment from 'moment'
import { UserService } from '@/services/UserService'

interface User {
  user_id: string
  email: string
}

enum SEARCH_TYPE {
  ALL,
  EMAIL,
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
        dividend_allocate_status: '',
        dividend_status: '',
        search_key: '',
      },
      tableReloadKey: 1,
      STATUS,
      DIVIDEND_CALCULATED_MODE,
      ALLOCATE_STATUS,
      DISTRIBUTE_TYPE,
      searchType: SEARCH_TYPE.ALL,
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
            key: 'code',
            title: 'dividendScreen.dividendCode',
            sortable: true,
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'campaign_status',
            title: 'dividendScreen.status',
            sortable: true,
            render: (value) => this.renderCampaignStatus(value),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'status',
            title: 'dividendScreen.allocateStatus',
            sortable: true,
            render: (value) => this.renderStatus(value),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'established_date',
            title: 'dividendScreen.establishedDate',
            sortable: true,
            render: (value) => {
              return formatTimeStamp(value)
            },
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'email',
            title: 'dividendScreen.user',
            sortable: false,
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'last_dividend_date',
            title: 'dividendScreen.dividendDate',
            sortable: true,
            render: (value) => this.renderLastDividendDate(value),
            class: 'td-w-150px align-middle text-center',
          },
          {
            key: 'distribute_type',
            title: 'dividendScreen.distributeType',
            sortable: true,
            render: (value) => this.renderDistributeType(value),
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
  async created() {
    this.querySearch.dividend_id =
      this.$route.query.id && typeof this.$route.query.id === 'string'
        ? this.$route.query.id
        : ''
    await this.getDividendName()
  },
  mounted() {
    setCurrentPageBreadcrumbs('dividendScreen.dividendCodeList', [])
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
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(params: GetDividendCodesRequest) {
      try {
        this.searching = true
        const { success, data } = await DividendService.getDividendCodes(params)
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

    async toggleDividendCode(dividendCode) {
      const stt =
        dividendCode.is_disable === 1
          ? this.$t('dividendScreen.enable')
          : this.$t('dividendScreen.disable')
      const confirm = await Swal.fire({
        icon: 'question',
        text: this.$t('dividendScreen.toggleDividendCode', {
          status: `${stt.toLowerCase()}`,
          code: `${dividendCode.code}`,
        }),
        showCancelButton: true,
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
      })
      if (confirm.isConfirmed) {
        const { success, data } = await DividendService.toggleDividendCodes(
          dividendCode,
        )
        if (success && data.data.success) {
          this.refreshTable()
          this.$toastr.success(this.$t('success'))
        } else {
          this.$toastr.error(this.$t('error'))
        }
      }
    },

    // reset form before open modal
    createNewDividendCode() {
      const dividendNewCodeRef = this.$refs.dividendNewCodeRef as any
      dividendNewCodeRef.beforeOpen()
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

    async getUsersRegistrant(query) {
      this.remoteLoading = true
      const data = await UserService.getListUsers({
        search_field: 'email',
        search_text: query,
      })
      this.remoteLoading = false
      this.users = data?.data?.data ?? []
    },

    async handleDownloadCsv(params: GetDividendCodesRequest) {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      try {
        let data = await this.getAllDataForDownload(params)

        const codes = data.map((item, index) => {
          return {
            no: index + 1,
            name: item.name,
            code: item.code,
            campaign_status: this.renderCampaignStatus(item.campaign_status),
            status: this.renderStatus(item.status),
            established_date: formatTimeStamp(item.established_date),
            email: item.email,
            last_dividend_date: this.renderLastDividendDate(
              item.last_dividend_date,
            ),
            distribute_type: this.renderDistributeType(item.distribute_type),
          }
        })
        await this.downloadCsv(codes)
      } catch (err) {
        this.$toastr.error(this.$t('dividendScreen.exportFileError'))
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },

    async getAllDataForDownload(params: GetDividendCodesRequest) {
      const GET_ALL_LIMIT_PAGE = 5000
      params.page = 1
      params.limit = GET_ALL_LIMIT_PAGE

      const data: DividendCode[] = []

      // 1. get data first page
      const { success, data: resultFirstPage } =
        await DividendService.getDividendCodes(params)
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
          await DividendService.getDividendCodes(params)
        if (success) {
          data.push(...resultEachPage.data)
        }
      }
      return data
    },

    async downloadCsv(data) {
      const fileName = `${this.$t(
        'dividendScreen.dividendCodeList',
      )}-${moment().format('YYYY-MM-DD HH:mm:ss')}.csv`
      const headerTitle = [
        this.$t('dividendScreen.no'),
        this.$t('dividendScreen.dividendName'),
        this.$t('dividendScreen.dividendCode'),
        this.$t('dividendScreen.status'),
        this.$t('dividendScreen.allocateStatus'),
        this.$t('dividendScreen.establishedDate'),
        this.$t('dividendScreen.user'),
        this.$t('dividendScreen.dividendDate'),
        this.$t('dividendScreen.distributeType'),
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

    renderCampaignStatus(status) {
      if (Object.values(STATUS).includes(status)) {
        return this.$t(`dividendScreen.statusList.${status}`)
      }
      return status
    },

    renderStatus(status) {
      if (Object.values(ALLOCATE_STATUS).includes(status)) {
        return this.$t(`dividendScreen.allocateStatusList.${status}`)
      }
      return status
    },

    renderDistributeType(value) {
      if (Object.values(DISTRIBUTE_TYPE).includes(value)) {
        return this.$t(`dividendScreen.distributeTypes.${value}`)
      }
      return value
    },

    renderLastDividendDate(value) {
      return formatTimeStamp(convertDatetimeToMilliseconds(value))
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
    searchType: function (currentType, beforeType) {
      if (
        beforeType === this.SEARCH_TYPE.EMAIL &&
        this.querySearch.search_key
      ) {
        this.querySearch.search_key = ''
      }
    },
  },
})
</script>

<style lang="scss" scoped>
.input-group-search-key {
  flex: 3 1 auto !important;
}
</style>
