<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('importExcel.importBalance') }}
      </div>
      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <el-form>
        <el-form-item
          :label="$t('importExcel.totalRows')"
          :label-width="formLabelWidth"
          class="mb-0"
        >
          {{ summaryResponse.data?.total_rows }}
        </el-form-item>
        <el-form-item
          :label="$t('importExcel.failedRows')"
          :label-width="formLabelWidth"
          class="mb-0"
        >
          {{ summaryResponse.data?.failed_rows }}
        </el-form-item>
        <el-form-item
          :label="$t('importExcel.succeedRows')"
          :label-width="formLabelWidth"
        >
          {{ summaryResponse.data?.succeed_rows }}
        </el-form-item>
      </el-form>
      <button
        class="btn btn-primary ml-2"
        @click="btnImportClick"
        :disabled="isReadingExcel"
      >
        <span class="indicator-label">
          {{ $t('importExcel.uploadFile') }}
        </span>
        <span class="indicator-progress">
          {{ $t('importExcel.actionImport') }}
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
      <input
        type="file"
        ref="fileUpload"
        class="d-none"
        accept=".xls,.xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
        @change="handleFileUpload($event)"
      />
      <datatable :config="tableConfig" :force-reload-key="reloadKey">
        <template v-slot:cell-action="{ row: balanceImportFile }">
          <button
            class="btn btn-sm btn-primary ml-5"
            @click="() => showDetail(balanceImportFile)"
          >
            {{ $t('detail') }}
          </button>
          <button
            class="btn btn-sm btn-primary ml-5"
            @click="() => downloadFile(balanceImportFile)"
          >
            {{ $t('download') }}
          </button>
        </template>
      </datatable>
      <import-detail
        :fileId="confirmFileId"
        :reload="reload"
        :close="closeConfirmModal"
      ></import-detail>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { ImportFileService } from '@/services/ImportFileService'
import { BALANCE_IMPORT_FILE_STATUS } from '@/enums/import-file.enum'
import { HttpStatus } from '@/core/variables/common.enum'
import Swal from 'sweetalert2'
import { Mutations } from '@/store/enums/StoreEnums'
import store from '@/store'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import {
  BalanceImportFile,
  BalanceImportSummaryResponse,
  ListBalanceImportFileRequest,
  UploadFileResponse,
} from '@/interfaces/import-file.interface'
import ImportDetail from './ImportDetail.vue'

const formLabelWidth = '200px'

export default defineComponent({
  name: 'ImportExcelBalance',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('importExcel.balanceTitle', [])
  },
  components: { Datatable, ImportDetail },
  data() {
    return {
      summaryResponse: {} as BalanceImportSummaryResponse,
      confirmFileId: '',
      reloadKey: 0,
      isReadingExcel: false,
      maxFileSize: 5242880,
      formLabelWidth,
      tableConfig: {
        identifyField: 'import_balance_id',
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'file_name',
            title: this.$t('importExcel.balance.name'),
            sortable: false,
            class: 'text-center td-w-350px',
          },
          {
            key: 'status',
            title: this.$t('importExcel.balance.status'),
            sortable: false,
            class: 'text-center',
            render: (value) => {
              return this.$t(
                'importExcel.balance.' + BALANCE_IMPORT_FILE_STATUS[value],
              )
            },
          },
          {
            key: 'created_at',
            title: this.$t('importExcel.balance.createdAt'),
            sortable: false,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD HH:mm:ss')
            },
            class: 'text-center',
          },
          {
            key: 'updated_at',
            title: this.$t('importExcel.balance.updatedAt'),
            sortable: false,
            render: (value) => {
              return convertTimestampToDate(value, 'YYYY/MM/DD HH:mm:ss')
            },
            class: 'text-center',
          },
          {
            key: 'action',
            title: '',
            class: 'text-center td-w-200px',
          },
        ],
        configPage: true,
      } as ITableConfig,
    }
  },
  created() {
    this.getSummary()
  },
  methods: {
    // open input select file
    btnImportClick() {
      ;(this.$refs['fileUpload'] as any).click()
    },
    getSummary() {
      ImportFileService.getSummary().then((response) => {
        this.summaryResponse = response
      })
    },
    showDetail(balanceImportFile: BalanceImportFile) {
      this.confirmFileId = balanceImportFile.id
    },
    downloadFile(balanceImportFile: BalanceImportFile) {
      const fileId = balanceImportFile.id
      const originalFileName = balanceImportFile.file_name
      const dotLastIndex = originalFileName.lastIndexOf('.')
      const extension =
        dotLastIndex > 0 ? originalFileName.substring(dotLastIndex) : ''
      const name =
        dotLastIndex > 0
          ? originalFileName.substring(0, dotLastIndex)
          : originalFileName
      const createdAt = convertTimestampToDate(
        String(balanceImportFile.created_at),
        'YYYY-MM-DD',
      )
      const fileName = `${name}.${createdAt}${extension}`
      return ImportFileService.getBalanceImportFileDownload(fileId, fileName)
    },
    async handleFileUpload(event: any) {
      this.isReadingExcel = true
      //check extension of file

      const file: File = event.target.files[0]
      if (!file) {
        this.showWarning(this.$t('importExcel.badRequest'))
      }

      const { isConfirmed } = await Swal.fire({
        text:
          this.$t('importExcel.confirmImportFile') +
          " '" +
          file.name +
          "'" +
          ' ?',
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('importExcel.actionSend'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (!isConfirmed) {
        this.clearFileInput()
        return
      }

      const extension = file.name.split('.').pop()
      if (!extension || !['xlsx', 'xls'].includes(extension)) {
        this.showWarning(this.$t('importExcel.extensionError'))
        return false
      }

      //check file max size
      // file have size < 5MB (5242880 byte)
      if (file.size > this.maxFileSize) {
        this.showWarning(this.$t('importExcel.maxFileSize'))
        return false
      }

      //upload file to sever
      await this.uploadFileToServer(file)
    },

    async getDataSource(params) {
      const paramsFilter: ListBalanceImportFileRequest = {
        page: params.page,
        size: params.limit,
      }
      const fileResponse = await ImportFileService.getListBalanceImportFiles(
        paramsFilter,
      )
      const files = fileResponse.data

      return {
        status: HttpStatus.OK,
        data: {
          data: files.data,
          pagination: {
            page: files.paginate?.page,
            size: files.paginate?.size,
            total: files.paginate?.total,
          },
        },
      }
    },

    showWarning(errorMessage: string) {
      this.$toastr.warning(errorMessage)
      this.clearFileInput()
    },

    async uploadFileToServer(file: File) {
      let formData = new FormData()
      formData.append('file', file)
      formData.append('admin_id', this.$store.getters.currentUser.id)
      store.commit(Mutations.SHOW_API_LOADING, true)

      ImportFileService.uploadFileImportBalance(formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
        .then((response) => {
          if (
            response?.status !== HttpStatus.OK &&
            response?.status !== HttpStatus.CREATED
          ) {
            this.showErrorMessage(response)
          } else {
            this.reload()
            this.confirmFileId = response.data.data.fileId
            this.clearFileInput()
          }
          store.commit(Mutations.SHOW_API_LOADING, false)
        })
        .catch(() => {
          this.$toastr.error(this.$t('error'))
          this.clearFileInput()
          store.commit(Mutations.SHOW_API_LOADING, false)
        })
    },
    reload() {
      this.reloadKey++
      this.getSummary()
      this.clearFileInput()
    },
    closeConfirmModal() {
      this.confirmFileId = ''
    },
    showErrorMessage(response: UploadFileResponse) {
      this.clearFileInput()
      if (response?.data?.message === 'BALANCE.MAX_FILE_AMOUNT') {
        this.$toastr.error(this.$t('importExcel.balanceMaxFileAmountError'))
        return
      }
      this.$toastr.error(this.$t('importExcel.badRequest'))
    },

    clearFileInput() {
      ;(this.$refs['fileUpload'] as any).value = null
      this.isReadingExcel = false
    },
  },
})
</script>

<style lang="scss" scoped>
.ml-5 {
  margin-left: 5px;
}
</style>
