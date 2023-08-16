<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t(`menu.futures.openPosition`) }}
      </div>

      <div class="card-toolbar"></div>
    </div>

    <div class="card-body pt-0">
      <div class="row mb-2">
        <div
          v-for="(item, index) in this.searchColumns"
          :key="index"
          :class="'col-md-4 col-xl-3'"
          class="mb-4"
        >
          <label class="form-label">{{ $t(item.title) }}:</label>
          <v-select
            v-if="item.searchType === DatatableSearchType.SELECT"
            :options="getOptions(item)"
            option-value="id"
            option-label="name"
            :placeholder="$t(item.title)"
            @change="getData"
            v-model="filter[item.key]"
            searchable
            :multiple="item.multiple"
            :can-deselect="true"
            :remote="item.remote"
            :reserve-keyword="item.reserveKeyword"
            :collapse-tags="item.collapseTags"
            :sourceFunction="item.remoteOptions"
          >
          </v-select>
          <date-picker
            v-if="item.searchType === DatatableSearchType.DATE"
            :placeholder="$t(item.title)"
            v-model="filter[item.key]"
            :mode="item.mode"
          ></date-picker>
          <date-range-picker
            v-if="item.searchType === DatatableSearchType.DATE_RANGE"
            :start-placeholder="$t(item.startPlaceholder)"
            :end-placeholder="$t(item.endPlaceholder)"
            :input-format="item.inputFormat ?? ''"
            @change="() => item.getDataOnChange && getData()"
            v-model="filter[item.key]"
            :mode="item.mode"
          ></date-range-picker>
          <input
            v-if="item.searchType === DatatableSearchType.TEXT"
            class="form-control"
            :placeholder="$t(item.title)"
            v-model="filter[item.key]"
          />
        </div>
        <div class="col-auto mb-2 pt-8">
          <button
            v-if="searchColumns?.length"
            class="btn btn-primary me-2 mb-1"
            :disabled="loading"
            @click="getData"
            :title="$t('search')"
          >
            <i v-if="!loading" class="fas fa-search fa-fw"></i>
            <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
          </button>
          <button
            v-if="searchColumns?.length"
            class="btn btn-primary me-2 mb-1"
            :disabled="loading"
            @click="resetSearch"
            :title="$t('reset')"
          >
            <i v-if="!loading" class="fas fa-sync fa-fw"></i>
            <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
          </button>
          <button
            v-if="configColumn"
            class="btn btn-primary me-2 mb-1"
            @click="openColumnConfigModal"
            :title="$t('config')"
          >
            <i v-if="!loading" class="fas fa-cog fa-fw"></i>
            <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="d-none d-lg-inline-block">{{ $t('config') }}</span>
          </button>
          <slot name="button"></slot>
        </div>
        <div class="col mb-2">
          <div class="d-flex justify-content-end align-items-center">
            <slot name="right-toolbar"></slot>
          </div>
        </div>
      </div>
      <div class="table-wrapper">
        <div class="table-responsive mb-4">
          <table
            class="table dataTable align-middle fs-6 gy-5 common-table table-bordered"
          >
            <thead>
              <tr>
                <th
                  v-for="(col, index) in visibleColumns"
                  :key="index"
                  :class="[
                    col.sortable && 'sorting cursor-pointer',
                    isSorting(col) &&
                      sortType === SortType.DESC &&
                      'sorting_desc',
                    isSorting(col) &&
                      sortType === SortType.ASC &&
                      'sorting_asc',
                  ]"
                  @click="sortColumn(col)"
                >
                  <template v-if="col.key === 'checkbox'">
                    <div
                      class="form-check form-check-sm form-check-custom form-check-solid"
                    >
                      <input
                        v-model="checkAllStatus"
                        class="form-check-input"
                        type="checkbox"
                        @click="checkboxAll"
                      />
                    </div>
                  </template>
                  <template v-else>
                    {{ renderHead(col) }}
                  </template>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!hasData">
                <td :colspan="colspan" class="text-center py-5 text-muted">
                  {{ $t('noData') }}
                </td>
              </tr>
              <template v-if="hasData">
                <template v-for="row in data" :key="row.id">
                  <tr :class="row.trCustomClass ?? ''">
                    <td
                      v-for="(col, index) in visibleColumns"
                      :key="index"
                      :class="col.class"
                      :title="renderTitleCell(col, row)"
                    >
                      <span
                        v-if="col.key === 'side'"
                        :title="`${$t(
                          `futures.openPosition.sideOptions.${row.side}`,
                        )}`"
                        :class="{
                          'text-success': row.side === PositionSide.Long,
                          'text-danger': row.side === PositionSide.Short,
                        }"
                      >
                        {{ $t(`futures.openPosition.sideOptions.${row.side}`) }}
                      </span>
                      <button
                        v-else-if="col.key === 'expand'"
                        class="btn btn-sm btn-primary btn-detail hide"
                        @click.prevent="showOrders(row.id)"
                      >
                        <span
                          class="svg-icon svg-icon-2 me-0"
                          :class="
                            openOrders.includes(row.id)
                              ? 'arrow-up'
                              : 'arrow-down'
                          "
                        >
                          <inline-svg
                            :src="`media/icons/duotune/arrows/${
                              openOrders.includes(row.id)
                                ? 'arr081.svg'
                                : 'arr082.svg'
                            }`"
                          />
                        </span>
                      </button>
                      <div v-else>{{ renderCell(col, row) }}</div>
                    </td>
                  </tr>
                  <tr
                    v-if="openOrders.includes(row.id)"
                    :class="`order-by-position-${row.id}`"
                    style="padding: 0 !important; border: 0 !important"
                  >
                    <td
                      colspan="10"
                      style="padding: 0 !important; border: 0 !important"
                    >
                      <OrdersByPosition
                        :position-id="row.id"
                      ></OrdersByPosition>
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </table>
        </div>
        <div
          v-if="loading"
          class="d-flex align-items-center justify-content-center loading-wrapper"
        >
          <div class="loading-area">
            <slot name="loading">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('loading') }}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>
      <div class="row">
        <div
          class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
        >
          <div
            v-if="configPage"
            class="dataTables_length"
            id="kt_customers_table_length"
          >
            <label class="me-4">
              <select
                name="kt_customers_table_length"
                class="form-select form-select-sm form-select-solid"
                @change="getData(true)"
                v-model="pagination.size"
              >
                <option v-for="item in pageOptions" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </label>
            <span v-if="hasData">
              {{
                $t('tableDisplayResult', {
                  start: (pagination.page - 1) * pagination.size + 1,
                  end: (pagination.page - 1) * pagination.size + data.length,
                  total: pagination.total,
                })
              }}
            </span>
          </div>
        </div>
        <div
          class="col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end"
        >
          <el-pagination
            v-model:current-page="pagination.page"
            @current-change="choosePage"
            :page-size="pagination.size"
            layout="prev, pager, next"
            :total="pagination.total"
            :hide-on-single-page="true"
            background
          >
          </el-pagination>
        </div>
      </div>
    </div>
  </div>

  <base-modal
    title="columnConfig"
    :show="showColumnConfig"
    @close="closeColumnConfigModal"
  >
    <template v-slot:body>
      <draggable
        v-model="columnsToConfig"
        item-key="key"
        ghost-class="ghost"
        itemKey="draggable-table-base-modal"
      >
        <template #item="{ element: column, index }">
          <div
            class="d-flex align-items-center px-2 py-3 border-bottom bg-white"
            :class="{ 'border-top': index === 0 }"
          >
            <label
              :for="`column-config-${index}`"
              class="flex-grow-1 d-flex align-items-center fw-bold cursor-pointer"
              :title="renderHead(column)"
            >
              <input
                type="checkbox"
                :id="`column-config-${index}`"
                class="me-3"
                :checked="!column.hidden"
                @input="
                  ($event) => {
                    column.hidden = !$event?.target?.checked
                  }
                "
              />
              {{ renderHead(column) }}
            </label>
          </div>
        </template>
      </draggable>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary me-2"
        type="button"
        @click="resetColumnConfig"
      >
        {{ $t('reset') }}
      </button>
      <!-- prettier-ignore -->
      <button
        class="btn btn-success me-2"
        type="button"
        @click="
          // eslint-disable-next-line
          setColumnConfig(columnsToConfig);
          closeColumnConfigModal()
        "
      >
        {{ $t('confirm') }}
      </button>
      <button
        class="btn btn-secondary"
        type="button"
        @click="closeColumnConfigModal"
      >
        {{ $t('cancel') }}
      </button>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { HttpStatus } from '@/core/variables/common.enum'
import { AxiosResponse } from 'axios'
import { defineComponent } from 'vue'
import {
  clone,
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import BaseModal from '@/components/modals/BaseModal.vue'
import { useRoute } from 'vue-router'
import { DateRangePickerMode } from '@/libs/DateRangePicker.vue'
import { FutureService } from '@/services/FutureService'
import { OrderSide, PositionSide } from '@/core/variables/futures.enum'
import { UserService } from '@/services/UserService'
import draggable from 'vuedraggable'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import {
  DatatableSearchType,
  SortType,
} from '@/components/datatable/Datatable.vue'
import {
  IBaseSearchColumnConfig,
  IColumnConfig,
  IDateRangeSearchColumnConfig,
  ISelectSearchColumnConfig,
} from '@/interfaces/futures'
import OrdersByPosition from '@/components/futures/OrdersByPosition.vue'
import _ from 'lodash'

export type TSearchColumnConfig =
  | IBaseSearchColumnConfig
  | ISelectSearchColumnConfig
  | IDateRangeSearchColumnConfig

export default defineComponent({
  name: 'futures-open-position',
  components: { BaseModal, draggable, OrdersByPosition },
  emits: [],
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.futures.openPosition', [
      'menu.futures.title',
    ])
    this.initTable()
    this.getData()
  },
  data() {
    return {
      columns: [
        {
          key: 'expand',
          title: '',
          sortable: false,
          class: 'td-w-70px text-center',
        },
        {
          key: 'created_at',
          title: 'futures.common.createAt',
          sortable: true,
          class: 'td-w-110px min-w-90px text-center',
          render: (value) => {
            return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
          },
        },
        {
          key: 'user_id',
          title: 'futures.common.userId',
          sortable: true,
          class: 'td-w-70px min-w-50px text-center',
        },
        {
          key: 'email',
          title: 'futures.common.email',
          sortable: false,
          class: 'td-w-160px min-w-120px',
        },
        {
          key: 'id',
          title: 'futures.openPosition.positionId',
          sortable: true,
          class: 'td-w-120px min-w-100px text-center',
        },
        {
          key: 'side',
          title: 'futures.common.side',
          sortable: true,
          class: 'td-w-60px min-w-40px text-center',
        },
        {
          key: 'entry_price',
          title: 'futures.openPosition.entryPrice',
          sortable: true,
          class: 'td-w-70px min-w-50px text-center',
        },
        {
          key: 'unrealized_pnl',
          title: 'futures.openPosition.unrealizedPnl',
          sortable: true,
          class: 'td-w-100px min-w-80px text-center',
        },
        {
          key: 'liquidation_price',
          title: 'futures.openPosition.liquidationPrice',
          sortable: true,
          class: 'td-w-70px min-w-50px text-center',
        },
        {
          key: 'tp_sl',
          title: 'futures.openPosition.tp_sl',
          sortable: true,
          class: 'td-w-120px min-w-100px text-center',
        },
      ] as IColumnConfig[],
      searchColumns: [
        {
          key: 'created_at_date',
          startPlaceholder: 'futures.common.startDate',
          endPlaceholder: 'futures.common.endDate',
          searchType: DatatableSearchType.DATE_RANGE,
          mode: DateRangePickerMode.DATE,
          title: 'futures.common.createAt',
        },
        {
          key: 'order_side',
          title: 'futures.common.orderSide',
          searchType: DatatableSearchType.SELECT,
          options: [OrderSide.Buy, OrderSide.Sell].map((e) => ({
            id: e,
            name: this.$t(`futures.common.orderSideOptions.${e}`),
          })),
        },
        {
          key: 'pair',
          title: 'futures.common.pair',
          searchType: DatatableSearchType.SELECT,
          remote: true,
          remoteOptions: async (coinCurrency) => {
            const [coin, currency] = coinCurrency.split('/')
            const result = await FutureService.getSettings({ coin, currency })
            if (result.status !== HttpStatus.OK || result.data.length < 1)
              return []
            return result.data.map((e) => {
              if (`${e.coin}/${e.currency}` === 'btc/usdt')
                this.filter['pair'] = `${e.coin}/${e.currency}`
              return {
                id: `${e.coin}/${e.currency}`,
                name: `${e.coin.toUpperCase()}/${e.currency.toUpperCase()}`,
              }
            })
          },
        },
        {
          key: 'user_id',
          title: 'futures.common.email',
          searchType: DatatableSearchType.SELECT,
          remote: true,
          remoteOptions: async (text) => {
            const users = await UserService.searchByFilter({
              email: text,
            })
            if (!users) return []
            if (users.status !== HttpStatus.OK) {
              return []
            }
            return users.data.map((user) => {
              return { id: user.id, name: user.email }
            })
          },
        },
      ] as TSearchColumnConfig[],
      configPage: true,
      configColumn: false,
      pageOptions: [10, 25, 50, 100],
      tableName: 'futures-open-position-table',
      usingId: false,

      defaultColumns: [] as IColumnConfig[],
      columnsToConfig: [] as IColumnConfig[],
      checkAllStatus: false,
      DatatableSearchType,
      SortType,
      loading: false,
      data: [] as any[],
      filter: {},
      sort: '',
      sortType: '',
      draw: 0,
      pagination: {
        size: 25,
        page: 1,
        total: 0,
      },
      showColumnConfig: false,
      route: useRoute(),
      PositionSide,
      openOrders: [] as string[],
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter((col) => !col.hidden)
    },
    colspan() {
      return this.visibleColumns.length
    },
    hasData() {
      return this.data && this.data.length
    },
  },
  methods: {
    showOrders(positionId) {
      if (_.includes(this.openOrders, positionId)) {
        _.remove(this.openOrders, function (id) {
          return id === positionId
        })
      } else {
        this.openOrders.push(positionId)
      }
    },
    filterPositionParams() {
      const filter = {}
      if (this.filter['pair'] !== undefined) {
        filter['symbols'] = [this.filter['pair']]
      }
      if (this.filter['user_id'] !== undefined) {
        filter['user_id'] = [this.filter['user_id']]
      }
      if (this.filter['created_at_date'] !== undefined) {
        filter['from'] =
          new Date(this.filter['created_at_date'][0]).getTime() / 1000
        filter['to'] =
          new Date(this.filter['created_at_date'][1]).getTime() / 1000
      }
      if (this.filter['order_side'] !== undefined) {
        filter['side'] = this.filter['order_side']
      }
      return filter
    },
    checkboxAll() {
      const input = {
        checked: this.checkAllStatus,
        ids: this.data.map((e) => e.id),
        data: this.data,
      }
      console.log(input)
    },
    defaultSuccessFunction(res: AxiosResponse) {
      this.pagination = res.data.pagination || {}
      if (
        Math.ceil(this.pagination.total / this.pagination.size) &&
        this.pagination.page >
          Math.ceil(this.pagination.total / this.pagination.size)
      )
        this.getData(true)
      else {
        this.data = res.data.data || []
        if (res.data && res.data.items) {
          this.data = res.data.items || []
        }
        if (res.data && res.data.meta) {
          this.pagination.size = res.data.meta.itemsPerPage
          this.pagination.page = res.data.meta.currentPage
          this.pagination.total = res.data.meta.totalItems
        }
        if (this.usingId) {
          this.data.forEach((row, index) => {
            if (!row.id) {
              row.id =
                index + 1 + (this.pagination.page - 1) * this.pagination.size
            } else {
              row.stt =
                index + 1 + (this.pagination.page - 1) * this.pagination.size
            }
          })
        }
      }
    },
    async searchOptions(item, text) {
      const response = await item.asyncFind(text)
      return response.data.data.data.map((item) => {
        return {
          value: item.id,
          label: item.name,
        }
      })
    },
    getData: async function (resetPage = false) {
      // Check all handle
      this.checkAllStatus = false

      if (resetPage) this.pagination.page = 1
      this.loading = true
      const draw = ++this.draw
      const res = await FutureService.getOpenPositionList({
        ...this.filterPositionParams(),
        sort_by: this.sort,
        sort_type: this.sortType,
        per_page: this.pagination.size,
        page: this.pagination.page,
        draw,
      })
      this.loading = false
      if (draw != this.draw) return
      this.loading = false
      if (res.status == HttpStatus.OK) {
        this.defaultSuccessFunction(res)
      } else {
        this.$toastr.error(this.$t(res?.data?.message || 'serverError'))
      }
      if (this.configColumn) this.saveTableState()
    },
    choosePage: function (page) {
      this.pagination.page = page
      this.getData()
    },
    renderHead(col) {
      return col.title ? this.$t(col.title) : ''
    },
    renderCell: function (col: IColumnConfig, row) {
      const content = this.renderTitleCell(col, row)
      const [coin, currency] = row.symbol.split('/')
      if (col.key === 'entry_price') {
        return `${row.entry_price} ${currency.toUpperCase()}`
      }
      if (col.key === 'unrealized_pnl') {
        return `${row.unrealized_pnl} ${currency.toUpperCase()}`
      }
      if (col.key === 'liquidation_price') {
        return `${row.liquidation_price} ${currency.toUpperCase()}`
      }
      if (col.key === 'tp_sl') {
        return `${row.take_profit_price} ${currency.toUpperCase()} / ${
          row.stop_loss_price
        } ${currency.toUpperCase()}`
      }
      return content
    },
    renderTitleCell: function (col: IColumnConfig, row) {
      if (col.hiddenTitle) return ''
      const value = row[col.key] != null ? row[col.key] : ''
      if (col.render) return col.render(value, row)
      return value
    },
    resetSearch() {
      this.filter = {}
      this.getData(true)
    },
    sortColumn(col: IColumnConfig) {
      if (!col.sortable) return
      if (this.isSorting(col)) {
        if (this.sortType == SortType.DESC) {
          this.sort = ''
          this.sortType = ''
        } else if (this.sortType == SortType.ASC) {
          this.sortType = SortType.DESC
        } else {
          this.sortType = SortType.ASC
        }
      } else {
        this.sort = this.getSortKey(col)
        this.sortType = SortType.ASC
      }
      this.getData()
    },
    isSorting(col: IColumnConfig) {
      return this.sort == this.getSortKey(col)
    },
    getSortKey(col: IColumnConfig) {
      return col.sortKey || col.key
    },
    getOptions(item: ISelectSearchColumnConfig) {
      if (item.remote) return []
      return item.options || []
    },
    openColumnConfigModal() {
      this.showColumnConfig = true
      this.columnsToConfig = clone(this.columns)
    },
    closeColumnConfigModal() {
      this.showColumnConfig = false
    },
    setColumnConfig(columnConfig) {
      if (!columnConfig || !columnConfig.length) return
      this.columns = columnConfig.map((configColumn) => {
        const originColumn = this.columns.find(
          (col) => col.key == configColumn?.key,
        )
        return { ...originColumn, ...configColumn }
      })
      this.saveTableState()
    },
    resetColumnConfig() {
      this.columnsToConfig = clone(this.defaultColumns)
    },
    saveTableState() {
      localStorage.setItem(
        `datatable-${this.tableName}-${this.route.path}`,
        JSON.stringify({
          columns: this.columns,
        }),
      )
    },
    restoreTableState() {
      const previousState = JSON.parse(
        localStorage.getItem(
          `datatable-${this.tableName}-${this.route.path}`,
        ) || '{}',
      )
      const previousColumns = previousState?.columns
      if (this.checkValidColumnVersion(previousColumns)) {
        this.setColumnConfig(previousColumns)
      }
    },
    initTable() {
      this.sort = ''
      this.sortType = ''

      this.columns = clone(this.columns)
      this.defaultColumns = clone(this.columns)

      this.restoreTableState()
    },
    checkValidColumnVersion(columnConfig) {
      const originColumns = this.columns
      if (originColumns?.length != columnConfig?.length) return false
      return originColumns.every((originColumn) =>
        columnConfig.find((col) => col.key == originColumn.key),
      )
    },
  },
})
</script>

<style lang="scss" scoped>
.table-wrapper {
  position: relative;

  .loading-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.1);
    .loading-area {
      font-size: 1.2em;
      color: white;
      background-color: #aaa;
      padding: 10px 15px;
      border-radius: 5px;
    }
  }
}
.text-search-group {
  input {
    flex-grow: 2;
  }
}
td {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
@for $i from 5 through 50 {
  .td-w-#{$i * 10}px {
    width: #{$i * 10}px;
    max-width: #{$i * 10}px;
  }
}
.ghost {
  opacity: 0.8;
  background-color: rgb(169, 204, 255) !important;
}
.tr-draggable {
  cursor: move;
}
.plain-text {
  white-space: pre;
}
</style>
