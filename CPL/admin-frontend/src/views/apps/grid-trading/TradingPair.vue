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
      <datatable
        :config="tableConfig"
        ref="tradingTable"
        @onReceiveData="onReceiveData"
        @onOrderRowChanged="onOrderRowChanged"
      >
        <template v-slot:cell-action="{ row: item }">
          <div>
            <span class="btn-action">
              <a
                class="btn btn-sm btn-primary"
                @click="openEditModal(item)"
                target="_blank"
              >
                {{ $t('gridTrading.edit') }}
              </a>
            </span>
            <span class="btn-action">
              <a class="btn btn-sm btn-danger" @click="onDelete(item)">
                {{ $t('gridTrading.delete') }}
              </a>
            </span>
          </div>
        </template>
      </datatable>
    </div>
  </div>
  <EditTradingPairModal
    v-if="showEdit"
    :show="showEdit"
    :isNew="isNew"
    :trading="tradingModal"
    :listTradingPair="currentOrderPairs"
    @updated="refreshTable"
    @close="closeEditModal"
  />
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import EditTradingPairModal from '@/components/grid-trading/EditTradingPairModal.vue'
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  IDatatableContext,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { SpotGridTradingSettingService } from '@/services/SpotGridTradingSettingService'
import CONFIG from '@/config'
import { plainToInstance } from 'class-transformer'
import { HttpStatus, PAIR_STATUS } from '@/core/variables/common.enum'
import _, { cloneDeep } from 'lodash'
import { GetListCoinName } from '@/models/setting-exchange/CoinSetting'
import { SORT_TYPE } from '@/core/variables/common.enum'
import {
  GetGridTradingPaginationDto,
  GetGridTradingPairResponseDto,
  TradingPairItemDto,
  UpdateOrderOfPairRequestDto,
} from '@/models/spot-grid-trading/trading-pair-item.dto'
import Swal from 'sweetalert2'
import { AxiosResponse } from 'axios'
import { mulNumberString } from '@/core/helpers/util'

enum SEARCH_KEY {
  COIN = 'coin',
  CURRENCY = 'currency',
}

export default defineComponent({
  name: 'trading-setting',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.tradingSetting', ['setting.spotGrid.page'])
    this.getCoinList()
  },
  components: {
    Datatable,
    EditTradingPairModal,
  },
  data() {
    return {
      showEdit: false,
      tradingModal: new TradingPairItemDto(),
      isNew: true,
      CONFIG,
      listCoinName: [] as any[],
      dragging: false as boolean,
      currentOrderPairs: [] as TradingPairItemDto[],
    }
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) =>
          SpotGridTradingSettingService.getTradingPair(
            plainToInstance(
              GetGridTradingPaginationDto,
              {
                ...params,
                sort_type: SORT_TYPE.ASC,
              },
              {
                excludeExtraneousValues: true,
              },
            ),
          ),
        columns: [
          {
            key: 'pair',
            title: 'pair',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (_value, row) =>
              `${row.coin.toUpperCase()}/${row.currency.toUpperCase()}`,
          },
          {
            key: 'status',
            title: 'gridTrading.status',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => (value === PAIR_STATUS.ACTIVE ? 'ON' : 'OFF'),
          },
          {
            key: 'profitSharing',
            title: 'gridTrading.profitSharing',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => mulNumberString(value, '100') + '%',
          },
          {
            key: 'maxGrid',
            title: 'gridTrading.maxGrid',
            sortable: false,
            class: 'td-w-150px text-center',
          },
          {
            key: 'minGrid',
            title: 'gridTrading.minGrid',
            sortable: false,
            class: 'td-w-150px text-center',
          },
          {
            key: 'thresholdHigherPrice',
            title: 'gridTrading.thresholdHigherPrice',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => mulNumberString(value, '100') + '%',
          },
          {
            key: 'thresholdLowerPrice',
            title: 'gridTrading.thresholdLowerPrice',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => mulNumberString(value, '100') + '%',
          },
          {
            key: 'adjustCoefficient',
            title: 'gridTrading.adjustCoefficient',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => mulNumberString(value, '100') + '%',
          },
          {
            key: 'action',
            class: 'td-w-150px text-center',
            title: 'gridTrading.action',
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
            key: 'status',
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
        rowOrder: true,
      }
    },
  },
  methods: {
    onReceiveData(response: AxiosResponse<GetGridTradingPairResponseDto>) {
      this.currentOrderPairs = cloneDeep(response.data.data || [])
    },
    async onOrderRowChanged(items: TradingPairItemDto[]) {
      let shouldUpdateOrder = false
      if (this.currentOrderPairs.length !== items.length) {
        shouldUpdateOrder = true
      }
      for (let index = 0; index < items.length; index++) {
        if (items[index].id !== this.currentOrderPairs[index].id) {
          shouldUpdateOrder = true
        }
      }
      if (!shouldUpdateOrder) return

      const request = new UpdateOrderOfPairRequestDto()
      request.data = items.map((item, idx) => ({
        id: item.id,
        index: idx,
      }))

      if (!request.data.length) return

      const response = await SpotGridTradingSettingService.updateOrderPair(
        plainToInstance(UpdateOrderOfPairRequestDto, request, {
          excludeExtraneousValues: true,
        }),
      )
      if (response.status != HttpStatus.OK) {
        if (response.data && (response.data as any).message) {
          return this.$toastr.error((response.data as any).message)
        }
        return this.$toastr.error(this.$t('gridTrading.savePairFail'))
      }
      this.$toastr.success(this.$t('gridTrading.savePairSuccess'))
    },
    onDelete(setting: TradingPairItemDto) {
      Swal.fire({
        text: 'Delete grid trading setting?',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary',
        },
      }).then(async (result) => {
        if (!result.isConfirmed) return

        SpotGridTradingSettingService.deleteTradingPair(setting.id).then(
          (res) => {
            if (res.status !== HttpStatus.OK) {
              this.$toastr.error(
                (res?.data as any)?.message ||
                  this.$t('gridTrading.deleteFail'),
              )
              return
            }
            this.$toastr.success(this.$t('gridTrading.deleteSuccess'))
            this.refreshTable()
          },
        )
      })
    },
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
    openEditModal(setting: TradingPairItemDto) {
      this.tradingModal = setting
      this.isNew = this.tradingModal ? false : true
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

<style lang="scss" scoped>
.btn-action {
  padding-right: 6px;
  &:nth-child(2) {
    padding-right: 0;
  }
}
</style>
