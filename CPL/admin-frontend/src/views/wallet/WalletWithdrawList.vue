<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-4" style="padding-left: 0">
        <div class="row mb-4">
          <div class="col-3 mr-8">
            <el-input
              v-model="searchAddress"
              type="text"
              :placeholder="$t('walletGeneral.address')"
              clearable
            />
          </div>
          <div class="col-3 mr-8">
            <el-input
              v-model="searchTransactionHash"
              type="text"
              :placeholder="$t('walletGeneral.transactionHash')"
              clearable
            />
          </div>
          <div class="col-3 mr-8">
            <el-input
              v-model="searchTransactionId"
              type="text"
              :placeholder="$t('walletGeneral.transactionId')"
              clearable
            />
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-3 mr-8">
            <!--begin::Input-->
            <div>
              <el-select
                class="form-select-solid"
                :placeholder="$t('walletGeneral.selectStatus')"
                v-model="statusSelect"
                clearable
                filterable
              >
                <el-option
                  v-for="value in listStatus"
                  :value="value"
                  :key="value"
                  :label="value"
                >
                  {{ value }}
                </el-option>
              </el-select>
            </div>
            <!--end::Input-->
          </div>
          <div class="col-3 mr-8">
            <!--begin::Input-->
            <div>
              <el-select
                class="form-select-solid"
                :placeholder="$t('walletGeneral.selectCoin')"
                v-model="coinSelect"
                clearable
                filterable
              >
                <el-option
                  v-for="coin in listCoin"
                  :value="coin"
                  :key="coin"
                  :label="coin"
                >
                  {{ coin }}
                </el-option>
              </el-select>
            </div>
            <!--end::Input-->
          </div>
          <div class="col-3 mr-8">
            <date-range-picker-options
              :start-placeholder="$t('walletGeneral.from')"
              :end-placeholder="$t('walletGeneral.to')"
              v-model="dateRange"
              clearable
              format="YYYY-MM-DD"
            ></date-range-picker-options>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-12 text-uppercase">
            <button
              class="btn btn-primary me-2 mb-1"
              title="Search"
              @click="getData"
            >
              <i class="fas fa-search fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
            </button>
            <button
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
              class="btn btn-primary me-2 mb-1"
              :disabled="loadingExport"
              @click="exportWithdraw"
              :title="$t('walletGeneral.export')"
            >
              <i v-if="!loadingExport" class="fas fa-download fa-fw"></i>
              <i v-if="loadingExport" class="fas fa-spinner fa-spin fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{
                $t('walletGeneral.export')
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
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
                        <slot
                          v-if="cell.key === 'transaction_hash_url'"
                          :name="`cell-${cell.key}`"
                          :row="item"
                        >
                          <a
                            v-if="item[cell.key]"
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                            :href="item[cell.key]"
                            target="_blank"
                          >
                            {{ item['transaction_hash'] }}
                          </a>
                          <span
                            v-else
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                          >
                            {{ item['transaction_hash'] }}
                          </span>
                        </slot>
                        <slot v-else :name="`cell-${cell.key}`" :row="item">
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
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
                        :disabled="
                          ![
                            WITHDRAW_TRANSACTION_STATUS.FAILED_SIGN,
                            WITHDRAW_TRANSACTION_STATUS.FAILED_CHECK_CONFIRMATION,
                          ].includes(item.status) ||
                          (item.interactor === WITHDRAWINTERACTOR.USER &&
                            item.status ===
                              WITHDRAW_TRANSACTION_STATUS.FAILED_SIGN &&
                            item.domain === DOMAIN.WITHDRAW)
                        "
                        @click="onOpenRetryDialog(item)"
                      >
                        {{ $t('walletGeneral.retry') }}
                      </button>
                      <button
                        class="btn btn-danger text-nowrap"
                        :disabled="
                          ![
                            WITHDRAW_TRANSACTION_STATUS.IN_SIGNING_QUEUE,
                            WITHDRAW_TRANSACTION_STATUS.IN_CONFIRMATION_QUEUE,
                          ].includes(item.status)
                        "
                        @click="stopProcessingWithdraw(item.id)"
                      >
                        {{ $t('walletGeneral.stop') }}
                      </button>
                      <button
                        class="btn btn-primary text-nowrap"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_detail_withdraw_modal"
                        @click="openDetail(item.id)"
                      >
                        <span>
                          {{ $t('walletGeneral.detail') }}
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
    <Form @submit="retryWithdrawTransaction">
      <el-dialog
        v-model="openRetryDialog"
        :title="$t('walletGeneral.retryWithdraw')"
        :before-close="onCloseRetryDialog"
        center
      >
        <div class="row w-75 m-auto">
          <label class="col-6 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.withdrawId')
          }}</label>
          <span class="col-6">{{ retryTransaction?.id }}</span>
        </div>

        <div
          class="row w-75 mt-5 m-auto"
          v-if="
            retryTransaction?.status ===
              WITHDRAW_TRANSACTION_STATUS.FAILED_SIGN &&
            ['btc', 'bch', 'ltc'].includes(retryTransaction?.chain_code)
          "
        >
          <label class="col-6 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.feeLimit')
          }}</label>
          <div class="col-6">
            <Field
              v-model="retryFeeLimit"
              name="retryFeeLimit"
              v-slot="{ field, errorMessage }"
              :rules="`required|min:0.00004`"
            >
              <input v-bind="field" class="form-control" />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div
          class="row w-75 mt-5 m-auto"
          v-if="
            retryTransaction?.status ===
              WITHDRAW_TRANSACTION_STATUS.FAILED_SIGN &&
            ['erc20', 'bep20', 'eth', 'bnb'].includes(
              retryTransaction?.chain_code,
            )
          "
        >
          <label class="col-6 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.gasLimit')
          }}</label>
          <div class="col-6">
            <Field
              v-model="retryGasLimit"
              name="retryGasLimit"
              v-slot="{ field, errorMessage }"
              :rules="`required|min:21000`"
            >
              <input v-bind="field" class="form-control" />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer text-center">
            <el-button
              type="primary"
              native-type="submit"
              :disabled="loadingRetry"
            >
              <i v-if="loadingRetry" class="fas fa-spinner fa-spin fa-fw"></i>
              {{ $t('submit') }}</el-button
            >
            <el-button @click="onCloseRetryDialog" :disabled="loadingRetry">{{
              $t('cancel')
            }}</el-button>
          </span>
        </template>
      </el-dialog>
    </Form>
    <DetailWithdrawModal
      :transactionId="detailWithdrawId"
      :close="(detailWithdrawId = 0)"
    />
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
import { IPagination } from '@/core/data/deposit'
import moment from 'moment'
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import {
  WITHDRAW_TRANSACTION_STATUS,
  DOMAIN,
  WITHDRAWINTERACTOR,
  LIMIT_EXPORT_MONTHS,
} from '@/models/hot-wallet/HotWalletType'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'
import { useI18n } from 'vue-i18n'
import { Field, Form } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import Swal from 'sweetalert2'
import DetailWithdrawModal from '@/components/wallet/DetailWithdrawModal.vue'

export default defineComponent({
  components: {
    Form,
    Field,
    ErrorDisplay,
    DetailWithdrawModal,
  },
  setup() {
    const tableHeader = ref([
      {
        name: 'id',
        key: 'id',
        sortable: false,
      },
      {
        name: 'walletGeneral.status',
        key: 'status',
        sortable: false,
      },
      {
        name: 'walletGeneral.from',
        key: 'from',
        sortable: false,
      },
      {
        name: 'walletGeneral.to',
        key: 'to',
        sortable: false,
      },
      {
        name: 'walletGeneral.coin',
        key: 'symbol',
        sortable: false,
      },
      {
        name: 'walletGeneral.balance',
        key: 'amount',
        sortable: true,
      },
      {
        name: 'walletGeneral.transactionHash',
        key: 'transaction_hash_url',
        sortable: false,
        minWidth: 150,
      },
      {
        name: 'walletGeneral.transactionId',
        key: 'bce_transaction_transaction_id',
        sortable: false,
      },
      {
        name: 'walletGeneral.createdDate',
        key: 'created_at',
        sortable: true,
        minWidth: 150,
      },
    ])

    const i18n = useI18n()

    const getFilterParams = () => {
      let p: any = {
        page: pagination.value.page,
        size: pagination.value.rowsPerPage,
        sort_type: sortType.value,
        sort: sort.value,
        lang: i18n.locale.value,
      }

      if (coinSelect.value) {
        p.symbol = coinSelect.value.toLowerCase()
      }

      if (searchAddress.value) {
        p.search_address = searchAddress.value.toLowerCase()
      }

      if (searchTransactionHash.value) {
        p.search_transaction_hash = searchTransactionHash.value.toLowerCase()
      }

      if (searchTransactionId.value) {
        p.search_transaction_id = searchTransactionId.value.toLowerCase()
      }

      if (statusSelect.value) {
        p.status = statusSelect.value
      }

      if (dateRange.value && dateRange.value.length) {
        const [fromDate, toDate] = dateRange.value

        p.from_date = fromDate
        p.to_date = toDate
      }

      return p
    }

    const getTransactionHashUrl = ({
      coin,
      chainCode,
      transactionHash,
    }: {
      coin: string
      chainCode: string
      transactionHash: string
    }) => {
      const coinData = listCoinRaw.value[coin]

      if (!coinData) {
        return
      }
      const networksData = coinData.networks || []

      const coinDataNetwork =
        networksData.find((networkData) => networkData.network === chainCode) ||
        networksData[0]

      if (!coinDataNetwork) {
        return
      }

      const transactionTxPath = coinDataNetwork.transactionTxPath
      return transactionTxPath.replace('{$transaction_id}', transactionHash)
    }

    const getData = () => {
      const p = getFilterParams()
      loading.value = true

      WalletSettingService.getWithDrawList(p).then((res) => {
        if (res.data) {
          const responseData = res.data.data || []

          pagination.value.total = res.data.total_count || 0

          items.value = responseData.map((item) => {
            item.created_at = moment
              .unix(+item.created_at / 1000)
              .format('YYYY-MM-DD HH:mm')

            /**
             * * Map transaction_hash url
             */
            const coinData = listCoinRaw.value[item.symbol]

            if (coinData && item.transaction_hash) {
              const transactionHashUrl = getTransactionHashUrl({
                coin: item.symbol,
                chainCode: item.chain_code,
                transactionHash: item.transaction_hash,
              })

              if (transactionHashUrl) {
                item.transaction_hash_url = transactionHashUrl
              }
            }

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
      setCurrentPageBreadcrumbs(
        'menu.walletSub.walletService.withdrawTransaction',
        ['menu.wallet', 'menu.walletSub.walletService.index'],
      )
      store.dispatch(Actions.FETCH_LIST_COIN)
      store.dispatch(Actions.FETCH_LIST_COIN_RAW)
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

    const listCoinRaw = computed(() => {
      return store.getters.listCoinRaw
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
    const searchAddress = ref('')
    const searchTransactionHash = ref('')
    const searchTransactionId = ref('')
    const dateRange = ref([])
    const loading = ref(false)
    const loadingExport = ref(false)
    const loadingRetry = ref(false)
    const openRetryDialog = ref(false)
    const retryTransaction = ref()
    const retryFeeLimit = ref(0.00004)
    const retryGasLimit = ref(21000)
    const detailWithdrawId = ref(0)

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
      searchAddress.value = ''
      searchTransactionHash.value = ''
      searchTransactionId.value = ''
      dateRange.value = []

      getData()
    }

    const exportWithdraw = () => {
      const params = getFilterParams()

      const fromDate = params.from_date ? moment(params.from_date) : moment()
      const toDate = params.to_date ? moment(params.to_date) : moment()
      if (toDate.diff(fromDate, 'months', true) > LIMIT_EXPORT_MONTHS) {
        toastr.error(
          t('walletGeneral.failedExportTooFar', { month: LIMIT_EXPORT_MONTHS }),
        )
        return
      }

      loadingExport.value = true

      WalletSettingService.exportWithdrawTransactions(params)
        .then((result) => {
          if (result?.data?.data?.path) {
            downloadFileWithoutPopUp(result?.data?.data?.path, 'export.xlsx')
            toastr.success(t('walletGeneral.exportSucceed'))
            return
          }

          toastr.error(t('walletGeneral.exportFailed'))
        })
        .catch((error) => {
          console.log(error)
          toastr.error(t('walletGeneral.exportFailed'))
        })
        .finally(() => {
          loadingExport.value = false
        })
    }

    const onOpenRetryDialog = (transaction) => {
      retryTransaction.value = transaction
      openRetryDialog.value = true
    }

    const onCloseRetryDialog = () => {
      openRetryDialog.value = false
      retryFeeLimit.value = 0.00004
      retryGasLimit.value = 21000
    }

    const retryWithdrawTransaction = () => {
      loadingRetry.value = true
      WalletSettingService.retryWithdrawTransaction(
        retryTransaction.value?.id,
        {
          fee_limit: retryFeeLimit.value,
          gas_limit: retryGasLimit.value,
        },
      )
        .then((result) => {
          if (result?.data?.data) {
            toastr.success(t('walletGeneral.succeedRetryWithdraw'))
            onCloseRetryDialog()
            getData()
            return
          }

          toastr.error(t('walletGeneral.failedRetryWithdraw'))
        })
        .catch((error) => {
          console.log(error)
          toastr.error(t(error))
        })
        .finally(() => {
          loadingRetry.value = false
        })
    }

    const stopProcessingWithdraw = (id) => {
      Swal.fire({
        icon: 'warning',
        title: t('walletGeneral.forceStopTitle'),
        html: t('walletGeneral.confirmStopWithdraw'),
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-secondary',
        },
        buttonsStyling: false,
        confirmButtonText: t('walletGeneral.stop'),
        cancelButtonText: t('cancel'),
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const result = await WalletSettingService.stopWithdrawTransaction(id)
          if (result.data?.data?.result) {
            toastr.success(t('walletGeneral.succeedStopWithdraw'))
            getData()
            return true
          }

          toastr.error(t('walletGeneral.failedStopWithdraw'))
          return true
        },
      })
    }

    const openDetail = (id) => {
      detailWithdrawId.value = id
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
      listCoinRaw,
      listStatus,
      WITHDRAW_TRANSACTION_STATUS,
      DOMAIN,
      WITHDRAWINTERACTOR,

      coinSelect,
      statusSelect,
      searchAddress,
      searchTransactionHash,
      searchTransactionId,
      dateRange,
      sortType,
      sortColumn,
      SortType,
      isSorting,
      resetSearch,
      exportWithdraw,
      loadingExport,
      openRetryDialog,
      onOpenRetryDialog,
      retryTransaction,
      retryFeeLimit,
      retryGasLimit,
      retryWithdrawTransaction,
      onCloseRetryDialog,
      loadingRetry,
      stopProcessingWithdraw,
      openDetail,
      detailWithdrawId,
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
