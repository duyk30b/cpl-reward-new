<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.tradingSetting') }}
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="row justify-content-start mt-4">
        <div class="col-sm-3 col-md-3">
          <label class="form-label">{{ $t('exchangeHistory.fromTo') }}</label>
          <date-range-picker-options
            :start-placeholder="$t('exchangeHistory.startDate')"
            :end-placeholder="$t('exchangeHistory.endDate')"
            v-model="dateRange"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
        <div class="col-sm-2 col-md-2">
          <label class="form-label">{{ $t('exchangeHistory.pair') }}</label>
          <v-select
            :options="pairList"
            option-value="id"
            option-label="name"
            :placeholder="$t('exchangeHistory.pair')"
            v-model="pair"
            searchable
            :can-deselect="false"
            :isTranslate="false"
            @change="pairChange(pair)"
          ></v-select>
        </div>
        <div class="col-sm-2 col-md-2">
          <label class="form-label">{{ $t('gridTrading.gridType') }}</label>
          <v-select
            :options="gridTypeFilter"
            option-value="id"
            option-label="name"
            v-model="gridTypeSelected"
            searchable
            :can-deselect="false"
            :isTranslate="false"
          ></v-select>
        </div>
        <div class="col-sm-2 col-md-2">
          <label class="form-label">{{ $t('gridTrading.status') }}</label>
          <v-select
            :options="statusFilter"
            option-value="id"
            option-label="name"
            v-model="statusSelected"
            searchable
            :can-deselect="false"
            :isTranslate="false"
          ></v-select>
        </div>
      </div>
      <div class="row justify-content-start mt-4">
        <div class="col-sm-2 col-md-2">
          <label class="form-label">{{
            $t('exchangeHistory.searchType')
          }}</label>
          <v-select
            :options="searchFilter"
            option-value="id"
            option-label="name"
            v-model="searchByField"
            searchable
            :can-deselect="false"
            :isTranslate="false"
          ></v-select>
        </div>
        <div class="col-sm-3 col-md-3">
          <label class="form-label">{{ $t('exchangeHistory.keyword') }}</label>
          <input
            class="form-control"
            v-model="keyword"
            @keyup.enter="onSearch()"
            placeholder="Enter your keyword ..."
          />
        </div>
        <div class="col-sm-4 col-md-4 align-items-end area-actions">
          <div>
            <button @click="onSearch()" class="btn btn-primary">
              <span>{{ $t('search') }}</span>
            </button>
            <button @click="onReset()" class="btn btn-primary mx-3">
              <span>{{ $t('reset') }}</span>
            </button>
          </div>
        </div>
      </div>
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-action="{ row: item }">
          <div>
            <span class="btn-action">
              <a
                class="btn btn-sm btn-primary"
                @click="openGridDetailModal(item)"
              >
                {{ $t('gridTrading.detail') }}
              </a>
            </span>
          </div>
        </template>
      </datatable>
    </div>
  </div>
  <GridDetailModal
    v-if="show"
    :show="show"
    @close="closeEditModal"
    :modalTitle="modalTitle"
    :strategyId="strategySelectedId"
    :ownerId="ownerSelectedId"
  />
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { formatUTCDate, setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { plainToInstance } from 'class-transformer'
import _ from 'lodash'
import {
  addNumberString,
  convertGridTypeToOptions,
  convertSearchFieldsToOptions,
  convertStrategyStatusToOptions,
  toFixed,
  subNumberString,
} from '@/core/helpers/util'
import { SpotGridTradingService } from '@/services/SpotGridTradingService'
import {
  GetGridPaginationDto,
  StrategyDto,
} from '@/models/spot-grid-trading/grid.dto'
import {
  SEARCH_BY_FIELD,
  SORT_TYPE,
  STRATEGY_STATUS,
} from '@/models/spot-grid-trading/enum'
import {
  ONE_DAY_MILLISECONDS,
  STRATEGY_STATUS_MAP_STRING,
} from '@/core/variables/common.const'
import moment from 'moment'
import { SpotGridTradingSettingService } from '@/services/SpotGridTradingSettingService'
import { HttpStatus } from '@/core/variables/common.enum'
import GridDetailModal from '@/components/spot-grid/GridDetailModal.vue'

export default defineComponent({
  name: 'trading-setting',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.spotGrid', ['setting.spotGrid.page'])
    await this.getPairList()
  },
  components: {
    GridDetailModal,
    Datatable,
  },
  data() {
    return {
      show: false,
      STRATEGY_STATUS: STRATEGY_STATUS,
      searchFilter: convertSearchFieldsToOptions(),
      gridTypeFilter: convertGridTypeToOptions(),
      statusFilter: convertStrategyStatusToOptions(),
      searchByField: SEARCH_BY_FIELD.BOT_ID,
      gridTypeSelected: '',
      statusSelected: '',
      pair: '',
      dateRange: [
        moment().subtract(1, 'day').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ],
      keyword: '',
      tableReloadKey: 1,
      pairList: [] as Array<{ id: string; name: string }>,
      modalTitle: '',
      strategySelectedId: '',
      ownerSelectedId: '',
    }
  },
  computed: {
    query: function (): any {
      const [coin, currency] = this.pair.split('/')
      const [from, to] = this.dateRange
      return {
        coin,
        currency,
        from: new Date(from).getTime(),
        to: subNumberString(
          addNumberString(
            new Date(to).getTime().toString(),
            ONE_DAY_MILLISECONDS,
          ),
          '1',
        ),
        search_by_field: this.searchByField,
        keyword: this.keyword,
        sort_type: SORT_TYPE.DESC,
        type: this.gridTypeSelected || undefined,
        status: this.statusSelected || undefined,
      }
    },
    tableConfig(): ITableConfig {
      return {
        dataSource: (params) => {
          return SpotGridTradingService.getListGrids(
            plainToInstance(
              GetGridPaginationDto,
              {
                ...params,
                ...this.query,
              },
              {
                excludeExtraneousValues: true,
              },
            ),
          )
        },
        columns: [
          {
            key: 'createTime',
            title: 'gridTrading.createTime',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => {
              return formatUTCDate(+value, 'YYYY-MM-DD HH:mm:ss') || ''
            },
          },
          {
            key: 'id',
            title: 'gridTrading.botId',
            sortable: false,
            class: 'td-w-150px text-center',
          },
          {
            key: 'pair',
            title: 'pair',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (_value, row) =>
              `${row.coin.toUpperCase()}/${row.currency.toUpperCase()}`,
          },
          {
            key: 'email',
            title: 'gridTrading.email',
            sortable: false,
            class: 'td-w-150px text-center',
          },

          {
            key: 'totalInvestment',
            title: 'gridTrading.totalInvestment',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value, row) => {
              return `${toFixed(value)} ${(
                row.currency as string
              ).toUpperCase()}`
            },
          },
          {
            key: 'range_price',
            title: 'gridTrading.rangePrice',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (_, row) => {
              return `${toFixed(row.lowerPrice)} - ${toFixed(row.higherPrice)}`
            },
          },
          {
            key: 'gridNumber',
            title: 'gridTrading.numberOfGrid',
            sortable: false,
            class: 'td-w-150px text-center',
          },
          {
            key: 'status',
            title: 'gridTrading.status',
            sortable: false,
            class: 'td-w-150px text-center',
            render: (value) => this.$t(STRATEGY_STATUS_MAP_STRING[value]),
          },
          {
            key: 'action',
            class: 'td-w-150px text-center',
            title: 'gridTrading.action',
          },
        ],
        isRemoveSearch: true,
        configPage: true,
      }
    },
  },
  methods: {
    openGridDetailModal(strategy: StrategyDto) {
      this.show = true
      this.modalTitle = `Spot Grid Bot ID: ${strategy.id}`
      this.strategySelectedId = strategy.id
      this.ownerSelectedId = strategy.ownerId
    },
    closeEditModal() {
      this.show = false
    },
    pairChange(pair: string) {
      this.pair = pair
    },
    async getPairList() {
      const pairData =
        await SpotGridTradingSettingService.getAllPairNameOfGrid()
      if (pairData.status != HttpStatus.OK) {
        this.pairList = []
        return
      }
      this.pairList = pairData.data.data
        .map((o) => ({
          id: `${o.coin}/${o.currency}`,
          name: `${o.coin.toUpperCase()}/${o.currency.toUpperCase()}`,
        }))
        .sort((a: any, b: any) => {
          return a.coin < b.coin ? -1 : 1
        })
    },
    onSearch() {
      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
    onReset() {
      this.keyword = ''
      this.searchByField = SEARCH_BY_FIELD.BOT_ID
      this.gridTypeSelected = ''
      this.statusSelected = ''
      this.pair = ''
      this.dateRange = [
        moment().subtract(1, 'day').format('YYYY-MM-DD'),
        moment().format('YYYY-MM-DD'),
      ]
      this.refreshTable()
    },
  },
})
</script>

<style lang="scss" scoped>
.area-actions {
  display: flex !important;
}
</style>
