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
              @click="exportDeposit"
              :title="$t('walletGeneral.export')"
            >
              <i v-if="!loadingExport" class="fas fa-download fa-fw"></i>
              <i v-if="loadingExport" class="fas fa-spinner fa-spin fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{
                $t('walletGeneral.export')
              }}</span>
            </button>
            <button
              class="btn btn-primary me-2 mb-1"
              @click="showCreateDeposit = true"
              :title="$t('walletGeneral.addDeposit')"
            >
              <i class="fas fa-plus fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{
                $t('walletGeneral.addDeposit')
              }}</span>
            </button>
            <button
              class="btn btn-primary me-2 mb-1"
              @click="showCreateDepositManual = true"
              :title="$t('walletGeneral.addDepositManual')"
            >
              <i class="fas fa-plus fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{
                $t('walletGeneral.addDepositManual')
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
                          item.queue_status !== DEPOSIT_QUEUE_STATUS.DONE ||
                          item.id === loadingRetryDeposit
                        "
                        @click="retryDepositTransaction(item.id)"
                      >
                        <i
                          v-if="item.id === loadingRetryDeposit"
                          class="fas fa-spinner fa-spin fa-fw"
                        ></i>
                        <span v-if="item.id !== loadingRetryDeposit">
                          {{ $t('walletGeneral.retry') }}
                        </span>
                      </button>
                      <button
                        class="btn btn-primary text-nowrap"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_detail_deposit_modal"
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
    <Form @submit="createManualDeposit">
      <el-dialog
        v-model="showCreateDeposit"
        :title="$t('walletGeneral.addDeposit')"
        :before-close="onCloseRetryDialog"
        center
      >
        <div class="row w-75 m-auto">
          <label class="col-6 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.coin')
          }}</label>
          <div class="col-6">
            <Field
              v-model="selectedRetryCoin"
              name="coin_name"
              v-slot="{ errorMessage }"
              :rules="`required`"
            >
              <el-select
                v-model="selectedRetryCoin"
                size="small"
                class="form-select-solid"
                clearable
                filterable
                value-key="key"
                name="coin_name"
                :placeholder="$t('walletGeneral.selectCoin')"
              >
                <el-option
                  v-for="coin in listCurrency"
                  :key="coin.key"
                  :label="`${coin.symbol} (${coin.chainCode})`"
                  :value="coin"
                />
              </el-select>
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-6 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.transactionHash')
          }}</label>
          <div class="col-6">
            <Field
              v-model="inputRetryTxHash"
              name="transaction_hash"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input class="form-control" v-bind="field" required />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer text-center">
            <el-button
              type="primary"
              native-type="submit"
              :disabled="loadingCreateDeposit"
            >
              <i
                v-if="loadingCreateDeposit"
                class="fas fa-spinner fa-spin fa-fw"
              ></i>
              {{ $t('submit') }}</el-button
            >
            <el-button
              @click="onCloseRetryDialog"
              :disabled="loadingCreateDeposit"
              >{{ $t('cancel') }}</el-button
            >
          </span>
        </template>
      </el-dialog>
    </Form>
    <Form @submit="openConfirmDepositManualModal">
      <el-dialog
        v-model="showCreateDepositManual"
        :title="$t('walletGeneral.addDepositManual')"
        :before-close="onCloseDepositManualModal"
        center
      >
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.transactionHash') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryTxHash"
              name="tx_hash"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input class="form-control" v-bind="field" required />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.userId') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryUserId"
              name="user_id"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input
                class="form-control"
                v-bind="field"
                type="number"
                required
              />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.coin') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="selectedRetryCoin"
              name="currency"
              v-slot="{ errorMessage }"
              :rules="`required`"
            >
              <el-select
                v-model="selectedRetryCoin"
                size="small"
                class="form-select-solid"
                clearable
                filterable
                value-key="key"
                name="currency"
                :placeholder="$t('walletGeneral.selectCoin')"
              >
                <el-option
                  v-for="coin in listCurrency"
                  :key="coin.key"
                  :label="`${coin.symbol} (${coin.chainCode})`"
                  :value="coin"
                />
              </el-select>
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.fromAddress') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryFromAddress"
              name="from_address"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input class="form-control" v-bind="field" required />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('autoWithdraw.toAddress') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryToAddress"
              name="to_address"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input class="form-control" v-bind="field" required />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('tag')
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryTag"
              name="destination_tag"
              v-slot="{ field, errorMessage }"
            >
              <input class="form-control" v-bind="field" type="number" />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.amount') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryAmount"
              name="amount"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input
                class="form-control"
                v-bind="field"
                type="number"
                required
              />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <div class="row mt-5 w-75 m-auto">
          <label class="col-4 d-flex flex-column justify-content-center">{{
            $t('walletGeneral.date') + ' *'
          }}</label>
          <div class="col-8">
            <Field
              v-model="inputRetryDate"
              name="date"
              v-slot="{ field, errorMessage }"
              :rules="`required`"
            >
              <input
                class="form-control"
                v-bind="field"
                type="datetime-local"
                required
              />
              <error-display :message="errorMessage"></error-display>
            </Field>
          </div>
        </div>
        <template #footer>
          <span class="dialog-footer text-center">
            <el-button
              type="primary"
              native-type="submit"
              :disabled="loadingCreateDeposit"
            >
              <i
                v-if="loadingCreateDeposit"
                class="fas fa-spinner fa-spin fa-fw"
              ></i>
              {{ $t('submit') }}</el-button
            >
            <el-button
              @click="onCloseDepositManualModal"
              :disabled="loadingCreateDeposit"
              >{{ $t('cancel') }}</el-button
            >
          </span>
        </template>
      </el-dialog>
    </Form>
    <Form @submit="createManualDepositManual">
      <el-dialog
        v-model="showConfirmDepositManual"
        :title="$t('walletGeneral.confirmAddDeposit')"
        :before-close="onCloseConfirmDepositManualModal"
        center
      >
        <ul>
          <li>
            <span class="fw-bolder"
              >{{ $t('walletGeneral.transactionHash') }}:
            </span>
            <span>{{ inputRetryTxHash }}</span>
          </li>
          <li>
            <span class="fw-bolder">{{ $t('walletGeneral.userId') }}: </span>
            <span>{{ inputRetryUserId }}</span>
          </li>
          <li>
            <span class="fw-bolder">{{ $t('walletGeneral.coin') }}: </span>
            <span>{{ selectedRetryCoin?.symbol }}</span>
          </li>
          <li>
            <span class="fw-bolder"
              >{{ $t('walletGeneral.fromAddress') }}:
            </span>
            <span>{{ inputRetryFromAddress }}</span>
          </li>
          <li>
            <span class="fw-bolder">{{ $t('autoWithdraw.toAddress') }}: </span>
            <span>{{ inputRetryToAddress }}</span>
          </li>
          <li v-if="inputRetryTag">
            <span class="fw-bolder">{{ $t('tag') }}: </span>
            <span>{{ inputRetryTag }}</span>
          </li>
          <li>
            <span class="fw-bolder">{{ $t('walletGeneral.amount') }}: </span>
            <span>{{ inputRetryAmount }}</span>
          </li>
          <li>
            <span class="fw-bolder">{{ $t('walletGeneral.date') }}: </span>
            <span>{{ inputRetryDate }}</span>
          </li>
        </ul>

        <template #footer>
          <span class="dialog-footer text-center">
            <el-button
              type="primary"
              native-type="submit"
              :disabled="loadingCreateDeposit"
            >
              <i
                v-if="loadingCreateDeposit"
                class="fas fa-spinner fa-spin fa-fw"
              ></i>
              {{ $t('submit') }}</el-button
            >
            <el-button
              @click="onCloseConfirmDepositManualModal"
              :disabled="loadingCreateDeposit"
              >{{ $t('cancel') }}</el-button
            >
          </span>
        </template>
      </el-dialog>
    </Form>
    <DetailDepositModal :transactionId="detailId" :close="(detailId = 0)" />
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
import { ICurrency, IPagination } from '@/core/data/deposit'
import moment from 'moment'
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import {
  DEPOSIT_TRANSACTION_STATUS,
  DEPOSIT_QUEUE_STATUS,
  LIMIT_EXPORT_MONTHS,
} from '@/models/hot-wallet/HotWalletType'
import { IColumnConfig, SortType } from '@/components/datatable/Datatable.vue'
import { useI18n } from 'vue-i18n'
import { CurrencyService } from '../currency/services/CurrencyService'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import DetailDepositModal from '@/components/wallet/DetailDepositModal.vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  components: { Form, Field, ErrorDisplay, DetailDepositModal },
  setup() {
    const router = useRouter()
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
        name: 'walletGeneral.address',
        key: 'wallet_address',
        sortable: false,
      },
      {
        name: 'walletGeneral.coin',
        key: 'symbol',
        sortable: false,
      },
      {
        name: 'walletGeneral.balance',
        key: 'parsed_amount',
        sortable: true,
      },
      {
        name: 'walletGeneral.transactionHash',
        key: 'transaction_hash_url',
        sortable: false,
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
    const listCoin = computed(() => {
      return [...new Set([...store.getters.listCoin, ...listCoinErc20.value])]
    })

    const listCoinRaw = computed(() => {
      return store.getters.listCoinRaw
    })

    const listStatus = computed(() => {
      return [
        ...Object.keys(DEPOSIT_TRANSACTION_STATUS).map((key) => key),
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

    // Get list currency from common-setting v2
    const getListCurrency = async () => {
      const { data } = await CurrencyService.getListCurrency({})

      if ('data' in data) {
        let arrCurrencies = [] as Array<ICurrency>

        for (let currency of data['data']) {
          if (!currency?.networks?.length) {
            continue
          }

          currency.networks.forEach((network) => {
            if (network.type === 'not_wallet') {
              return
            }

            // follow logic of hot wallet BE
            if (
              ['erc20', 'bep20'].includes(network.network) &&
              !network.contract_address
            ) {
              return
            }

            arrCurrencies.push({
              key: currency.coin + '_' + network.network,
              symbol: currency.coin?.toUpperCase(),
              chainCode: network.network?.toUpperCase(),
            })
          })
        }

        listCurrency.value = arrCurrencies.sort((a, b) =>
          a.key.localeCompare(b.key),
        )
      }
    }

    const i18n = useI18n()

    const getFilterParams = () => {
      let params: any = {
        page: pagination.value.page,
        size: pagination.value.rowsPerPage,
        sort_type: sortType.value,
        sort: sort.value,
        lang: i18n.locale.value,
      }

      if (coinSelect.value) {
        params.symbol = coinSelect.value.toLowerCase()
      }

      if (searchAddress.value) {
        params.search_address = searchAddress.value.toLowerCase()
      }

      if (searchTransactionHash.value) {
        params.search_transaction_hash =
          searchTransactionHash.value.toLowerCase()
      }

      if (searchTransactionId.value) {
        params.search_transaction_id = searchTransactionId.value.toLowerCase()
      }

      if (statusSelect.value) {
        params.status = statusSelect.value
      }

      if (dateRange.value && dateRange.value.length) {
        const [fromDate, toDate] = dateRange.value

        params.from_date = fromDate
        params.to_date = toDate
      }

      return params
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
      const params = getFilterParams()
      loading.value = true

      WalletSettingService.getDepositWalletList(params).then((res) => {
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

    const coinSelect = ref('')
    const statusSelect = ref('')
    const searchAddress = ref('')
    const searchTransactionHash = ref('')
    const searchTransactionId = ref('')
    const dateRange = ref([] as string[])
    const loading = ref(false)
    const loadingExport = ref(false)
    const loadingCreateDeposit = ref(false)
    const loadingRetryDeposit = ref(0)
    const showCreateDeposit = ref(false)
    const showCreateDepositManual = ref(false)
    const showConfirmDepositManual = ref(false)
    const listCurrency = ref([] as Array<ICurrency>)
    const selectedRetryCoin = ref<ICurrency>()
    const inputRetryTxHash = ref('')
    const inputRetryUserId = ref('')
    const inputRetryToAddress = ref('')
    const inputRetryFromAddress = ref('')
    const inputRetryAmount = ref('')
    const inputRetryTag = ref('')
    const inputRetryDate = ref('')
    const detailId = ref(0)

    const app = getCurrentInstance()
    const toastr = app?.appContext.config.globalProperties.$toastr
    const t = app?.appContext.config.globalProperties.$t

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs(
        'menu.walletSub.walletService.depositTransaction',
        ['menu.wallet', 'menu.walletSub.walletService.index'],
      )
      store.dispatch(Actions.FETCH_LIST_COIN)
      getListCoin()
      getData()
      getListCurrency()
    })

    const page = ref(1)
    const total = ref()
    const rowsPerPage = ref(10)
    const pagination = ref<IPagination>({
      page: page.value,
      total: total.value,
      rowsPerPage: rowsPerPage.value,
    })

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
      searchAddress.value = ''
      searchTransactionHash.value = ''
      searchTransactionId.value = ''
      statusSelect.value = ''
      dateRange.value = []

      getData()
    }

    const exportDeposit = () => {
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

      WalletSettingService.exportDepositTransactions(params)
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

    const retryDepositTransaction = (id: number) => {
      loadingRetryDeposit.value = id
      WalletSettingService.retryDepositTransaction(id)
        .then((result) => {
          if (!result.data?.data?.result) {
            toastr.error(t('walletGeneral.failedRetryDeposit'))
            return
          }

          toastr.success(t('walletGeneral.succeedRetryDeposit'))
          getData()
        })
        .catch((error) => {
          console.log(error)
          toastr.error(t(error.message))
        })
        .finally(() => {
          loadingRetryDeposit.value = 0
        })
    }

    const onCloseRetryDialog = () => {
      showCreateDeposit.value = false
      selectedRetryCoin.value = undefined
      inputRetryTxHash.value = ''
    }

    const onCloseDepositManualModal = () => {
      showCreateDepositManual.value = false
      loadingCreateDeposit.value = false
      selectedRetryCoin.value = undefined
      inputRetryTxHash.value = ''
      inputRetryToAddress.value = ''
      inputRetryFromAddress.value = ''
      inputRetryAmount.value = ''
      inputRetryTag.value = ''
      inputRetryDate.value = ''
      inputRetryUserId.value = ''
    }

    const onCloseConfirmDepositManualModal = () => {
      showConfirmDepositManual.value = false
    }

    const openConfirmDepositManualModal = () => {
      showConfirmDepositManual.value = true
      inputRetryDate.value = moment(inputRetryDate.value).format(
        'YYYY-MM-DD HH:mm:ss',
      )
    }

    const createManualDeposit = () => {
      loadingCreateDeposit.value = true
      WalletSettingService.createManualDepositTransaction({
        symbol: selectedRetryCoin.value?.symbol,
        chain_code: selectedRetryCoin.value?.chainCode,
        transaction_hash: inputRetryTxHash.value,
      })
        .then((result) => {
          if (result?.data?.data?.result) {
            toastr.success(t('walletGeneral.succeedCreateDeposit'))
            onCloseRetryDialog()
            getData()
            return
          }

          toastr.error(t('walletGeneral.failedCreateDeposit'))
        })
        .catch((error) => {
          toastr.error(error)
        })
        .finally(() => {
          loadingCreateDeposit.value = false
        })
    }
    const createManualDepositManual = () => {
      loadingCreateDeposit.value = true
      WalletSettingService.createBceManualDepositTransaction({
        user_id: +inputRetryUserId.value,
        currency: selectedRetryCoin.value?.symbol as string,
        tx_hash: inputRetryTxHash.value,
        to_address: inputRetryToAddress.value,
        from_address: inputRetryFromAddress.value,
        amount: +inputRetryAmount.value,
        date: moment(inputRetryDate.value).format('YYYY-MM-DD HH:mm:ss'),
        ...(inputRetryTag.value && { destination_tag: +inputRetryTag.value }),
      })
        .then((result) => {
          if (result?.data?.data?.result) {
            toastr.success(t('walletGeneral.succeedCreateManualDeposit'))
            onCloseDepositManualModal()
            onCloseConfirmDepositManualModal()
            router.push({
              name: 'wallet.history.depositHistory',
            })
            return
          }

          toastr.error(
            t(`walletGeneral.${result?.data?.message}`) ||
              t('walletGeneral.failedCreateDeposit'),
          )
        })
        .catch((error) => {
          toastr.error(error)
        })
        .finally(() => {
          loadingCreateDeposit.value = false
        })
    }

    const openDetail = (id) => {
      detailId.value = id
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
      coinSelect,
      listCoin,
      getData,
      listStatus,
      DEPOSIT_TRANSACTION_STATUS,
      DEPOSIT_QUEUE_STATUS,
      listCurrency,

      statusSelect,
      searchAddress,
      searchTransactionHash,
      searchTransactionId,
      dateRange,
      sortColumn,
      isSorting,
      SortType,
      sortType,
      resetSearch,
      exportDeposit,
      loadingExport,
      showCreateDeposit,
      showCreateDepositManual,
      showConfirmDepositManual,
      retryDepositTransaction,
      selectedRetryCoin,
      inputRetryTxHash,
      inputRetryToAddress,
      inputRetryFromAddress,
      inputRetryAmount,
      inputRetryTag,
      inputRetryDate,
      inputRetryUserId,
      onCloseRetryDialog,
      onCloseDepositManualModal,
      openConfirmDepositManualModal,
      onCloseConfirmDepositManualModal,
      createManualDeposit,
      createManualDepositManual,
      loadingCreateDeposit,
      loadingRetryDeposit,
      openDetail,
      detailId,
    }
  },
})
</script>
<style scoped>
.mw-150px {
  min-width: 150px;
}
.mr-8 {
  margin-right: 8px;
}
</style>
