<template>
  <button
    v-if="checkPermission(Permission.BALANCE_ABNORMAL_READ)"
    class="btn btn-primary btn-sm me-2"
    @click="openCheckDialog()"
  >
    {{ $t('userBalance.checkBalance.button') }}
  </button>
  <button
    v-if="checkPermission(Permission.BALANCE_ABNORMAL_UPDATE)"
    class="btn btn-primary btn-sm"
    @click="openCorrectDialog()"
  >
    {{ $t('userBalance.correctBalance.button') }}
  </button>
  <h3 class="fw-bold mt-10 mb-6">
    {{ $t('userBalance.abnormalBalanceAccounts') }}
  </h3>
  <div class="tab-pane mt-5" id="user-balance-tab">
    <el-tabs v-model="selectTab" tab-position="left" class="demo-tabs">
      <el-tab-pane
        :label="$t('userBalance.exchangeBalance')"
        name="EXCHANGE"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.highlowBalance')"
        name="BO"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.cashbackBalance')"
        name="CASHBACK"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.rewardBalance')"
        name="REWARD"
      ></el-tab-pane>
      <!--   TODO: below tab is in development stage. Author: TuanCM   -->
      <el-tab-pane
        :label="`${$t('userBalance.futureBalance')} - DEV`"
        name="FUTURE"
      ></el-tab-pane>
      <div class="table-wrapper pl-8">
        <div class="table-responsive mb-4">
          <table
            :class="[loading && 'overlay overlay-block']"
            class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
            id="kt_customers_table"
            role="grid"
          >
            <thead>
              <tr
                class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0"
                role="row"
                v-if="columns && columns.length"
              >
                <template v-for="(cell, i) in columns" :key="i">
                  <th
                    :class="[cell.class, 'min-w-125px']"
                    tabindex="0"
                    rowspan="1"
                    colspan="1"
                  >
                    {{ $t(cell.title) }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody class="fw-bold text-gray-600">
              <template v-if="selectData && selectData.length">
                <template v-for="(item, i) in selectData" :key="i">
                  <tr class="odd">
                    <template v-for="(cell, i) in columns" :key="i">
                      <td :class="[cell.class]">
                        <slot
                          v-if="
                            cell.key === 'actual_balance' &&
                            item.is_abnormal_actual_balance
                          "
                          :name="`cell-${cell.key}`"
                          :row="item"
                        >
                          <span class="text-danger">{{
                            formatNumberString(item[cell.key])
                          }}</span>
                        </slot>
                        <slot
                          v-else-if="
                            cell.key === 'available_balance' &&
                            item.is_abnormal_available_balance
                          "
                          :name="`cell-${cell.key}`"
                          :row="item"
                        >
                          <span class="text-danger">{{
                            formatNumberString(item[cell.key])
                          }}</span>
                        </slot>
                        <slot
                          v-else-if="
                            cell.key === 'actual_balance' ||
                            cell.key === 'available_balance'
                          "
                          :name="`cell-${cell.key}`"
                          :row="item"
                        >
                          {{ formatNumberString(item[cell.key]) }}
                        </slot>
                        <slot v-else :name="`cell-${cell.key}`" :row="item">
                          {{ item[cell.key] }}
                        </slot>
                      </td>
                    </template>
                  </tr>
                </template>
              </template>
              <template>
                <tr class="odd">
                  <td colspan="7" class="dataTables_empty">
                    {{ $t('noData') }}
                  </td>
                </tr>
              </template>
            </tbody>
            <div
              v-if="loading"
              class="overlay-layer card-rounded bg-dark bg-opacity-5"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('loading') }}</span>
              </div>
            </div>
          </table>
        </div>
        <div
          v-if="loading"
          class="d-flex align-items-center justify-content-center loading-wrapper"
        >
          <div class="loading-area">
            <slot name="loading">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('loading') }}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </el-tabs>

    <h3 class="fw-bold mt-20 mb-6">
      {{ $t('userBalance.balanceUpdateHistory') }}
    </h3>
    <datatable
      :config="tableConfig"
      ref="tableBalanceHistory"
      :forceReloadKey="forceReloadKey"
    >
      <template v-slot:cell-status="{ row: item }">
        <span v-if="item.status === 'OK'" class="badge badge-primary">OK</span>
        <span v-else-if="item.status === 'NG'" class="badge badge-danger"
          >NG</span
        >
        <span v-if="item.status === 'CORRECTED'" class="badge badge-success"
          >CORRECTED</span
        >
      </template>
    </datatable>
  </div>
  <el-dialog
    v-model="checkDialogVisible"
    :title="$t('userBalance.checkBalance.title')"
    :before-close="closeCheckDialog"
  >
    <el-form>
      <el-form-item :label="$t('service')" :label-width="formLabelWidth">
        <el-select filterable v-model="checkService">
          <el-option
            v-for="item in balanceTypes"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('currency')" :label-width="formLabelWidth">
        <el-select filterable v-model="checkCurrency">
          <el-option
            v-for="coin in listCoin"
            :value="coin.toLowerCase()"
            :key="coin"
            :label="coin"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeCheckDialog">{{ $t('cancel') }}</el-button>
        <el-button
          type="primary"
          @click="checkBalanceInvalid"
          :disabled="!checkService || !checkCurrency"
        >
          {{ $t('userBalance.checkBalance.button') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="correctDialogVisible"
    :title="$t('userBalance.correctBalance.title')"
    :before-close="closeCorrectDialog"
  >
    <el-form :model="correctItem">
      <el-form-item :label="$t('email')" :label-width="formLabelWidth">
        {{ user?.email }}
      </el-form-item>
      <el-form-item :label="$t('userId')" :label-width="formLabelWidth">
        {{ user?.id }}
      </el-form-item>
      <el-form-item :label="$t('service')" :label-width="formLabelWidth">
        <el-select filterable v-model="correctService">
          <el-option
            v-for="item in balanceTypes"
            :value="item.id"
            :key="item.id"
          >
            {{ item.name }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('currency')" :label-width="formLabelWidth">
        <el-select filterable v-model="correctCurrency">
          <el-option
            v-for="account in correctAccountList"
            :value="account.currency"
            :key="account.currency"
            :label="account.currency.toUpperCase()"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.actualBalance')"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="correctItem.diff.current_actual_balance"
          :placeholder="$t('userBalance.correctBalance.actualBalance')"
          readonly
        />
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.availableBalance')"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="correctItem.diff.current_available_balance"
          :placeholder="$t('userBalance.correctBalance.availableBalance')"
          readonly
        />
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.onHoldTransaction')"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="correctItem.diff.total_on_hold_transaction"
          :placeholder="$t('userBalance.correctBalance.onHoldTransaction')"
          readonly
        />
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.sumBalanceTransaction')"
        :label-width="formLabelWidth"
      >
        <el-input
          v-model="correctItem.diff.total_amount_transaction"
          :placeholder="$t('userBalance.correctBalance.sumBalanceTransaction')"
          readonly
        />
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.correctOption')"
        :label-width="formLabelWidth"
      >
        <el-select filterable v-model="correctItem.correction_option">
          <el-option
            v-for="correctedType in correctedTypes"
            :key="correctedType.id"
            :value="correctedType.id"
            :label="correctedType.name"
          >
          </el-option>
        </el-select>
        <p class="text-break text-danger">
          {{ $t('userBalance.correctBalance.trustBalanceTransactionNote') }}
        </p>
        <p class="text-break text-danger">
          {{ $t('userBalance.correctBalance.trustBalanceAccountNote') }}
        </p>
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.correctReason')"
        :label-width="formLabelWidth"
      >
        <el-input
          :rows="2"
          type="textarea"
          v-model="correctItem.reason"
          :placeholder="$t('userBalance.correctBalance.correctReason')"
          maxlength="10000"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeCorrectDialog">{{ $t('cancel') }}</el-button>
        <el-button
          type="primary"
          @click="confirmCorrectBalance"
          :disabled="!correctCurrency || !correctItem.correction_option"
        >
          {{ $t('userBalance.correctBalance.button') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
  <el-dialog
    v-model="confirmCorrectDialogVisible"
    :before-close="closeCorrectDialog"
  >
    <p>{{ correctItem.confirm.message }}</p>
    <el-form>
      <el-form-item
        :label="$t('userBalance.correctBalance.actualBalance')"
        :label-width="formLabelWidth"
      >
        {{ correctItem.confirm.current_actual_balance }}
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.availableBalance')"
        :label-width="formLabelWidth"
      >
        {{ correctItem.confirm.current_available_balance }}
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.onHoldTransaction')"
        :label-width="formLabelWidth"
      >
        {{ correctItem.confirm.total_on_hold_transaction }}
      </el-form-item>
      <el-form-item
        :label="$t('userBalance.correctBalance.sumBalanceTransaction')"
        :label-width="formLabelWidth"
      >
        {{ correctItem.confirm.total_amount_transaction }}
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeCorrectDialog">{{ $t('cancel') }}</el-button>
        <el-button type="primary" @click="correctBalance">
          {{ $t('confirm') }}
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserBalanceService } from '@/services/UserBalanceService'
import { IColumnConfig } from '@/components/datatable/Datatable.vue'
import { HttpStatus } from '@/core/variables/common.enum'
import { Actions, Mutations } from '@/store/enums/StoreEnums'
import moment from 'moment'
import Datatable, {
  DatatableSearchType,
  ITableConfig,
} from '@/components/datatable/Datatable.vue'
import {
  balanceTypeOption,
  formatNumberString,
  transactionTypeOption,
} from '@/core/helpers/util'
import { checkPermission } from '@/core/helpers/common.helper'
import { Permission } from '@/core/variables/common.enum'
import store from '@/store'
import { User } from '@/models/user/User'
import { CORRECTED_TYPE } from '@/enums/balance.enum'
import { ElLoading } from 'element-plus'
import { FixedNumber } from '@ethersproject/bignumber'
import { MAX_HISTORY_DAYS } from './constants'

const formLabelWidth = '200px'

const initCorrectItem = () => ({
  diff: {
    user_id: '',
    currency: '',
    balance_type: '',
    current_actual_balance: '',
    current_available_balance: '',
    total_on_hold_transaction: '',
    total_amount_transaction: '',
    diff_actual_balance: '',
    diff_available_balance: '',
  },
  confirm: {
    message: '',
    current_actual_balance: '',
    current_available_balance: '',
    total_on_hold_transaction: '',
    total_amount_transaction: '',
  },
  reason: '',
  correction_option: null,
})

const initFilter = () => ({
  date: [
    moment().startOf('date').clone().subtract(30, 'days').format('YYYY/MM/DD'),
    moment().endOf('date').clone().format('YYYY/MM/DD'),
  ],
  balance_type: '',
  currency: '',
})

interface BalanceAccountDto {
  id: string
  user_id: string
  currency: string
  actual_balance: string
  available_balance: string
  type: string
  created_at: string
  updated_at: string
  is_abnormal_actual_balance: boolean
  is_abnormal_available_balance: boolean
}

export default defineComponent({
  components: {
    Datatable,
  },
  props: {
    user: User,
  },
  data() {
    return {
      selectTab: 'EXCHANGE',
      dataItems: [] as BalanceAccountDto[],
      selectData: [] as BalanceAccountDto[],
      loading: false,
      correctLoading: false,
      columns: [
        {
          key: 'currency',
          title: 'currency',
          class: 'td-w-350px text-uppercase',
        },
        {
          key: 'actual_balance',
          title: 'actualBalance',
          class: 'td-w-350px',
        },
        {
          key: 'available_balance',
          title: 'availableBalance',
          class: 'td-w-350px',
        },
      ] as IColumnConfig[],
      checkDialogVisible: false,
      checkService: '',
      checkCurrency: '',
      correctDialogVisible: false,
      confirmCorrectDialogVisible: false,
      correctItem: initCorrectItem(),
      formLabelWidth,
      forceReloadKey: 0,
      balanceTypes: balanceTypeOption(),
      correctService: '',
      correctAccountList: [] as BalanceAccountDto[],
      correctCurrency: '',
      correctedTypes: [
        {
          id: CORRECTED_TYPE.CORRECT_BALANCE_ACCOUNT_TO_TRANSACTION,
          name: this.$t('userBalance.correctBalance.trustBalanceTransaction'),
        },
        {
          id: CORRECTED_TYPE.CORRECT_BALANCE_TRANSACTION_TO_ACCOUNT,
          name: this.$t('userBalance.correctBalance.trustBalanceAccount'),
        },
      ],
      tableConfig: {
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'id',
            title: this.$t('id'),
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'balance_type',
            title: this.$t('service'),
            class: 'text-center align-middle text-center',
          },
          {
            key: 'currency',
            title: this.$t('currency'),
            class: 'td-w-250px text-uppercase align-middle text-center',
          },
          {
            key: 'actual_balance_change',
            title: this.$t('balanceHistory.actualBalanceChange'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(
                value.includes('-') ? value : '+' + value,
              )
            },
          },
          {
            key: 'actual_balance',
            title: this.$t('balanceHistory.actualBalance'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(value)
            },
          },
          {
            key: 'available_balance_change',
            title: this.$t('balanceHistory.availableBalanceChange'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(
                value.includes('-') ? value : '+' + value,
              )
            },
          },
          {
            key: 'available_balance',
            title: this.$t('balanceHistory.availableBalance'),
            class: 'td-w-250px align-middle text-center',
            render: (value) => {
              return formatNumberString(value)
            },
          },
          {
            key: 'transaction_type',
            title: this.$t('event'),
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'reference_id',
            title: this.$t('referenceId'),
            class: 'td-w-250px align-middle text-center',
          },
          {
            key: 'status',
            title: this.$t('status'),
            class: 'align-middle text-center',
          },
          {
            key: 'created_at',
            title: this.$t('createDate'),
            class: 'align-middle text-center',
            render: (value) => {
              return moment.unix(value / 1000).format('YYYY-MM-DD HH:mm:ss')
            },
          },
        ],
        notReset: true,
        searchColumns: [
          {
            key: 'balance_type',
            title: 'service',
            searchType: DatatableSearchType.SELECT,
            options: balanceTypeOption(),
            class: 'td-w-150px',
          },
          {
            key: 'currency',
            title: 'currency',
            searchType: DatatableSearchType.SELECT,
            options: this.$store.getters.listCoin,
            class: 'td-w-150px',
          },
          {
            key: 'transaction_type',
            title: 'event',
            searchType: DatatableSearchType.SELECT,
            options: transactionTypeOption(),
            class: 'td-w-200px',
          },
          {
            key: 'status',
            title: 'status',
            searchType: DatatableSearchType.SELECT,
            options: ['OK', 'NG', 'CORRECTED'].map((e) => ({
              id: e,
              name: e,
            })),
            class: 'td-w-150px',
          },
          {
            key: 'date',
            searchType: DatatableSearchType.DATE_RANGE,
            startPlaceholder: moment()
              .startOf('date')
              .clone()
              .subtract(30, 'days')
              .format('DD/MM/YYYY'),
            endPlaceholder: moment().endOf('date').clone().format('DD/MM/YYYY'),
          },
        ],
        activeDownloadCsv: true,
        downloadCsv: (params) => this.downloadCsv(params),
        configPage: true,
        initFilter: initFilter(),
      } as ITableConfig,
      Permission,
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    userAdmin(): any {
      return this.$store.getters.currentUser
    },
    listCoin(): string[] {
      return this.$store.getters.listCoin
    },
  },
  mounted() {
    ;(this.$refs.tableBalanceHistory as any).updateConfig()
    this.getData()
    if (!this.$store.getters.listCoin.length) {
      this.$store.dispatch(Actions.FETCH_LIST_COIN)
    }
  },
  watch: {
    selectTab: function () {
      this.selectData = this.dataItems.filter(
        (item) => item.type === this.selectTab,
      )
    },
    listCoin: function () {
      if (!this.tableConfig.searchColumns) return

      const searchColumn: any = this.tableConfig.searchColumns.find(
        (e) => e.key === 'currency',
      )
      searchColumn.options = this.$store.getters.listCoin.map((e) => ({
        id: e,
        name: e,
      }))
    },
    correctService: function (value) {
      this.correctAccountList = this.dataItems.filter(
        (item) => item.type === value,
      )
      this.correctCurrency = ''
    },
    correctCurrency: function (value) {
      if (!value) {
        this.correctItem.diff = initCorrectItem().diff
        return
      }
      const loadingInstance = ElLoading.service({})
      UserBalanceService.getDiffBalanceCorrect({
        user_id: this.user?.id,
        currency: this.correctCurrency,
        balance_type: this.correctService,
      })
        .then((res) => {
          if (res.status === HttpStatus.OK) {
            const diff = res.data.data
            diff.current_actual_balance = formatNumberString(
              diff.current_actual_balance,
            )
            diff.current_available_balance = formatNumberString(
              diff.current_available_balance,
            )
            this.correctItem.diff = diff
            loadingInstance.close()
            return
          }
          loadingInstance.close()
          this.$toastr.error(res.data.message)
        })
        .catch(() => {
          loadingInstance.close()
          this.$toastr.error(this.$t('error'))
        })
    },
    userId: function (value) {
      if (!value) return
      this.getData()
      if (this.tableConfig.initFilter) {
        this.tableConfig.initFilter = initFilter()
        this.tableConfig.initFilter.user_id = this.userId
      }
      ;(this.$refs.tableBalanceHistory as any).updateConfig()
    },
  },
  methods: {
    async downloadCsv(params) {
      store.commit(Mutations.SHOW_API_LOADING, true)
      this.loading = true
      const response = await UserBalanceService.downloadAbnormalBalanceHistory({
        ...this.convertParamQuery(params),
        user_id: this.$route.params.id,
      })
      store.commit(Mutations.SHOW_API_LOADING, false)
      this.loading = false

      return response
    },
    getDataSource(params) {
      //default search with 30 days
      const startDate =
        params.date && params.date[0]
          ? moment(params.date[0]).startOf('date')
          : moment().startOf('date').clone().subtract(30, 'days')
      const endDate =
        params.date && params.date[1]
          ? moment(params.date[1]).endOf('date')
          : moment().endOf('date').clone()

      const diffDays = startDate.diff(endDate, 'days')
      if (Math.abs(diffDays) > MAX_HISTORY_DAYS) {
        this.$toastr.error({
          message: this.$t('balanceHistory.invalidSearchDateMessage', {
            days: MAX_HISTORY_DAYS,
          }),
          duration: 5000,
        })
        return []
      }

      params['start_date'] = startDate.startOf('date').format('x')
      params['end_date'] = endDate.endOf('date').format('x')

      return UserBalanceService.getAbnormalBalanceHistory({
        user_id: this.$route.params.id,
        ...params,
        size: params.per_page || 25,
      })
    },
    convertParamQuery(params) {
      //default search with 30 days
      const startDate =
        params.date && params.date[0]
          ? moment(params.date[0]).startOf('date')
          : moment().startOf('date').clone().subtract(30, 'days')
      const endDate =
        params.date && params.date[1]
          ? moment(params.date[1]).endOf('date')
          : moment().endOf('date').clone()

      params['start_date'] = startDate.startOf('date').format('x')
      params['end_date'] = endDate.endOf('date').format('x')

      return params
    },
    getData() {
      UserBalanceService.getAbnormalBalanceList(
        this.$route.params.id as string,
      ).then((res) => {
        if (res && res.status == HttpStatus.OK) {
          this.dataItems = res.data.data
          this.selectData = this.dataItems.filter(
            (item) => item.type === this.selectTab,
          )
        }
      })
    },
    openCheckDialog() {
      this.checkDialogVisible = true
    },
    openCorrectDialog() {
      this.correctDialogVisible = true
    },
    confirmCorrectBalance() {
      if (
        this.correctItem.correction_option ===
        CORRECTED_TYPE.CORRECT_BALANCE_ACCOUNT_TO_TRANSACTION
      ) {
        this.correctItem.confirm.message = this.$t(
          'userBalance.correctBalance.trustBalanceTransactionConfirm',
        )
        this.correctItem.confirm.total_amount_transaction =
          this.correctItem.diff.total_amount_transaction
        this.correctItem.confirm.current_actual_balance =
          this.correctItem.diff.total_amount_transaction
      } else {
        this.correctItem.confirm.message = this.$t(
          'userBalance.correctBalance.trustBalanceAccountConfirm',
        )
        this.correctItem.confirm.total_amount_transaction =
          this.correctItem.diff.current_actual_balance
        this.correctItem.confirm.current_actual_balance =
          this.correctItem.diff.current_actual_balance
      }
      this.correctItem.confirm.total_on_hold_transaction =
        this.correctItem.diff.total_on_hold_transaction
      this.correctItem.confirm.current_available_balance = FixedNumber.from(
        this.correctItem.confirm.total_amount_transaction,
      )
        .subUnsafe(
          FixedNumber.from(this.correctItem.confirm.total_on_hold_transaction),
        )
        .toString()
      this.correctDialogVisible = false
      this.confirmCorrectDialogVisible = true
    },
    correctBalance() {
      const params = {
        user_id: this.user?.id,
        currency: this.correctCurrency,
        balance_type: this.correctService,
        diff_actual_balance: this.correctItem.diff.diff_actual_balance,
        diff_available_balance: this.correctItem.diff.diff_available_balance,
        corrected_by: this.$store.getters.currentUser.id,
        reason: this.correctItem.reason,
        is_update_balance:
          this.correctItem.correction_option ===
          CORRECTED_TYPE.CORRECT_BALANCE_ACCOUNT_TO_TRANSACTION
            ? 1
            : 0,
      }
      const loadingInstance = ElLoading.service({})
      UserBalanceService.correctAbnormalBalance(params)
        .then((res) => {
          loadingInstance.close()
          if (res.status === HttpStatus.OK) {
            if (
              this.correctItem.correction_option ===
              CORRECTED_TYPE.CORRECT_BALANCE_ACCOUNT_TO_TRANSACTION
            ) {
              this.$toastr.success(
                this.$t(
                  'userBalance.correctBalance.trustBalanceTransactionSuccess',
                ),
              )
            } else {
              this.$toastr.success(
                this.$t(
                  'userBalance.correctBalance.trustBalanceAccountSuccess',
                ),
              )
            }
            this.selectTab = this.correctService
            if (this.tableConfig.initFilter) {
              this.tableConfig.initFilter.balance_type = this.correctService
              this.tableConfig.initFilter.currency = this.correctCurrency
            }
            this.closeCorrectDialog()
            this.getData()
            ;(this.$refs.tableBalanceHistory as any).updateConfig()
            return
          }
          this.$toastr.error(this.$t('userBalance.correctBalance.errorMessage'))
        })
        .catch(() => {
          loadingInstance.close()
          this.$toastr.error(this.$t('error'))
        })
    },
    checkBalanceInvalid() {
      const loadingInstance = ElLoading.service({})
      const params = {
        user_id: this.user?.id,
        currency: this.checkCurrency,
        balance_type: this.checkService,
      }
      UserBalanceService.checkBalanceInvalid(params)
        .then((res) => {
          loadingInstance.close()
          if (res.status === HttpStatus.OK) {
            this.$toastr.success(
              this.$t('userBalance.checkBalance.successMessage'),
            )
            this.selectTab = this.checkService
            if (this.tableConfig.initFilter) {
              this.tableConfig.initFilter.balance_type = this.checkService
              this.tableConfig.initFilter.currency = this.checkCurrency
            }
            this.closeCheckDialog()
            this.getData()
            ;(this.$refs.tableBalanceHistory as any).updateConfig()
            return
          }
          this.$toastr.error(this.$t('userBalance.checkBalance.errorMessage'))
        })
        .catch(() => {
          loadingInstance.close()
          this.$toastr.error(this.$t('error'))
        })
    },
    closeCorrectDialog() {
      this.correctDialogVisible = false
      this.confirmCorrectDialogVisible = false
      this.correctItem = initCorrectItem()
      this.correctService = ''
      this.correctCurrency = ''
    },
    closeCheckDialog() {
      this.checkDialogVisible = false
      this.checkService = ''
      this.checkCurrency = ''
    },
    checkPermission,
    formatNumberString,
  },
})
</script>

<style lang="scss" scoped>
.td-w-100px {
  width: 100px;
}
.pl-8 {
  padding-left: 2rem;
}
.pr-0 {
  padding-right: 0;
}
</style>
