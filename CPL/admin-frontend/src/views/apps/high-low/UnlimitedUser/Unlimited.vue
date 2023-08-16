<template>
  <div class="card p-8">
    <div class="d-flex justify-content-end">
      <a
        class="btn btn-primary me-1 text-uppercase"
        @click="handleRegisterUser"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_register"
      >
        {{ $t('highLow.registerNewUser') }}
      </a>
    </div>
    <div class="stick-horizontal"></div>

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
    </div>
    <div class="card-body p-0">
      <datatable :config="tableConfig" :forceReloadKey="tableReloadKey">
        <template v-slot:cell-action="{ row: user }">
          <a
            class="btn btn-sm btn-primary me-1 text-uppercase"
            @click="removeSuspension(user.id, user.email)"
          >
            {{ $t('delete') }}
          </a>
        </template>
      </datatable>
      <div class="modal-backdrop fade show" v-if="isOpenModal"></div>
      <Modal
        @refreshTable="refreshTable"
        v-if="isOpenModal"
        @onClickClose="onClickClose"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import { defineComponent } from 'vue'
import CONFIG from '@/config'
import Swal from 'sweetalert2'

import Modal from './RegisterModal.vue'
import { HighLowService } from '@/services/HighLowService'
import { convertTimestampToDate } from '@/core/helpers/common.helper'
import { format } from 'date-fns'
import { HttpStatus } from '@/core/variables/common.enum'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'Unlimited',
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
      isOpenModal: false,
      searchText: '',
      loading: false,
      tableReloadKey: 1,

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
          HighLowService.getUnlimitedUser({
            ...params,
            ...this.query,
          }),
        columns: [
          {
            key: 'no',
            title: 'no',
            sortable: true,
            class: 'text-center td-w-50px',
          },
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-200px min-w-150px',
          },
          {
            key: 'lastLogin',
            title: 'highLow.lastLogin',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              return value
                ? convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
                : value
            },
          },
          {
            key: 'createdAt',
            title: 'highLow.unlimitedUserRegistrationDate',
            sortable: true,
            class: 'text-center td-w-200px min-w-150px',
            render: (value) => {
              if (value) {
                return value ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss') : ''
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
        // getExport: () => UserService.getUsersExport(),
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

          let data = await HighLowService.exportUnlimitedUser(query)

          if (data) {
            this.$toastr.success(this.$t('success'))
          } else {
            this.$toastr.error(this.$t('serverError'))
          }

          return data
        }
      } as ITableConfig,
      CONFIG,
    }
  },
  computed: {
    query: function (): any {
      return {
        search_text: this.searchText.trim() ? this.searchText.trim() : undefined,
      }
    },
  },
  methods: {
    handleRegisterUser() {
      this.isOpenModal = true
    },
    onClickClose() {
      this.isOpenModal = false
    },
    refreshTable() {
      this.tableReloadKey++
    },
    removeSuspension: async function (id: number, name: string) {
      if (id) {
        const { isConfirmed } = await Swal.fire({
          text: this.$t('confirmDeleteUserMessage', { name }),
          icon: 'question',
          buttonsStyling: false,
          showCancelButton: true,
          confirmButtonText: this.$t('Yes'),
          customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-secondary',
          },
        })

        if (!isConfirmed) {
          return
        }

        this.loading = true
        const result = await HighLowService.deleteUnlimitedUser(id)
        this.loading = false

        if (result.status == HttpStatus.OK) {
          this.$toastr.success(this.$t('success'))
          this.$emit('saved', result.data)
          this.refreshTable()
          return
        }

        if (result.data?.errors?.[0]?.property) {
          this.$toastr.error(
            'Please check field: ' + result.data.errors[0].property,
          )
          return
        }

        this.$toastr.error(result.data.message)
        return
      }
    },
    onSearch() {
      this.refreshTable()
    },
    onReset() {
      this.searchText = ''

      this.refreshTable()
    },
  },
})
</script>
