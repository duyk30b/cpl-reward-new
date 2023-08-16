<template>
  <div class="card p-8">
    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-action="{ row: user }">
          <a
            class="btn btn-sm btn-light me-2 text-uppercase"
            @click="handleEditGrantPayout(user)"
            data-bs-toggle="modal"
            data-bs-target="#kt_update_modal_user_grant_payout_modal"
          >
            {{ $t('highLow.edit') }}
          </a>
          <a
            v-if="user.status === 1"
            class="btn btn-sm btn-danger me-2 text-uppercase"
            @click="disableGrantPayout(user.userId)"
          >
            {{ $t('highLow.disable') }}
          </a>
          <a
            v-if="user.status === 0"
            class="btn btn-sm btn-success me-2 text-uppercase"
            @click="enableGrantPayout(user.userId)"
          >
            {{ $t('highLow.enable') }}
          </a>
        </template>
        <template v-slot:right-toolbar>
          <div
            class="d-flex justify-content-end align-items-center btn-action-groups"
            data-kt-user-table-toolbar="selected"
          >
            <button
              class="btn btn-primary me-1 text-uppercase"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_user_grant_payout_modal"
              @click="handlePreGrantPayoutUser"
            >
              <i class="fas fa-plus fa-fw"></i>
              <span class="d-none d-lg-inline-block">{{
                $t('highLow.grantPayout')
              }}</span>
            </button>
          </div>
        </template>
      </datatable>
      <InsertModal @refreshTable="refreshTable" :dataModal="dataUserInsert" />
      <UpdateModal @refreshTable="refreshTable" :dataModal="dataUserUpdate" />
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import { defineComponent } from 'vue'
import CONFIG from '@/config'
import Swal from 'sweetalert2'

import InsertModal from './modal/InsertUserGrantPayoutModal.vue'
import UpdateModal from './modal/UpdateUserGrantPayoutModal.vue'
import { HighLowService } from '@/services/HighLowService'
import { format } from 'date-fns'
import { HttpStatus } from '@/core/variables/common.enum'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'UserGrantPayout',
  components: {
    Datatable,
    InsertModal,
    UpdateModal,
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
      loading: false,
      tableReloadKey: 1,
      dataUserInsert: {
        dataUser: null,
        userId: '',
        payoutBonus: '',
      },
      dataUserUpdate: {
        dataUser: null,
        userId: '',
        payoutBonus: '',
      },
      tableConfig: {
        buttonSectionClass: 'flex-1 align-self-end mb-4',
        onSuccess: (res, table) => {
          this.$data['loading'] = table.loading

          table.pagination = res.data.pagination || {}
          if (table.pageCount && table.pagination.page > table.pageCount) {
            table.getData(true)
          } else {
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
          HighLowService.getUserGrantPayout({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'highLow.no',
            sortable: false,
            class: 'text-center td-w-50px',
          },
          {
            key: 'userId',
            title: 'highLow.userId',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'email',
            title: 'highLow.email',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'payoutBonus',
            title: 'highLow.payoutBonus',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'createdAt',
            title: 'highLow.grantedDate',
            sortable: false,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              if (value) {
                return value
                  ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
                  : ''
              }

              return ''
            },
          },
          {
            key: 'action',
            title: '',
            class: 'text-center td-w-200px min-w-150px',
          },
        ],
        configPage: true,
        configColumn: false,
        activeExport: true,
        tableName: 'unlimited-user-table',
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

          let data = await HighLowService.exportGrantPayout(query)

          if (data) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        },
        searchColumns: [
          {
            key: 'search_text',
            title: 'email',
            searchType: DatatableSearchType.TEXT,
          },
        ],
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        lang: this.getLang(),
        search_field: 'email',
      }
    },
  },
  methods: {
    handlePreGrantPayoutUser() {
      this.dataUserInsert = {
        dataUser: null,
        userId: '',
        payoutBonus: '',
      }
    },
    refreshTable() {
      this.tableReloadKey++
    },
    handleEditGrantPayout: async function (user) {
      this.dataUserUpdate = {
        dataUser: user.email,
        userId: user.userId.toString(),
        payoutBonus: user.payoutBonus.toString(),
      }
    },
    disableGrantPayout: async function (userId: number) {
      if (userId) {
        await Swal.fire({
          text: 'Are you sure disable grant payout for this user?',
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
            this.loading = true
            return HighLowService.updateUserGrantPayout({ status: 0 }, userId)
          },
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value) {
              if (result.value.status == HttpStatus.OK) {
                this.$toastr.success(this.$t('success'))
                this.refreshTable()
                return
              }
            }

            this.$toastr.error(this.$t('serverError'))
          }
        })
      }
    },
    enableGrantPayout: async function (userId: number) {
      if (userId) {
        await Swal.fire({
          text: 'Are you sure enable grant payout for this use?',
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
            this.loading = true
            return HighLowService.updateUserGrantPayout({ status: 1 }, userId)
          },
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value) {
              if (result.value.status == HttpStatus.OK) {
                this.$toastr.success(this.$t('success'))
                this.refreshTable()
                return
              }
            }

            this.$toastr.error(this.$t('serverError'))
          }
        })
      }
    },
    onSearch() {
      this.refreshTable()
    },
    onReset() {
      this.refreshTable()
    },
  },
})
</script>
