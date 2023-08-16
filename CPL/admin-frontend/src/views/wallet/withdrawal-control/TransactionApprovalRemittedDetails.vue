<template>
  <div class="card">
    <!-- <div class="card-header border-0 pt-6 mb-8">
      <div class="card-title">
        <h1>
          {{ $t('menu.walletSub.withdrawalControl.remittedApprovalDetail') }}:
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
          </div>
        </div>
      </div>
      <div class="admin-info mb-8">
        <h2 class="title pb-5">
          {{ $t('menu.walletSub.withdrawalControl.adminInfo').toUpperCase() }}
        </h2>
        <div class="row">
          <div class="details">
            <div
              v-for="(item, index) in administrationInformationDisplayKeys"
              :key="index"
              class="detail row mb-4"
            >
              <p class="col-3">{{ $t(item.label) }}</p>
              <a
                class="col-9"
                v-if="item.key === 'transactionHashUrl' && approval[item.key]"
                :href="approval[item.key]"
                target="_blank"
              >
                <b class="text-break">{{ approval['transactionHash'] }}</b>
              </a>
              <b v-else class="text-break col-9">{{ approval[item.key] }}</b>
            </div>
          </div>

          <div class="remarks row d-flex mb-4">
            <p class="col-3">
              {{ $t('menu.walletSub.withdrawalControl.remarks') }}
            </p>
            <div class="col-5">
              <textarea
                v-model="remarks"
                class="form-control"
                disabled="true"
                rows="5"
                maxlength="65535"
              ></textarea>
            </div>
          </div>

          <div class="row mb-4">
            <p class="col-3">
              {{ $t('menu.walletSub.withdrawalControl.log') }}
            </p>
            <div class="dataTables_wrapper dt-bootstrap4 no-footer col-9">
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
                    <template v-if="logs && logs.length">
                      <tr v-for="(item, itemIndex) in logs" :key="itemIndex">
                        <template v-for="(cell, i) in tableHeader" :key="i">
                          <td
                            :class="{
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
                                {{ $t(item[cell.key]) }}
                              </span>
                            </slot>
                          </td>
                        </template>
                      </tr>
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
        </div>

        <hr />

        <el-button class="btn btn-light" @click="back">
          {{ $t('back') }}
        </el-button>
      </div>
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
import store from '@/store'
import { Actions } from '@/store/enums/StoreEnums'
import {
  WITHDRAW_TRANSACTION_STATUS,
  DOMAIN,
  WITHDRAWINTERACTOR,
} from '@/models/hot-wallet/HotWalletType'
import { useRoute, useRouter } from 'vue-router'
import {
  TransactionApprovalModel,
  WithdrawalLogDto,
} from '@/models/withdrawal-control/TransactionApproval'
import { WalletBceService } from '@/services/WalletBceService'

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const transactionId = computed(() => route.params.transactionId)
    const approval = ref<Partial<TransactionApprovalModel>>({})
    const remarks = ref<string>('')
    const logs = ref<Array<WithdrawalLogDto>>([])
    const tableHeader = ref([
      {
        name: 'status',
        key: 'status',
      },
      {
        name: 'description',
        key: 'message',
      },
      {
        name: 'walletGeneral.time',
        key: 'createdAt',
      },
    ])
    const tableData = ref<Array<WithdrawalLogDto>>([])
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
    const administrationInformationDisplayKeys = [
      {
        key: 'approveAt',
        label: 'menu.walletSub.withdrawalControl.approvedDate',
      },
      {
        key: 'approvedBy',
        label: 'menu.walletSub.withdrawalControl.approvedBy',
      },
      {
        key: 'processType',
        label: 'menu.walletSub.withdrawalControl.processType',
      },
      {
        key: 'processSourceType',
        label: 'menu.walletSub.withdrawalControl.processSourceType',
      },
      {
        key: 'sentAt',
        label: 'menu.walletSub.withdrawalControl.sentDate',
      },
      {
        key: 'sendConfirmers',
        label: 'menu.walletSub.withdrawalControl.sentBy',
      },
      {
        key: 'transactionHashUrl',
        label: 'menu.walletSub.withdrawalControl.transactionHash',
      },
      // {
      //   key: 'remarks',
      //   label: 'menu.walletSub.withdrawalControl.remarks',
      // },
    ]

    const listCoinRaw = computed(() => {
      return store.getters.listCoinRaw
    })

    const getTransactionHashUrl = ({
      coin,
      chainCode,
      transactionHash,
    }: {
      coin: string
      chainCode?: string
      transactionHash: string
    }) => {
      const coinData = listCoinRaw.value[coin]

      if (!coinData) {
        return
      }
      const networksData = coinData.networks || []

      let coinDataNetwork = networksData[0]

      if (chainCode) {
        networksData.find((networkData) => networkData.network === chainCode) ||
          coinDataNetwork
      }

      if (!coinDataNetwork) {
        return
      }

      const transactionTxPath = coinDataNetwork.transactionTxPath
      return transactionTxPath.replace('{$transaction_id}', transactionHash)
    }

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

          const withdrawalType = details.withdrawalType

          details.processSourceType = withdrawalType
            ? withdrawalType === 'auto'
              ? t('walletGeneral.autoWithdraw')
              : t('walletGeneral.manualWithdraw')
            : ''

          details.processType = details.processType
            ? details.processType === 2
              ? t('menu.walletSub.withdrawalControl.hotWalletProgress')
              : t('menu.walletSub.withdrawalControl.manualProgress')
            : t('menu.walletSub.withdrawalControl.manualProgress')

          if (withdrawalType === 'auto') {
            details.processType = '' as any
          }

          /**
           * * Map transaction_hash url
           */
          const coinData = listCoinRaw.value[details.currency]

          if (coinData && details.transactionHash) {
            const transactionHashUrl = getTransactionHashUrl({
              coin: details.currency,
              transactionHash: details.transactionHash,
            })

            if (transactionHashUrl) {
              details['transactionHashUrl'] = transactionHashUrl
            }
          }

          approval.value = details
        }

        if (details.remarks) {
          remarks.value = details.remarks
        }

        if (details.withdrawalLogs) {
          logs.value = details.withdrawalLogs
        }

        isPageLoading.value = false
      } catch (error) {
        isPageLoading.value = false
      }
    }

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs(
        'menu.walletSub.withdrawalControl.remittedApprovalDetail',
        ['menu.walletSub.withdrawalControl.index'],
      )
      store.dispatch(Actions.FETCH_LIST_COIN_RAW)
      getData()
    })

    const back = () => {
      router.push({
        name: 'menu.walletSub.withdrawalControl.remittedTransactions',
      })
    }

    const isPageLoading = ref(false)
    const isTableLoading = ref(false)

    const app = getCurrentInstance()
    // const toastr = app?.appContext.config.globalProperties.$toastr
    const t = app?.appContext.config.globalProperties.$t

    return {
      approval,
      approvalDetailsDisplayKeys,
      customerInformationDisplayKeys,
      administrationInformationDisplayKeys,
      isPageLoading,
      isTableLoading,
      tableHeader,
      tableData,
      getData,
      back,
      WITHDRAW_TRANSACTION_STATUS,
      DOMAIN,
      WITHDRAWINTERACTOR,
      remarks,
      logs,
    }
  },
})
</script>
<style scoped>
.mw-150px {
  min-width: 150px;
}

[disabled] {
  cursor: auto !important;
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

.max-width-250 {
  max-width: 250px;
  word-break: break-word;
}
</style>
