<template>
  <div class="card">
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
      <div
        class="d-flex col-md-4 align-self-end justify-content-end mt-8 mt-md-0"
      >
        <button
          class="btn btn-primary w-100 me-6"
          :disabled="loading"
          @click="onReset"
          :title="$t('reset')"
        >
          <i v-if="!loading" class="fas fa-sync fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('reset') }}</span>
        </button>
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onReset"
          :title="$t('update')"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="d-none d-lg-inline-block">{{ $t('update') }}</span>
        </button>
      </div>
    </div>

    <div class="card-body p-0">
      <datatable
        :config="tableConfig"
        :forceReloadKey="tableReloadKey"
        ref="table"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { BigNumber } from 'bignumber.js'
import { format } from 'date-fns'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { UserBalanceService } from '@/services/UserBalanceService'
import { HighLowService } from '@/services/HighLowService'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'orders',
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
      loadingRequestExport: false,
      disabledExportBtn: false,

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
          UserBalanceService.getBalanceUsers({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'no',
            sortable: false,
            class: 'text-center td-w-50px min-w-80px',
          },
          {
            key: 'email',
            title: 'highLow.mailAddress',
            sortable: true,
            class: 'td-w-250px min-w-80px',
          },
          {
            key: 'usdt',
            title: 'USDT',
            sortable: true,
            class: 'td-w-150px min-w-80px',
            render: (value) => {
              return new BigNumber(value).toFormat()
            },
          },
          {
            key: 'bcast',
            title: 'bcast',
            sortable: true,
            class: 'td-w-150px min-w-80px',
            render: (value) => {
              return new BigNumber(value).toFormat()
            },
          },
          {
            key: 'cashback',
            title: 'Cashback',
            class: 'td-w-150px min-w-80px',
            render: (value) => {
              return new BigNumber(value).toFormat()
            },
          },
          {
            key: 'updatedAt',
            title: 'highLow.date',
            class: 'text-center td-w-150px min-w-80px',
            sortable: true,
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
        tableName: 'orders-table',
        // getExport: () => HighLowService.exportUsersBalance({}),
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

          let data = await HighLowService.exportUsersBalance(query)

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
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
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
