<template>
  <el-dialog
    :title="$t('importExcel.balanceDetailTitle') + ': ' + file.file_name"
    v-model="modalVisible"
    :before-close="closeModal"
    width="75%"
  >
    <el-form>
      <el-form-item
        :label="$t('service')"
        :label-width="formLabelWidth"
        class="mb-0"
      >
        <el-select
          v-model="file.balance_type"
          filterable
          :disabled="file.status !== BALANCE_IMPORT_FILE_STATUS.PROCESSING"
        >
          <el-option
            v-for="item in balanceTypes"
            :value="item.id"
            :key="item.id"
            :label="item.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('importExcel.totalRows')"
        :label-width="formLabelWidth"
        class="mb-0"
      >
        {{ file.total_rows }}
      </el-form-item>
      <el-form-item
        :label="$t('importExcel.failedRows')"
        :label-width="formLabelWidth"
        class="mb-0"
      >
        {{ file.failed_rows }}
      </el-form-item>
      <el-form-item
        v-if="file.status === BALANCE_IMPORT_FILE_STATUS.SUCCESS"
        :label="$t('importExcel.succeedRows')"
        :label-width="formLabelWidth"
        class="mb-0"
      >
        {{ file.total_rows - file.failed_rows }}
      </el-form-item>
    </el-form>
    <datatable :config="tableConfig" :force-reload-key="reloadKey"></datatable>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeModal">{{ $t('close') }}</el-button>
        <el-button
          v-if="file.status === BALANCE_IMPORT_FILE_STATUS.PROCESSING"
          type="primary"
          @click="submitImportExcel"
        >
          {{ $t('submit') }}
        </el-button>
        <el-button
          v-if="file.status === BALANCE_IMPORT_FILE_STATUS.PROCESSING"
          type="warning"
          @click="cancelImportExcel"
        >
          {{ $t('cancel') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { ImportFileService } from '@/services/ImportFileService'
import Datatable, { ITableConfig } from '@/components/datatable/Datatable.vue'
import {
  BalanceImportFile,
  BalanceImportFileRowsRequest,
  ConfirmBalanceImportFileRequest,
} from '@/interfaces/import-file.interface'
import {
  BALANCE_IMPORT_FILE_STATUS,
  BALANCE_IMPORT_ROW_STATUS,
} from '@/enums/import-file.enum'
import store from '@/store'
import { Mutations } from '@/store/enums/StoreEnums'
import { HttpStatus } from '@/core/variables/common.enum'
import { balanceTypeOption } from '@/core/helpers/util'
import { BALANCE_TYPE } from '@/enums/balance.enum'

const formLabelWidth = '200px'

export default defineComponent({
  name: 'ImportRows',
  components: { Datatable },
  props: {
    fileId: String,
    reload: Function,
    close: Function,
  },
  data() {
    return {
      BALANCE_IMPORT_FILE_STATUS,
      balanceTypes: balanceTypeOption(),
      BALANCE_TYPE,
      file: {
        admin_id: '',
        created_at: 0,
        updated_at: 0,
        file_name: '',
        status: 0,
        id: '',
        total_rows: 0,
        failed_rows: 0,
        balance_type: BALANCE_TYPE[BALANCE_TYPE.EXCHANGE],
      } as BalanceImportFile,
      formLabelWidth,
      modalVisible: false,
      reloadKey: 0,
      tableConfig: {
        identifyField: 'import_balance_id',
        dataSource: (params) => this.getData(params),
        columns: [
          {
            key: 'row_index',
            title: this.$t('importExcel.balanceDetail.id'),
            sortable: false,
            class: 'text-center',
          },
          {
            key: 'email',
            title: this.$t('importExcel.balanceDetail.email'),
            sortable: false,
          },
          {
            key: 'currency',
            title: this.$t('importExcel.balanceDetail.currency'),
            sortable: false,
            class: 'text-center',
          },
          {
            key: 'amount',
            title: this.$t('importExcel.balanceDetail.amount'),
            sortable: false,
          },
          {
            key: 'note',
            title: this.$t('importExcel.balanceDetail.note'),
            sortable: false,
            class: 'plain-text',
          },
          {
            key: 'status',
            title: this.$t('importExcel.balanceDetail.status'),
            sortable: false,
            class: 'text-center',
            render: (value) => {
              return this.$t(
                'importExcel.balanceDetail.' + BALANCE_IMPORT_ROW_STATUS[value],
              )
            },
          },
        ],
        configPage: true,
        defaultPageSize: 10,
      } as ITableConfig,
    }
  },
  computed: {
    computedFileId(): string | undefined {
      return this.fileId
    },
  },
  watch: {
    computedFileId(value) {
      if (value) {
        this.modalVisible = true
        this.reloadKey++
      }
    },
    reloadKey() {
      if (!this.fileId) return
      ImportFileService.getBalanceImportFile(this.fileId).then((response) => {
        this.file = response.data
      })
    },
  },
  created: function () {
    if (this.fileId) {
      this.modalVisible = true
      this.reloadKey++
    }
  },
  methods: {
    async getData(params) {
      if (!this.fileId || isNaN(parseInt(this.fileId))) return {}

      const fileRowsRequest: BalanceImportFileRowsRequest = {
        size: params.limit,
        page: params.page,
      }
      return ImportFileService.getBalanceImportFileRows(
        this.fileId,
        fileRowsRequest,
      )
    },
    async submitImportExcel() {
      if (!this.fileId) return
      store.commit(Mutations.SHOW_API_LOADING, true)
      const params: ConfirmBalanceImportFileRequest = {
        balance_type: this.file.balance_type,
      }
      ImportFileService.confirmBalanceImportFile(this.fileId, params)
        .then((response) => {
          if (
            response?.status !== HttpStatus.OK &&
            response?.status !== HttpStatus.CREATED
          ) {
            this.$toastr.error(this.$t('error'))
          } else {
            this.reload && this.reload()
            this.reloadKey++
            this.$toastr.success(this.$t('success'))
          }
          store.commit(Mutations.SHOW_API_LOADING, false)
        })
        .catch(() => {
          this.$toastr.error(this.$t('error'))
          store.commit(Mutations.SHOW_API_LOADING, false)
        })
    },

    async cancelImportExcel() {
      if (!this.fileId) return
      store.commit(Mutations.SHOW_API_LOADING, true)

      ImportFileService.cancelBalanceImportFile(this.fileId)
        .then((response) => {
          if (
            response?.status !== HttpStatus.OK &&
            response?.status !== HttpStatus.CREATED
          ) {
            this.$toastr.error(this.$t('error'))
          } else {
            this.reload && this.reload()
            this.reloadKey++
            this.$toastr.success(this.$t('success'))
          }
          store.commit(Mutations.SHOW_API_LOADING, false)
        })
        .catch(() => {
          this.$toastr.error(this.$t('error'))
          store.commit(Mutations.SHOW_API_LOADING, false)
        })
    },
    closeModal() {
      this.modalVisible = false
      this.close && this.close()
    },
  },
})
</script>

<style scoped>
.mb-0 {
  margin-bottom: 0;
}
</style>
