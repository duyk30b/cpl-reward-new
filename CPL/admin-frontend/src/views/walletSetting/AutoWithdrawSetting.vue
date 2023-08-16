<template>
  <div class="card">
    <div class="card-body pt-6">
      <div class="card-body pt-4" style="padding-left: 0">
        <div class="col-3 mr-8">
          <!--begin::Input-->
          <div>
            <el-select
              class="form-select-solid"
              :placeholder="$t('walletGeneral.selectCoin')"
              v-model="coinSelect"
              clearable
              filterable
              @change="changeCoin"
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
                        v-if="tableHeader.length - 1 !== i"
                        :class="{
                          [cell.className]: cell.className,
                        }"
                      >
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <div
                            class="form-check form-switch"
                            v-if="
                              (item[cell.key] &&
                                item[cell.key].toString() == 'true') ||
                              (item[cell.key] &&
                                item[cell.key].toString() == 'false')
                            "
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              id="flexSwitchCheckDefault"
                              disabled
                              v-model="item[cell.key]"
                            />
                            <label
                              class="form-check-label"
                              for="flexSwitchCheckDefault"
                            ></label>
                          </div>
                          <span v-else>
                            {{ item[cell.key] }}
                          </span>
                        </slot>
                      </td>
                      <td v-else>
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <button
                            class="btn btn-sm btn-primary min-w-125px"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_deposit_setting_edit_modal"
                            @click="openEdit(item.coin)"
                          >
                            <span class="svg-icon svg-icon-3">
                              <inline-svg
                                src="/media/icons/duotune/art/art005.svg"
                              />
                            </span>
                            {{ $t('edit') }}
                          </button>
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
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
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

    <DepositSettingEditModal
      :item="itemEdit"
      :initData="initData"
      :isEdit="isEdit"
      :coin="coinEdit"
      :title="titleModal"
      @updateData="onSubmit"
      @warning-modal="showWarningModal"
    />
    <div
      class="modal fade"
      id="kt_deposit_warning_modal"
      ref="warningModalRef"
      tabindex="-1"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered mw-650px">
        <div class="modal-content">
          <div class="modal-header">
            <div
              class="swal2-icon swal2-warning swal2-icon-show"
              style="display: flex"
            >
              <div class="swal2-icon-content">!</div>
            </div>
          </div>
          <div class="p-5 pt-0" style="text-align: center">
            <p class="modal-warning-text outline-warning">
              {{ $t(titleWarning) }}
            </p>
            <div class="row mb-4 mt-12">
              <div class="col-12" style="text-align: center">
                <button
                  type="button"
                  class="btn btn-primary"
                  @click="closeWarningModal"
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { computed, defineComponent, onMounted, ref } from 'vue'
import DepositSettingEditModal from '../../components/depositSetting/DepositSettingEditModal.vue'
import { WalletSettingService } from '@/services/WalletSettingService'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  SettingData,
  IPagination,
  IHeaderConfiguration,
} from '@/core/data/deposit'
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import { hideModal, showModal } from '@/core/helpers/dom'
import _ from 'lodash'

export default defineComponent({
  components: {
    DepositSettingEditModal,
  },
  setup() {
    const route = useRoute()
    const items = ref()
    const itemEdit = ref()
    const initData = ref()
    const coinSelect = ref()
    const coinEdit = ref()
    const openEdit = (coin) => {
      titleModal.value = t('menu.walletSettingSub.autoWithdrawSetting')
      coinEdit.value = coin.toUpperCase()
      itemEdit.value = formatDataEdit(coin)
      initData.value = formatDataEdit(coin)
      isEdit.value = true
    }
    const settingNew = [
      {
        key: 'BTC_AUTO_COLLECTION_ENABLE',
        show: true,
        title: 'Auto Collection Enable',
        value: 'false',
      },
      {
        key: 'BTC_COLLECTION_THRESHOLD',
        show: true,
        title: 'Collection Threshold',
        value: '',
      },
      {
        key: 'BTC_DEPOSIT_CONFIRMATION',
        show: true,
        title: 'Deposit Confirmation',
        value: '',
      },
    ]
    const { t } = useI18n()
    const openAdd = () => {
      titleModal.value = t('autoWithdrawSetting')
      coinEdit.value = ''
      itemEdit.value = settingNew
      isEdit.value = false
    }

    const titleWarning = ref()
    titleWarning.value = 'autoWithdrawThresholdWarning'

    const titleModal = ref()
    const tableHeader = ref()
    const oldData = ref()
    const allData = ref()
    const loading = ref(false)
    const isEdit = ref(false)
    const currentPage = ref(false)
    const page = ref(1)
    const total = ref()
    const rowsPerPage = ref(10)
    const pagination = ref<IPagination>({
      page: page.value,
      total: total.value,
      rowsPerPage: rowsPerPage.value,
    })
    const getData = () => {
      return WalletSettingService.getWalletSetting(route.meta.category)
    }

    const changeCoin = () => {
      return onSubmit()
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

    const onSubmit = () => {
      loading.value = true

      getData()
        .then((res) => {
          let responseData = res.data.data
          if (responseData) {
            if (coinSelect.value) {
              responseData = responseData.filter(
                (responseDataItem) =>
                  responseDataItem.chain_code ===
                  coinSelect.value.toLowerCase(),
              )
            }

            allData.value = responseData
            items.value = formatData(responseData)
            pagination.value.total = items.value.length
            let start =
              pagination.value.rowsPerPage * (pagination.value.page - 1)
            items.value = items.value.splice(
              start,
              pagination.value.rowsPerPage,
            )
            tableHeader.value = getHeader(responseData)
            oldData.value = responseData
          }
          loading.value = false
        })
        .catch(() => {
          loading.value = false
        })
    }

    const ignoreKey: string[] = [
      'MIN_WITHDRAW_AMOUNT_LIMIT',
      'WITHDRAW_AMOUNT_LIMIT',
      'WITHDRAW_ENABLE',
    ]

    const getHeader = (res) => {
      let result: IHeaderConfiguration[] = [
        {
          name: 'walletGeneral.coin',
          key: 'coin',
          sortable: true,
          className: 'text-uppercase',
        },
      ]

      res.forEach((item: SettingData) => {
        item.settings.forEach((s) => {
          const lengthCode = item.chain_code.length + 1
          const keyName = s.key.slice(lengthCode, s.key.length)

          const isHasKey = result.filter((item) => {
            return keyName === item.key
          })

          if (ignoreKey.includes(keyName)) {
            return
          }

          if (!isHasKey.length && s.show) {
            result = [
              ...result,
              {
                name: `walletGeneral.${_.camelCase(keyName)}`,
                key: keyName,
                sortable: true,
                className: 'mw-150px',
              },
            ]
          }
        })
      })
      result = [
        ...result,
        {
          name: '',
          key: 'action',
          className: 'mw-150px',
        },
      ]
      return result
    }

    const formatData = (res: SettingData[]) => {
      let result: any[] = []
      res.forEach((item) => {
        if (['erc20', 'bep20'].includes(item.chain_code)) return
        let row: any = {
          coin: item.chain_code,
        }

        const itemSettingSorted = item.settings.sort((firstEl, secondEl) =>
          firstEl.key.localeCompare(secondEl.key),
        )

        itemSettingSorted.forEach((s) => {
          row[s.key.slice(item.chain_code.length + 1, s.key.length)] = s.value
          row.show = s.show
        })
        result = [...result, row]
      })

      result = result.sort((firstEl, secondEl) =>
        firstEl.coin.localeCompare(secondEl.coin),
      )

      return result
    }

    const formatDataEdit = (coin) => {
      let result
      oldData.value.forEach((item: SettingData) => {
        if (item.chain_code === coin) {
          result = [...JSON.parse(JSON.stringify(item.settings))]
        }
      })
      if (result) {
        result = result.filter((item) => {
          const keyName = item.key.slice(coin.length + 1, item.key.length)

          return !ignoreKey.includes(keyName)
        })

        result = result.sort((a, b) => {
          let x = a.key.toLowerCase()
          let y = b.key.toLowerCase()
          if (x < y) {
            return -1
          }
          if (x > y) {
            return 1
          }
          return 0
        })

        result.map((item) => {
          const keyName = item.key.slice(coin.length + 1, item.key.length)

          item.title = `walletGeneral.${_.camelCase(keyName)}`

          return item
        })

        return result
      }
    }

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs('menu.walletSettingSub.autoWithdrawSetting', [
        'menu.walletSettingSub.autoWithdrawSetting',
      ])

      store.dispatch(Actions.FETCH_LIST_COIN)
      getListCoin()

      onSubmit()
    })

    const currentPageChange = () => {
      onSubmit()
    }

    const setItemsPerPage = () => {
      pagination.value.page = 1
      pagination.value.rowsPerPage = +pagination.value.rowsPerPage
      onSubmit()
    }

    const warningModalRef = ref(null)

    const closeWarningModal = () => {
      hideModal(warningModalRef.value)
    }

    const showWarningModal = () => {
      showModal(warningModalRef.value)
    }

    return {
      items,
      loading,
      pagination,
      currentPage,
      setItemsPerPage,
      tableHeader,
      openEdit,
      itemEdit,
      initData,
      coinSelect,
      coinEdit,
      onSubmit,
      isEdit,
      openAdd,
      titleModal,
      currentPageChange,
      closeWarningModal,
      showWarningModal,
      warningModalRef,
      titleWarning,

      listCoin,
      changeCoin,
    }
  },
})
</script>
<style scoped>
.mw-150px {
  min-width: 150px;
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
</style>
