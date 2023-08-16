<template>
  <div class="card" id="currency-setting-screen">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">
        {{ $t('currencyScreen.listCurrency') }}
      </div>

      <div class="card-toolbar d-flex">
        <button
          class="btn btn-primary ml-4"
          :title="$t('currencyScreen.activeCurrency')"
          data-bs-toggle="modal"
          data-bs-target="#active-currency-modal"
          @click="currencyActive = null"
        >
          <span class="d-none d-lg-inline-block">{{
            $t('currencyScreen.activeCurrency')
          }}</span>
        </button>
      </div>
    </div>

    <div class="row mx-5 d-flex">
      <div class="col-2">
        <el-input v-model="coin" type="text" placeholder="Coin" clearable />
      </div>

      <div class="col-2">
        <el-input
          v-model="network"
          type="text"
          placeholder="Network"
          clearable
        />
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
        <template v-slot:cell-active="{ row: item }">
          <button
            class="btn btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#active-currency-modal"
            @click="activeCoin(item)"
          >
            {{ $t('currencyScreen.activeBtn') }}
          </button>
        </template>
      </datatable>
    </div>

    <active-currency-modal
      :currencyActive="currencyActive"
      @resetCurrencyActive="resetCurrencyActive"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { HttpStatus } from '@/core/variables/common.enum'
import ActiveCurrencyModal from '@/views/currency/components/ActiveCurrencyModal.vue'

export default defineComponent({
  name: 'CurrencyDown',
  components: {
    Datatable,
    ActiveCurrencyModal,
  },
  data() {
    return {
      coin: '',
      network: '',
      searching: false,
      tableReloadKey: 1,
      currencyActive: null,
      tableConfig: {
        dataSource: (params) =>
          this.getDataSource({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'coin',
            title: this.$t('currencyScreen.coin'),
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'coin_name',
            title: this.$t('currencyScreen.coinName'),
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'network',
            title: this.$t('currencyScreen.network'),
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'site_address',
            title: this.$t('currencyScreen.siteAddress'),
            sortable: false,
          },
          {
            key: 'active',
            title: this.$t('currencyScreen.activeBtn'),
            sortable: false,
          },
        ],
        configPage: true,
      } as ITableConfig,
    }
  },
  mounted() {
    setCurrentPageBreadcrumbs('menu.currencyDown', ['currency'])
  },
  computed: {
    query: function (): any {
      const queryObject = {}
      if (this.coin) {
        queryObject['coin'] = this.coin
      }

      if (this.network) {
        queryObject['network'] = this.network
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
        const data = [
          {
            coin: 'etc',
            coin_name: 'etc',
            network: 'erc20',
            site_address: 'site_address',
            status: false,
          },
        ]
        const total = data.length
        return {
          status: HttpStatus.OK,
          data: {
            data: data,
            pagination: {
              page: params.page,
              size: params.per_page,
              total: total,
            },
          },
        }
      } catch (err) {
        //
      }
    },

    async onSearch() {
      this.searching = true
      this.refreshTable()
    },

    activeCoin(item) {
      this.currencyActive = item
    },

    resetCurrencyActive() {
      this.currencyActive = null
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/currency_setting.scss';
</style>
