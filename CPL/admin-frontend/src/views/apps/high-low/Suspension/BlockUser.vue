<template>
  <div class="card p-8">
    <!-- Search -->
    <!-- <div class="row justify-content-between mt-4">
      <div class="col-md-4">
        <input
          class="form-control"
          :placeholder="$t('keyword')"
          v-model="searchText"
          @keyup="(e) => e.keyCode == 13 && onSearch()"
        />
      </div>
      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="">{{ $t('search') }}</span>
        </button>
      </div>
    </div> -->
    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-action="{ row: user }">
          <a
            class="btn btn-sm btn-danger me-1 text-uppercase"
            @click="unblockUser(user.id, user.email)"
          >
            {{ $t('highLow.unblock') }}
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
              data-bs-target="#kt_modal_block_user_modal"
              @click="handlePreBlockUser"
            >
              {{ $t('highLow.addBlockUser') }}
            </button>
          </div>
        </template>
      </datatable>
      <Modal @refreshTable="refreshTable" :dataModal="dataUserInsert" />
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

import Modal from './modal/BlockModal.vue'
import { HighLowService } from '@/services/HighLowService'
import { format } from 'date-fns'
import { HttpStatus } from '@/core/variables/common.enum'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'BlockUser',
  components: {
    Datatable,
    Modal,
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
        reason: '',
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
          HighLowService.getBlockedUser({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'no',
            sortable: false,
            class: 'text-center td-w-50px',
          },
          {
            key: 'userId',
            title: 'userId',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'email',
            title: 'email',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'reason',
            title: 'reason',
            sortable: false,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'createdAt',
            title: 'highLow.blockedDate',
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

          let data = await HighLowService.exportBlockedUser(query)

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
    handlePreBlockUser() {
      this.dataUserInsert = {
        dataUser: null,
        userId: '',
        reason: '',
      }
    },
    refreshTable() {
      this.tableReloadKey++
    },
    unblockUser: async function (id: number, name: string) {
      if (id) {
        await Swal.fire({
          text: this.$t('highLow.confirmUnblockUserMessage', { name }),
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
            return HighLowService.deleteBlockedUser(id)
          },
        }).then((result) => {
          if (result.isConfirmed) {
            if (result.value) {
              if (result.value.status == HttpStatus.OK) {
                this.$toastr.success(
                  this.$t('highLow.unBlockSuccess', { value: name }),
                )
                this.refreshTable()
                return
              }
            }

            this.$toastr.error(this.$t('highLow.unBlockFalse', { value: name }))
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
