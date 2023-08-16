<template>
  <div class="card">
    <div class="card-body pt-6">
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
            <!--begin::Input-->
            <div>
              <el-select
                class="form-select-solid"
                :placeholder="$t('walletGeneral.chainCode')"
                v-model="searchChainCode"
                clearable
                filterable
              >
                <el-option
                  v-for="currency in listChainCode"
                  :value="currency"
                  :key="currency"
                  :label="currency"
                >
                  {{ currency }}
                </el-option>
              </el-select>
            </div>
            <!--end::Input-->
          </div>
          <div class="col-5" style="text-align: right">
            <button
              type="button"
              class="btn btn-primary"
              data-bs-toggle="modal"
              data-bs-target="#kt_blacklist_user_modal"
              @click="openEdit({})"
            >
              {{ $t('create') }}
            </button>
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-4 text-uppercase">
            <button
              class="btn btn-primary me-2 mb-1"
              title="Search"
              @click="getData"
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
                    :class="[cell.name && 'min-w-125px']"
                    tabindex="0"
                    rowspan="1"
                    colspan="1"
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
                    <template v-for="(cell, i) in tableHeader" :key="i">
                      <td
                        v-if="cell.key !== 'action'"
                        :class="{
                          [cell.className]: cell.className,
                          'max-width-250': 1,
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
                      <td v-else>
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <button
                            class="btn btn-sm btn-primary mr-2"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_blacklist_modal"
                            @click="openEdit(item)"
                          >
                            {{ $t('edit') }}
                          </button>

                          <button
                            class="btn btn-sm btn-danger"
                            @click="onDelete(item)"
                          >
                            {{ $t('delete') }}
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
    <BlackListAddressModal
      :listChainCode="listChainCode"
      :listCoin="listCoin"
      :item="itemEdit"
      @updateData="updateData()"
      @close="isOpenModal = false"
      v-if="isOpenModal"
    />
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent, onMounted, ref } from 'vue'
import { IPagination } from '@/core/data/deposit'
import { WalletSettingService } from '@/services/WalletSettingService'
import BlackListAddressModal from '../../components/depositSetting/BlackListAddressModal.vue'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n/index'
import { useRouter } from 'vue-router'
// import { IMaskComponent } from 'vue-imask'
import ApiService from '@/core/services/ApiService'
import { ElMessageBox } from 'element-plus'
import moment from 'moment'

export default defineComponent({
  components: {
    BlackListAddressModal,
    // 'imask-input': IMaskComponent,
  },
  setup() {
    const { t } = useI18n()

    const tableHeader = ref([
      {
        name: 'walletGeneral.address',
        key: 'address',
        sortable: false,
      },
      {
        name: 'walletGeneral.source',
        key: 'source',
        sortable: false,
      },
      {
        name: 'walletGeneral.note',
        key: 'note',
        sortable: false,
      },
      {
        name: 'walletGeneral.reason',
        key: 'reason',
        sortable: false,
      },
      {
        name: 'walletGeneral.chainCode',
        key: 'chain_code',
        sortable: false,
      },
      {
        name: 'walletGeneral.createdDate',
        key: 'created_at',
        sortable: false,
      },
      {
        name: '',
        key: 'action',
        sortable: false,
      },
    ])

    const listChainCode = ref()

    const getData = (param = {}) => {
      let p = {
        ...param,
        page: pagination.value.page,
        size: pagination.value.rowsPerPage,
        chain_code: searchChainCode.value?.toLowerCase(),
        keyword: searchAddress.value,
      }
      loading.value = true
      WalletSettingService.getBlacklistAddress(p).then((res) => {
        loading.value = false
        if (res.data) {
          let data = res.data.data || []
          pagination.value.total = res.data.total_count
          items.value = data.map((item) => {
            item.created_at = item.created_at
              ? moment(parseInt(item.created_at)).format('YYYY-MM-DD HH:mm:ss')
              : ''
            return item
          })
        }
      })
    }

    const isOpenModal = ref(false)
    const tableReloadKey = ref(0)
    const items = ref()
    const totalB = ref()
    const searchText = ref('')
    const loading = ref(false)
    const listCoin = ref()

    onMounted(async () => {
      setPageFliud()
      setCurrentPageBreadcrumbs('menu.walletSettingSub.blacklistAddress', [
        'menu.walletSettingSub.blacklistAddress',
      ])
      getData()
      WalletSettingService.getChainCode().then((res) => {
        if (res.data && res.data.data) {
          listChainCode.value = [
            ...res.data.data.map((item) => item.code.toUpperCase()),
          ]
        }
      })

      const coin = await ApiService.get('/coin')
      if (coin && coin.data) {
        listCoin.value = [...coin.data.map((item) => item.symbol.toUpperCase())]
      }
      WalletSettingService.getListCoin().then((res) => {
        if (res.data && res.data.data) {
          let listCoinErc20 = res.data.data.map((item) => {
            return item.symbol.toUpperCase()
          })
          listCoin.value = [...new Set([...listCoinErc20])]
        }
      })
    })

    const page = ref(1)
    const total = ref(0)
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
    const router = useRouter()

    const openEdit = (item) => {
      isOpenModal.value = true
      itemEdit.value = {
        id: item.id || '',
        address: item.address || '',
        chain_code: (item.chain_code && item.chain_code.toUpperCase()) || '',
        source: item.source || '',
        note: item.note || '',
        reason: item.reason || '',
        symbol: (item.symbol && item.symbol.toUpperCase()) || '',
      }

      router.replace({ query: { isEdit: item.address ? 'true' : 'false' } })
    }

    const onDelete = (item) => {
      ElMessageBox.confirm(t('walletGeneral.areYouSureToDelete')).then(() => {
        WalletSettingService.deleteBlacklistAddress(item.id).then((res) => {
          if (res && res.status === 200) {
            ElNotification({
              title: '',
              message: t('success'),
              type: 'success',
            })
            getData()
          } else {
            ElNotification({
              title: '',
              message: t('error'),
              type: 'error',
            })
          }
        })
      })
    }

    const itemEdit = ref({
      address: '',
      chain_code: '',
      source: '',
      note: '',
      reason: '',
      symbol: '',
      id: '',
    })

    const updateData = () => {
      getData()
      isOpenModal.value = false
    }

    const searchAddress = ref('')
    const searchChainCode = ref('')

    return {
      tableHeader,
      items,
      searchText,
      tableReloadKey,
      pagination,
      rowsPerPage,
      getData,
      totalB,
      currentPageChange,
      setItemsPerPage,
      openEdit,
      itemEdit,
      onDelete,
      loading,
      isOpenModal,
      updateData,
      listChainCode,
      searchAddress,
      searchChainCode,
      listCoin,
    }
  },
})
</script>
<style lang="scss" scoped>
.mw-150px {
  min-width: 150px;
}
.mr-2 {
  margin-right: 0.5rem;
}

.w-70 {
  width: 70%;
}

.max-width-250 {
  max-width: 250px;
  word-break: break-word;
}
</style>
