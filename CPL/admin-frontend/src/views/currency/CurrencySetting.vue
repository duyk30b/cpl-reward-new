<template>
  <div class="card" id="currency-setting-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">
        {{ $t('currencyScreen.listCurrency') }}
      </div>

      <div class="card-toolbar d-flex">
        <router-link
          class="btn btn-primary"
          :to="{
            name: 'currency.setting.new_currency',
          }"
        >
          {{ $t('currencyScreen.settingScreen.registerCurrencyBtn') }}
        </router-link>

        <router-link
          class="btn btn-primary ml-4"
          :to="{
            name: 'currency.setting.new_eb20',
          }"
        >
          {{ $t('currencyScreen.settingScreen.registerERCBEP20Btn') }}
        </router-link>

        <!-- <button
          class="btn btn-danger ml-4"
          :title="$t('currencyScreen.settingScreen.downCurrencyBtn')"
          data-bs-toggle="modal"
          data-bs-target="#down-currency-modal"
        >
          <span class="d-none d-lg-inline-block">{{
            $t('currencyScreen.settingScreen.downCurrencyBtn')
          }}</span>
        </button> -->
      </div>
    </div>

    <div class="row mx-5 d-flex">
      <div class="col-2">
        <el-select
          class="form-select-solid"
          :placeholder="$t('currencyScreen.coin')"
          v-model="coin"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="symbol in allSymbols"
            :value="symbol"
            :key="symbol"
            :label="symbol.toUpperCase()"
          >
          </el-option>
        </el-select>
      </div>

      <div class="col-2">
        <el-select
          class="form-select-solid"
          :placeholder="$t('currencyScreen.network')"
          v-model="network"
          clearable
          filterable
          @clear="refreshTable"
        >
          <el-option
            v-for="nw in allNetworks"
            :value="nw"
            :key="nw"
            :label="nw.toUpperCase()"
          >
          </el-option>
        </el-select>
      </div>

      <div class="col-2 col-offset-6">
        <button
          class="btn btn-primary w-100"
          :disabled="searching"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!searching" class="fas fa-search fa-fw"></i>
          <i v-if="searching" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
      </div>
    </div>

    <div class="card-body pt-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-detail="{ row: item }">
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#edit-currency-modal"
            @click="editCurrency(item)"
          >
            {{ $t('currencyScreen.editBtn') }}
          </button>
        </template>

        <template v-slot:cell-deposit="{ row: item }">
          <label
            class="form-check form-switch form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              name="deposit"
              type="checkbox"
              v-model="item.on_deposit"
              @change="changeStatusDeposit(item)"
            />
          </label>
        </template>

        <template v-slot:cell-withdraw="{ row: item }">
          <label
            class="form-check form-switch form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              name="withdraw"
              type="checkbox"
              v-model="item.on_withdrawal"
              @change="changeStatusWithdraw(item)"
            />
          </label>
        </template>
      </datatable>
    </div>

    <down-currency-modal />
    <edit-currency-modal
      :allCoins="allCoins"
      :currencyEdit="currencyEdit"
      @editCurrencySuccess="refreshTable"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import DownCurrencyModal from '@/views/currency/components/DownCurrencyModal.vue'
import EditCurrencyModal from '@/views/currency/components/EditCurrencyModal.vue'
import Swal from 'sweetalert2'
import { CurrencyService } from '@/views/currency/services/CurrencyService'
import {
  TRANSACTION_TYPE_DEPOSIT,
  TRANSACTION_TYPE_WITHDRAW,
  ENV_TESTNET,
  ENV_MAINNET,
} from '@/views/currency/variables/currency.const'

export default defineComponent({
  name: 'CurrencySetting',
  components: {
    Datatable,
    DownCurrencyModal,
    EditCurrencyModal,
  },
  data() {
    return {
      coin: '',
      allCoins: [],
      allSymbols: [] as string[],
      allNetworks: [] as string[],
      network: '',
      searching: false,
      tableReloadKey: 1,
      currencyEdit: null,
      tableConfig: {
        dataSource: (params) =>
          this.getDataSource({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'coin',
            title: 'currencyScreen.coin',
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'name',
            title: 'currencyScreen.coinName',
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'network',
            title: 'currencyScreen.network',
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'site_address',
            title: 'currencyScreen.siteAddress',
            sortable: false,
          },
          {
            key: 'detail',
            title: 'currencyScreen.detail',
            sortable: false,
          },
          {
            key: 'deposit',
            title: 'currencyScreen.deposit',
            sortable: false,
          },
          {
            key: 'withdraw',
            title: 'currencyScreen.withdraw',
            sortable: false,
          },
        ],
        configPage: true,
      } as ITableConfig,
    }
  },
  created() {
    this.getAllData()
  },
  mounted() {
    setCurrentPageBreadcrumbs('menu.currencySetting', ['currency'])
  },
  computed: {
    query: function (): any {
      const queryObject = {}
      if (this.coin) {
        queryObject['coin'] = this.coin.trim().toLowerCase()
      }

      if (this.network) {
        queryObject['network'] = this.network.trim().toLowerCase()
      }

      return queryObject
    },
  },
  methods: {
    refreshTable() {
      this.tableReloadKey++
    },

    async getDataSource(params) {
      try {
        if ('sort' in params && !params['sort']) {
          delete params['sort']
          delete params['sort_type']
        }

        this.searching = true
        const { data } = await CurrencyService.getListCurrency(params)
        if ('data' in data) {
          const newListCurrency = data['data'].map((currency) => {
            const networks = currency?.networks?.[0]
            return {
              ...currency,
              coin_name: currency['name'],
              network: networks ? networks.network : '',
              site_address: networks ? networks.transaction_explorer : '',
            }
          })
          data['data'] = newListCurrency
          this.searching = false
          return {
            status: HttpStatus.OK,
            data,
          }
        }
        this.searching = false
      } catch (err) {
        this.searching = false
      }
    },

    async onSearch() {
      this.refreshTable()
    },

    async editCurrency(item) {
      this.currencyEdit = item
    },

    async changeStatusDeposit(item) {
      const coin: any = item
      const env = item?.networks?.[0]?.env ?? ENV_MAINNET
      const params = {
        coin: coin.coin,
        type: TRANSACTION_TYPE_DEPOSIT,
        env: env,
      }

      if (item.on_deposit) {
        const confirm = await Swal.fire({
          icon: 'warning',
          text: this.$t('currencyScreen.enableDepositConfirm'),
          showCancelButton: true,
          confirmButtonText: this.$t('yes'),
          cancelButtonText: this.$t('no'),
        })
        if (confirm.isConfirmed) {
          params['status'] = 1
        } else {
          item.on_deposit = false
        }
      } else {
        const confirm = await Swal.fire({
          icon: 'warning',
          text: this.$t('currencyScreen.disableDepositConfirm'),
          showCancelButton: true,
          confirmButtonText: this.$t('yes'),
          cancelButtonText: this.$t('no'),
        })
        if (confirm.isConfirmed) {
          params['status'] = 0
        } else {
          item.on_deposit = true
        }
      }

      if ('status' in params) {
        try {
          const { data } = await this.changeStatus(params)
          if (!data.result) {
            this.$toastr.error(this.$t('currencyScreen.changeStatusFail'))
            // reset when has error
            if (item.on_deposit) {
              item.on_deposit = false
            } else {
              item.on_deposit = true
            }
          }
          this.$toastr.success(this.$t('currencyScreen.changeStatusSuccess'))
        } catch (err) {
          this.$toastr.error(this.$t('currencyScreen.changeStatusFail'))
          // reset when has error
          if (item.on_deposit) {
            item.on_deposit = false
          } else {
            item.on_deposit = true
          }
        }
      }
    },

    async changeStatusWithdraw(item) {
      const coin: any = item
      const env = item?.networks?.[0]?.env ?? ENV_MAINNET
      const params = {
        coin: coin.coin,
        type: TRANSACTION_TYPE_WITHDRAW,
        env: env,
      }

      if (item.on_withdrawal) {
        const confirm = await Swal.fire({
          icon: 'warning',
          text: this.$t('currencyScreen.enableWithdrawalConfirm'),
          showCancelButton: true,
          confirmButtonText: this.$t('yes'),
          cancelButtonText: this.$t('no'),
        })
        if (confirm.isConfirmed) {
          params['status'] = 1
        } else {
          item.on_withdrawal = false
        }
      } else {
        const confirm = await Swal.fire({
          icon: 'warning',
          text: this.$t('currencyScreen.disableWithdrawlConfirm'),
          showCancelButton: true,
          confirmButtonText: this.$t('yes'),
          cancelButtonText: this.$t('no'),
        })
        if (confirm.isConfirmed) {
          params['status'] = 0
        } else {
          item.on_withdrawal = true
        }
      }

      if ('status' in params) {
        try {
          const { data } = await this.changeStatus(params)
          if (!data.result) {
            this.$toastr.error(this.$t('currencyScreen.changeStatusFail'))
            // reset when has error
            if (item.on_withdrawal) {
              item.on_withdrawal = false
            } else {
              item.on_withdrawal = true
            }
            return
          }
          this.$toastr.success(this.$t('currencyScreen.changeStatusSuccess'))
        } catch (err) {
          this.$toastr.error(this.$t('currencyScreen.changeStatusFail'))
          // reset when has error
          if (item.on_withdrawal) {
            item.on_withdrawal = false
          } else {
            item.on_withdrawal = true
          }
        }
      }
    },

    async changeStatus(body) {
      return CurrencyService.changeStatus(body)
    },

    async getAllData() {
      const { data } = await CurrencyService.getListCurrency({})
      if ('data' in data) {
        this.allCoins = data['data'] ?? []

        // search options
        let allSymbols: string[] = []
        let allNetworks: string[] = []
        for (let currency of data['data']) {
          const networks = currency?.networks?.[0]
          allSymbols.push(currency?.coin)
          if (networks.network) {
            allNetworks.push(networks.network)
          }
          this.allSymbols = [...new Set(allSymbols)]
          this.allNetworks = [...new Set(allNetworks)]
        }
      }
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/currency_setting.scss';
</style>
