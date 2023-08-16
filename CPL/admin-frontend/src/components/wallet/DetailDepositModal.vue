<template>
  <div
    class="modal fade"
    id="kt_detail_deposit_modal"
    ref="detailDepositModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">{{ $t('walletGeneral.transactionDetail') }}</h2>
          <div
            @click="closeModal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="p-5">
          <div class="mb-5" v-if="!loading && transaction?.id">
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('ID') }}:
              </div>
              <div class="col-4">
                {{ transaction?.id }}
                <span
                  class="badge ms-4"
                  :class="
                    transaction.queue_status === TRANSACTION_QUEUE_STATUS.DONE
                      ? 'badge-success'
                      : 'badge-warning'
                  "
                  >{{
                    $t(
                      `walletGeneral.transactionQueueStatus.${transaction.queue_status}`,
                    )
                  }}
                </span>
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('walletGeneral.coin') }}:
              </div>
              <div class="col-6 text-uppercase">
                {{ transaction?.symbol }}
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('walletGeneral.status') }}:
              </div>
              <div class="col-6 text-uppercase">
                {{ transaction?.status }}
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('walletGeneral.transactionId') }}:
              </div>
              <div class="col-6">
                {{ transaction?.bce_transaction_transaction_id }}
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('walletGeneral.transactionHash') }}:
              </div>
              <div class="col-6">
                {{ transaction?.transaction_hash }}
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('walletGeneral.address') }}:
              </div>
              <div class="col-6">
                {{ transaction?.wallet_address }}
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('amount') }}:
              </div>
              <div class="col-6">
                {{ formatNumber(transaction?.parsed_amount) }}
              </div>
            </div>
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center fw-bold">
                {{ $t('createdAt') }}:
              </div>
              <div class="col-6">{{ transaction?.created_at }}</div>
            </div>

            <!--begin::Accordion-->
            <div
              v-if="logs?.length"
              class="accordion mt-4"
              id="detail_accordion"
            >
              <div
                class="accordion-item"
                v-for="(log, logIdx) in logs"
                :key="log.id"
              >
                <p
                  class="accordion-header"
                  :id="`detail_accordion_header_${log.id}`"
                >
                  <button
                    class="accordion-button fs-4 fw-bold collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    :data-bs-target="`#detail_accordion_body_${log.id}`"
                    :aria-controls="`detail_accordion_body_${log.id}`"
                    aria-expanded="false"
                  >
                    <div class="m-0 w-100 d-flex justify-content-between">
                      <span class="fs-6">
                        {{ logIdx + 1 }}.
                        {{
                          $t('walletGeneral.retriedAt', {
                            admin: log?.created_admin?.email,
                          })
                        }}
                        <br />
                        <span
                          class="ms-4 text-muted fs-small"
                          v-if="log?.created_at"
                        >
                          {{ log?.created_at }}
                        </span>
                      </span>
                      <div class="d-flex align-items-center">
                        <span
                          class="badge me-5"
                          :class="
                            log.process_status === TRANSACTION_QUEUE_STATUS.DONE
                              ? 'badge-success'
                              : 'badge-warning'
                          "
                          >{{
                            $t(
                              `walletGeneral.transactionQueueStatus.${log.process_status}`,
                            )
                          }}
                        </span>
                      </div>
                    </div>
                  </button>
                </p>
                <div
                  :id="`detail_accordion_body_${log.id}`"
                  class="accordion-collapse collapse"
                  :aria-labelledby="`detail_accordion_header_${log.id}`"
                  data-bs-parent="#detail_accordion"
                >
                  <div class="accordion-body">
                    <div class="row mb-4 fw-bold">
                      <div class="col-4 d-flex align-items-center fw-bold">
                        {{ $t('createdBy') }}:
                      </div>
                      <div class="col-6">
                        {{ log?.created_admin?.email }}
                      </div>
                    </div>
                    <div class="row mb-4">
                      <div class="col-4 d-flex align-items-center fw-bold">
                        {{ $t('walletGeneral.createdDate') }}:
                      </div>
                      <div class="col-6">
                        {{ log?.created_at }}
                      </div>
                    </div>

                    <div class="row mb-4">
                      <div class="col-4 d-flex align-items-center fw-bold">
                        {{ $t('action') }}:
                      </div>
                      <div class="col-6">
                        <span class="badge" :class="classAction[log.action]">
                          {{ log?.action }}
                        </span>
                      </div>
                    </div>
                    <div class="row mb-4">
                      <div class="col-4 d-flex align-items-center fw-bold">
                        {{ $t('walletGeneral.retryStatusHistory') }}:
                      </div>
                      <div class="col-6">
                        {{ log?.before_status }} → {{ log?.after_status }}
                      </div>
                    </div>
                    <div class="row">
                      <div class="col-4 d-flex align-items-center fw-bold">
                        {{ $t('walletGeneral.systemLog') }}:
                      </div>
                      <div class="col-6">
                        {{ log?.message }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!--end::Accordion-->
          </div>
          <div class="mb-5" v-if="!loading && !transaction?.id">
            <h4 class="text-center">
              {{ $t('walletGeneral.errorLoadTransaction') }}
            </h4>
          </div>

          <div v-if="loading" class="d-flex justify-content-center fs-1 p-5">
            <span class="fas fa-spinner fa-spin text-primary"></span>
          </div>

          <div v-if="!loading" class="mt-4">
            <button class="btn btn-primary m-auto d-block" @click="closeModal">
              {{ $t('close') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { WalletSettingService } from '@/services/WalletSettingService'
import { defineComponent } from 'vue'
import {
  MANUAL_TRANSACTION_ACTION,
  TRANSACTION_QUEUE_STATUS,
} from '@/models/hot-wallet/HotWalletType'
import moment from 'moment'
import { hideModal } from '@/core/helpers/dom'
import { convertDateFormat } from '@/core/helpers/common.helper'
import BigNumber from 'bignumber.js'

export default defineComponent({
  props: {
    transactionId: {
      type: Number,
      default: 0,
    },
  },
  watch: {
    transactionId(newVal) {
      if (newVal === 0) {
        return
      }

      this.getTransactionDetail()
    },
  },
  data() {
    return {
      loading: true,
      transaction: {},
      logs: [],
      TRANSACTION_QUEUE_STATUS,
      classAction: {
        [MANUAL_TRANSACTION_ACTION.CREATE]: 'badge-primary',
        [MANUAL_TRANSACTION_ACTION.RETRY]: 'badge-warning',
        [MANUAL_TRANSACTION_ACTION.FORCE_STOP]: 'badge-danger',
      },
    }
  },
  methods: {
    async getTransactionDetail() {
      this.loading = true
      try {
        const res = await WalletSettingService.getDetailDepositTransaction(
          this.transactionId,
        )

        this.logs = res.data.data?.logs
          ? res.data.data?.logs.map((item) => ({
              ...item,
              created_at: item.created_at
                ? moment(+item.created_at).format('YYYY-MM-DD HH:mm')
                : '',
            }))
          : []

        res.data.data.transaction.created_at = convertDateFormat(
          res.data.data?.transaction?.created_at,
          'x',
        )
        this.transaction = res.data.data?.transaction
      } catch (error) {
        this.transaction = {}
        this.logs = []
        console.log(error)
      }

      this.loading = false
    },
    closeModal() {
      hideModal(this.$refs.detailDepositModalRef as HTMLElement)
      this.$emit('close')
    },
    formatNumber(number) {
      if (!number) {
        return number
      }

      return new BigNumber(number).toString()
    },
  },
})
</script>
<style scoped>
.fs-small {
  font-size: 0.75rem;
}
</style>
