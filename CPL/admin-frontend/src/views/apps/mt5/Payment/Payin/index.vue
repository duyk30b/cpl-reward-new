<template>
  <div id="mt5-payment-deposit" class="card p-8">
    <div class="card-title">
      <h4 class="text-primary">DEPOSIT CONFIRMATION</h4>
    </div>

    <!--Search section-->
    <div class="border p-4 mb-6">
      <div class="row justify-content-between">
        <div class="row col-md-11">
          <div class="col-md-6">
            <input
              class="form-control"
              placeholder="Search Email ..."
              v-model="searchEmail"
              @keyup="(e) => e.keyCode == 13 && onSearch()"
            />
          </div>
          <div class="col-md-6">
            <input
              class="form-control"
              placeholder="Search MT5 ID ..."
              v-model="searchMt5Id"
              @keyup="(e) => e.keyCode == 13 && onSearch()"
            />
          </div>
        </div>

        <div class="d-flex col-md-1 align-self-end justify-content-end">
          <button
            class="btn btn-primary w-100"
            :disabled="loading"
            @click="onSearch"
            title="Search"
          >
            <i v-if="!loading" class="fas fa-search fa-fw"></i>
            <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="d-none d-lg-inline-block">{{ $t('search') }}</span>
          </button>
        </div>
      </div>

      <div class="row justify-content-between mt-4">
        <div class="row col-md-11">
          <!-- Date range -->
          <div class="col-md-4">
            <label class="form-label">Created Date:</label>
            <date-range-picker-options
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              v-model="dateRange"
              :shortcuts="shortcuts"
              format="YYYY-MM-DD"
            ></date-range-picker-options>
          </div>
          <!-- Status -->
          <div class="col-md-2">
            <label class="form-label">{{ $t('highLow.status') }}:</label>
            <v-select
              :options="statusOptions"
              option-value="id"
              option-label="name"
              :placeholder="$t('highLow.status')"
              v-model="status"
              :multiple="false"
              :can-deselect="true"
              :remote="false"
              :sourceFunction="false"
            ></v-select>
          </div>
          <div class="col-md-6"></div>
        </div>
        <div class="d-flex col-md-1 align-self-end justify-content-end">
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
    </div>

    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-action="{ row: payin }">
          <a
            class="btn btn-sm btn-primary text-uppercase"
            @click="handleUpdatepayin(payin)"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_payin_update_modal"
          >
            {{
              payin.status.trim() == 'DONE' ||
              payin.status.trim() == 'REJECTED' ||
              payin.status.trim() == 'FAILED'
                ? 'DETAIL'
                : 'EDIT'
            }}
          </a>
        </template>
        <template v-slot:cell-status="{ row: item }">
          <span :class="formatClass(item.status)">
            {{ item.status }}
          </span>
        </template>
        <template v-slot:cell-amount="{ row: item }">
          <span>
            {{
              formatAmount(item.amount) +
              ' ' +
              (item.quote == 'JPY' ? '¥' : '$')
            }}
          </span>
        </template>
        <template v-slot:cell-totalAmount="{ row: item }">
          <span>
            {{
              formatAmount(item.totalAmount) +
              ' ' +
              (item.baseCurrency == 'JPY' ? '¥' : '$')
            }}
          </span>
        </template>
      </datatable>
    </div>

    <ModalConfirm @refreshTable="refreshTable" :payinData="payinModalUpdate" />
  </div>
</template>

<style>
#mt5-payment-withdrawal table.dataTable tr td {
  white-space: pre-line;
}
</style>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import CONFIG from '@/config'
import ModalConfirm from './modal/UpdateModal.vue'
import { useI18n } from 'vue-i18n'
import { MT5Service } from '@/services/MT5Service'
import { formatUTCToLocalTime } from '@/core/helpers/util'
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: 'payins',
  components: {
    Datatable,
    ModalConfirm,
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
      searchEmail: '',
      searchMt5Id: '',
      loading: false,
      tableReloadKey: 1,
      dateRange: [
        '2023-01-01',
        new Date().getFullYear() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getDate(),
      ],
      shortcuts: [
        {
          text: this.$t('highLow.lastMonth'),
          value: () => {
            const end = endOfMonth(subMonths(new Date(), 1))
            const start = startOfMonth(subMonths(new Date(), 1))
            return [start, end]
          },
        },
        {
          text: this.$t('highLow.thisMonth'),
          value: () => {
            const end = new Date()
            const start = startOfMonth(new Date())
            return [start, end]
          },
        },
      ],

      // status,
      status: '',
      statusOptions: [
        { id: '', name: 'ALL' },
        { id: '0', name: 'PROCESSING' },
        { id: '1', name: 'FAILED' },
        { id: '2', name: 'REJECTED' },
        { id: '4', name: 'DONE' },
      ],

      payinModalUpdate: {
        payinId: '',
        mt5Id: '',
        amount: '',
        totalAmount: '',
        cplId: '',
        payinStatus: '',
        reasonAdmin: '',
        baseCurrency: '',
        quote: '',
        emailBitcastle: '',
      },

      tableConfig: {
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        onSuccess: (payinDetail, table) => {
          this.$data['loading'] = table.loading

          table.pagination = payinDetail.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount)
            table.getData(true)
          else {
            table.data = payinDetail.data.data || []
            table.data.forEach((row, index) => {
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
          MT5Service.getListPayin({
            ...params,
            ...this.query,
            size: 15,
          }),
        columns: [
          {
            key: 'id',
            title: 'No.',
            class: 'ml-5 text-center td-w-50px min-w-50px',
          },
          {
            key: 'email_bitcastle',
            title: 'mt5.email',
            class: 'ml-5 text-left td-w-200px min-w-150px',
          },
          {
            key: 'mt5Id',
            title: 'MT5 ID',
            sortable: true,
            class: 'ml-5 text-center td-w-100px min-w-80px',
          },
          {
            key: 'amount',
            title: 'mt5.amount',
            class: 'ml-5 text-center td-w-100px min-w-80px',
          },
          {
            key: 'totalAmount',
            title: 'Estimate Amount',
            class: 'ml-5 text-center td-w-100px min-w-80px',
          },
          {
            key: 'status',
            title: 'mt5.status',
            class: 'ml-5 text-center td-w-100px min-w-80px ',
          },
          {
            key: 'created_date',
            title: 'mt5.createdDate',
            class: 'ml-5 text-right td-w-150px min-w-120px',
            sortable: true,
            render: (value) => {
              return formatUTCToLocalTime(value, 'DD-MM-YYYY HH:mm:ss')
            },
          },
          {
            key: 'updated_date',
            title: 'Updated Date',
            class: 'ml-5 text-right td-w-150px min-w-120px',
            sortable: true,
            render: (value) => {
              return formatUTCToLocalTime(value, 'DD-MM-YYYY HH:mm:ss')
            },
          },
          {
            key: 'remark',
            title: 'mt5.remark',
            class: 'ml-5 text-left td-w-300px min-w-200px break-line',
          },
          {
            key: 'action',
            title: 'CONFIRM',
            class: 'text-center td-w-80px min-w-80px',
          },
        ],
        configPage: false,
        configColumn: false,
        activeExport: false,
        tableName: 'payin-echelon-table',
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
        status: this.status || undefined,
        search_email: this.searchEmail.trim()
          ? this.searchEmail.trim()
          : undefined,
        search_mt5: this.searchMt5Id.trim()
          ? this.searchMt5Id.trim()
          : undefined,
      }
    },
    fromTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => {
          let startDate = item
          if (item) {
            startDate = item + ' 00:00:00'
          }

          return this.validateDate(startDate)
        })[0]
        .toString()
    },
    toTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => {
          let endDate = item
          if (item != '') {
            endDate = item + ' 23:59:59'
          }

          return this.validateDate(endDate)
        })[1]
        .toString()
    },
  },
  methods: {
    handleUpdatepayin: async function (payin) {
      const payinDetail = await MT5Service.getPayinDetail(payin.payin_id)
      console.log(payinDetail)
      if (payinDetail['status'] != 200 || !payinDetail['data']['success']) {
        this.$toastr.error('Could not find payin detail')
        return
      }

      // f**cking mad
      this.payinModalUpdate = {
        payinId: payinDetail['data']['data']['payin_id'],
        mt5Id: payinDetail['data']['data']['mt5_id'],
        amount: payinDetail['data']['data']['amount'],
        totalAmount: payinDetail['data']['data']['total_amount'],
        cplId: payinDetail['data']['data']['cpl_id'],
        payinStatus: payinDetail['data']['data']['payinStatus'],
        reasonAdmin: payinDetail['data']['data']['reason_admin'],
        baseCurrency: payinDetail['data']['data']['base_currency'],
        quote: payinDetail['data']['data']['quote'],
        emailBitcastle: payinDetail['data']['data']['email_bitcastle'],
      }
    },
    onSearch() {
      this.refreshTable()
    },
    onReset() {
      this.searchEmail = ''
      this.searchMt5Id = ''
      ;(this.dateRange = [
        '2023-01-01',
        new Date().getFullYear() +
          '-' +
          (new Date().getUTCMonth() + 1) +
          '-' +
          new Date().getDate(),
      ]),
        (this.status = '')

      this.refreshTable()
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    formatClass(status: string) {
      switch (status.toUpperCase()) {
        case 'PROCESSING':
          return 'text-warning'
        case 'FAILED':
          return 'text-danger'
        case 'REJECTED':
          return 'text-danger'
        case 'DONE':
          return 'text-success'
        default:
          return 'text-primary'
      }
    },
    formatAmount(amount) {
      return new BigNumber(amount).toFormat()
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
