<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.importListToBan') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :force-reload-key="reloadKey">
        <template
          v-slot:cell-numeric_order="{
            idx: index,
            page: currentPage,
            size: perPage,
          }"
        >
          {{ getNumericOrder(index, currentPage, perPage) }}
        </template>
        <template v-slot:right-toolbar>
          <div
            class="d-flex justify-content-end align-items-center btn-action-groups"
            data-kt-user-table-toolbar="selected"
          >
            <button
              class="btn btn-primary ml-2"
              @click="importBanUsers"
              :disabled="isReadingExcel"
              :data-kt-indicator="isReadingExcel ? 'on' : ''"
            >
              <span class="indicator-label">
                {{ $t('autoWithdraw.actionImport') }}
              </span>
              <span class="indicator-progress">
                {{ $t('autoWithdraw.actionImport') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>

            <input
              type="file"
              class="d-none"
              ref="fileUpload"
              @change="readFileExcel"
            />
          </div>
        </template>
        <template v-slot:cell-status="{ row: log }">
          <span
            class="badge"
            :class="{
              'badge-light': log.status === status.WAITING,
              'badge-light-warning': log.status === status.PROCESSING,
              'badge-light-success': log.status === status.SUCCESS,
              'badge-light-danger': log.status === status.FAIL,
              'badge-light-info': log.status === status.NOT_FOUND,
              'badge-light-primary': log.status === status.DUPLICATED_BANNED,
            }"
            >{{ getTextStatus(log.status) }}</span
          >
        </template>
      </datatable>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import { UserService } from '@/services/UserService'

export default defineComponent({
  name: 'import-ban-history',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.importListToBan', ['users'])
  },
  components: {
    Datatable,
  },
  methods: {
    getNumericOrder(idx, page, size) {
      return idx + 1 + size * (page - 1)
    },
    refreshTable() {
      this.reloadKey++
    },
    getTextStatus(status: number) {
      if (status === this.status.WAITING)
        return this.$t('importListToBan.status.waiting')
      if (status === this.status.PROCESSING)
        return this.$t('importListToBan.status.processing')
      if (status === this.status.SUCCESS)
        return this.$t('importListToBan.status.success')
      if (status === this.status.FAIL)
        return this.$t('importListToBan.status.fail')
      if (status === this.status.NOT_FOUND)
        return this.$t('importListToBan.status.userNotFound')
      if (status === this.status.DUPLICATED_BANNED)
        return this.$t('importListToBan.status.duplicatedBanned')
      return 'N/A'
    },
    importBanUsers() {
      ;(this.$refs['fileUpload'] as any).click()
    },
    async readFileExcel(event) {
      this.isReadingExcel = true
      const file = event.target.files[0]
      const extension = file.name.split('.').pop()
      if (!['csv'].includes(extension)) {
        this.$toastr.error(
          this.$t('importListToBan.UPLOAD_FILE.WRONG_FILE_TYPE'),
        )
        this.isReadingExcel = false
        this.clearFileInput()
        return
      }

      if (file.size === 0) {
        this.$toastr.error(this.$t('importListToBan.UPLOAD_FILE.BLANK_FILE'))
        this.isReadingExcel = false
        this.clearFileInput()
        return
      }

      try {
        const uploadResult = await UserService.uploadBanUsers(file)
        if (uploadResult.status === 201) {
          this.$toastr.success(this.$t('success'))
          this.refreshTable()
        } else {
          this.$toastr.error(
            this.$t(`importListToBan.${uploadResult.data.message}`),
          )
        }
        this.isReadingExcel = false
        this.clearFileInput()
      } catch (err) {
        this.$toastr.error(this.$t('error'))
        this.isReadingExcel = false
        this.clearFileInput()
        this.refreshTable()
      }
    },
    clearFileInput() {
      ;(this.$refs['fileUpload'] as any).value = null
    },
  },
  data() {
    return {
      reloadKey: 0,
      status: {
        WAITING: 1,
        PROCESSING: 2,
        SUCCESS: 3,
        FAIL: 4,
        NOT_FOUND: 5,
        DUPLICATED_BANNED: 6,
      },
      tableConfig: {
        dataSource: (params) => {
          return UserService.getListBanHistories({
            ...params,
          })
        },
        columns: [
          {
            key: 'numeric_order',
            title: 'numericOrder',
            sortable: false,
            class: 'td-w-50px text-center',
          },
          {
            key: 'user_id',
            title: 'userId',
            sortable: true,
            class: 'td-w-100px text-center',
          },
          {
            key: 'email',
            title: 'email',
            sortable: true,
            class: 'td-w-250px text-center',
          },
          {
            key: 'status',
            title: 'status',
            sortable: true,
            class: 'td-w-200px text-center',
          },
          {
            key: 'admin_action_id',
            title: 'importListToBan.adminActionId',
            sortable: true,
            class: 'td-w-100px text-center',
          },
          {
            key: 'request_time',
            title: 'importListToBan.requestTime',
            sortable: true,
            class: 'td-w-200px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'ban_time',
            title: 'importListToBan.banTime',
            sortable: true,
            class: 'td-w-200px text-center',
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY-MM-DD HH:mm:ss')
            },
          },
          {
            key: 'admin_id',
            title: 'importListToBan.adminId',
            sortable: true,
            class: 'td-w-100px text-center',
          },
        ],
        searchColumns: [
          {
            key: 'user_id',
            title: 'userId',
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'admin_action_id',
            title: 'importListToBan.adminActionId',
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig,
      CONFIG,
      isReadingExcel: false,
    }
  },
})
</script>
