<template>
  <div
    class="card"
    id="auto-withdraw-group-detail"
    ref="autoWithdrawGroupDetail"
  >
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('autoWithdraw.list') }}
      </div>

      <div class="card-toolbar"></div>
    </div>
    <div class="card-body pt-0">
      <div class="group-info mb-5 row">
        <div class="col-6">
          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.groupName') }}:
            </span>
            <span>{{ groupDetail?.name }}</span>
          </div>

          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.createdAt') }}:
            </span>
            <span>{{
              groupDetail?.createDate
                ? convertTimestampToDate(
                    groupDetail?.createDate,
                    'YYYY/MM/DD HH:mm:ss',
                  )
                : ''
            }}</span>
          </div>

          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.hwAddress') }}:
            </span>
            <span>{{ groupDetail?.walletAddress }}</span>
          </div>

          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.totalBalances') }}:
            </span>
            <span>{{
              formatCurrencyBalance(groupDetail?.totalBalance ?? 0)
            }}</span>
          </div>
        </div>

        <div class="col-6">
          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.suggestedFee') }}:
            </span>
            <span>{{
              formatCurrencyBalance(groupDetail?.suggestedFee ?? 0)
            }}</span>
          </div>

          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.currentBalance') }}:
            </span>
            <span>{{
              formatCurrencyBalance(groupDetail?.currentBalance ?? 0)
            }}</span>
          </div>

          <div
            v-if="listErc20.includes(groupDetail.currency)"
            class="group-info-item"
          >
            <span class="group-info-label"
              >{{ $t('autoWithdraw.nativeCurrentBalance') }}:
            </span>
            <span>{{
              formatCurrencyBalance(groupDetail?.nativeCurrentBalance ?? 0)
            }}</span>
          </div>

          <div class="group-info-item">
            <span class="group-info-label"
              >{{ $t('autoWithdraw.suggestedDeposit') }}:
            </span>
            <span>{{ suggestedDeposit }}</span>
          </div>
          <span>{{
            groupDetail.currency === 'xrp'
              ? `(${$t('autoWithdraw.xrpNeedMaintenanceFee')})`
              : ''
          }}</span>
        </div>
      </div>

      <datatable :config="tableConfig" :force-reload-key="reloadKey">
        <template v-slot:right-toolbar>
          <div
            class="d-flex justify-content-end align-items-center btn-action-groups"
            data-kt-user-table-toolbar="selected"
          >
            <button
              class="btn btn-primary ml-2"
              @click="collectGroup"
              :disabled="isCollecting"
              :data-kt-indicator="isCollecting ? 'on' : ''"
              v-if="[GROUP_STATUS.COMPLETED].includes(groupDetail.status)"
            >
              <span class="indicator-label">
                {{ $t('autoWithdraw.actionCollection') }}
              </span>
              <span class="indicator-progress">
                {{ $t('autoWithdraw.actionCollection') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>

            <button
              class="btn btn-danger ml-2"
              @click="cancelGroup"
              :disabled="isCanceling"
              :data-kt-indicator="isCanceling ? 'on' : ''"
              v-if="
                [GROUP_STATUS.CREATED, GROUP_STATUS.PROCESSING].includes(
                  groupDetail.status,
                )
              "
            >
              <span class="indicator-label">
                {{ $t('autoWithdraw.actionCancel') }}
              </span>
              <span class="indicator-progress">
                {{ $t('autoWithdraw.actionCancel') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>

            <button
              class="btn btn-primary ml-2"
              @click="importTempTransactions"
              :disabled="
                isReadingExcel || groupDetail.status !== GROUP_STATUS.CREATED
              "
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

            <button
              type="button"
              class="btn btn-primary ml-2"
              v-if="
                ![GROUP_STATUS.COMPLETED, GROUP_STATUS.CANCEL].includes(
                  groupDetail.status,
                )
              "
              :data-kt-indicator="isSavingTempTransactions ? 'on' : ''"
              :disabled="
                tempTransactions.length === 0 || isSavingTempTransactions
              "
              @click="saveTempTransactions"
            >
              <span class="indicator-label">
                {{ $t('autoWithdraw.actionSave') }}
              </span>
              <span class="indicator-progress">
                {{ $t('autoWithdraw.actionSave') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </template>
      </datatable>

      <button
        type="button"
        class="btn btn-primary mt-5"
        id="btn-send-transaction"
        v-if="
          ![GROUP_STATUS.COMPLETED, GROUP_STATUS.CANCEL].includes(
            groupDetail.status,
          )
        "
        :data-kt-indicator="isSending ? 'on' : ''"
        :disabled="
          transactions.length === 0 ||
          isSending ||
          groupDetail.status !== GROUP_STATUS.CREATED
        "
        @click="sendTransactions"
      >
        <span class="indicator-label">
          {{ $t('autoWithdraw.actionSend') }}
        </span>
        <span class="indicator-progress">
          {{ $t('autoWithdraw.actionSend') }}
          <span
            class="spinner-border spinner-border-sm align-middle ms-2"
          ></span>
        </span>
      </button>
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
  buildLocalDatatableResponse,
  formatCurrencyBalance,
} from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CONFIG from '@/config'
import {
  WALLET_TRANSACTION_STATUS,
  GROUP_STATUS,
  WALLET_TRANSACTION_QUEUE_STATUS,
  TRANSACTION_STATUS,
} from '@/core/variables/auto_withdraw.const'
import Swal from 'sweetalert2'
import readXlsxFile from 'read-excel-file'
import { AutoWithdrawService } from '@/services/AutoWithdrawService'
import BigNumber from 'bignumber.js'

export default defineComponent({
  name: 'AutoWithdrawGroupDetail',
  components: {
    Datatable,
  },
  data() {
    return {
      CONFIG,
      reloadKey: 0,
      GROUP_STATUS,
      tableConfig: {
        identifyField: 'group_id',
        dataSource: (params) => this.getDataSource(params),
        columns: [
          {
            key: 'withdrawRequestId',
            title: this.$t('autoWithdraw.transactionId'),
            sortable: false,
            class: 'td-w-400px',
          },
          {
            key: 'transactionStatus',
            title: this.$t('autoWithdraw.transactionStatus'),
            sortable: false,
          },
          {
            key: 'currency',
            title: this.$t('autoWithdraw.currency'),
            sortable: false,
            render: (value) => {
              return value.toUpperCase()
            },
          },
          {
            key: 'email',
            title: this.$t('autoWithdraw.email'),
            sortable: false,
          },
          {
            key: 'toAddress',
            title: this.$t('autoWithdraw.toAddress'),
            sortable: false,
            class: 'td-w-400px',
          },
          {
            key: 'amount',
            title: this.$t('autoWithdraw.amount'),
            sortable: false,
            render: (value) => {
              return formatCurrencyBalance(Math.abs(value))
            },
          },
          {
            key: 'status',
            title: this.$t('autoWithdraw.status'),
            sortable: false,
            render: (value) => {
              return [
                WALLET_TRANSACTION_QUEUE_STATUS.SIGNING_QUEUE,
                WALLET_TRANSACTION_QUEUE_STATUS.CONFIRMATION_QUEUE,
                WALLET_TRANSACTION_STATUS.SENDING,
              ].includes(value)
                ? WALLET_TRANSACTION_STATUS.SENDING
                : value
            },
          },
          {
            key: 'txHash',
            title: this.$t('autoWithdraw.transactionHash'),
            sortable: false,
            class: 'td-w-600px',
          },
          {
            key: 'error',
            title: this.$t('autoWithdraw.transactionError'),
            sortable: false,
            class: 'td-w-400px',
          },
        ],
        searchColumns: [
          {
            key: 'email',
            title: this.$t('autoWithdraw.email'),
            searchType: DatatableSearchType.TEXT,
          },
          {
            key: 'status',
            title: this.$t('autoWithdraw.status'),
            searchType: DatatableSearchType.SELECT,
            remote: false,
            options: Object.values(WALLET_TRANSACTION_STATUS),
            class: 'w-150px',
          },
        ],
        configPage: false,
      } as ITableConfig,
      transactions: [] as any[],
      tempTransactions: [] as any[],
      groupDetail: {} as any,
      isReadingExcel: false,
      isSending: false,
      isCollecting: false,
      isCanceling: false,
      isSavingTempTransactions: false,
      hasGetTransactions: true,
      listErc20: [
        'arb',
        'bcast',
        'castle',
        'comp',
        'drp',
        'eve',
        'hic',
        'hop',
        'hrs',
        'iris',
        'join',
        'jpi',
        'link',
        'mc',
        'nhop',
        'obt',
        'sushi',
        'uf',
        'uni',
        'venus',
        'wpc',
        'aave',
        'usdt',
        'twin',
      ] as string[],
    }
  },
  computed: {
    suggestedDeposit() {
      const vm = this as any
      const suggestedFee = vm.groupDetail?.suggestedFee ?? 0
      const totalBalance = vm.groupDetail?.totalBalance ?? 0

      if (
        vm.groupDetail?.currency &&
        vm.listErc20.includes(vm.groupDetail?.currency)
      ) {
        const ethBalance = `${vm.formatCurrencyBalance(
          new BigNumber(suggestedFee),
        )} ETH`

        const totalErc20Balance = `${vm.formatCurrencyBalance(totalBalance)} ${
          vm.groupDetail?.currency
        }`

        return `${totalErc20Balance} + ${ethBalance}`
      }

      return vm.formatCurrencyBalance(
        new BigNumber(suggestedFee).plus(totalBalance),
      )
    },
  },
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('autoWithdraw.groupTitle', [])
    this.$nextTick(() => {
      window.addEventListener('scroll', this.handleScroll)
    })
  },
  methods: {
    refreshTable() {
      this.reloadKey++
    },
    async getDataSource(params) {
      if (this.hasGetTransactions) {
        await this.getTransactions(params)
        this.hasGetTransactions = true
      }

      let transactions = this.transactions

      // filter by email
      if (params['search_field'] === 'email' && params['search_text']) {
        transactions = transactions.filter((transaction) => {
          return transaction.email.includes(params['search_text'])
        })
      }

      const dataSource = [...this.tempTransactions, ...transactions]
      return buildLocalDatatableResponse(dataSource, 1, 1000)
    },

    async getTransactions(params) {
      try {
        params['size'] = 1000

        const result = await AutoWithdrawService.getTransactions({
          group_id: this.$route.params?.id,
          ...params,
        })
        this.groupDetail = result?.data?.metaData ?? null
        let transactions = await this.mappingStatusTransactions(
          result?.data?.data ?? [],
        )
        this.transactions = transactions
      } catch (err) {
        // TODO
      }
    },

    async mappingStatusTransactions(transactions) {
      try {
        if (transactions.length === 0) {
          return transactions
        }
        let transactionIds = transactions.map((transaction) => {
          return transaction.withdrawRequestId
        })
        transactionIds = Array.from(new Set(transactionIds))
        const params = { transactionIds }
        if (this.groupDetail?.status !== GROUP_STATUS.CREATED) {
          params['status'] = 'all'
        }
        const result = await AutoWithdrawService.getDetailTransactions(params)
        let tempTransactions = result?.data?.data ?? []
        if (tempTransactions.length === 0) {
          return transactions
        }

        let transactionsObj = {}
        for (let tempTran of tempTransactions) {
          transactionsObj[tempTran.transaction_id] = tempTran
        }

        return transactions.map((transaction) => {
          return {
            ...transaction,
            transactionStatus:
              transactionsObj[transaction.withdrawRequestId]?.status,
            email:
              transactionsObj[transaction.withdrawRequestId]?.user?.email ??
              null,
          }
        })
      } catch (err) {
        return transactions
      }
    },

    importTempTransactions() {
      ;(this.$refs['fileUpload'] as any).click()
    },

    async readFileExcel(event) {
      try {
        this.isReadingExcel = true
        const file = event.target.files[0]
        const extension = file.name.split('.').pop()
        let rows: any = []
        if (['xlsx', 'xls'].includes(extension)) {
          rows = await readXlsxFile(event.target.files[0])
        }

        if (['csv'].includes(extension)) {
          rows = await this.readFileCsv(event.target.files[0])
        }

        const isValid = this.validateFileExcel(rows)
        if (!isValid) {
          this.isReadingExcel = false
          this.clearFileInput()
          return
        }

        // read file content
        let transactionIds: any[] = []
        for (let i = 0; i < rows.length; i++) {
          if (typeof rows[i][0] === 'string') {
            const transactionId = rows[i][0].trim().replace(/["']/g, '')
            if (transactionId) {
              transactionIds.push(transactionId)
            }
          }
        }

        transactionIds = Array.from(new Set(transactionIds))

        // check transaction exist other group
        const groupDetailId = this.groupDetail?.id
        if (!groupDetailId) {
          this.isReadingExcel = false
          this.clearFileInput()
          return
        }
        const errorTransactionIdsFromServer =
          await this.validateTransactionsFromServer({
            withdraw_request_ids: transactionIds,
            group_id: groupDetailId,
          })

        if (errorTransactionIdsFromServer.length > 0) {
          transactionIds = transactionIds.filter(
            (item) => !errorTransactionIdsFromServer.includes(item),
          )
        }

        await this.getDetailTransactions(transactionIds)
        this.isReadingExcel = false
        this.clearFileInput()
      } catch (err) {
        console.log('readFileExcel', err)
        this.isReadingExcel = false
        this.clearFileInput()
      }
    },

    async readFileCsv(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = async (e) => {
          const text = e?.target?.result as string
          resolve(this.csvToArray(text))
        }
        reader.onerror = (error) => {
          reject(error)
        }
        reader.readAsText(file)
      })
    },

    csvToArray(str, delimiter = ',') {
      // slice from start of text to the first \n index
      // use split to create an array from string by delimiter
      const headers = str.slice(0, str.indexOf('\n')).split(delimiter)

      // slice from \n index + 1 to the end of the text
      // use split to create an array of each csv value row
      const rows = str.slice(str.indexOf('\n') + 1).split('\n')

      const arr = rows.map(function (row) {
        const values = row.split(delimiter)
        return values
      })

      // return the array
      return [headers, ...arr]
    },

    async getDetailTransactions(transactionIds) {
      try {
        const result = await AutoWithdrawService.getDetailTransactions({
          transactionIds: transactionIds,
          status: 'all',
        })
        let tempTransactions = result?.data?.data ?? []
        tempTransactions = tempTransactions.map((transaction) => {
          return {
            toAddress:
              transaction.currency === 'xrp'
                ? transaction.destination_tag
                  ? `${transaction.to_address}:${transaction.destination_tag}`
                  : `${transaction.to_address}`
                : transaction.to_address,
            amount: Math.abs(transaction.amount),
            withdrawRequestId: transaction.transaction_id,
            transactionStatus: transaction.status,
            currency: transaction.currency,
            email: transaction?.user?.email ?? null,
            trCustomClass:
              transaction.status !== TRANSACTION_STATUS.APPROVED ||
              transaction.currency !== this.groupDetail.currency
                ? 'warning'
                : '',
          }
        })
        this.tempTransactions = tempTransactions
        this.hasGetTransactions = false
        this.refreshTable()
      } catch (err) {
        //
      }
    },

    async saveTempTransactions() {
      try {
        const groupDetailId = this.groupDetail?.id

        if (this.tempTransactions.length === 0 || !groupDetailId) {
          return
        }

        let tempTransactions = this.tempTransactions
          .filter(
            (transaction) =>
              transaction.transactionStatus === TRANSACTION_STATUS.APPROVED,
          )
          .filter(
            (transaction) => transaction.currency === this.groupDetail.currency,
          )
          .map((transaction) => {
            return {
              toAddress: transaction.toAddress,
              amount: Math.abs(transaction.amount),
              withdraw_request_id: transaction.withdrawRequestId,
              email: transaction?.email ?? null,
            }
          })

        if (tempTransactions.length === 0) {
          this.tempTransactions = []
          this.hasGetTransactions = true
          this.refreshTable()
          return Swal.fire({
            icon: 'warning',
            text: this.$t('autoWithdraw.noSatisfyTransactions'),
            showConfirmButton: false,
            timer: 3000,
          })
        }

        this.isSavingTempTransactions = true
        const result = await AutoWithdrawService.saveTransactions({
          withdraws: tempTransactions,
          groupId: groupDetailId,
        })

        const data = result?.data?.data ?? null
        if (!data) {
          Swal.fire({
            icon: 'error',
            text: this.$t('autoWithdraw.saveTransactionsFail'),
            showConfirmButton: false,
            timer: 3000,
          })
          this.isSavingTempTransactions = false
          return
        }

        Swal.fire({
          icon: 'success',
          text: this.$t('autoWithdraw.saveTransactionsSuccess'),
          showConfirmButton: false,
          timer: 3000,
        })
        this.tempTransactions = []
        this.isSavingTempTransactions = false
        this.hasGetTransactions = true
        this.refreshTable()
      } catch (err) {
        this.isSavingTempTransactions = false
      }
    },

    async sendTransactions() {
      const { isConfirmed } = await Swal.fire({
        text: this.$t('autoWithdraw.confirmSendTransaction'),
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('autoWithdraw.actionSend'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (!isConfirmed) {
        return
      }

      try {
        const groupDetailId = this.groupDetail?.id
        if (!groupDetailId) {
          return
        }
        this.isSending = true
        const result = await AutoWithdrawService.sendProcessTransactions({
          group_id: groupDetailId,
          status: 'processing',
        })

        const data = result?.data?.data ?? null
        if (!data) {
          Swal.fire({
            icon: 'error',
            text: this.$t('autoWithdraw.sendTransactionsFail'),
            showConfirmButton: false,
            timer: 3000,
          })
          this.isSending = false
          return
        }
        Swal.fire({
          icon: 'success',
          text: this.$t('autoWithdraw.sendTransactionsSuccess'),
          showConfirmButton: false,
          timer: 3000,
        })
        this.isSending = false
        this.hasGetTransactions = true
        this.refreshTable()
      } catch (err) {
        this.isSending = false
      }
    },

    async cancelGroup() {
      const { isConfirmed } = await Swal.fire({
        text: this.$t('autoWithdraw.confirmCancelGroup'),
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('save'),
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (!isConfirmed) {
        return
      }

      try {
        const groupDetailId = this.groupDetail?.id
        if (!groupDetailId) {
          return
        }
        this.isCanceling = true
        const result = await AutoWithdrawService.sendProcessTransactions({
          group_id: groupDetailId,
          status: 'cancel',
        })

        const data = result?.data?.data ?? null
        if (!data) {
          Swal.fire({
            icon: 'error',
            text: this.$t('autoWithdraw.cancelTransactionsFail'),
            showConfirmButton: false,
            timer: 3000,
          })
          this.isCanceling = false
          return
        }
        const transactionHash =
          result?.data?.data?.metaData?.transactionHash ?? ''
        let successToastTitle = this.$t(
          'autoWithdraw.cancelTransactionsSuccess',
        )
        if (transactionHash) {
          successToastTitle = this.$t(
            'autoWithdraw.cancelTransactionsSuccessWithHash',
          )
        }
        this.isCanceling = false
        this.refreshTable()
        return Swal.fire({
          title: `${successToastTitle}`,
          text: `${transactionHash}`,
          icon: 'success',
        })
      } catch (err) {
        this.isCanceling = false
      }
    },

    async collectGroup() {
      const { isConfirmed } = await Swal.fire({
        text: this.$t('autoWithdraw.confirmCollectGroup'),
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('save'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (!isConfirmed) {
        return
      }

      try {
        const groupDetailId = this.groupDetail?.id
        if (!groupDetailId) {
          return
        }
        this.isCollecting = true
        const result = await AutoWithdrawService.collectGroup(groupDetailId)
        const transactionHash = result?.data?.data?.transactionHash ?? null
        if (!transactionHash) {
          return Swal.fire({
            title: this.$t('autoWithdraw.collectTransactionsFail'),
            icon: 'error',
          }).then(async () => {
            this.isCollecting = false
            return
          })
        }
        this.isCollecting = false
        return Swal.fire({
          title: this.$t('autoWithdraw.collectTransactionsSuccess'),
          html: `${transactionHash}`,
          icon: 'success',
        }).then(async () => {
          // this.refreshTable()
        })
      } catch (err) {
        this.isCollecting = false
      }
    },

    validateFileExcel(rows) {
      if (rows.length < 1) {
        Swal.fire({
          icon: 'warning',
          text: this.$t('autoWithdraw.fileEmpty'),
          showConfirmButton: false,
          timer: 3000,
        })
        return false
      }

      if (rows.length > 501) {
        Swal.fire({
          icon: 'warning',
          text: this.$t('autoWithdraw.fileTooLarge'),
          showConfirmButton: false,
          timer: 3000,
        })
        return false
      }
      return true
    },

    async validateTransactionsFromServer(transactionIds) {
      try {
        const res = await AutoWithdrawService.validateTransactions(
          transactionIds,
        )
        let errorTransactionIdsFromServer = res?.data?.data ?? []
        errorTransactionIdsFromServer = Array.from(
          new Set(errorTransactionIdsFromServer),
        )

        if (errorTransactionIdsFromServer.length > 0) {
          const htmlContent = errorTransactionIdsFromServer.reduce(
            (str, currentValue) => {
              return str + `<p>${currentValue}</p>`
            },
            '',
          )
          return Swal.fire({
            title: this.$t('autoWithdraw.importedTransactions'),
            html: `${htmlContent}`,
            icon: 'error',
          }).then(async () => {
            return errorTransactionIdsFromServer
          })
        }
        return errorTransactionIdsFromServer
      } catch (err) {
        return []
      }
    },

    clearFileInput() {
      ;(this.$refs['fileUpload'] as any).value = null
    },
    formatCurrencyBalance(amount, zeroValue) {
      return formatCurrencyBalance(Math.abs(amount), zeroValue)
    },
    convertTimestampToDate,
    handleScroll() {
      const btnSendTransaction = document.getElementById(
        'btn-send-transaction',
      ) as HTMLElement
      if (!btnSendTransaction) {
        return
      }
      const autoWithdrawGroupDetail = this.$refs
        .autoWithdrawGroupDetail as HTMLElement
      const sticky = document.documentElement.scrollTop
      const windowInnerHeight = window.innerHeight
      let offsetHeight: number | null = null
      if (
        autoWithdrawGroupDetail &&
        'offsetHeight' in autoWithdrawGroupDetail
      ) {
        offsetHeight = autoWithdrawGroupDetail.offsetHeight
      }

      if (!offsetHeight) {
        return
      }

      if (sticky > 200 && offsetHeight - windowInnerHeight > sticky) {
        btnSendTransaction.classList.add('sticky', 'btn-sm')
      } else {
        btnSendTransaction.classList.remove('sticky', 'btn-sm')
      }
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/auto_withdraw/scss/auto_withdraw_group_detail';
</style>
