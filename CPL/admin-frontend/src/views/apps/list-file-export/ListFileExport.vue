<template>
  <div class="card">
    <div class="card-header border-0 pt-6"></div>
    <div class="card-body pt-0">
      <div class="dataTables_wrapper dt-bootstrap4 no-footer">
        <div class="table-responsive">
          <table
            :class="[loading && 'overlay overlay-block']"
            class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
            id="kt_customers_table"
            role="grid"
          >
            <thead>
              <tr
                class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0"
                role="row"
                v-if="tableHeader && tableHeader.length"
              >
                <template v-for="(cell, i) in tableHeader" :key="i">
                  <th
                    tabindex="0"
                    rowspan="1"
                    colspan="1"
                    :class="[
                      cell.sortable && 'sorting cursor-pointer',
                      cell.name && 'min-w-125px',
                      cell.name && 'min-w-125px',
                      isSorting(cell) &&
                        sortType === SortType.DESC &&
                        'sorting_desc',
                      isSorting(cell) &&
                        sortType === SortType.ASC &&
                        'sorting_asc',
                    ]"
                    @click="sortColumn(cell)"
                    :style="
                      cell.minWidth
                        ? `min-width: ${cell.minWidth}px !important;`
                        : ''
                    "
                  >
                    {{ $t(cell.name) }}
                  </th>
                </template>
                <th>{{ $t('action') }}</th>
              </tr>
            </thead>
            <tbody class="fw-bold text-gray-600">
              <template v-if="items && items.length">
                <template v-for="(item, i) in items" :key="i">
                  <tr class="odd">
                    <template v-for="(cell, i) in tableHeader" :key="i">
                      <td
                        :class="{
                          [cell.className]: cell.className,
                        }"
                      >
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code' ||
                                cell.key === 'currency',
                            }"
                          >
                            {{ item[cell.key] }}
                          </span>
                        </slot>
                      </td>
                    </template>
                    <td class="d-flex justify-content-between gap-2">
                      <button
                        class="btn btn-primary text-nowrap"
                        @click="downloadFileExport(item.path, item.file_name)"
                        :disabled="item.status === 'processing'"
                      >
                        <span>
                          {{ $t('walletGeneral.download') }}
                        </span>
                      </button>
                    </td>
                  </tr>
                </template>
              </template>
              <template v-else>
                <tr class="odd">
                  <td colspan="12" class="text-center py-5 text-muted">
                    {{ $t('walletGeneral.thereIsNoData') }}
                  </td>
                </tr>
              </template>
            </tbody>
            <div
              v-if="loading"
              class="overlay-layer card-rounded bg-dark bg-opacity-5"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
            <!--end::Table body-->
          </table>
        </div>

        <div class="row">
          <div
            class="col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start"
          >
            <div class="dataTables_length" id="kt_customers_table_length">
              <label
                ><select
                  v-model="pagination.rowsPerPage"
                  name="kt_customers_table_length"
                  class="form-select form-select-sm form-select-solid"
                  @change="setItemsPerPage"
                >
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select></label
              >
              <span v-if="items && items.length" class="ms-4">
                {{
                  $t('tableDisplayResult', {
                    start: (pagination.page - 1) * pagination.rowsPerPage + 1,
                    end:
                      (pagination.page - 1) * pagination.rowsPerPage +
                      items.length,
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
              @current-change="currentPageChange"
              :page-size="pagination.rowsPerPage"
              layout="prev, pager, next"
              :total="pagination.total"
              :hide-on-single-page="false"
              background
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import {
  downloadFileWithoutPopUp,
  setPageFliud,
} from '@/core/helpers/common.helper'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue'
import { WalletSettingService } from '@/services/WalletSettingService'
import { WalletBceService } from '@/services/WalletBceService'
import { IPagination } from '@/core/data/deposit'
import moment from 'moment'
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import {
  WITHDRAW_TRANSACTION_STATUS,
  DOMAIN,
  WITHDRAWINTERACTOR,
} from '@/models/hot-wallet/HotWalletType'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'

export default defineComponent({
  components: {},
  setup() {
    const tableHeader = ref([
      {
        name: 'id',
        key: 'id',
        sortable: false,
      },
      {
        name: 'walletGeneral.fileName',
        key: 'file_name',
        sortable: true,
      },
      {
        name: 'walletGeneral.status',
        key: 'status',
        sortable: true,
        className: 'text-uppercase'
      },
      {
        name: 'walletGeneral.createdDate',
        key: 'created_at',
        sortable: true,
        minWidth: 150,
      },
    ])

    const getFilterParams = () => {
      let p: any = {
        page: pagination.value.page,
        limit: pagination.value.rowsPerPage,
        sort_type: sortType.value,
        sort: sort.value,
      }

      return p
    }

    const getData = () => {
      const p = getFilterParams()
      loading.value = true

      WalletBceService.getListFileExport(p).then((res) => {
        if (res.data) {
          const responseData = res.data.data || []

          pagination.value.total = res.data.total_count || 0
          items.value = responseData.map((item) => {
            item.created_at = moment
              .unix(+item.created_at / 1000)
              .format('YYYY-MM-DD HH:mm')

            return item
          })
          tableReloadKey.value++
        }

        loading.value = false
      })
    }

    const tableReloadKey = ref(0)

    const items = ref()

    const currentPageChange = () => {
      getData()
    }

    const setItemsPerPage = () => {
      pagination.value.page = 1
      pagination.value.rowsPerPage = +pagination.value.rowsPerPage
      getData()
    }

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs('menu.listFileExport', [])
      store.dispatch(Actions.FETCH_LIST_COIN)
      getListCoin()
      getData()
    })

    const page = ref(1)
    const total = ref()
    const rowsPerPage = ref(10)
    const pagination = ref<IPagination>({
      page: page.value,
      total: total.value,
      rowsPerPage: rowsPerPage.value,
    })
    const listCoin = computed(() => {
      return [...new Set([...store.getters.listCoin, ...listCoinErc20.value])]
    })
    const listStatus = computed(() => {
      return [
        ...Object.keys(WITHDRAW_TRANSACTION_STATUS).map((key) => key),
      ].sort()
    })
    const listCoinErc20 = ref([])
    const getListCoin = () => {
      WalletSettingService.getListCoin().then((res) => {
        if (res.data && res.data.data) {
          listCoinErc20.value = res.data.data.map((item) =>
            item.symbol.toUpperCase(),
          )
        }
      })
    }

    const coinSelect = ref('')
    const statusSelect = ref('')
    const searchEmail = ref('')
    const searchTransactionId = ref('')
    const dateRange = ref([])
    const loading = ref(false)
    const loadingDownload = ref(false)

    const app = getCurrentInstance()
    const toastr = app?.appContext.config.globalProperties.$toastr
    const t = app?.appContext.config.globalProperties.$t
    const getSortKey = (col: IColumnConfig) => {
      return col.sortKey || col.key
    }

    const sort = ref('')

    const sortType = ref('')

    const isSorting = (col: IColumnConfig) => {
      return sort.value == getSortKey(col)
    }

    const sortColumn = (col: IColumnConfig) => {
      if (!col.sortable) return
      if (isSorting(col)) {
        if (sortType.value == SortType.DESC) {
          sort.value = ''
          sortType.value = ''
        } else if (sortType.value == SortType.ASC) {
          sortType.value = SortType.DESC
        } else {
          sortType.value = SortType.ASC
        }
      } else {
        sort.value = getSortKey(col)
        sortType.value = SortType.ASC
      }
      getData()
    }

    const resetSearch = () => {
      coinSelect.value = ''
      statusSelect.value = ''
      searchEmail.value = ''
      searchTransactionId.value = ''
      dateRange.value = []

      getData()
    }

    const downloadFileExport = (path: string, fileName: string) => {
      const params = getFilterParams()

      params.path = path
      params.file_name = fileName

      loadingDownload.value = true
      WalletBceService.downloadFileExport(params)
        .then((result) => {
          if (!result?.data?.data?.url) {
            toastr.error(t('walletGeneral.downloadFileFailed'))

            return
          }
          downloadFileWithoutPopUp(result?.data?.data?.url, fileName)

          toastr.success(t('walletGeneral.downloadFileSuccess'))
        })
        .catch((error) => {
          console.log(error)
          toastr.error(t('walletGeneral.downloadFileFailed'))
        })
        .finally(() => {
          loadingDownload.value = false
        })
    }

    return {
      loading,
      tableHeader,
      items,
      tableReloadKey,
      pagination,
      rowsPerPage,
      currentPageChange,
      setItemsPerPage,
      getData,
      listCoin,
      listStatus,
      WITHDRAW_TRANSACTION_STATUS,
      DOMAIN,
      WITHDRAWINTERACTOR,

      coinSelect,
      statusSelect,
      searchEmail,
      searchTransactionId,
      dateRange,
      sortType,
      sortColumn,
      SortType,
      isSorting,
      resetSearch,
      downloadFileExport,
      loadingDownload,
    }
  },
})
</script>
<style scoped>
.mw-150px {
  min-width: 150px;
}

[disabled] {
  cursor: not-allowed !important;
  pointer-events: auto !important;
}
</style>
