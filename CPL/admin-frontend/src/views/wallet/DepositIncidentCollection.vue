<template>
  <div class="card">
    <div class="card-body pt-4">
      <div class="card-body pt-4" style="padding-left: 0">
        <div class="row mb-4">
          <div class="col-3 mr-8">
            <div>
              <el-select
                class="form-select-solid"
                :placeholder="$t('walletGeneral.selectCoin')"
                v-model="coinSelect"
                clearable
                filterable
              >
                <el-option
                  v-for="value in listCoin"
                  :value="value"
                  :key="value"
                  :label="value"
                >
                  {{ value }}
                </el-option>
              </el-select>
              <span style="color: #f56c6c" v-if="isNotValidCoin()">
                {{ $t('walletGeneral.thisFieldIsRequired') }}
              </span>
            </div>
          </div>
          <div class="col-3 mr-8">
            <el-input
              v-model="collectionThreshold"
              :placeholder="$t('walletGeneral.collectionThreshold')"
              clearable
            />
            <span style="color: #f56c6c" v-if="isNotValid()">
              この項目は{{ minValue }}以上の値を入力してください
            </span>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-4 text-uppercase">
            <button
              class="btn btn-primary me-2 mb-1"
              title="Search"
              @click="getData"
              :disabled="isNotValid() || isNotValidCoin() ? true : false"
            >
              <i class="fas fa-search fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
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
                    @click="
                      sort(
                        cell.sortingField ? cell.sortingField : cell.key,
                        cell.sortable,
                      )
                    "
                    :class="[
                      cell.name && 'min-w-125px',
                      cell.sortable !== false && 'sorting',
                      currentSort ===
                        `${
                          cell.sortingField ? cell.sortingField : cell.key
                        }desc` && 'sorting_desc',
                      currentSort ===
                        `${
                          cell.sortingField ? cell.sortingField : cell.key
                        }asc` && 'sorting_asc',
                    ]"
                    :style="
                      cell.minWidth
                        ? `min-width: ${cell.minWidth}px !important;`
                        : ''
                    "
                    tabindex="0"
                    rowspan="1"
                    colspan="1"
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
                                cell.key === 'chain_code',
                            }"
                          >
                            {{ item[cell.key] }}
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
              <tr v-if="items && items.length">
                <td class="text-dark fw-bolder fs-5" colspan="3">
                  {{ $t('autoWithdraw.totalBalances') }} :
                </td>
                <td class="text-uppercase text-dark fw-bolder fs-5">
                  {{ totalB ? totalB : '' }}
                </td>
              </tr>
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

        <!-- <div class="row mb-4">
          <div class="col-6 d-flex align-items-center">Estimate Fee:</div>
          <div class="col-4 text-uppercase">
            {{ fee }}
          </div>
        </div> -->

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
                  @change="getData"
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
            v-if="items && items.length"
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
    <div class="row my-4">
      <div class="col-10 d-flex align-items-center"></div>
      <div class="col-2 text-uppercase">
        <button
          type="button"
          class="btn btn-primary"
          @click="collection"
          :disabled="items && items.length ? false : true"
          :style="
            items && items.length
              ? ''
              : 'cursor: not-allowed; pointer-event: unset'
          "
        >
          {{ $t('walletGeneral.collection') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { computed, defineComponent, onMounted, ref } from 'vue'
import { WalletSettingService } from '@/services/WalletSettingService'
import { IPagination } from '@/core/data/deposit'
import { Actions } from '@/store/enums/StoreEnums'
import store from '@/store'
import BigNumber from 'bignumber.js'
import Swal from 'sweetalert2'
import { useIMask } from 'vue-imask'

export default defineComponent({
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
        name: 'walletGeneral.chainCode',
        key: 'chain_code',
        sortable: false,
      },
      {
        name: 'walletGeneral.balance',
        key: 'balanceF',
        sortable: false,
      },
    ])
    const getData = (params?) => {
      // if (!collectionThreshold.value) {
      //   collectionThreshold.value = '0.00000001'
      // }
      // if (!coinSelect.value) {
      //   coinSelect.value = (listCoin.value && listCoin.value[0]) || 'BTC'
      // }
      if (isNotValid() || isNotValidCoin()) {
        return
      }
      loading.value = true

      let p = {
        ...params,
        min_balance: (+collectionThreshold.value).toFixed(8).toString(),
        symbol: coinSelect.value.toLowerCase(),
        page: pagination.value.page,
        size: pagination.value.rowsPerPage,
        domain: 'USER',
      }
      WalletSettingService.getIncident(p)
        .then((res) => {
          if (res.data) {
            const responseData = res.data.data || []

            pagination.value.total = res.data.total_count || 0

            items.value = responseData.map((item) => {
              item.balance = new BigNumber(item.balance)
              item.balanceF = item.balance.minus(item.pending_balance)
              return item
            })
            totalB.value =
              res.data.meta_data &&
              res.data.meta_data.incidenceAmount &&
              new BigNumber(res.data.meta_data.incidenceAmount)
            tableReloadKey.value++
            coinSelect.value = p.symbol.toString().toUpperCase()
          }

          loading.value = false
        })
        .catch(() => {
          loading.value = false
        })
    }

    const listCoin = computed(() => {
      return [...new Set([...store.getters.listCoin, ...listCoinErc20.value])]
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
    const tableReloadKey = ref(0)
    const isNotValid = () => {
      if (coinSelect.value) {
        switch (coinSelect.value) {
          case 'BTC':
          case 'LTC':
          case 'BCH':
            if (+collectionThreshold.value < 0.00001) {
              minValue.value = '0.00001'
              return true
            }
            break
          case 'XRP':
            if (+collectionThreshold.value < 15) {
              minValue.value = '15'
              return true
            }
            break
          default:
            break
        }
      }
      if (+collectionThreshold.value < 0) {
        minValue.value = '0'
        return true
      }
      return false
    }

    const isNotValidCoin = () => {
      if (coinSelect.value) {
        return false
      }

      return true
    }
    const minValue = ref('0')
    const items = ref()
    const totalB = ref()
    const fee = ref()
    const coinSelect = ref('')
    const collectionThreshold = ref('0.00000001')
    const loading = ref(false)

    const searchText = ref('')

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs(
        'menu.walletSub.walletService.depositIncidentCollection',
        ['menu.wallet', 'menu.walletSub.walletService.index'],
      )
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
    const currentPageChange = () => {
      getData()
    }

    const setItemsPerPage = () => {
      pagination.value.page = 1
      pagination.value.rowsPerPage = +pagination.value.rowsPerPage
      getData()
    }

    const { el } = useIMask({
      mask: String,
      min: 0,
      max: 999999999,
      scale: 8,
      signed: false,
      thousandsSeparator: '',
      padFractionalZeros: false,
      normalizeZeros: true,
      radix: '.',
      mapToRadix: ['.'],
    })

    return {
      loading,
      tableHeader,
      items,
      searchText,
      tableReloadKey,
      pagination,
      rowsPerPage,
      coinSelect,
      collectionThreshold,
      getData,
      listCoin,
      totalB,
      fee,
      currentPageChange,
      setItemsPerPage,
      minValue,
      isNotValid,
      isNotValidCoin,
      el,
    }
  },

  watch: {
    collectionThreshold() {
      this.collectionThreshold = this.collectionThreshold
        .toString()
        .replace(/([^\d]*)(\d*(\.\d{0,8})?)(.*)/, '$2')
    },
  },
  methods: {
    collection() {
      if (!this.items.length) return
      Swal.fire({
        text: this.$t('walletGeneral.areYouSureToCollection'),
        icon: 'success',
        buttonsStyling: false,
        showCancelButton: true,
        showConfirmButton: true,
        cancelButtonText: this.$t('cancel'),
        confirmButtonText: 'OK',
        customClass: {
          cancelButton: 'btn',
          confirmButton: 'btn btn-primary',
        },
      }).then(async (res) => {
        if (res.value) {
          let p = {
            min_balance: (+this.collectionThreshold).toFixed(8).toString(),
            symbol: this.coinSelect.toLowerCase(),
            domain: 'USER',
            chain_code: this.items[0].chain_code,
          }
          WalletSettingService.updateIncident(p).then((res) => {
            if (res.data) {
              this.$toastr.success(this.$t('success'))
            }
          })
        }
      })
    },
  },
})
</script>
<style scoped>
.mw-150px {
  min-width: 150px;
}
</style>
