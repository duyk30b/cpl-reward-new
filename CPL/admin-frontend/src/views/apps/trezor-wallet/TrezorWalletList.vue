<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-4" style="padding-left: 0">
        <div class="row">
          <div class="col-6 text-start">
            <el-select
              class="form-select-solid me-4"
              :placeholder="$t('walletGeneral.selectCoin')"
              v-model="coinSelect"
              clearable
              filterable
              style="max-width: 150px"
              @change="getData"
            >
              <el-option
                v-for="coin in listCoin"
                :value="coin.coin"
                :key="coin.coin"
                :label="coin.coin.toUpperCase()"
              >
                {{ coin.coin.toUpperCase() }}
              </el-option>
            </el-select>
            <el-select
              class="form-select-solid"
              :placeholder="$t('walletGeneral.selectCoin')"
              v-model="statusSelect"
              filterable
              style="max-width: 150px"
              @change="getData"
            >
              <el-option
                v-for="status in TREZOR_WALLET_STATUS"
                :value="status"
                :key="status"
                :label="status"
              >
                {{ status.toUpperCase() }}
              </el-option>
            </el-select>
          </div>
          <div class="col-6 text-end">
            <button
              class="btn btn-primary"
              :disabled="selected.length === 0"
              @click="onCollectSelectedWallets"
            >
              {{
                $t('walletGeneral.collectSelectedWallet', {
                  number: selected.length,
                })
              }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="dataTables_wrapper dt-bootstrap4 no-footer">
        <div class="table-responsive table-sticky">
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
                <th>
                  <label
                    class="form-checkbox"
                    style="position: relative; top: 3px"
                  >
                    <input
                      type="checkbox"
                      v-model="selectAll"
                      @click="changeSelectAll"
                      :disabled="disabledMultipleCollect"
                      :checked="selectAll"
                    />
                  </label>
                </th>
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
                      cell.headerClass,
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
              </tr>
            </thead>
            <tbody class="fw-bold text-gray-600">
              <template v-if="items && items.length">
                <template v-for="(item, i) in items" :key="i">
                  <tr class="odd">
                    <td>
                      <label class="form-checkbox">
                        <input
                          type="checkbox"
                          :value="item.id"
                          v-model="item.is_selected"
                          :disabled="disabledMultipleCollect"
                          @click="changeSelect(item)"
                        />
                        <i class="form-icon"></i>
                      </label>
                    </td>
                    <template v-for="(cell, i) in tableHeader" :key="i">
                      <td
                        :class="{
                          [cell.className]: cell.className,
                        }"
                      >
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <span
                            v-if="cell.key == 'status'"
                            :class="{
                              badge,
                              'badge-light-danger':
                                item.status === TREZOR_WALLET_STATUS.PENDING,
                              'badge-light-warning':
                                item.status === TREZOR_WALLET_STATUS.PROCESSING,
                              'badge-light-success':
                                item.status === TREZOR_WALLET_STATUS.DONE,
                            }"
                          >
                            {{ item[cell.key] }}
                          </span>
                          <span
                            v-else-if="cell.key !== 'action'"
                            :class="{
                              'text-uppercase': cell.key === 'symbol',
                              [cell.spanClassName]: cell.spanClassName,
                            }"
                          >
                            {{ item[cell.key] }}
                          </span>
                          <div class="text-center" v-else>
                            <button
                              :disabled="
                                item.status !== TREZOR_WALLET_STATUS.PENDING
                              "
                              class="btn btn-primary btn-sm"
                              @click="onCollectWallet(item)"
                            >
                              {{ $t('walletGeneral.collect') }}
                            </button>
                          </div>
                        </slot>
                      </td>
                    </template>
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
              style="margin-top: 50px"
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
                  v-model="pagination.size"
                  name="kt_customers_table_length"
                  class="form-select form-select-sm form-select-solid"
                  @change="setItemsPerPage"
                >
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                </select></label
              >
              <span v-if="items && items.length" class="ms-4">
                {{
                  $t('tableDisplayResult', {
                    start: (pagination.page - 1) * pagination.size + 1,
                    end: (pagination.page - 1) * pagination.size + items.length,
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
              :page-size="pagination.size"
              layout="prev, pager, next"
              :total="pagination.total"
              :hide-on-single-page="false"
              background
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <TrezorWalletModal
        :wallets="collectWallets"
        :receiver="receiverAddress"
        :coins="listCoin"
        @close="onCloseCollectModal"
        ref="collectorTrezorModal"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue'
import { Actions } from '@/store/enums/StoreEnums'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'
import { useStore } from 'vuex'
import {
  CollectorAddress,
  TrezorWallet,
  TREZOR_WALLET_STATUS,
} from '@/models/trezor-wallet/TrezorWallet'
import _ from 'lodash'
import { WalletSettingService } from '@/services/WalletSettingService'
import { plainToInstance } from 'class-transformer'
import TrezorWalletModal from '@/components/wallet/TrezorWalletModal.vue'
import { CoinItem } from '@/models/setting-exchange/CoinSetting'
import { SUPPORTED_MULTIPLE_ADDRESS } from '@/core/helpers/trezor-connector'
import TrezorConnect from 'trezor-connect'
import CONFIG from '@/config'
import { GlobalWithdrawalSettingListPagination } from '@/models/setting-withdrawal/GlobalWithdrawal'

export default defineComponent({
  components: {
    TrezorWalletModal,
  },
  setup() {
    const tableHeader = ref([
      {
        name: 'walletGeneral.address',
        key: 'address',
        sortable: false,
      },
      {
        name: 'walletGeneral.coin',
        key: 'symbol',
        sortable: false,
      },
      {
        name: 'walletGeneral.hdPath',
        key: 'path',
        sortable: false,
      },
      {
        name: 'walletGeneral.balance',
        key: 'balance',
        sortable: true,
      },
      {
        name: 'walletGeneral.status',
        key: 'status',
        sortable: false,
      },
      {
        name: 'action',
        key: 'action',
        sortable: false,
        headerClass: 'text-center',
      },
    ])

    const app = getCurrentInstance()
    const toastr = app?.appContext.config.globalProperties.$toastr
    const t = app?.appContext.config.globalProperties.$t

    const store = useStore()

    const tableReloadKey = ref(0)
    const items = ref([] as TrezorWallet[])
    const selectAll = ref(false)
    const selected = ref([] as TrezorWallet[])
    const collectWallets = ref([] as TrezorWallet[]) // user selected addressed to collect
    const collectorAddresses = ref([] as CollectorAddress[]) // list receiver address

    const coinSelect = ref()
    const statusSelect = ref(TREZOR_WALLET_STATUS.PENDING)
    const loading = ref(false)
    const sort = ref('')
    const sortType = ref('')
    const receiverAddress = ref<CollectorAddress>()
    const collectorTrezorModal = ref<HTMLElement | null>(null)

    // paginate
    const page = ref(1)
    const total = ref(0)
    const size = ref(10)
    const pagination = ref<GlobalWithdrawalSettingListPagination>({
      page: page.value,
      total: total.value,
      size: size.value,
    })

    const supportedCollectCoins = [
      'btc',
      'bch',
      'ltc',
      'xrp',
      'eth',
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
      'usdt',
      'venus',
      'wpc',
    ]

    const disabledMultipleCollect = ref(false)

    /**
     * Initital data methods
     */
    const getData = async () => {
      loading.value = true

      try {
        const symbol = {
          symbol: coinSelect.value,
          sort: sort.value,
          sort_type: sortType.value,
          page: pagination.value.page,
          size: pagination.value.size,
          status: statusSelect.value,
        }

        const res = await WalletSettingService.getTrezorWallet(symbol)

        disabledMultipleCollect.value =
          !SUPPORTED_MULTIPLE_ADDRESS.includes(coinSelect.value) ||
          statusSelect.value !== TREZOR_WALLET_STATUS.PENDING
        selectAll.value = false
        selected.value = []

        items.value = plainToInstance(TrezorWallet, res.data.data as [])
        pagination.value.total = res.data.total_count

        await getReceiverAddresses()
      } catch (error) {
        console.log(error)
      }
      loading.value = false
    }

    const getReceiverAddresses = async () => {
      const res = await WalletSettingService.getCollectorAddress()
      collectorAddresses.value = res.data.data
    }

    /**
     * Component 's lifecycle methods
     */
    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs('menu.trezorWallet', [])
      getData()
      store.dispatch(Actions.FETCH_LIST_COIN_RAW)
      TrezorConnect.init({
        lazyLoad: true,
        manifest: {
          email: 'nguyennhattan@cryptopie-labo.com',
          appUrl: CONFIG.APP_URL,
        },
      })
    })

    /**
     * Computed data
     */
    const listCoin = computed(() => {
      return (
        Object.values(store.getters.listCoinRaw) as Array<CoinItem>
      ).filter((coin: CoinItem) => supportedCollectCoins.includes(coin.coin))
    })

    /**
     * Handle event
     */
    const changeSelect = (changedItem: TrezorWallet) => {
      items.value.forEach((item) => {
        if (item.id === changedItem.id) {
          item.is_selected = !item.is_selected
        }
      })

      if (
        selected.value.findIndex((wallet) => wallet.id === changedItem.id) !==
        -1
      ) {
        selected.value = selected.value.filter(
          (item) => item.id !== changedItem.id,
        )

        if (selectAll.value) {
          selectAll.value = false
        }
      } else {
        selected.value.push(changedItem)

        if (selected.value.length === items.value.length) {
          selectAll.value = true
        }
      }
    }

    const changeSelectAll = () => {
      selectAll.value = !selectAll.value

      items.value.forEach((item) => {
        item.is_selected = selectAll.value
      })

      if (selectAll.value) {
        selected.value = items.value
        return
      }

      selected.value = []
    }

    const currentPageChange = () => {
      getData()
    }

    const setItemsPerPage = () => {
      pagination.value.page = 1
      pagination.value.size = +pagination.value.size
      getData()
    }

    const getSortKey = (col: IColumnConfig) => {
      return col.sortKey || col.key
    }

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

    const onCollectWallet = (item: TrezorWallet) => {
      // validate wallet
      const availAddress = collectorAddresses.value.find(
        (address) => address.chainCode === item.chainCode,
      )

      if (!availAddress) {
        toastr.error(
          t('walletGeneral.unavailableReceiverAddress', {
            chain: item.chainCode.toUpperCase(),
          }),
        )
        return
      }

      receiverAddress.value = availAddress
      collectWallets.value = [item]

      const modalComponent = collectorTrezorModal.value as any
      modalComponent.showModal()
    }

    const onCloseCollectModal = (success) => {
      if (!success) {
        return
      }

      selected.value = []
      collectWallets.value = []
      selectAll.value = false

      getData()
    }

    const onCollectSelectedWallets = () => {
      if (!selected.value.length) {
        return
      }

      const availAddress = collectorAddresses.value.find(
        (address) => address.chainCode === selected.value[0].chainCode,
      )
      if (!availAddress) {
        toastr.error(
          t('walletGeneral.unavailableReceiverAddress', {
            chain: selected.value[0].chainCode.toUpperCase(),
          }),
        )
        return
      }

      receiverAddress.value = availAddress
      collectWallets.value = selected.value

      const modalComponent = collectorTrezorModal.value as any
      modalComponent.showModal()
    }

    return {
      loading,
      tableHeader,
      items,
      tableReloadKey,
      pagination,
      currentPageChange,
      setItemsPerPage,
      size,

      getData,
      listCoin,

      coinSelect,
      statusSelect,
      sortType,
      sortColumn,
      SortType,
      isSorting,
      selectAll,
      selected,
      changeSelect,
      changeSelectAll,
      onCollectWallet,
      onCloseCollectModal,
      onCollectSelectedWallets,

      collectWallets,
      receiverAddress,

      collectorTrezorModal,
      disabledMultipleCollect,

      TREZOR_WALLET_STATUS,
    }
  },
})
</script>
<style lang="scss" scoped>
.usdt-form-input {
  display: flex;
  align-items: center;
}

.mw-120 {
  min-width: 120px;
}

.mr-10 {
  margin-right: 10px;
}

[disabled] {
  cursor: not-allowed !important;
  pointer-events: auto !important;
}
.mw-150px {
  min-width: 150px;
}
.mw-200px {
  min-width: 200px;
}
.modal-dialog {
  width: 32em !important;
}
.modal-header {
  border-bottom: 0 none !important;
  justify-content: center !important;
  padding: 1.5rem !important;
}
.modal-warning-text {
  font-weight: normal;
  font-size: 1.1rem;
  margin-top: 1.5rem;
  color: #3f4254;
}
.table-sticky {
  max-height: 66vh;
  thead {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 1;
  }
}
.btn-search {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.input-keyword {
  align-items: flex-start;
  .el-select {
    flex: 1;
    max-width: 150px;
  }
}
.reset-btn {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.ml-10px {
  margin-left: 10px;
}
.fs-italic {
  font-style: italic;
}
</style>
