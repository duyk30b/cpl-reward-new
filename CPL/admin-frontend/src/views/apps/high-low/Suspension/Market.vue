<template>
  <div class="card p-8">
    <!-- Search -->
    <div class="row justify-content-between mt-4">
      <div class="col-md-4">
        <input
          class="form-control"
          :placeholder="$t('keyword')"
          v-model="searchText"
          @keyup="(e) => e.keyCode == 13 && onSearch()"
        />
      </div>
      <div class="d-flex col-md-5 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100 me-5"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
        </button>
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onReset"
          :title="$t('reset')"
        >
          <i v-if="!loading" class="fas fa-sync fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
        </button>
      </div>
    </div>
    <div class="card-body p-0">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
      ></datatable>
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { HighLowService } from '@/services/HighLowService'
import { format } from 'date-fns'
import { defineComponent } from 'vue'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'market',
  components: {
    Datatable,
  },
  setup() {
    const i18n = useI18n()

    const getLang = () => i18n.locale.value
    return {
      getLang,
    }
  },
  data() {
    return {
      searchText: '',
      loading: false,
      tableReloadKey: 1,

      tableConfig: {
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

          table.pagination = res.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount)
            table.getData(true)
          else {
            table.data = res.data.data || []
            table.data.forEach((row, index) => {
              row.no = index + 1
              if (!row.id)
                row.id =
                  index +
                  1 +
                  (table.pagination.page - 1) * table.pagination.size
            })
            if (table.config.drawCallback) table.config.drawCallback()
          }
        },
        dataSource: (params) =>
          HighLowService.getMarket({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'no',
            class: 'text-center td-w-50px',
          },
          {
            key: 'symbol',
            title: 'highLow.market',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
          },
          {
            key: 'emergencyThreshold',
            title: 'highLow.tradingPairEmergency',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              const temp = new BigNumber(value).toFormat()
              return temp + ' USDT'
            },
          },
          {
            key: 'sumProfit',
            title: 'highLow.pairUserProfit',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              const temp = new BigNumber(Number(value).toFixed(2)).toFormat()
              return temp + ' USDT'
            },
          },
          {
            key: 'createdAt',
            title: 'highLow.restrictDate',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              if (value) {
                return format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
              }

              return ''
            },
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: true,
        onSearch: true,
        tableName: 'summary-table',
        createExport: async (params) => {
          let query = {
            lang: this.getLang(),
          }
          if (params) {
            query = {
              ...params,
              ...this.query,
              lang: this.getLang(),
            }
          }

          let data = await HighLowService.exportSuspensionMarket(query)

          if (data) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        },
      } as ITableConfig,
    }
  },
  computed: {
    query: function (): any {
      return {
        search_text: this.searchText.trim()
          ? this.searchText.trim()
          : undefined,
      }
    },
  },
  methods: {
    onSearch() {
      this.refreshTable()
    },
    onReset() {
      this.searchText = ''

      this.refreshTable()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
