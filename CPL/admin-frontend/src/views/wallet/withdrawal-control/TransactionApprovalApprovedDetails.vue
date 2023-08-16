<template>
  <div class="card">
    <!-- <div class="card-header border-0 pt-6 mb-8">
      <div class="card-title">
        <h1>
          {{ $t('menu.walletSub.withdrawalControl.approvedApprovalDetail') }}:
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
          <h2 class="title pb-5" style="display: flex; align-items: center">
            {{
              $t(
                'menu.walletSub.withdrawalControl.customerInformation',
              ).toUpperCase()
            }}
            <span
              v-if="isBlacklistUser"
              class="badge bg-danger"
              style="margin-left: 15px"
              >{{ $t('walletGeneral.userInWalletBlackListUser') }}</span
            >
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
      <Form v-slot="{ errors }">
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
                <b class="text-break col-9">{{ approval[item.key] }}</b>
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
                      <template v-if="tableData && tableData.length">
                        <tr
                          v-for="(item, itemIndex) in tableData"
                          :key="itemIndex"
                        >
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

            <div class="row mb-4">
              <p class="col-3 required">
                {{ $t('menu.walletSub.withdrawalControl.confirmer1') }}
              </p>

              <el-autocomplete
                class="col-5"
                name="confirmer1"
                v-model="confirmer1.email"
                :fetch-suggestions="querySearchConfirmer1"
                :trigger-on-focus="true"
                placeholder=""
                clearable
                :disabled="
                  approval.processStatus ===
                  approvalProcessStatus.WALLET_AUTO_WITHDRAW_PROCESSING_STATUS
                "
                @change="handleSelectConfirmer1"
                @select="handleSelectConfirmer1"
                maxlength="255"
              />
              <Field
                name="confirmer1"
                type="text"
                as="input"
                v-model="confirmer1.email"
                class="d-none"
                rules="required"
              >
              </Field>
              <ErrorMessage name="confirmer1" class="text-danger" />
            </div>

            <div class="row mb-4">
              <p class="col-3 required">
                {{ $t('menu.walletSub.withdrawalControl.confirmer2') }}
              </p>

              <el-autocomplete
                class="col-5"
                required
                v-model="confirmer2.email"
                :fetch-suggestions="querySearchConfirmer2"
                :trigger-on-focus="true"
                placeholder=""
                clearable
                :disabled="
                  approval.processStatus ===
                  approvalProcessStatus.WALLET_AUTO_WITHDRAW_PROCESSING_STATUS
                "
                @change="handleSelectConfirmer2"
                @select="handleSelectConfirmer2"
                maxlength="255"
              />
              <Field
                name="confirmer2"
                type="text"
                as="input"
                v-model="confirmer2.email"
                class="form-control d-none"
                rules="required"
              >
              </Field>
              <ErrorMessage name="confirmer2" class="text-danger" />
            </div>

            <div class="remarks row d-flex mb-4">
              <p class="col-3">
                {{ $t('menu.walletSub.withdrawalControl.remarks') }}
              </p>
              <div class="col-5">
                <textarea
                  v-model="remarks"
                  class="form-control"
                  :disabled="
                    approval.processStatus ===
                    approvalProcessStatus.WALLET_AUTO_WITHDRAW_PROCESSING_STATUS
                  "
                  maxlength="65535"
                  rows="5"
                ></textarea>
              </div>
            </div>

            <div class="row mb-4">
              <p class="col-3">
                {{ $t('menu.walletSub.withdrawalControl.processType') }}
              </p>
              <div class="col-9">
                <el-radio-group
                  v-model="processType"
                  class="d-flex"
                  :disabled="
                    approval.processStatus ===
                    approvalProcessStatus.WALLET_AUTO_WITHDRAW_PROCESSING_STATUS
                  "
                >
                  <el-radio
                    label="auto"
                    size="large"
                    :disabled="isBlacklistUser"
                    >{{
                      $t('menu.walletSub.withdrawalControl.hotWalletProgress')
                    }}</el-radio
                  >
                  <el-radio label="manual" size="large">{{
                    $t('menu.walletSub.withdrawalControl.manualProgress')
                  }}</el-radio>
                </el-radio-group>

                <p v-if="processType === 'auto'">
                  {{ $t('menu.walletSub.withdrawalControl.processTypeNote') }}
                </p>
              </div>
            </div>

            <div class="row mb-4">
              <template v-if="processType === 'auto'">
                <p class="col-3">
                  {{ $t('menu.walletSub.withdrawalControl.estimateTime') }}
                </p>
                <p class="col-9">
                  {{ $t('menu.walletSub.withdrawalControl.estimateWaitTime') }}
                </p>
              </template>

              <template v-else>
                <div class="col-3 d-flex align-items-center required">
                  {{ $t('menu.walletSub.withdrawalControl.transactionHash') }}
                </div>
                <div class="col-5">
                  <input
                    type="text"
                    as="input"
                    v-model="transactionHash"
                    class="form-control"
                    rules="required"
                    maxlength="190"
                    :disabled="
                      approval.processStatus ===
                      approvalProcessStatus.WALLET_AUTO_WITHDRAW_PROCESSING_STATUS
                    "
                  />
                  <Field
                    name="transactionHash"
                    v-model="transactionHash"
                    rules="required"
                    class="d-none"
                  />
                  <ErrorMessage name="transactionHash" class="text-danger" />

                  <!-- <input
                    v-model="transactionHash"
                    type="text"
                    class="form-control"
                    placeholder=""
                    maxlength="255"
                  /> -->
                </div>
              </template>
            </div>
          </div>
        </div>
        <div class="actions w-100 d-flex justify-content-center">
          <el-button
            class="btn btn-sm btn-success"
            :disabled="Object.keys(errors).length > 0 || isButtonDisabled"
            @click="remitTransaction"
          >
            {{
              processType === 'auto'
                ? $t('menu.walletSub.withdrawalControl.hotWalletSubmit')
                : $t('menu.walletSub.withdrawalControl.remitTransaction')
            }}
          </el-button>
          <el-button
            class="btn btn-sm btn-light"
            @click="back"
            :disabled="isLoading"
            >{{ $t('menu.walletSub.withdrawalControl.backToList') }}</el-button
          >
        </div>
      </Form>
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
  TransactionApprovalModel,
  EProcessType,
  IRemitTransactionParams,
  EApprovalProcessStatus,
  WithdrawalLogDto,
  EApprovalProcessType,
  SendConfirmerDataModel,
} from '@/models/withdrawal-control/TransactionApproval'
import { AdminService } from '@/services/AdminService'
import { Admin } from '@/models/admin-permission/Admin'
import { WalletBceService } from '@/services/WalletBceService'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { ElMessageBox } from 'element-plus'
import { WalletSettingService } from '@/services/WalletSettingService'

export default defineComponent({
  components: { Form, Field, ErrorMessage },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const transactionId = computed(() => route.params.transactionId)
    const approval = ref<Partial<TransactionApprovalModel>>({})
    const processType = ref<EProcessType>(EProcessType.HOT_WALLET)
    const adminList = ref<any>([])
    const confirmer1 = ref<SendConfirmerDataModel>(new SendConfirmerDataModel())
    const confirmer2 = ref<SendConfirmerDataModel>(new SendConfirmerDataModel())
    const isLoading = ref<boolean>(false)
    let timer: any

    // eslint-disable-next-line no-undef
    const transactionHash = ref<string>('')
    const remarks = ref<string>('')
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
    ]
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
    let tableData = ref<Array<WithdrawalLogDto>>([])

    const approvalProcessStatus = EApprovalProcessStatus
    const getData = async () => {
      try {
        isPageLoading.value = true

        const details =
          (await WalletBceService.getTransactionDetail(
            transactionId.value as string,
          )) || {}

        if (details) {
          if (details.userId) {
            details['userDetailUrl'] = `/#/user/${details.userId}/detail`
          }

          approval.value = details
        }

        if (details.withdrawalLogs) {
          tableData.value = details.withdrawalLogs
        }

        if (details.remarks) {
          remarks.value = details.remarks
        }

        if (details.processType) {
          processType.value =
            details.processType === EApprovalProcessType.AUTO
              ? EProcessType.HOT_WALLET
              : EProcessType.MANUAL
        }

        if (details.sendConfirmer1Data) {
          confirmer1.value = details.sendConfirmer1Data
        }

        if (details.sendConfirmer2Data) {
          confirmer2.value = details.sendConfirmer2Data
        }

        if (details.userInfo) {
          if (details.userInfo?.email) {
            const getBlacklistUserResponse =
              await WalletSettingService.getBlacklistUser({
                keyword: details.userInfo.email,
              })

            if (getBlacklistUserResponse) {
              const blacklistUserData =
                getBlacklistUserResponse?.data?.data || []

              isBlacklistUser.value = !!blacklistUserData.find(
                (item) => item.email === details.userInfo.email,
              )
            }
          }
        }

        isPageLoading.value = false
      } catch (error) {
        isPageLoading.value = false
      }
    }

    const isButtonDisabled = computed(() => {
      const condition =
        processType.value === EProcessType.HOT_WALLET
          ? !confirmer1.value.email || !confirmer2.value.email
          : !transactionHash.value
      return (
        isLoading.value ||
        approval.value.processStatus ===
          EApprovalProcessStatus.WALLET_AUTO_WITHDRAW_PROCESSING_STATUS ||
        condition
      )
    })

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs(
        'menu.walletSub.withdrawalControl.approvedApprovalDetail',
        ['menu.walletSub.withdrawalControl.index'],
      )
      getData()
      AdminService.getListAdmins({}).then((value) => {
        adminList.value = value.data.data
      })
    })

    const reloadPage = () => {
      getData()
      processType.value = EProcessType.MANUAL
    }

    const remitTransaction = async () => {
      ElMessageBox.confirm(
        t('menu.walletSub.withdrawalControl.remissionConfirmMessage'),
        {
          confirmButtonText: t('yes'),
          cancelButtonText: t('no'),
        },
      ).then(() => {
        const body: IRemitTransactionParams = {
          transactionId: transactionId.value as string,
          remarks: remarks.value,
          transactionHash: transactionHash.value,
          processType: processType.value,
          sendConfirmer1: confirmer1.value.id,
          sendConfirmer2: confirmer2.value.id,
        }
        isLoading.value = true

        WalletBceService.remitTransaction(body)
          .then((data) => {
            isLoading.value = false

            if (data.status_code >= 400) {
              toastr.error(t('menu.walletSub.withdrawalControl.remitFailed'))
            } else {
              toastr.success(t('menu.walletSub.withdrawalControl.remitSuccess'))
              router.push({
                name: 'menu.walletSub.withdrawalControl.approvedTransactions',
              })
            }
          })
          .catch(() => {
            isLoading.value = false
            reloadPage()

            toastr.error(t('menu.walletSub.withdrawalControl.remitFailed'))
          })
      })
    }

    const querySearchConfirmer1 = async (queryString, cb) => {
      // TODO: Not sure why this block of code is needed
      // const results = queryString
      //   ? adminList.value.filter((admin: Admin) =>
      //       admin.email.includes(queryString),
      //     )
      //   : adminList.value

      // cb(
      //   results &&
      //     results.map((item: Admin) => {
      //       return {
      //         value: item.email,
      //         id: item.id,
      //       }
      //     }),
      // )

      const results = await AdminService.getListAdmins({
        searchText: confirmer1?.value?.email || '',
      })
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        cb(
          results &&
            results.data.data.map((item: Admin) => {
              return {
                value: item.email,
                id: item.id,
              }
            }),
        )
      }, 300)
    }

    const querySearchConfirmer2 = async (queryString, cb) => {
      // TODO: Not sure why this block of code is needed
      // const results = queryString
      //   ? adminList.value.filter((admin: Admin) =>
      //       admin.email.includes(queryString),
      //     )
      //   : adminList.value

      // cb(
      //   results &&
      //     results.map((item: Admin) => {
      //       return {
      //         value: item.email,
      //         id: item.id,
      //       }
      //     }),
      // )

      const results = await AdminService.getListAdmins({
        searchText: confirmer2?.value?.email || '',
      })
      if (timer) {
        clearTimeout(timer)
      }

      timer = setTimeout(() => {
        cb(
          results &&
            results.data.data.map((item: Admin) => {
              return {
                value: item.email,
                id: item.id,
              }
            }),
        )
      }, 300)
    }

    const handleSelectConfirmer1 = (item) => {
      confirmer1.value.id = item.id || ''
    }

    const handleSelectConfirmer2 = (item) => {
      confirmer2.value.id = item.id || ''
    }

    const back = () => {
      router.push({
        name: 'menu.walletSub.withdrawalControl.approvedTransactions',
      })
    }

    const isPageLoading = ref(false)
    const isTableLoading = ref(false)
    const isBlacklistUser = ref(false)

    const app = getCurrentInstance()
    const toastr = app?.appContext.config.globalProperties.$toastr
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
      remarks,
      processType,
      transactionHash,
      adminList,
      confirmer1,
      confirmer2,
      approvalProcessStatus,
      isLoading,
      isButtonDisabled,
      getData,
      remitTransaction,
      back,
      querySearchConfirmer1,
      handleSelectConfirmer1,
      querySearchConfirmer2,
      handleSelectConfirmer2,
      WITHDRAW_TRANSACTION_STATUS,
      DOMAIN,
      WITHDRAWINTERACTOR,
      isBlacklistUser,
      reloadPage,
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
.max-width-250 {
  max-width: 250px;
  word-break: break-word;
}
</style>
