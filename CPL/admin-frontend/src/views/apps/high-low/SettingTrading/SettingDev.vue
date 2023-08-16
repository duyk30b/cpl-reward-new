<template>
  <div class="card p-8">
    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-action="{ row: pair }">
          <a
            class="btn btn-sm btn-primary text-uppercase"
            @click="handleUpdatePair(pair)"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_setting_pair_update_modal_dev"
          >
            {{ $t('edit') }}
          </a>
        </template>
        <template v-slot:cell-status="{ row: pair }">
          <span
            class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
          >
            <input
              class="form-check-input"
              type="checkbox"
              name="notifications"
              v-model="pair.status"
              v-on:change="handleUpdateStatus(pair)"
            />
          </span>
        </template>
      </datatable>
    </div>

    <ModalUPdate
      @refreshTable="refreshTable"
      :pairData="pairModalUpdate"
      :id="idModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import CONFIG from '@/config'
import { HighLowService } from '@/services/HighLowService'
import ModalUPdate from './modal/UpdateModal.vue'
import BigNumber from 'bignumber.js'
import { useI18n } from 'vue-i18n'
import Swal from 'sweetalert2'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'pairs',
  components: {
    Datatable,
    ModalUPdate,
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
      idModal: 'kt_modal_setting_pair_update_modal_dev',
      searchText: '',
      loading: false,
      tableReloadKey: 1,

      pairModalInsert: {
        pairId: '',
        decimalPart: '',
        highlowSpread: '',
        turboSpread: '',
        emergencyThreshold: '',
      },

      pairModalUpdate: {
        id: '',
        pairId: '',
        decimalPart: '',
        highlowSpread: '',
        turboSpread: '',
        emergencyThreshold: '',
        createdAt: '',
        updatedAt: '',
      },

      pairOptions: [
        { id: '', name: 'all' },
        { id: 1, name: 'BTC/USD' },
        { id: 2, name: 'ETH/USD' },
        { id: 3, name: 'BCH/USD' },
        { id: 4, name: 'XRP/USD' },
        { id: 5, name: 'LTC/USD' },
        { id: 6, name: 'EUR/USD' },
        { id: 7, name: 'USD/JPY' },
      ],

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
          HighLowService.getPairSetting({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'pairId',
            title: 'highLow.pair',
            class: 'text-center td-w-50px min-w-50px',
            render: (value) => {
              const temp = Array.prototype.slice
                .call(this.pairOptions)
                .find((item) => item.id == value)
              return temp?.name || ''
            },
          },
          {
            key: 'decimalPart',
            title: 'highLow.decimalPart',
            class: 'ml-5 td-w-100px min-w-50px',
          },
          {
            key: 'highlowSpread',
            title: 'highLow.highLowSpread',
            class: 'ml-5 td-w-100px min-w-80px',
            render: (value) => {
              return '+/- ' + new BigNumber(value).toFormat()
            },
          },
          {
            key: 'turboSpread',
            title: 'highLow.lightningSpread',
            class: 'ml-5 td-w-100px min-w-80px',
            render: (value) => {
              return '+/- ' + new BigNumber(value).toFormat()
            },
          },
          {
            key: 'emergencyThreshold',
            title: 'highLow.tradeEmergencyStopThreshold',
            class: 'ml-5 text-center td-w-100px min-w-80px',
            render: (value) => {
              const temp = new BigNumber(value).toFormat()
              return temp + ' USDT'
            },
          },
          {
            key: 'action',
            class: 'text-center td-w-50px min-w-50px',
          },
          {
            key: 'status',
            class: 'text-center td-w-50px min-w-50px',
          },
        ],
        configPage: false,
        configColumn: false,
        activeExport: false,
        tableName: 'setting-trading-pair-table',
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {},
  methods: {
    handleUpdateStatus: async function (pair) {
      pair.status = !pair.status
      const message = `Are you sure ${
        pair.status ? 'DISABLE' : 'ENABLE'
      } this pair?`
      await Swal.fire({
        text: message,
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('Yes'),
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-secondary',
        },
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          const dataBody = {
            id: pair.id,
            active: pair.status ? '0' : '1',
          }
          const result = await HighLowService.updateStatusSettingTradingPair(
            pair.id,
            dataBody,
          )
          if (result && result.status === HttpStatus.OK) {
            this.$toastr.success(this.$t('success'))
            this.refreshTable()
            return
          }
          this.$toastr.error(this.$t('serverError'))
        },
      })
    },
    handleUpdatePair: async function (pair) {
      this.pairModalUpdate = {
        id: pair.id,
        pairId: pair.id,
        decimalPart: pair.decimalPart,
        highlowSpread: new BigNumber(pair.highlowSpread).toFormat(),
        turboSpread: new BigNumber(pair.turboSpread).toFormat(),
        emergencyThreshold: pair.emergencyThreshold,
        createdAt: pair.createdAt,
        updatedAt: pair.updatedAt,
      }
    },
    handleInsertPair: async function () {
      this.pairModalInsert = {
        pairId: '',
        decimalPart: '',
        highlowSpread: '',
        turboSpread: '',
        emergencyThreshold: '',
      }
    },
    exportCSV: async function () {
      const query = {
        lang: this.getLang(),
      }
      let data = await HighLowService.exportPairSetting(query)

      if (data) {
        this.$toastr.success(this.$t('success'))
      } else {
        this.$toastr.error(this.$t('serverError'))
      }
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    refreshTable() {
      this.tableReloadKey++
    },
  },
})
</script>
<style lang="scss" scoped>
.ml-5 {
  margin-left: 20px;
}
</style>
