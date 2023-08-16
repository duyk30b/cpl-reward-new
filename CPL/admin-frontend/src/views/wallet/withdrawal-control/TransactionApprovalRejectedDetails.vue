<template>
  <div class="card">
    <!-- <div class="card-header border-0 pt-6 mb-8">
      <div class="card-title">
        <h1>
          {{ $t('menu.walletSub.withdrawalControl.rejectedApprovalDetail') }}:
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
          <!-- <div class="row mb-4">
            <p class="col-5">
              {{ $t('menu.walletSub.withdrawalControl.approvedDate') }}
            </p>
            <p class="col-7">approved date mock</p>
          </div>

          <div class="row mb-4">
            <p class="col-5">
              {{ $t('menu.walletSub.withdrawalControl.approvedBy') }}
            </p>
            <p class="col-7">approved by mock</p>
          </div> -->
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
        </div>
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
  // getCurrentInstance,
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
} from '@/models/withdrawal-control/TransactionApproval'
import { WalletBceService } from '@/services/WalletBceService'

export default defineComponent({
  components: {},
  setup() {
    const route = useRoute()
    const router = useRouter()
    const transactionId = computed(() => route.params.transactionId)
    const approval = ref<Partial<TransactionApprovalModel>>({})
    const processType = ref<EProcessType>(EProcessType.HOT_WALLET)
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
        key: 'denyAt',
        label: 'menu.walletSub.withdrawalControl.rejectDate',
      },
      {
        key: 'denyBy',
        label: 'menu.walletSub.withdrawalControl.rejectBy',
      },
      {
        key: 'remarks',
        label: 'menu.walletSub.withdrawalControl.remarks',
      },
    ]

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

        isPageLoading.value = false
      } catch (error) {
        isPageLoading.value = false
      }
    }

    onMounted(() => {
      setPageFliud()
      setCurrentPageBreadcrumbs(
        'menu.walletSub.withdrawalControl.rejectedApprovalDetail',
        ['menu.walletSub.withdrawalControl.index'],
      )
      getData()
    })

    const back = () => {
      router.push({
        name: 'menu.walletSub.withdrawalControl.rejectedTransactions',
      })
    }

    const isPageLoading = ref(false)

    // const app = getCurrentInstance()
    // const t = app?.appContext.config.globalProperties.$t

    return {
      approval,
      approvalDetailsDisplayKeys,
      customerInformationDisplayKeys,
      administrationInformationDisplayKeys,
      isPageLoading,
      remarks,
      processType,
      transactionHash,
      getData,
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
</style>
