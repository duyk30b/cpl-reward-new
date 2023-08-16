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
              v-model="selectedCoin"
              clearable
              filterable
              @change="getWalletSetting"
            >
              <el-option
                v-for="coin in listCoin"
                :value="coin"
                :key="coin"
                value-key="coin"
                :label="coin.toUpperCase()"
              />
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
              <template v-if="listSetting && listSetting.length">
                <template v-for="(item, i) in listSetting" :key="i">
                  <tr class="odd">
                    <template v-for="(cell, i) in tableHeader" :key="i">
                      <td
                        :class="{
                          [cell.className]: cell.className,
                        }"
                      >
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <div
                            class="form-check form-switch"
                            v-if="typeof item[cell.key] === 'boolean'"
                          >
                            <input
                              class="form-check-input"
                              type="checkbox"
                              v-model="item[cell.key]"
                              @change="editDepositStatus(item, $event)"
                            />
                          </div>
                          <span v-else>
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
              <span v-if="listSetting && listSetting.length" class="ms-4">
                {{
                  $t('tableDisplayResult', {
                    start: (pagination.page - 1) * pagination.rowsPerPage + 1,
                    end:
                      (pagination.page - 1) * pagination.rowsPerPage +
                      listSetting.length,
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
              @current-change="getWalletSetting"
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
import { setPageFliud } from '@/core/helpers/common.helper'
import { WalletSettingService } from '@/services/WalletSettingService'
import { Actions } from '@/store/enums/StoreEnums'
import { CurrencyService } from '@/views/currency/services/CurrencyService'
import { TRANSACTION_TYPE_DEPOSIT } from '@/views/currency/variables/currency.const'
import Swal from 'sweetalert2'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'deposit-setting',
  data() {
    return {
      loading: false,
      selectedCoin: '',
      pagination: {
        page: 1,
        total: 0,
        rowsPerPage: 10,
      },
      tableHeader: [
        {
          name: 'walletGeneral.coin',
          key: 'coin',
          className: 'text-uppercase',
        },
        {
          name: 'walletGeneral.depositEnable',
          key: 'deposit_enable',
        },
      ],
      listSetting: [],
    }
  },
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.globalDepositSetting', [
      'menu.globalSetting',
    ])
    this.$store.dispatch(Actions.FETCH_LIST_COIN)

    this.getWalletSetting()
  },
  computed: {
    listCoin() {
      return this.$store.getters.listCoin
    },
  },
  methods: {
    async getWalletSetting() {
      this.loading = true
      const res = await WalletSettingService.getWalletSetting(
        'deposit-setting',
      )
      if (!res?.data?.data) {
        return
      }

      let result = res?.data?.data
      if (this.selectedCoin) {
        result = res?.data?.data.filter(
          (item) => item.chain_code === this.selectedCoin.toLowerCase(),
        )
      }

      this.pagination.total = result.length

      let start = this.pagination.rowsPerPage * (this.pagination.page - 1)

      this.listSetting = result
        .sort((a, b) =>
          a.chain_code.toLowerCase().localeCompare(b.chain_code.toLowerCase()),
        )
        .splice(start, this.pagination.rowsPerPage)
        .map((item) => {
          const settingDeposit = item.settings.find(
            (setting) =>
              setting.key === `${item.chain_code.toUpperCase()}_DEPOSIT_ENABLE`,
          )

          return {
            coin: item.chain_code,
            deposit_enable: settingDeposit
              ? settingDeposit?.value === 'true'
              : true,
          }
        })

      this.loading = false
    },
    setItemsPerPage() {
      this.pagination.page = 1
      this.pagination.rowsPerPage = +this.pagination.rowsPerPage
      this.getWalletSetting()
    },
    async editDepositStatus(item, event) {
      const params = {
        coin: item.coin,
        type: TRANSACTION_TYPE_DEPOSIT,
        env: item.env,
        status: event.target.checked ? 1 : 0,
      }
      const confirmMessage = params.status
        ? 'currencyScreen.enableDepositConfirm'
        : 'currencyScreen.disableDepositConfirm'

      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        text: this.$t(confirmMessage),
        showCancelButton: true,
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
      })

      if (!isConfirmed) {
        item.deposit_enable = !params.status
        return
      }

      try {
        const { data } = await CurrencyService.changeStatus(params)
        if (!data.result) {
          this.$toastr.error(this.$t('currencyScreen.changeStatusFail'))
          // reset when has error
          item.deposit_enable = !params.status
          return
        }

        this.$toastr.success(this.$t('currencyScreen.changeStatusSuccess'))
      } catch (err) {
        console.log(err)
        this.$toastr.error(this.$t('currencyScreen.changeStatusFail'))
        // reset when has error
        item.deposit_enable = !params.status
      }
    },
  },
})
</script>

<style></style>
