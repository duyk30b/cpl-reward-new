<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-body pt-4" style="padding-left: 0">
        <div class="row mb-4">
          <div class="col-6">
            <div class="d-flex input-keyword" style="flex-direction: column">
              <div class="d-flex mb-4">
                <div class="form-input usdt-form-input">
                  <span class="mw-150 fw-bold">{{
                    $t('walletGeneral.usdtValueByCoin')
                  }}</span>
                  <imask-input
                    v-model.lazy="usdtFeeAmount"
                    :mask="/^([0-9]\d{0,8}|0)(\.\d{0,8})?$/"
                    class="form-control"
                    @change="changeUsdtFeeValue"
                  />
                </div>
              </div>
              <div class="d-flex">
                <div class="form-input usdt-form-input mr-10">
                  <span class="mw-150 fw-bold">{{
                    $t('walletGeneral.usdtValueByCastle')
                  }}</span>
                  <imask-input
                    v-model.lazy="usdtFeeCastleAmount"
                    class="form-control"
                    @change="changeUsdtFeeCastleValue"
                    :mask="/^([0-9]\d{0,8}|0)(\.\d{0,8})?$/"
                  />
                </div>
                <button
                  class="btn btn-primary text-nowrap"
                  @click="onSubmit"
                  :disabled="isNotValidUsdtFee || isNotValidUsdtCastleFee"
                >
                  <span>
                    {{ $t('walletGeneral.apply') }}
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div class="col-6">
            <div class="d-flex input-keyword justify-content-end">
              <el-select
                class="form-select-solid"
                :placeholder="$t('walletGeneral.selectCoin')"
                v-model="coinSelect"
                clearable
                filterable
                style="max-width: 150px"
                @change="getData"
              >
                <el-option
                  v-for="coin in currentListCoin"
                  :value="coin"
                  :key="coin"
                  :label="coin"
                >
                  {{ coin }}
                </el-option>
              </el-select>
              <el-select
                class="form-select-solid ml-10px"
                :placeholder="$t('currencyScreen.network')"
                v-model="network"
                clearable
                filterable
                @change="getData"
              >
                <el-option
                  v-for="network in allNetworks"
                  :value="network"
                  :key="network"
                  :label="network.toUpperCase()"
                >
                </el-option>
              </el-select>
              <el-select
                class="form-select-solid ml-10px"
                :placeholder="$t('walletGeneral.applied')"
                v-model="appliedType"
                clearable
                filterable
                @change="getData"
              >
                <el-option
                  v-for="appliedType in appliedGlobalSettingTypes"
                  :value="appliedType"
                  :key="appliedType"
                  :label="$t(`walletGeneral.${appliedType}`).toUpperCase()"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-2">
            <div class="d-flex input-keyword" style="height: 20px">
              <div v-if="selected.length" class="form-input usdt-form-input">
                <span class="mr-5 fw-bold fs-italic"
                  >{{
                    $t('walletGeneral.selectedItems', {
                      number: selected.length,
                    })
                  }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="isNotValidUsdtFee || isNotValidUsdtCastleFee"
          class="row-mb-4"
        >
          <span role="alert" class="text-danger" style="margin-left: 150px">{{
            $t('walletGeneral.minimumUsdtFeeValue')
          }}</span>
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
                    />
                    <i class="form-icon"></i>
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
                          :value="i.coin"
                          v-model="item.selected"
                          :disabled="item.appliedGlobalSetting === 'yes'"
                          @click="changeSelect(item.coin)"
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
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code' ||
                                cell.key === 'currency',
                              [cell.spanClassName]: cell.spanClassName,
                              'badge-light-success':
                                cell.key === 'appliedGlobalSetting' &&
                                item[cell.key] === 'yes',
                              'badge-light-danger':
                                cell.key === 'appliedGlobalSetting' &&
                                item[cell.key] === 'no',
                            }"
                          >
                            {{
                              cell.key === 'appliedGlobalSetting'
                                ? $t('walletGeneral.' + item[cell.key])
                                : item[cell.key]
                            }}
                          </span>
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

        <!-- <div class="row">
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
        </div> -->
      </div>
      <hr />
      <el-button class="btn btn-light" @click="back">
        {{ $t('back') }}
      </el-button>
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
import {
  WITHDRAW_TRANSACTION_STATUS,
  DOMAIN,
  WITHDRAWINTERACTOR,
} from '@/models/hot-wallet/HotWalletType'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'
import { useStore } from 'vuex'
import {
  APPLIED_GLOBAL_SETTING,
  ESpecialCoin,
  // GlobalWithdrawalSettingListPagination,
  GlobalWithdrawUsdtFeeModel,
  IGlobalWithdrawalSettingFilterParams,
  IPairPriceGroupByCoin,
} from '@/models/setting-withdrawal/GlobalWithdrawal'
import { SettingWithdrawalService } from '@/services/SettingWithdrawalService'
import { ElMessageBox } from 'element-plus'
import BigNumber from 'bignumber.js'
import { IMaskComponent } from 'vue-imask'
import { useRouter } from 'vue-router'
// import _ from 'lodash'

const CustomBN = BigNumber.clone({ DECIMAL_PLACES: 8 })
CustomBN.config({
  EXPONENTIAL_AT: [-256, 256],
})

export default defineComponent({
  components: {
    'imask-input': IMaskComponent,
  },
  setup() {
    const tableHeader = ref([
      {
        name: 'walletGeneral.coin',
        key: 'coin',
        sortable: true,
        className: 'text-uppercase',
      },
      {
        name: 'walletGeneral.price',
        key: 'price',
        sortable: false,
      },
      {
        name: 'walletGeneral.network',
        key: 'network',
        sortable: false,
      },
      {
        name: 'walletGeneral.appliedUsdt',
        key: 'appliedUsdt',
        sortable: false,
      },
      {
        name: 'walletGeneral.beforeValue',
        key: 'beforeValue',
        sortable: false,
      },
      {
        name: 'walletGeneral.afterValue',
        key: 'afterValue',
        sortable: false,
      },
      {
        name: 'walletGeneral.appliedGlobalSetting',
        key: 'appliedGlobalSetting',
        sortable: false,
        spanClassName: 'badge fs-8 fw-bolder',
      },
    ])

    const store = useStore()

    const getData = async () => {
      let params: IGlobalWithdrawalSettingFilterParams = {
        page: 1,
        search: coinSelect.value || undefined,
        sortType: sortType.value || 'ASC',
        sort: sort.value || 'coin',
        size: 1000,
        network: network.value,
        appliedType: appliedType.value,
      }

      loading.value = true

      try {
        const globalSetting = await SettingWithdrawalService.getGlobalSetting()

        usdtFeeAmount.value = globalSetting.usdtFee
        oldUsdtFeeAmount.value = globalSetting.usdtFee

        usdtFeeCastleAmount.value = globalSetting.usdtFeeCastle
        oldUsdtFeeCastleAmount.value = globalSetting.usdtFeeCastle

        const response = await SettingWithdrawalService.getGlobalUsdtFeeSetting(
          params,
          globalSetting.usdtFee,
          globalSetting.usdtFeeCastle,
        )

        // pagination.value = response.pagination
        items.value = response.items
        itemLength.value = response.items.filter(
          (item) => item.appliedGlobalSetting !== APPLIED_GLOBAL_SETTING.YES,
        ).length

        allNetworks.value = response.networks

        /**
         * * Reassign selected
         */
        items.value.forEach((item) => {
          if (selected.value.includes(item.coin)) {
            item.selected = true
          }
        })
        selectAll.value = false

        pairPrices.value = response.pairPrices

        changeCurrentListCoin()

        loading.value = false
      } catch (error) {
        console.log(`[err] > :`, error)
        loading.value = false
      }
    }

    const resetSearch = () => {
      coinSelect.value = ''
      getData()
    }

    const tableReloadKey = ref(0)
    const items = ref([] as GlobalWithdrawUsdtFeeModel[])
    const usdtFeeAmount = ref('0')
    const oldUsdtFeeAmount = ref(usdtFeeAmount.value)
    const usdtFeeCastleAmount = ref('0')
    const oldUsdtFeeCastleAmount = ref(usdtFeeCastleAmount.value)
    const selectAll = ref(false)
    const selected = ref([] as string[])
    const itemLength = ref(0)
    const pairPrices = ref({} as IPairPriceGroupByCoin)

    const changeSelect = (coin: string) => {
      items.value.map((item) => {
        if (item.coin === coin) {
          item.selected = !item.selected
        }

        return item
      })

      if (selected.value.includes(coin)) {
        selected.value = selected.value.filter((item) => item !== coin)

        if (selectAll.value) {
          selectAll.value = false
        }
      } else {
        selected.value.push(coin)

        if (selected.value.length === itemLength.value) {
          selectAll.value = true
        }
      }
    }

    const changeSelectAll = () => {
      const changeValue = !selectAll.value
      selectAll.value = changeValue

      if (changeValue) {
        items.value.forEach((item) => {
          if (item.appliedGlobalSetting !== APPLIED_GLOBAL_SETTING.YES) {
            item.selected = true
          }
        })

        items.value.forEach((item) => {
          if (item.appliedGlobalSetting !== APPLIED_GLOBAL_SETTING.YES) {
            item.selected = true

            if (!selected.value.includes(item.coin)) {
              selected.value.push(item.coin)
            }
          }
        })
      } else {
        items.value.forEach((item) => (item.selected = false))
        selected.value = []
      }
    }

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs('setting.globalWithdrawal.usdtFeeSetting', [
        'setting.globalWithdrawal.index',
      ])
      getData()
      store.dispatch(Actions.FETCH_LIST_COIN)
    })

    const coinSelect = ref()

    // const page = ref(1)
    // const total = ref(0)
    // const size = ref(10)
    // const pagination = ref<GlobalWithdrawalSettingListPagination>({
    //   page: page.value,
    //   total: total.value,
    //   size: size.value,
    // })
    // const currentPageChange = () => {
    //   getData()
    // }

    // const setItemsPerPage = () => {
    //   pagination.value.page = 1
    //   pagination.value.size = +pagination.value.size
    //   getData()
    // }

    const loading = ref(false)

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

    const listCoin = computed(() => {
      return store.getters.listCoin
    })

    const currentListCoin = ref(listCoin.value as string[])

    const changeCurrentListCoin = () => {
      const listCoinData: string[] = []

      items.value.forEach((item) => {
        listCoinData.push(item.coin.toUpperCase())
      })

      currentListCoin.value = listCoinData

      return
    }

    const isNotValidUsdtFee = ref(false)
    const isNotValidUsdtCastleFee = ref(false)

    const changeUsdtFeeValue = (event) => {
      loading.value = true

      usdtFeeAmount.value = new BigNumber(event.target.value || 0).toString()

      if (+usdtFeeAmount.value < 0) {
        isNotValidUsdtFee.value = true
      } else {
        isNotValidUsdtFee.value = false
      }

      if (+usdtFeeCastleAmount.value < 0) {
        isNotValidUsdtCastleFee.value = true
      } else {
        isNotValidUsdtCastleFee.value = false
      }

      items.value.map((item) => {
        let afterValue = +item.pairPrice
          ? new CustomBN(usdtFeeAmount.value || 0)
              .dividedBy(item.pairPrice)
              .dp(item.decimalPlace, BigNumber.ROUND_HALF_EVEN)
              .toString()
          : '-'

        if (afterValue !== '-') {
          afterValue += ` ${item.coin.toUpperCase()}`
        }

        if (item.isActiveCastleFee) {
          let afterCastleValue = +item.castlePrice
            ? new CustomBN(usdtFeeCastleAmount.value || 0)
                .dividedBy(item.castlePrice)
                .dp(item.decimalPlaceCastle, BigNumber.ROUND_HALF_EVEN)
                .toString()
            : '-'

          if (afterCastleValue !== '-') {
            afterCastleValue += ` ${ESpecialCoin.CASTLE.toUpperCase()}`
          }

          afterValue += `/ ${afterCastleValue}`
        }

        item.afterValue = afterValue
      })

      loading.value = false

      oldUsdtFeeAmount.value = usdtFeeAmount.value || ''
      return
    }

    const changeUsdtFeeCastleValue = (event) => {
      loading.value = true

      usdtFeeCastleAmount.value = new BigNumber(
        event.target.value || 0,
      ).toString()

      if (+usdtFeeCastleAmount.value < 0) {
        isNotValidUsdtFee.value = true
      } else {
        isNotValidUsdtFee.value = false
      }

      if (+usdtFeeAmount.value < 0) {
        isNotValidUsdtCastleFee.value = true
      } else {
        isNotValidUsdtCastleFee.value = false
      }

      items.value.map((item) => {
        let afterValue = +item.pairPrice
          ? new CustomBN(usdtFeeAmount.value || 0)
              .dividedBy(item.pairPrice)
              .dp(item.decimalPlace, BigNumber.ROUND_HALF_EVEN)
              .toString()
          : '-'

        if (afterValue !== '-') {
          afterValue += ` ${item.coin.toUpperCase()}`
        }

        if (item.isActiveCastleFee) {
          let afterCastleValue = +item.castlePrice
            ? new CustomBN(usdtFeeCastleAmount.value || 0)
                .dividedBy(item.castlePrice)
                .dp(item.decimalPlaceCastle, BigNumber.ROUND_HALF_EVEN)
                .toString()
            : '-'

          if (afterCastleValue !== '-') {
            afterCastleValue += ` ${ESpecialCoin.CASTLE.toUpperCase()}`
          }

          afterValue += `/ ${afterCastleValue}`
        }

        item.afterValue = afterValue
      })

      loading.value = false

      oldUsdtFeeCastleAmount.value = usdtFeeCastleAmount.value || ''
      return
    }

    const reloadPage = () => {
      selected.value = []
      selectAll.value = false

      getData()
    }

    const onSubmit = () => {
      ElMessageBox.confirm(t('walletGeneral.applyUsdtFeeWarningText'), {
        confirmButtonText: t('submit'),
        cancelButtonText: t('cancel'),
      }).then(async () => {
        loading.value = true

        try {
          const updateGlobalSetting =
            await SettingWithdrawalService.updateGlobalSetting({
              coins: selected.value,
              usdt_fee_amount: usdtFeeAmount.value,
              usdt_fee_castle_amount: usdtFeeCastleAmount.value,
            })

          if (updateGlobalSetting) {
            loading.value = false
            toastr.success(t('menu.walletSettingSub.updateSettingSuccess'))

            reloadPage()
          } else {
            loading.value = false
            toastr.error(t('menu.walletSettingSub.updateSettingFailed'))
          }
        } catch (err) {
          loading.value = false
          toastr.error(t('menu.walletSettingSub.updateSettingFailed'))
        }
      })
    }

    const network = ref('')
    const allNetworks = ref([] as string[])
    const router = useRouter()
    const appliedGlobalSettingTypes = ref(['yes', 'no'])
    const appliedType = ref('')

    const back = () => {
      router.push({
        name: 'walletSetting.globalWithdrawal',
        params: {},
      })
    }

    const app = getCurrentInstance()
    const toastr = app?.appContext.config.globalProperties.$toastr
    const t = app?.appContext.config.globalProperties.$t

    return {
      loading,
      tableHeader,
      items,
      tableReloadKey,
      // pagination,
      // currentPageChange,
      // setItemsPerPage,
      // size,

      getData,
      listCoin,
      WITHDRAW_TRANSACTION_STATUS,
      DOMAIN,
      WITHDRAWINTERACTOR,

      coinSelect,
      sortType,
      sortColumn,
      SortType,
      isSorting,
      resetSearch,

      usdtFeeAmount,
      usdtFeeCastleAmount,
      selectAll,
      selected,
      changeSelect,
      changeSelectAll,
      itemLength,
      changeUsdtFeeValue,
      changeUsdtFeeCastleValue,

      onSubmit,
      isNotValidUsdtFee,
      isNotValidUsdtCastleFee,
      network,
      allNetworks,
      back,
      appliedGlobalSettingTypes,
      appliedType,
      currentListCoin,
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
.mw-150 {
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
