<template>
  <div
    class="row mb-2"
    :class="config.filterClass"
    v-if="
      config.searchColumns !== undefined ? config.searchColumns.length : 0 > 0
    "
  >
    <div
      v-for="(item, index) in separateFilters"
      :key="index"
      :class="item.class || 'col-md-4 col-xl-3'"
      class="mb-4"
    >
      <label v-if="config.isShowLabelFilter" class="form-label"
        >{{ $t(item.title) }}:</label
      >
      <v-select
        v-if="item.searchType === DatatableSearchType.SELECT"
        :options="getOptions(item)"
        option-value="id"
        option-label="name"
        :placeholder="config.isShowLabelFilter ? '' : $t(item.title)"
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
    </div>
    <div v-if="groupedFilters.length" class="col-md-4 col-xl-3 mb-4">
      <label v-if="config.isShowLabelFilter" class="form-label"
        >{{
          groupedFilters.length > 1
            ? $t('keyword')
            : $t(groupedFilters[0].title)
        }}:</label
      >
      <div
        class="input-group text-search-group"
        v-if="groupedFilters.length > 1"
      >
        <v-select
          :options="searchFieldOptions"
          v-model="filter.searchField"
          :placeholder="$t('all')"
          option-value="id"
          option-label="name"
          :can-deselect="true"
        >
        </v-select>

        <input
          class="form-control"
          :placeholder="config.isShowLabelFilter ? '' : $t('keyword')"
          v-model="filter.searchText"
          @keyup="(e) => e.keyCode == 13 && getData()"
        />
      </div>
      <input
        v-else
        class="form-control"
        :placeholder="
          config.isShowLabelFilter ? '' : $t(groupedFilters[0].title)
        "
        v-model="filter.searchText"
        @keyup="(e) => e.keyCode == 13 && getData()"
      />
    </div>
    <div :class="config.buttonSectionClass || 'col-auto mb-2'">
      <button
        v-if="config?.searchColumns?.length && !config?.isRemoveSearch"
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
        v-if="config?.searchColumns?.length && !config?.notReset"
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
        v-if="config?.configColumn"
        class="btn btn-primary me-2 mb-1"
        @click="openColumnConfigModal"
        :title="$t('config')"
      >
        <i v-if="!loading" class="fas fa-cog fa-fw"></i>
        <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
        <span class="d-none d-lg-inline-block">{{ $t('config') }}</span>
      </button>
      <button
        v-if="config?.activeDownloadCsv"
        class="btn btn-primary me-2 mb-1"
        @click="downloadCsv"
        :title="$t('downloadCSV')"
      >
        <i class="fas fa-download"></i>
        <span class="d-none d-lg-inline-block">{{ $t('downloadCSV') }}</span>
      </button>
      <slot name="button"></slot>
    </div>
    <div class="col mb-2">
      <div class="d-flex justify-content-end align-items-center">
        <slot name="right-toolbar"></slot>
      </div>
    </div>
  </div>
  <div class="row" v-if="activeExport">
    <div class="col-auto mb-4">
      <button
        class="btn btn-primary me-2"
        :disabled="disabledExportBtn"
        @click="createExport(true)"
      >
        {{ $t('exportByFilter') }}
      </button>
      <button
        class="btn btn-primary me-2"
        @click="createExport(false)"
        :disabled="disabledExportBtn"
      >
        {{ $t('exportAll') }}
      </button>
    </div>
    <div
      class="col-auto mb-4 d-flex align-items-center"
      v-if="!exportInfo.isEmpty"
    >
      <div
        v-show="exportInfo.status === ExportStatus.PROCESSING"
        class="text-warning"
      >
        <i class="fas fa-spinner fa-spin fa-fw"></i>
        <span>{{ $t('exportProcessingMessage') }}</span>
      </div>
      <div
        v-show="exportInfo.status === ExportStatus.SUCCEED"
        class="text-success"
      >
        {{ $t('exportSucceedMessage', { datetime: exportedAt }) }}
        <a
          v-if="!isExpireExportFile"
          class="text-primary"
          :href="exportInfo.link"
          download=""
          target="_blank"
        >
          {{ $t('downloadFile') }}
        </a>
        <span v-else class="text-warning">
          {{ $t('expiredExportFile') }}
        </span>
      </div>
      <div
        v-show="exportInfo.status === ExportStatus.FAILED"
        class="text-danger"
      >
        {{ $t('exportFailedMessage', { datetime: exportedAt }) }}
      </div>
    </div>
  </div>
  <div class="row mb-2" v-if="config.isFutureCancelOrder">
    <hr />
    <div class="col-auto mb-2">
      <button
        @click="cancelFutureOrder"
        class="btn btn-danger"
        :title="$t('futures.openOrder.cancelOrders')"
        :disabled="checkedFutureOrders.length === 0"
      >
        <span class="d-none d-lg-inline-block">{{
          $t('futures.openOrder.cancelOrders')
        }}</span>
      </button>
      <button
        @click="resetSearch"
        class="btn btn-primary mx-3"
        :title="$t('reload')"
        :disabled="loading"
      >
        <span class="d-none d-lg-inline-block">{{ $t('reload') }}</span>
      </button>
    </div>
  </div>
  <div class="table-wrapper">
    <div class="table-responsive mb-4">
      <table
        class="table dataTable align-middle fs-6 gy-5 common-table table-bordered"
        :class="config.tableClass"
      >
        <thead>
          <tr>
            <th
              v-for="(col, index) in visibleColumns"
              :key="index"
              :class="[
                col.sortable && 'sorting cursor-pointer',
                isSorting(col) && sortType === SortType.DESC && 'sorting_desc',
                isSorting(col) && sortType === SortType.ASC && 'sorting_asc',
              ]"
              @click="sortColumn(col)"
            >
              <template v-if="col.key === 'checkbox'">
                <div
                  class="form-check form-check-sm form-check-custom form-check-solid"
                >
                  <input
                    v-model="checkAllStatus"
                    :class="config.isOpenOrder ? 'me-3' : 'form-check-input'"
                    type="checkbox"
                    @click="
                      this.$emit('checkAll', {
                        checked: checkAllStatus,
                        ids: data.map((e) => {
                          if (config.identifyField) {
                            return e[config.identifyField]
                          } else {
                            return e.id
                          }
                        }),
                        data,
                      })
                    "
                  />
                </div>
              </template>
              <template v-else>
                {{ renderHead(col) }}
              </template>
            </th>
          </tr>
        </thead>
        <tbody v-if="!config?.rowOrder">
          <tr v-if="!hasData">
            <td :colspan="colspan" class="text-center py-5 text-muted">
              {{ $t('noData') }}
            </td>
          </tr>
          <template v-if="hasData">
            <tr
              v-for="(row, idx) in data"
              :key="row.id"
              :class="row.trCustomClass ?? ''"
            >
              <td
                v-for="(col, index) in visibleColumns"
                :key="index"
                :class="col.class"
                :title="renderCell(col, row)"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :idx="idx"
                  :page="pagination.page"
                  :size="pagination.size"
                >
                  {{ renderCell(col, row) }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
        <!-- Start table for order by row -->
        <draggable
          :list="data"
          tag="tbody"
          v-if="config?.rowOrder"
          @start="dragging = true"
          @end="onEnded"
          itemKey="draggable-table-key"
        >
          <tr v-if="!hasData">
            <td :colspan="colspan" class="text-center py-5 text-muted">
              {{ $t('noData') }}
            </td>
          </tr>
          <template #item="{ element: row, index: idx }">
            <tr
              :key="row.id"
              :class="row.trCustomClass ?? ''"
              class="tr-draggable"
            >
              <td
                v-for="(col, index) in visibleColumns"
                :key="index"
                :class="col.class"
                :title="renderCell(col, row)"
              >
                <slot
                  :name="`cell-${col.key}`"
                  :row="row"
                  :idx="idx"
                  :page="pagination.page"
                  :size="pagination.size"
                >
                  {{ renderCell(col, row) }}
                </slot>
              </td>
            </tr>
          </template>
        </draggable>
        <!-- End table for order by row -->
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
        v-if="config.configPage"
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
            :class="{ 'border-top': index == 0 }"
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
import { clone, convertTimestampToDate } from '@/core/helpers/common.helper'
import BaseModal from '../modals/BaseModal.vue'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
// import { DatePickerMode } from '@/libs/DatePicker.vue'
import { DateRangePickerMode } from '@/libs/DateRangePicker.vue'

export enum DatatableSearchType {
  TEXT = 'text',
  SELECT = 'select',
  DATE = 'date',
  DATE_RANGE = 'date_range',
  CHECKBOX = 'checkbox',
}

export enum ExportStatus {
  PROCESSING = 1,
  SUCCEED = 2,
  FAILED = 3,
}

export enum SortType {
  ASC = 'ASC',
  DESC = 'DESC',
}

export interface ITableConfig {
  buttonSectionClass?: string
  drawCallback?: () => any
  dataSource: (params: IDataSourceParams) => any
  onSuccess?: (res: AxiosResponse<any>, table: IDatatableContext) => void
  onError?: (res: AxiosResponse<any>, table: IDatatableContext) => void
  filterClass?: string
  columns: Array<IColumnConfig>
  searchColumns?: Array<TSearchColumnConfig>
  configPage?: boolean
  configColumn?: boolean
  tableClass?: string
  initFilter?: Record<string, any>
  getExport?: () => any
  createExport?: (params: CreateExportParams | null) => any
  downloadCsv?: (params: CreateExportParams | null) => any
  activeExport?: boolean
  activeDownloadCsv?: boolean
  identifyField?: string
  default?: {
    sort?: string
    sortType?: SortType
    searchField?: string
  }
  defaultPageSize?: number
  tableName?: string
  notReset?: boolean
  isOpenOrder?: boolean
  pageOptions?: Array<number>
  isRemoveSearch?: boolean
  rowOrder?: boolean
  usingId?: boolean
  isShowLabelFilter?: boolean
  isFutureCancelOrder?: boolean
}
export interface IDataSourceParams {
  search_field: string
  search_text: string
  sort: string
  sort_type: string
  per_page: number
  page: number
  [key: string]: any
}

export interface IColumnConfig {
  key: string
  title: string
  class?: string
  sortKey?: string
  sortable?: boolean
  hidden?: boolean
  hiddenTitle?: boolean
  render?: (value, row?) => string
}

interface IBaseSearchColumnConfig {
  key: string
  title: string
  class?: string
}

interface ITextSearchColumnConfig extends IBaseSearchColumnConfig {
  searchType: DatatableSearchType.TEXT
}

export interface ISelectSearchColumnConfig extends IBaseSearchColumnConfig {
  searchType: DatatableSearchType.SELECT
  remote?: boolean
  options?: Array<{ id: string | number; name: string }>
  remoteOptions?: (
    keyword,
  ) => Promise<Array<{ id: string | number; name: string }>>
  multiple?: boolean
  reserveKeyword?: boolean
  collapseTags?: boolean
}

interface IDateRangeSearchColumnConfig extends IBaseSearchColumnConfig {
  searchType: DatatableSearchType.DATE_RANGE
  startPlaceholder: string
  endPlaceholder: string
  mode: DateRangePickerMode
  inputFormat?: string
  getDataOnChange?: boolean
}

export type TSearchColumnConfig =
  | ITextSearchColumnConfig
  | ISelectSearchColumnConfig
  | IDateRangeSearchColumnConfig

export interface IDatatableContext {
  loading: boolean
  data: Array<any>
  filter: Record<string, any>
  pagination: {
    size: number
    page: number
    total: number
  }
  pageCount: number
  config: ITableConfig
  getData: (resetPage?: boolean) => void
}

export interface CreateExportParams {
  search_field: string
  search_text: string
  sort: string
  sort_type: string
  [key: string]: any
}

const defaultSuccessFunction = (
  res: AxiosResponse<any>,
  table: IDatatableContext,
) => {
  table.pagination = res.data.pagination || {}
  if (table.pageCount && table.pagination.page > table.pageCount)
    table.getData(true)
  else {
    table.data = res.data.data || []
    if (res.data && res.data.items) {
      table.data = res.data.items || []
    }
    if (res.data && res.data.meta) {
      table.pagination.size = res.data.meta.itemsPerPage
      table.pagination.page = res.data.meta.currentPage
      table.pagination.total = res.data.meta.totalItems
    }
    if (table.config.usingId === undefined || table.config.usingId) {
      table.data.forEach((row, index) => {
        if (!row.id) {
          row.id =
            index + 1 + (table.pagination.page - 1) * table.pagination.size
        } else {
          row.stt =
            index + 1 + (table.pagination.page - 1) * table.pagination.size
        }
      })
    }
    if (table.config.drawCallback) table.config.drawCallback()
  }
}

export default defineComponent({
  components: { BaseModal, draggable },
  emits: [
    'checkAll',
    'onSuccess',
    'onReceiveData',
    'onOrderRowChanged',
    'cancelFutureOrder',
  ],
  mounted() {
    if (this.config.defaultPageSize) {
      this.pagination.size = this.config.defaultPageSize
    }
    this.initTable()
    this.getData()

    if (this.config.activeExport) {
      this.exportInfoIntervalId = window.setInterval(this.getExportInfo, 1000)
    }
  },
  unmounted() {
    if (this.exportInfoIntervalId) {
      clearInterval(this.exportInfoIntervalId)
    }
  },
  props: {
    checkedFutureOrders: {
      type: Array,
      default: () => {
        return []
      },
    },
    forceReloadKey: {
      type: Number,
      default: () => {
        return 0
      },
    },
    softReloadKey: {
      type: Number,
      default: () => {
        return 0
      },
    },
    config: {
      type: Object as () => ITableConfig,
      drawCallback: Function,
      dataSource: Function,
      onSuccess: Function,
      onError: Function,
      getExport: Function,
      createExport: Function,
      downloadCsv: Function,
      activeExport: {
        type: Boolean,
        default: false,
      },
      activeDownloadCsv: {
        type: Boolean,
        default: false,
      },
      columns: {
        type: Array as () => Array<IColumnConfig>,
        required: true,
      },
      searchColumns: {
        type: Object,
        default: {},
      },
      configPage: {
        type: Boolean,
        default: false,
      },
      configColumn: {
        type: Boolean,
        default: false,
      },
      tableClass: {
        type: String,
      },
      filterClass: {
        type: String,
      },
      initFilter: {
        type: Object,
      },
      isOpenOrder: {
        type: Boolean,
        default: false,
      },
      pageOptions: {
        type: Array,
        default: [10, 25, 50, 100],
      },
      defaultPageSize: {
        type: Number,
        default: 25,
      },
      tableName: 'table',
      required: true,
      identifyField: 'id',
      isRemoveSearch: false,
      notReset: false,
      rowOrder: false,
      isShowLabelFilter: {
        type: Boolean,
        default: false,
      },
      isFutureCancelOrder: {
        type: Boolean,
        default: false,
      },
    },
  },
  watch: {
    forceReloadKey() {
      if (this.config.isOpenOrder) {
        this.checkLoadOpenOrder()
        return
      }
      this.resetSearch()
    },
    softReloadKey() {
      this.getData(false)
    },
    // 'config.columns': function () {
    //   this.defaultColumns = clone(this.config.columns)
    //   const currentColumns = this.columns
    //   const columns = clone(this.config.columns)
    //   columns.forEach((col) => {
    //     const currentCol = currentColumns.find((e) => e.key == col.key)
    //     if (currentCol) {
    //       col.hidden = currentCol.hidden
    //     }
    //   })
    //   this.setColumnConfig(columns)
    // },
  },
  data() {
    return {
      columns: [] as IColumnConfig[],
      defaultColumns: [] as IColumnConfig[],
      columnsToConfig: [] as IColumnConfig[],
      checkAllStatus: false,
      DatatableSearchType,
      SortType,
      ExportStatus,
      loading: false,
      data: [] as any[],
      filter: { ...(this.config.initFilter || {}) },
      sort: '',
      sortType: '',
      draw: 0,
      numLoad: 0,
      pagination: {
        size: 25,
        page: 1,
        total: 0,
      },
      exportInfo: {
        isEmpty: true,
        status: ExportStatus.PROCESSING,
        link: '',
        finishedAt: '',
      },
      exportInfoIntervalId: 0,
      loadingRequestExport: false,
      showColumnConfig: false,
      route: useRoute(),
      dragging: false,
    }
  },
  computed: {
    tableName() {
      return this.config?.tableName
    },
    sourceFunc() {
      return this.config?.dataSource
    },
    pageOptions() {
      return this.config?.pageOptions
        ? this.config?.pageOptions
        : [10, 25, 50, 100]
    },
    separateFilters() {
      return (this.config?.searchColumns || []).filter(
        (item) => ![DatatableSearchType.TEXT].includes(item.searchType),
      )
    },
    groupedFilters() {
      return (this.config?.searchColumns || []).filter(
        (item) => item.searchType === DatatableSearchType.TEXT,
      )
    },
    visibleColumns() {
      return this.columns.filter((col) => !col.hidden)
    },
    colspan() {
      return this.visibleColumns.length
    },
    hasData() {
      return this.data && this.data.length
    },
    pageCount() {
      return Math.ceil(this.pagination.total / this.pagination.size)
    },
    parsedFilter() {
      return {
        ...this.filter,
        search_field: this.filter.searchField,
        search_text: (this.filter.searchText || '').trim(),
      }
    },
    searchFieldOptions() {
      return this.groupedFilters.map((col) => ({
        id: col.key,
        name: this.$t(col.title),
      }))
    },
    onSuccess() {
      return this.config?.onSuccess || defaultSuccessFunction
    },
    onError() {
      return this.config?.onError || (() => 1)
    },
    activeExport() {
      return this.config?.activeExport
    },
    activeDownloadCsv() {
      return this.config?.activeDownloadCsv
    },
    disabledExportBtn() {
      return (
        (this.exportInfo.status == ExportStatus.PROCESSING &&
          !this.exportInfo.isEmpty) ||
        this.loadingRequestExport
      )
    },
    exportedAt() {
      return convertTimestampToDate(this.exportInfo.finishedAt)
    },
    isExpireExportFile() {
      return (
        3600 * 1000 -
          new Date().getTime() +
          parseInt(this.exportInfo.finishedAt) <=
        0
      )
    },
    stateKey() {
      return `datatable-${this.tableName}-${this.route.path}`
    },
    filterKey() {
      return `datatable-${this.tableName}-${this.route.path}-filter`
    },
  },
  methods: {
    cancelFutureOrder() {
      this.$emit('cancelFutureOrder', this.checkedFutureOrders)
    },
    onEnded() {
      this.dragging = false

      this.$emit('onOrderRowChanged', this.data)
    },
    checkLoadOpenOrder() {
      if (this.numLoad != this.forceReloadKey) {
        this.resetSearch()
      }
    },
    debounce(func, timeout = 300) {
      let timer
      return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          func.apply(this, args)
        }, timeout)
      }
    },
    updateConfig() {
      this.filter = { ...this.filter, ...(this.config.initFilter || {}) }
      this.getData()
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
      this.$emit('checkAll', { checked: false, ids: [] })

      if (!this.sourceFunc) return
      if (resetPage) this.pagination.page = 1
      let forceReloadKey = this.forceReloadKey
      if (this.config.isOpenOrder) {
        this.numLoad++
        if (this.loading) {
          return
        }
      }
      this.loading = true
      const draw = ++this.draw
      const res = await this.sourceFunc({
        ...this.parsedFilter,
        sort: this.sort,
        sort_type: this.sortType,
        per_page: this.pagination.size,
        limit: this.pagination.size,
        page: this.pagination.page,
        draw: draw,
      })
      this.loading = false
      if (draw != this.draw) return
      this.loading = false
      if (res.status == HttpStatus.OK) {
        this.onSuccess(res, this)
        // this.saveFilter()
        this.$emit('onReceiveData', res)
        if (this.config.isOpenOrder) {
          this.numLoad = forceReloadKey
          this.debounce(this.checkLoadOpenOrder())
        }
      } else {
        this.$toastr.error(this.$t(res?.data?.message || 'serverError'))
        this.onError(res, this)
      }
      if (this.config.configColumn) this.saveTableState()
    },
    choosePage: function (page) {
      this.pagination.page = page
      this.getData()
    },
    renderHead(col) {
      return col.title ? this.$t(col.title) : ''
    },
    renderCell: function (col: IColumnConfig, row) {
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
      return [
        // { id: '', name: item.title ? this.$t(item.title) : this.$t('all') },
        ...(item.options || []),
      ]
    },
    async getExportInfo() {
      if (!this.config.getExport) {
        return
      }

      const { data } = await this.config.getExport()
      this.exportInfo.status = data.data.status
      this.exportInfo.isEmpty = data.data.is_empty
      this.exportInfo.link = data.data.link
      this.exportInfo.finishedAt = data.data.finished_at

      if (
        data.data.status !== ExportStatus.PROCESSING &&
        this.exportInfoIntervalId
      ) {
        clearInterval(this.exportInfoIntervalId)
        this.exportInfoIntervalId = 0
      }
    },
    async createExport(applyFilter: boolean) {
      if (!this.config.createExport) {
        return
      }

      let params = applyFilter
        ? {
            ...this.parsedFilter,
            sort: this.sort,
            sort_type: this.sortType,
          }
        : null

      this.loadingRequestExport = true
      const { data } = await this.config.createExport(params)
      this.loadingRequestExport = false

      if (data && data.data && data.data.success) {
        this.exportInfo.status = ExportStatus.PROCESSING
        this.exportInfoIntervalId = window.setInterval(this.getExportInfo, 1000)
      }
    },
    downloadCsv() {
      if (!this.config.downloadCsv) return
      const params = {
        ...this.parsedFilter,
        sort: this.sort,
        sort_type: this.sortType,
      }
      this.config.downloadCsv(params)
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
        const originColumn = this.config.columns.find(
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
        this.stateKey,
        JSON.stringify({
          columns: this.columns,
        }),
      )
    },
    restoreTableState() {
      const previousState = JSON.parse(
        localStorage.getItem(this.stateKey) || '{}',
      )
      const previousColumns = previousState?.columns
      if (this.checkValidColumnVersion(previousColumns)) {
        this.setColumnConfig(previousColumns)
      }
    },
    initTable() {
      this.sort = this.config.default?.sort || ''
      this.sortType = this.config.default?.sortType || ''
      this.filter.searchField = this.config.default?.searchField || ''

      this.columns = clone(this.config.columns)
      this.defaultColumns = clone(this.config.columns)

      this.restoreTableState()
      // this.restoreFilter()
    },
    checkValidColumnVersion(columnConfig) {
      const originColumns = this.config.columns
      if (originColumns?.length != columnConfig?.length) return false
      return originColumns.every((originColumn) =>
        columnConfig.find((col) => col.key == originColumn.key),
      )
    },
    saveFilter() {
      const data = {
        ...this.parsedFilter,
        sort: this.sort,
        sort_type: this.sortType,
        per_page: this.pagination.size,
        page: this.pagination.page,
      }
      localStorage.setItem(this.filterKey, JSON.stringify(data))
    },
    restoreFilter() {
      const data = JSON.parse(localStorage.getItem(this.filterKey) || '{}')
      if (data.page) this.pagination.page = data.page
      if (data.sort) this.sort = data.sort
      if (data.sort_type) this.sortType = data.sort_type
      if (data.per_page) this.pagination.size = data.per_page
      this.filter = { ...data }
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
