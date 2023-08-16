<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('autoWithdraw.groupTitle') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :force-reload-key="reloadKey">
        <template v-slot:right-toolbar>
          <div
            class="d-flex justify-content-end align-items-center"
            data-kt-user-table-toolbar="selected"
          >
            <button
              type="button"
              class="btn btn-success me-2"
              data-bs-toggle="modal"
              data-bs-target="#auto-withdraw-group-modal"
            >
              {{ $t('autoWithdraw.create') }}
            </button>
          </div>
        </template>

        <template v-slot:cell-action="{ row: withdrawGroup }">
          <router-link
            class="btn btn-sm btn-primary"
            :to="{
              name: 'autoWithdraw.detail',
              params: { id: withdrawGroup.id },
            }"
          >
            {{ $t('detail') }}
          </router-link>
        </template>
      </datatable>
    </div>
    <auto-withdraw-group-modal
      :currencyList="currencyList"
      @addedAutoWithdrawGroup="refreshTable"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  convertTimestampToDate,
  setPageFliud,
  formatCurrencyBalance,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import AutoWithdrawGroupModal from '@/views/auto_withdraw/components/AutoWithdrawGroupModal.vue'
import CONFIG from '@/config'
import { GROUP_STATUS } from '@/core/variables/auto_withdraw.const'
import { AutoWithdrawService } from '@/services/AutoWithdrawService'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'AutoWithdrawGroups',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('autoWithdraw.groupTitle', [])
  },
  components: {
    AutoWithdrawGroupModal,
    Datatable,
  },
  data() {
    return {
      CONFIG,
      reloadKey: 0,
      withdrawGroups: [] as any[],
      currencyList: [] as any[],
      tableConfig: {
        identifyField: 'group_id',
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'name',
            title: this.$t('autoWithdraw.groupName'),
            sortable: false,
          },
          {
            key: 'totalTransaction',
            title: this.$t('autoWithdraw.numberOfTransactions'),
            sortable: false,
          },
          {
            key: 'currency',
            title: this.$t('autoWithdraw.currency'),
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'totalBalance',
            title: this.$t('autoWithdraw.totalBalances'),
            sortable: false,
            render: (value) => {
              return formatCurrencyBalance(Math.abs(value))
            },
          },
          {
            key: 'status',
            title: this.$t('autoWithdraw.status'),
            sortable: false,
          },
          {
            key: 'createDate',
            title: this.$t('autoWithdraw.createdAt'),
            sortable: false,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD HH:mm:ss')
            },
          },
          {
            key: 'action',
            title: '',
            class: 'text-center td-w-100px',
          },
        ],
        searchColumns: [
          {
            key: 'keyword',
            title: this.$t('autoWithdraw.groupName'),
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'status',
            title: this.$t('autoWithdraw.status'),
            searchType: DatatableSearchType.SELECT,
            remote: false,
            options: Object.values(GROUP_STATUS),
            class: 'w-150px',
          },
          {
            key: 'currency',
            title: this.$t('autoWithdraw.currency'),
            searchType: DatatableSearchType.SELECT,
            remote: false,
            options: this.currencyList,
            class: 'w-150px',
          },
        ],
        configPage: true,
      } as ITableConfig,
    }
  },
  created() {
    this.getCurrencyList()
  },
  methods: {
    refreshTable() {
      this.reloadKey++
    },
    async getDataSource(params) {
      // tranform params
      if ('search_text' in params && params['search_text']) {
        params['keyword'] = params['search_text']
      }

      if ('currency' in params && params['currency']) {
        params['currency'] = params['currency'].toLowerCase()
      }

      if ('limit' in params && params['limit']) {
        params['size'] = params['limit']
      }

      try {
        const result = await AutoWithdrawService.getAutoWithdrawGroup(params)
        this.withdrawGroups = result?.data?.data ?? []
        const total = result?.data?.totalCount ?? 0
        return {
          status: HttpStatus.OK,
          data: {
            data: this.withdrawGroups,
            pagination: {
              page: params.page,
              size: params.per_page,
              total: total,
            },
          },
        }
      } catch (err) {
        //
      }
    },
    async getCurrencyList() {
      if (this.currencyList.length > 0) {
        return this.currencyList
      }
      try {
        let result = await AutoWithdrawService.getCurrencyList()
        let currencyList = result?.data ?? []
        currencyList = Array.from(new Set(currencyList))
        const acceptedCurrency = [
          'btc',
          'ltc',
          'bch',
          'xrp',
          'arb',
          'bcast',
          'castle',
          'comp',
          'drp',
          'eve',
          'hic',
          'hop',
          'hrs',
          'iris',
          'join',
          'jpi',
          'link',
          'mc',
          'nhop',
          'obt',
          'sushi',
          'uf',
          'uni',
          'venus',
          'wpc',
          'aave',
          'usdt',
          'twin',
        ]
        this.currencyList = currencyList
          .filter((item) => acceptedCurrency.includes(item.toLowerCase()))
          .map((item) => item.toUpperCase())

        let found = this.tableConfig?.searchColumns?.findIndex(
          (item) => item?.key === 'currency',
        ) as number
        const output = (this?.tableConfig?.searchColumns as any[])[found]
        if (output) {
          output.options = this.currencyList
        }
      } catch (err) {
        //
      }
    },
  },
  setup() {
    //
  },
})
</script>
