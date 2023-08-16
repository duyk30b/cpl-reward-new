<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('importExcel.setting') }}
      </div>
      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <datatable :config="tableConfig" :force-reload-key="reloadKey">
        <template v-slot:cell-action="{ row: item }">
          <button
            class="btn btn-sm btn-primary mr-2 mx-auto d-block"
            @click="openSettingDialog(item)"
          >
            {{ $t('importExcel.balanceSetting.btnEdit') }}
          </button>
        </template>
      </datatable>
    </div>
  </div>

  <el-dialog
    v-model="isOpenSettingDialog"
    :title="$t('userBalance.correctBalance.title')"
  >
    <el-form :model="setting" ref="settingForm">
      <el-form-item
        prop="max_file_amount"
        :label="$t('importExcel.balanceSetting.maxFileAmount')"
        :rules="[
          {
            required: true,
            message: $t('VALIDATION.REQUIRED'),
          },
        ]"
      >
        <el-input
          v-model.number="setting.max_file_amount"
          :placeholder="$t('importExcel.balanceSetting.maxFileAmount')"
          @change="resetError"
        />
        <div class="el-form-item__error" v-if="errors.maxFileAmount">
          {{ errors.maxFileAmount }}
        </div>
      </el-form-item>
      <el-form-item
        prop="max_line_amount"
        :label="$t('importExcel.balanceSetting.maxLineAmount')"
        :rules="[
          {
            required: true,
            message: $t('VALIDATION.REQUIRED'),
          },
        ]"
      >
        <el-input
          v-model.number="setting.max_line_amount"
          :placeholder="$t('importExcel.balanceSetting.maxLineAmount')"
          @change="resetError"
        />
        <div class="el-form-item__error" v-if="errors.maxLineAmount">
          {{ errors.maxLineAmount }}
        </div>
      </el-form-item>
      <el-form-item
        prop="remain_amount"
        :label="$t('importExcel.balanceSetting.remainAmount')"
        :rules="[
          {
            required: true,
            message: $t('VALIDATION.REQUIRED'),
          },
        ]"
      >
        <el-input
          v-model.number="setting.remain_amount"
          :placeholder="$t('importExcel.balanceSetting.remainAmount')"
          @change="resetError"
        />

        <div class="el-form-item__error" v-if="errors.remainAmount">
          {{ errors.remainAmount }}
        </div>
      </el-form-item>

      <el-form-item prop="is_unlimited">
        <el-checkbox v-model="setting.is_unlimited">
          {{ $t('importExcel.balanceSetting.isUnlimited') }}
        </el-checkbox>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeCorrectDialog" class="btn btn-sm">{{
          $t('cancel')
        }}</el-button>
        <el-button
          type="submit"
          class="btn btn-sm btn-primary"
          @click="updateSetting"
          :disabled="isUpdating"
        >
          {{ $t('submit') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  convertTimestampToDate,
  setPageFliud,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { ImportFileService } from '@/services/ImportFileService'

import { HttpStatus } from '@/core/variables/common.enum'
import Datatable, {
  DatatableSearchType,
  IDataSourceParams,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  BalanceImportFileSetting,
  BalanceImportFileSettingRequest,
  UpdateBalanceImportFileSettingRequest,
} from '@/interfaces/import-file.interface'
import { ElMessageBox } from 'element-plus'
import { Mutations } from '@/store/enums/StoreEnums'
import store from '@/store'

export default defineComponent({
  name: 'ImportExcelBalanceSetting',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('importExcel.setting', [])
  },
  components: { Datatable },
  data() {
    return {
      reloadKey: 0,
      isUpdating: false,
      errors: [],
      setting: {
        id: '',
        currency: '',
        is_unlimited: false,
        max_file_amount: '0',
        max_line_amount: '0',
        remain_amount: '0',
      },
      isOpenSettingDialog: false,
      tableConfig: {
        identifyField: 'import_balance_id',
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'currency',
            title: this.$t('importExcel.balanceSetting.currency'),
            class: 'text-center',
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'max_file_amount',
            title: this.$t('importExcel.balanceSetting.maxFileAmount'),
            class: 'text-center',
          },
          {
            key: 'max_line_amount',
            title: this.$t('importExcel.balanceSetting.maxLineAmount'),
            class: 'text-center',
          },
          {
            key: 'remain_amount',
            title: this.$t('importExcel.balanceSetting.remainAmount'),
            class: 'text-center',
          },
          {
            key: 'is_unlimited',
            title: this.$t('importExcel.balanceSetting.isUnlimited'),
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
            class: 'text-center td-w-100px',
          },
        ],
        searchColumns: [
          {
            key: 'currency',
            title: this.$t('importExcel.balanceSetting.currency'),
            searchType: DatatableSearchType.TEXT,
          },
        ],
        configPage: true,
      } as ITableConfig,
    }
  },

  methods: {
    openSettingDialog(setting: BalanceImportFileSetting) {
      this.setting = { ...setting }
      this.isOpenSettingDialog = true
    },

    closeCorrectDialog() {
      ;(this.$refs.settingForm as any).clearValidate()
      this.isOpenSettingDialog = false
      this.errors = []
      this.reloadKey++
    },

    resetError() {
      this.errors = []
    },

    //submit update setting
    async updateSetting() {
      this.errors = []
      //disable submit button
      this.isUpdating = true
      const confirmUpdate = await ElMessageBox.confirm(
        this.$t('importExcel.confirmUpdateSetting'),
      )
      if (confirmUpdate) {
        const isValidateForm = await (this.$refs.settingForm as any).validate()
        if (!isValidateForm) return

        const data: UpdateBalanceImportFileSettingRequest = {
          is_unlimited: this.setting.is_unlimited,
          max_file_amount: this.setting.max_file_amount.toString(),
          max_line_amount: this.setting.max_line_amount.toString(),
          remain_amount: this.setting.remain_amount.toString(),
          currency: this.setting.currency,
        }

        //call api update
        store.commit(Mutations.SHOW_API_LOADING, true)
        try {
          const response =
            await ImportFileService.updateBalanceImportFileSetting(data)
          if (response.status === HttpStatus.OK) {
            this.closeCorrectDialog()
          } else if (response.status === HttpStatus.BAD_REQUEST) {
            response.data?.errors?.forEach((item) => {
              this.errors[item.property] = this.$t('VALIDATION.' + item.msg)
            })
          }

          //enable submit button
          this.isUpdating = false
        } catch (error) {
          this.isUpdating = false
          await ElMessageBox.alert('error')
        }

        store.commit(Mutations.SHOW_API_LOADING, false)
      }
    },

    //Get list settings
    async getDataSource(params: IDataSourceParams) {
      const paramsFilter: BalanceImportFileSettingRequest = {
        page: params.page,
        size: params.per_page || 25,
        currency: params.searchText ? params.searchText.toLowerCase() : '',
      }
      const settingResponse =
        await ImportFileService.getBalanceImportFileSetting(paramsFilter)
      const files = settingResponse.data

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
  },
})
</script>
