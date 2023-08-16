<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.tradingSetting') }}
      </div>

      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end">
          <!--begin::Register trading pair-->
          <button
            type="button"
            class="btn btn-primary"
            @click="openEditModal(null)"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            {{ $t('setting.registerTradingPair') }}
          </button>
          <!--end::Register trading pair-->
        </div>
        <!--end::Toolbar-->
      </div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" ref="tradingTable">
        <template v-slot:cell-default_precision="{ row: item }">
          <div class="d-inline-flex flex-wrap">
            <span class="badge badge-success m-1">{{
              item.default_precision
            }}</span>
          </div>
        </template>
        <template v-slot:cell-action="{ row: item }">
          <a
            class="btn btn-sm btn-primary"
            @click="openEditModal(item)"
            target="_blank"
          >
            {{ $t('detail') }}
          </a>
        </template>
      </datatable>
    </div>
  </div>
  <EditTradingModal
    v-if="showEdit"
    :show="showEdit"
    :isNew="isNew"
    :trading="tradingModal"
    @updated="refreshTable"
    @close="closeEditModal"
  />
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import EditTradingModal from '@/components/exchange-setting/EditPairSettingModal.vue'
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import CONFIG from '@/config'
import { PairItem, FEE_TYPE } from '@/models/setting-exchange/TradingPair'
import { plainToClass, plainToInstance } from 'class-transformer'
import { HttpStatus, PAIR_STATUS } from '@/core/variables/common.enum'
import _ from 'lodash'
import { mulNumberString } from '@/core/helpers/util'
import { GetListCoinName } from '@/models/setting-exchange/CoinSetting'
import { SORT_TYPE } from '@/core/variables/common.enum'

enum SEARCH_KEY {
  COIN = 'coin',
  CURRENCY = 'currency',
}

export default defineComponent({
  name: 'trading-setting',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.tradingSetting', ['setting.setting'])
    this.getCoinList()
  },
  components: {
    Datatable,
    EditTradingModal,
  },
  data() {
    return {
      showEdit: false,
      tradingModal: new PairItem(),
      isNew: true,
      CONFIG,
      listCoinName: [] as any[],
    }
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) =>
          SettingExchangeService.getPairList(
            { ...params, sort_type: 1 },
            false,
          ),
        columns: [
          {
            key: 'pair',
            title: 'pair',
            sortable: false,
            class: 'td-w-250px text-center',
            render: (_value, row) => {
              return `${row.coin.toUpperCase()}/${row.currency.toUpperCase()}`
            },
          },
          {
            key: 'status',
            title: 'setting.status',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => {
              return +value == PAIR_STATUS.ACTIVE ? 'ON' : 'OFF'
            },
          },
          {
            key: 'obm_active',
            title: 'setting.activeOBM',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => {
              return +value == PAIR_STATUS.ACTIVE ? 'YES' : 'NO'
            },
          },
          {
            key: 'n_day_amount_limit',
            title: 'setting.nDayAmountLimit',
            sortable: false,
            class: 'td-w-350px text-center',
            render: (_value, row) => {
              return `${row.n_day_amount_limit} ${row.coin.toUpperCase()}`
            },
          },
          {
            key: 'n_day_total_limit',
            title: 'setting.nDayTotalLimit',
            class: 'td-w-250px text-center',
            sortable: false,
            render: (_value, row) => {
              return `${row.n_day_total_limit} ${row.currency.toUpperCase()}`
            },
          },
          {
            key: 'sell_fee',
            title: 'setting.sellFee',
            sortable: false,
            class: 'td-w-350px text-center',
            render: (_value, row) => {
              if (row.sell_fee_type === FEE_TYPE.PERCENTAGE) {
                return `${mulNumberString(row.sell_fee, '100')} %`
              }
              return row.sell_fee
            },
          },
          {
            key: 'buy_fee',
            title: 'setting.buyFee',
            class: 'td-w-250px text-center',
            sortable: false,
            render: (_value, row) => {
              if (row.buy_fee_type === FEE_TYPE.PERCENTAGE) {
                return `${mulNumberString(row.buy_fee, '100')} %`
              }
              return row.buy_fee
            },
          },
          {
            key: 'action',
            class: 'text-center',
            title: 'detail',
          },
        ],
        searchColumns: [
          {
            key: SEARCH_KEY.COIN,
            title: SEARCH_KEY.COIN,
            searchType: DatatableSearchType.SELECT,
            options: this.listCoinName,
          },
          {
            key: SEARCH_KEY.CURRENCY,
            title: SEARCH_KEY.CURRENCY,
            searchType: DatatableSearchType.SELECT,
            options: CONFIG.CURRENCY_LIST.sort().map((cur) => ({
              id: cur,
              name: cur.toUpperCase(),
            })),
          },
          {
            key: 'pair_status',
            title: 'Pair Status',
            searchType: DatatableSearchType.SELECT,
            options: [
              { id: PAIR_STATUS.ACTIVE.toString(), name: 'ON' },
              { id: PAIR_STATUS.INACTIVE.toString(), name: 'OFF' },
            ],
            class: 'td-w-150px text-center',
          },
        ],
        isRemoveSearch: true,
        configPage: true,
      }
    },
  },
  methods: {
    async getCoinList() {
      const instance = plainToInstance(
        GetListCoinName,
        {
          sort_type: SORT_TYPE.ASC,
          per_page: 1000,
        },
        { exposeDefaultValues: true },
      )
      const coinData = await SettingExchangeService.getListCoinName(instance)
      if (coinData.status !== HttpStatus.OK) {
        this.$toastr.error(
          this.$t((coinData?.data as unknown as any)?.message) ||
            'Something went wrong',
        )
        return
      }
      const coinList = coinData.data?.data?.map((coin) => ({
        id: coin,
        name: coin.toUpperCase(),
      }))

      this.listCoinName = _.sortBy(coinList, [
        function (o) {
          return o.id
        },
      ])
    },
    openEditModal(trading?) {
      const tradingItem = plainToClass(PairItem, trading || {}, {
        exposeDefaultValues: true,
      })
      this.tradingModal = tradingItem
      this.isNew = !trading
      this.showEdit = true
    },
    refreshTable() {
      if (this.$refs.tradingTable) {
        ;(this.$refs.tradingTable as IDatatableContext).getData()
      }
    },
    closeEditModal() {
      this.showEdit = false
    },
  },
})
</script>
