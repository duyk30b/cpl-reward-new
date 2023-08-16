<template>
  <div class="card">
    <div class="card-body pt-4">
      <!-- Search -->
      <div class="d-flex mt-4 mb-4">
        <div class="col-12">
          <div class="d-flex input-keyword">
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
            <button
              class="btn btn-primary btn-search"
              :disabled="loading"
              @click="getData"
              :title="$t('search')"
            >
              <i v-if="!loading" class="fas fa-search fa-fw"></i>
              <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
              <span class="">{{ $t('search') }}</span>
            </button>
            <button
              class="btn btn-primary reset-btn"
              :disabled="loading"
              @click="resetSearch"
              :title="$t('reset')"
            >
              <i v-if="!loading" class="fas fa-sync fa-fw"></i>
              <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
              <span>{{ $t('reset') }}</span>
            </button>
            <button
              class="btn btn-primary text-nowrap ml-auto"
              @click="openUsdtFeeSetting()"
            >
              <i class="fas fa-cog fa-fw"></i>
              <span>
                {{ $t('walletGeneral.usdtFeeSetting') }}
              </span>
            </button>
          </div>
        </div>
      </div>
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
                      isSorting(cell) &&
                        sortType === SortType.DESC &&
                        'sorting_desc',
                      isSorting(cell) &&
                        sortType === SortType.ASC &&
                        'sorting_asc',
                      cell.class,
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
                <template v-for="(item, itemIndex) in items" :key="itemIndex">
                  <tr class="odd">
                    <template
                      v-for="(cell, cellIndex) in tableHeader"
                      :key="cellIndex"
                    >
                      <td
                        v-if="cell.key !== 'action'"
                        :class="{
                          'text-end': tableHeader.length - 1 === cellIndex,
                          [cell.className]: cell.className,
                          'max-width-250': 1,
                        }"
                      >
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key === 'no'"
                        >
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                          >
                            {{
                              (pagination.page - 1) * pagination.size +
                              1 +
                              itemIndex
                            }}
                          </span>
                        </slot>
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key === 'coin'"
                        >
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                          >
                            {{ item[cell.key].toUpperCase() }}
                          </span>
                        </slot>
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key === 'withdrawalEnable'"
                        >
                          <span
                            :class="{
                              [cell.spanClassName]: cell.spanClassName,
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                              'badge-light-success': !!item[cell.key],
                              'badge-light-danger': !item[cell.key],
                            }"
                          >
                            {{
                              item[cell.key]
                                ? $t('walletGeneral.on')
                                : $t('walletGeneral.off')
                            }}
                          </span>
                        </slot>
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key === 'maximumResetTime'"
                        >
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                          >
                            {{
                              item[cell.key] > 1
                                ? `${item[cell.key]} Days`
                                : `${item[cell.key]} Day`
                            }}
                          </span>
                        </slot>
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="
                            cell.key === 'minimumWithdrawal' ||
                            cell.key === 'maximumWithdrawal' ||
                            cell.key === 'autoWithdrawalThreshold'
                          "
                        >
                          <span
                            :class="{
                              'text-uppercase':
                                cell.key === 'symbol' ||
                                cell.key === 'chain_code',
                            }"
                          >
                            {{ `${item[cell.key]}` }}
                          </span>
                        </slot>

                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key === 'feeTypes'"
                        >
                          <span :class="'text-uppercase'">
                            {{ item[cell.key].join(', ') }}
                          </span>
                        </slot>
                        <slot
                          :name="`cell-${cell.key}`"
                          :row="item"
                          v-if="cell.key === 'feeAmounts'"
                        >
                          <span :class="'text-uppercase'">
                            {{ item[cell.key].join('/ ') }}
                          </span>
                        </slot>
                      </td>
                      <td v-else>
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <div class="d-flex align-items-center">
                            <button
                              class="btn btn-sm btn-primary mr-2 text-nowrap"
                              @click="openEdit(item)"
                            >
                              {{ $t('edit') }}
                            </button>
                          </div>
                        </slot>
                      </td>
                    </template>
                  </tr>
                </template>
              </template>
              <tr class="odd" v-else>
                <td :colspan="6" class="text-center">
                  {{ $t('noData') }}
                </td>
              </tr>
            </tbody>
            <div
              v-if="loading"
              class="overlay-layer card-rounded bg-dark bg-opacity-5"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('loading') }}...</span>
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
                  @change="getData"
                >
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select></label
              >
              <span class="ms-3" v-if="items && items.length">
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
    </div>
    <SettingGlobalWithdrawalModal
      :item="itemEdit"
      :pairPrices="pairPrices"
      :globalUsdtAmount="globalUsdtAmount"
      :globalUsdtCastleAmount="globalUsdtCastleAmount"
      @updateData="updateData"
      @close="handleModalClose"
      v-if="isOpenModal"
    />
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud, formatUTCDate } from '@/core/helpers/common.helper'
import { computed, defineComponent, onMounted, ref, toRaw } from 'vue'
import { SettingWithdrawalService } from '@/services/SettingWithdrawalService'
import SettingGlobalWithdrawalModal from '../modal/SettingGlobalWithdrawalModal.vue'
// import { useI18n } from 'vue-i18n/index'
// import { useRouter } from 'vue-router'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'
import {
  GlobalWithdrawalSettingModel,
  IGlobalWithdrawalSettingFilterParams,
  GlobalWithdrawalSettingListPagination,
  IPairPriceGroupByCoin,
} from '@/models/setting-withdrawal/GlobalWithdrawal'
import { plainToClass } from 'class-transformer'
import { useStore } from 'vuex'
import { Actions } from '@/store/enums/StoreEnums'
import router from '@/router'

export default defineComponent({
  components: {
    SettingGlobalWithdrawalModal,
  },
  setup() {
    const tableHeader = ref([
      {
        name: 'numericOrder',
        key: 'no',
        sortable: false,
        minWidth: 50,
      },
      {
        name: 'walletGeneral.coin',
        key: 'coin',
        sortable: true,
        minWidth: 100,
      },
      {
        name: 'walletGeneral.withdrawalEnable',
        key: 'withdrawalEnable',
        sortable: false,
        minWidth: 100,
        spanClassName: 'badge fs-8 fw-bolder',
      },
      {
        name: 'walletGeneral.minimumWithdrawal',
        key: 'minimumWithdrawal',
        sortable: false,
        minWidth: 100,
      },
      {
        name: 'walletGeneral.maximumWithdrawal',
        key: 'maximumWithdrawal',
        sortable: false,
        minWidth: 150,
      },
      {
        name: 'walletGeneral.maximumResetTime',
        key: 'maximumResetTime',
        sortable: false,
        minWidth: 100,
      },
      {
        name: 'walletGeneral.withdrawalThreshold',
        key: 'autoWithdrawalThreshold',
        sortable: false,
        minWidth: 150,
      },
      {
        name: 'walletGeneral.feeType',
        key: 'feeTypes',
        sortable: false,
        minWidth: 150,
      },
      {
        name: 'walletGeneral.fee',
        key: 'feeAmounts',
        sortable: false,
        minWidth: 300,
      },
      {
        name: 'action',
        key: 'action',
        sortable: false,
      },
    ])
    const store = useStore()

    const pairPrices = ref({} as IPairPriceGroupByCoin)

    const getPairPrices = async () => {
      try {
        const response = await SettingWithdrawalService.getPairPrices()

        if (response.pairPrices) {
          pairPrices.value = response.pairPrices
        }
      } catch (error) {
        console.log(`[error] > :`, error)
      }
    }

    const getData = async () => {
      let params: IGlobalWithdrawalSettingFilterParams = {
        page: pagination.value.page,
        search: coinSelect.value || undefined,
        sortType: sortType.value,
        sort: sort.value,
        size: pagination.value.size,
      }

      loading.value = true

      try {
        const response =
          await SettingWithdrawalService.getGlobalWithdrawalSettings(params)

        pagination.value.total = response.pagination.total
        items.value = response.items

        loading.value = false
      } catch (error) {
        loading.value = false
      }
    }

    const globalUsdtAmount = ref('0')
    const globalUsdtCastleAmount = ref('0')

    const getGlobalSetting = async () => {
      try {
        const response = await SettingWithdrawalService.getGlobalSetting()

        if (response) {
          globalUsdtAmount.value = response.usdtFee
          globalUsdtCastleAmount.value = response.usdtFeeCastle
        }

        loading.value = false
      } catch (error) {
        loading.value = false
      }
    }

    const resetSearch = () => {
      coinSelect.value = ''
      getData()
    }

    const tableReloadKey = ref(0)
    const items = ref()

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs('setting.globalWithdrawal.index', [])
      getData()
      getGlobalSetting()
      getPairPrices()
      store.dispatch(Actions.FETCH_LIST_COIN)
    })

    const coinSelect = ref()

    const page = ref(1)
    const total = ref(0)
    const size = ref(10)
    const pagination = ref<GlobalWithdrawalSettingListPagination>({
      page: page.value,
      total: total.value,
      size: size.value,
    })
    const currentPageChange = () => {
      getData()
    }

    const setItemsPerPage = () => {
      pagination.value.page = 1
      pagination.value.size = +pagination.value.size
      getData()
    }

    const openEdit = (item: GlobalWithdrawalSettingModel) => {
      console.log(`[item] > :`, item)

      itemEdit.value = {
        coin: item.coin,
        withdrawalEnable: item.withdrawalEnable,
        minimumWithdrawal: item.minimumWithdrawal.toString(),
        maximumWithdrawal: item.maximumWithdrawal.toString(),
        maximumResetTime: item.maximumResetTime,
        feeMode: item.feeMode,
        feeUsdtAmount: item.feeUsdtAmount?.toString() || '0',
        feeUsdtCastleAmount: item.feeUsdtCastleAmount?.toString() || '0',
        feeSettings: toRaw(item.feeSettings),
        autoWithdrawalThreshold: item.autoWithdrawalThreshold.toString(),
        decimalOfFee: item.decimalOfFee.toString(),
      }

      isOpenModal.value = true
    }

    const itemEdit: any = ref(plainToClass(GlobalWithdrawalSettingModel, {}))

    const loading = ref(false)
    const isOpenModal = ref(false)
    const updateData = () => {
      getData()
      isOpenModal.value = false
    }

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

    const handleModalClose = (e) => {
      isOpenModal.value = false

      if (e?.success) {
        getData()
      }
    }

    const listCoin = computed(() => {
      return store.getters.listCoin
    })

    const openUsdtFeeSetting = () => {
      router.push({
        name: 'walletSetting.globalWithdrawal.usdtFeeSetting',
      })
    }

    return {
      tableHeader,
      items,
      tableReloadKey,
      pagination,
      size,
      getData,
      getPairPrices,
      currentPageChange,
      setItemsPerPage,
      openEdit,
      itemEdit,
      pairPrices,
      loading,
      isOpenModal,
      updateData,
      sortColumn,
      isSorting,
      SortType,
      sortType,
      formatUTCDate,
      resetSearch,
      handleModalClose,
      coinSelect,
      listCoin,
      openUsdtFeeSetting,
      globalUsdtAmount,
      globalUsdtCastleAmount,
    }
  },
})
</script>
<style lang="scss" scoped>
.mw-50px {
  min-width: 50px;
  word-break: break-word;
}
.mw-75px {
  min-width: 75px;
  word-break: break-word;
}
.mw-100px {
  min-width: 100px;
  word-break: break-word;
}
.mw-150px {
  min-width: 150px;
  word-break: break-word;
}
.mr-2 {
  margin-right: 0.5rem;
}
.max-width-250 {
  max-width: 250px;
  word-break: break-word;
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
.ml-auto {
  margin-left: auto;
}
// .badge {
//   border-bottom: 0 none !important;
// }
</style>
