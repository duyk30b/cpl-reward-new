<template>
  <div class="card">
    <!-- <div class="card-header border-0 pt-6 mb-8">
      <div class="card-title">
        <h1>
          {{ $t('menu.walletSub.withdrawalControl.pendingApprovalDetail') }}:
          {{ approval.transactionId }}
        </h1>
      </div>
    </div> -->
    <div class="card-body pt-10">
      <div class="row">
        <div
          class="transaction-details col-sm-12 col-md-12 col-lg-12 col-xl-6 mb-8"
        >
          <h2 class="title pb-5">
            {{
              $t(
                'menu.walletSub.withdrawalControl.transactionDetails',
              ).toUpperCase()
            }}
          </h2>
          <div class="details">
            <div
              v-for="(item, index) in approvalDetailsDisplayKeys"
              :key="index"
              class="detail row"
            >
              <p class="col-5">{{ $t(item.label) }}</p>
              <b class="text-break col-7" :class="item.className ?? ''">{{
                approval[item.key]
              }}</b>
            </div>
          </div>
        </div>
        <div
          class="customer-information col-sm-12 col-md-12 col-lg-12 col-xl-6 mb-8"
        >
          <h2 class="title pb-5">
            {{
              $t(
                'menu.walletSub.withdrawalControl.customerInformation',
              ).toUpperCase()
            }}
          </h2>

          <div class="details">
            <div
              v-for="(item, index) in customerInformationDisplayKeys"
              :key="index"
              class="detail row"
            >
              <p class="col-5">{{ $t(item.label) }}</p>
              <a
                class="col-7"
                v-if="
                  approval.userInfo &&
                  item.key === 'email' &&
                  approval['userDetailUrl'] &&
                  approval.userInfo['email']
                "
                :href="approval['userDetailUrl']"
                target="_blank"
              >
                <b class="text-break">{{ approval.userInfo[item.key] }}</b>
              </a>
              <b v-else-if="approval.userInfo" class="text-break col-7">{{
                approval.userInfo[item.key]
              }}</b>
            </div>

            <div class="remarks row d-flex justify-content-between">
              <p class="col-5">
                {{ $t('menu.walletSub.withdrawalControl.remarks') }}
              </p>
              <div class="form-floating col-7">
                <textarea
                  v-model="approval.remarks"
                  class="form-control"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="user-security-test mb-8">
        <h2 class="title pb-5">
          {{
            $t('menu.walletSub.withdrawalControl.securityTest').toUpperCase()
          }}
        </h2>
        <div class="dataTables_wrapper dt-bootstrap4 no-footer">
          <div class="table-responsive">
            <table
              :class="[isTableLoading && 'overlay overlay-block']"
              class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
              id="kt_customers_table"
              role="grid"
            >
              <thead>
                <tr
                  class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0"
                  role="row"
                  v-if="tableHeader && tableHeader.length"
                >
                  <template v-for="(cell, i) in tableHeader" :key="i">
                    <th
                      tabindex="0"
                      rowspan="1"
                      colspan="1"
                      :class="[cell.sortable && 'sorting cursor-pointer']"
                    >
                      {{ $t(cell.name) }}
                    </th>
                  </template>
                </tr>
              </thead>
              <tbody class="fw-bold text-gray-600">
                <template v-if="tableData && tableData.length">
                  <template
                    v-for="(item, itemIndex) in tableData"
                    :key="itemIndex"
                  >
                    <tr class="odd">
                      <template
                        v-for="(cell, cellIndex) in tableHeader"
                        :key="cellIndex"
                      >
                        <td
                          v-if="cell.key !== 'result'"
                          :class="{
                            'text-end': tableHeader.length - 1 === cellIndex,
                            [cell.className]: cell.className,
                            'max-width-250': 1,
                          }"
                        >
                          <slot :name="`cell-${cell.key}`" :row="item">
                            <span
                              :class="{
                                'text-uppercase':
                                  cell.key === 'symbol' ||
                                  cell.key === 'chain_code',
                              }"
                            >
                              {{
                                $t(item[cell.key], {
                                  currency: approval.currency?.toUpperCase(),
                                  hl_limit_time:
                                    configTransactionApproval?.highlowTotalChecking.toLocaleString() ??
                                    0,
                                  hl_win_rate_percent:
                                    configTransactionApproval?.highlowWinrateLimitPercent.toLocaleString() ??
                                    0,
                                  hl_profit:
                                    configTransactionApproval?.highlowProfitLimit.toLocaleString() ??
                                    0,
                                  daily_rating_order:
                                    configTransactionApproval?.orderDailyLimit.toLocaleString() ??
                                    0,
                                  minutely_rating_order:
                                    configTransactionApproval?.orderMinutelyLimit.toLocaleString() ??
                                    0,
                                  manual_update_major_balance_amount:
                                    configTransactionApproval?.manuallyTransactionUsdValueLimit.toLocaleString() ??
                                    0,
                                })
                              }}
                            </span>
                          </slot>
                        </td>
                        <td v-else>
                          <slot :name="`cell-${cell.key}`" :row="item">
                            <div class="d-flex align-items-center">
                              <span
                                v-if="isTableLoading"
                                class="badge bg-secondary"
                              >
                                {{ $t('loading') }}
                              </span>
                              <template v-else>
                                <span
                                  v-if="isTableError"
                                  class="badge bg-danger"
                                >
                                  {{ $t('error') }}
                                </span>
                                <span
                                  v-else
                                  class="badge"
                                  :class="{
                                    'bg-success': item[cell.key],
                                    'bg-danger': !item[cell.key],
                                  }"
                                >
                                  {{
                                    item[cell.key]
                                      ? $t(
                                          'menu.walletSub.withdrawalControl.good',
                                        )
                                      : $t(
                                          'menu.walletSub.withdrawalControl.notGood',
                                        )
                                  }}
                                </span>
                              </template>
                            </div>
                          </slot>
                        </td>
                      </template>
                    </tr>
                  </template>
                </template>
                <tr class="odd" v-else>
                  <td :colspan="6" class="text-center">
                    {{ $t('noData') }}
                  </td>
                </tr>
              </tbody>
              <div
                v-if="isTableLoading"
                class="overlay-layer card-rounded bg-dark bg-opacity-5"
              >
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
              </div>
              <!--end::Table body-->
            </table>
          </div>
        </div>
      </div>
      <div class="actions">
        <el-button
          class="btn btn-sm btn-success"
          :disabled="isPageLoading"
          @click="approveTransaction"
        >
          {{ $t('verify') }}
        </el-button>
        <el-button
          class="btn btn-sm btn-danger"
          :disabled="isPageLoading"
          @click="rejectTransaction"
          >{{ $t('reject') }}</el-button
        >
      </div>

      <hr />

      <el-button class="btn btn-light" @click="back">
        {{ $t('back') }}
      </el-button>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import {
  computed,
  defineComponent,
  getCurrentInstance,
  onMounted,
  ref,
} from 'vue'
import {
  WITHDRAW_TRANSACTION_STATUS,
  DOMAIN,
  WITHDRAWINTERACTOR,
} from '@/models/hot-wallet/HotWalletType'
import { useRoute, useRouter } from 'vue-router'
import {
  BceConfigTransactionApprovalDto,
  ETransactionApproveAction,
  IApproveTransactionParams,
  TransactionApprovalModel,
} from '@/models/withdrawal-control/TransactionApproval'
import { WalletBceService } from '@/services/WalletBceService'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const transactionId = computed(() => route.params.transactionId)
    const approval = ref<Partial<TransactionApprovalModel>>({})
    const configTransactionApproval = ref<BceConfigTransactionApprovalDto>()
    const approvalDetailsDisplayKeys = [
      {
        key: 'transactionId',
        label: 'menu.walletSub.withdrawalControl.transactionId',
      },
      {
        key: 'currency',
        label: 'menu.walletSub.withdrawalControl.withdrawalCurrency',
        className: 'text-uppercase',
      },
      {
        key: 'amount',
        label: 'menu.walletSub.withdrawalControl.amount',
      },
      {
        key: 'toAddressFormatted',
        label: 'menu.walletSub.withdrawalControl.withdrawalAddress',
      },
      {
        key: 'createdAt',
        label: 'menu.walletSub.withdrawalControl.createdDate',
      },
    ]
    const customerInformationDisplayKeys = [
      {
        key: 'fullName',
        label: 'menu.walletSub.withdrawalControl.name',
      },
      {
        key: 'countryName',
        label: 'menu.walletSub.withdrawalControl.country',
      },
      {
        key: 'birthday',
        label: 'menu.walletSub.withdrawalControl.birthdate',
      },
      {
        key: 'tel',
        label: 'menu.walletSub.withdrawalControl.tel',
      },
      {
        key: 'email',
        label: 'menu.walletSub.withdrawalControl.email',
      },
    ]
    const tableHeader = ref([
      {
        name: 'walletGeneral.domain',
        key: 'domain',
      },
      {
        name: 'walletGeneral.description',
        key: 'descriptions',
      },
      {
        name: 'walletGeneral.result',
        key: 'result',
      },
    ])
    let tableData = ref([
      {
        domain: 'highLow.highLow',
        descriptions: 'menu.walletSub.withdrawalControl.highlowWinrateDesc',
        result: false,
      },
      {
        domain: 'highLow.highLow',
        descriptions: 'menu.walletSub.withdrawalControl.highlowProfitDesc',
        result: false,
      },
      {
        domain: 'menu.exchange',
        descriptions: 'menu.walletSub.withdrawalControl.dailyRatingDesc',
        result: false,
      },
      {
        domain: 'menu.exchange',
        descriptions: 'menu.walletSub.withdrawalControl.minutelyRatingDesc',
        result: false,
      },
      {
        domain: 'menu.exchange',
        descriptions: 'menu.walletSub.withdrawalControl.userBalanceDesc',
        result: false,
      },
      {
        domain: 'menu.exchange',
        descriptions:
          'menu.walletSub.withdrawalControl.manuallyUpdateMajorBalanceDesc',
        result: false,
      },
      {
        domain: 'dividend',
        descriptions:
          'menu.walletSub.withdrawalControl.dividendCodeDuplicatedDesc',
        result: false,
      },
    ])
    const getData = async () => {
      try {
        isPageLoading.value = true

        const details = await WalletBceService.getTransactionDetail(
          transactionId.value as string,
        )

        if (details) {
          if (details.userId) {
            details['userDetailUrl'] = `/#/user/${details.userId}/detail`
          }

          approval.value = details
        }

        await getConfigTransactionApproval()
        getSecurityResults()

        isPageLoading.value = false
      } catch (error) {
        isPageLoading.value = false
      }
    }

    const getSecurityResults = async () => {
      isTableLoading.value = true
      try {
        const isMinutelyRatingValid = WalletBceService.checkOrderMinutelyRating(
          approval.value.userId as number,
        )

        const isDailyRatingValid = WalletBceService.checkOrderDailyRating(
          approval.value.userId as number,
        )

        // const isOrderOverLimit = WalletBceService.checkOrderOverLimit(
        //   approval.value.userId as number,
        // )

        const isUserBalanceValid = WalletBceService.checkUserBalance(
          approval.value.userId as number,
          approval.value.currency as string,
        )

        const isManuallyUpdateMajorBalanceValid =
          WalletBceService.checkManuallyUpdateMajorBalance(
            approval.value.userId as number,
          )

        const isDividendCodeDuplicated =
          WalletBceService.checkDividendCodeDuplicated(
            approval.value.userId as number,
          )

        const isHighLowTotalRecordValid =
          WalletBceService.checkHighLowTotalRecord(
            approval.value.userId as number,
          )
        const isHighLowProfitValid = WalletBceService.checkHighLowProfit(
          approval.value.userId as number,
        )

        // const isMinutelyRatingValid =
        //   WalletBceService.checkOrderMinutelyRating(
        //     approval.value.userId as number,
        //   )

        const res = await Promise.all([
          isHighLowTotalRecordValid,
          isHighLowProfitValid,
          isDailyRatingValid,
          isMinutelyRatingValid,
          // isOrderOverLimit,
          isUserBalanceValid,
          isManuallyUpdateMajorBalanceValid,
          isDividendCodeDuplicated,
        ])

        tableData.value = tableData.value.map((e, index) => {
          if (index === 0) {
            e.result = res[index].isWinRatioSafe
          } else if (index === 1) {
            e.result = res[index].isProfitSafe
          } else {
            e.result = res[index] as boolean
          }
          return e
        })

        isTableLoading.value = false
      } catch (error) {
        isTableLoading.value = false
        isTableError.value = true
      }
    }

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs(
        'menu.walletSub.withdrawalControl.pendingApprovalDetail',
        ['menu.walletSub.withdrawalControl.index'],
      )
      getData()
    })

    const rejectTransaction = () => {
      ElMessageBox.confirm(
        t('menu.walletSub.withdrawalControl.rejectionConfirmMessage'),
        {
          confirmButtonText: t('yes'),
          cancelButtonText: t('no'),
        },
      ).then(() => {
        const body: IApproveTransactionParams = {
          transactionId: transactionId.value as string,
          action: ETransactionApproveAction.REJECTED,
          remarks: approval.value.remarks,
        }
        isPageLoading.value = true

        WalletBceService.approveTransaction(body)
          .then(() => {
            isPageLoading.value = false

            toastr.success(t('menu.walletSub.withdrawalControl.rejectSuccess'))
            router.push({
              name: 'menu.walletSub.withdrawalControl.approvalPending',
            })
          })
          .catch(() => {
            isPageLoading.value = false
            toastr.error(t('menu.walletSub.withdrawalControl.rejectFailed'))
          })
      })
    }

    const getConfigTransactionApproval = async () => {
      configTransactionApproval.value =
        await WalletBceService.getConfigTransactionApproval()
    }

    const approveTransaction = async () => {
      ElMessageBox.confirm(
        t('menu.walletSub.withdrawalControl.approvalConfirmMessage'),
        {
          confirmButtonText: t('yes'),
          cancelButtonText: t('no'),
        },
      ).then(() => {
        const body: IApproveTransactionParams = {
          transactionId: transactionId.value as string,
          action: ETransactionApproveAction.VERIFIED,
          remarks: approval.value.remarks,
        }
        isPageLoading.value = true

        WalletBceService.approveTransaction(body)
          .then(() => {
            isPageLoading.value = false

            toastr.success(t('menu.walletSub.withdrawalControl.verifySuccess'))
            router.push({
              name: 'menu.walletSub.withdrawalControl.approvalPending',
            })
          })
          .catch(() => {
            isPageLoading.value = false
            toastr.error(t('menu.walletSub.withdrawalControl.approveFailed'))
          })
      })
    }

    const back = () => {
      router.push({
        name: 'menu.walletSub.withdrawalControl.approvalPending',
      })
    }

    const isPageLoading = ref(false)
    const isTableLoading = ref(true)
    const isTableError = ref(false)

    const app = getCurrentInstance()
    const toastr = app?.appContext.config.globalProperties.$toastr
    const t = app?.appContext.config.globalProperties.$t

    return {
      approval,
      approvalDetailsDisplayKeys,
      customerInformationDisplayKeys,
      isPageLoading,
      isTableLoading,
      isTableError,
      tableHeader,
      tableData,
      getData,
      getSecurityResults,
      approveTransaction,
      rejectTransaction,
      getConfigTransactionApproval,
      configTransactionApproval,
      back,
      WITHDRAW_TRANSACTION_STATUS,
      DOMAIN,
      WITHDRAWINTERACTOR,
    }
  },
})
</script>
<style scoped>
.mw-150px {
  min-width: 150px;
}

[disabled] {
  cursor: not-allowed !important;
  pointer-events: auto !important;
}

.transaction-details .details {
  display: flex;
  flex-direction: column;
}

.transaction-details .details .detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
}

.customer-information .details {
  display: flex;
  flex-direction: column;
}

.customer-information .details .detail {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.5rem;
}
</style>
