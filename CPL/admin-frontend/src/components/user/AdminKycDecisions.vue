<template>
  <div class="card mb-5">
    <div class="card-header">
      <div class="card-title m-0 text-uppercase fw-bold">
        {{ $t('adminDecisions') }}
      </div>
    </div>

    <div class="card-body pt-4">
      <div class="table-responsive">
        <table class="table fs-6 gy-5 common-table table-bordered">
          <thead>
            <tr class="fw-bolder text-muted">
              <th>
                {{ $t('madeBy') }}
              </th>
              <th>
                {{ $t('updatedAt') }}
              </th>
              <th>
                {{ $t('matchInfo') }}
              </th>
              <th>{{ $t('overrideRiskRating') }}</th>
              <th>{{ $t('status') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="text-center text-muted">
                <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
              </td>
            </tr>
            <template v-else-if="displayAdminDecisions.length">
              <tr v-for="(decision, i) in displayAdminDecisions" :key="i">
                <td>
                  {{
                    decision.isAuto ? $t('auto') : decision.admin?.email || '-'
                  }}
                </td>
                <td>
                  {{ $filters.convertTimestampToDate(decision.createdAt) }}
                </td>
                <td>
                  <ul>
                    <li
                      v-for="(compare, i) in [
                        'compareName',
                        'compareBirthday',
                        'compareDocumentType',
                        'compareLivenessSelfie',
                      ]"
                      :key="i"
                    >
                      {{ $t(`reviewOcr.${compare}`) }} -
                      <b>{{ decision[compare] ? $t('yes') : $t('no') }}</b>
                    </li>
                  </ul>
                </td>
                <td>
                  {{
                    decision.riskRating
                      ? $t(`riskRatingValue.${decision.riskRating}`)
                      : '-'
                  }}
                </td>
                <td>
                  {{ $t(`kycStatusValue.${decision.status}`) }}
                  <i
                    v-if="decision.status == KycStatus.REJECT"
                    class="cursor-pointer fas fa-exclamation-circle text-danger"
                    @click="showAdminDecisionDetail(decision)"
                    :title="$t('rejectionReasons')"
                  ></i>
                </td>
              </tr>
            </template>
            <tr v-else>
              <td colspan="5" class="text-center text-muted">
                {{ $t('noData') }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <base-modal
    :show="showAdminDecisionDetailModal"
    @close="showAdminDecisionDetailModal = false"
    dialogClass="modal-xl"
    title="rejectionReasons"
  >
    <template v-slot:body>
      <ul class="mb-0">
        <li
          v-for="(reason, i) in showingAdminDecision?.rejectionReasons"
          :key="i"
        >
          {{ reason.nameByLocale }}
        </li>
      </ul>
    </template>
  </base-modal>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {
  KycStatus,
  UserKyc,
  UserKycAdminDecision,
  UserKycHistory,
} from '@/models/user/UserKyc'
import { Optional } from '@/models/common/Optional'
import { UserKycService } from '@/services/UserKycService'
import BaseModal from '@/components/modals/BaseModal.vue'

export default defineComponent({
  name: 'admin-kyc-decisions',
  components: { BaseModal },
  async mounted() {
    await this.getData()
  },
  watch: {
    userId: async function () {
      await this.getData()
    },
  },
  props: {
    userKyc: null as unknown as PropType<Optional<UserKyc | UserKycHistory>>,
  },
  data: () => ({
    showAdminDecisionDetailModal: false,
    showingAdminDecision: null as Optional<UserKycAdminDecision>,
    adminDecisions: [] as UserKycAdminDecision[],
    loading: false,
    KycStatus,
  }),
  computed: {
    userId() {
      return this.userKyc?.userId as string
    },
    displayAdminDecisions() {
      if (!this.adminDecisions) return []
      return this.adminDecisions.filter(
        (decision) =>
          decision.userKycHistoryId == this.userKyc?.userKycHistoryId,
      )
    },
  },
  methods: {
    async getAdminDecisions() {
      this.adminDecisions = await UserKycService.findAdminDecisionByUserId(
        this.userId,
      )
    },
    async getData() {
      if (!this.userId) return
      this.loading = true
      await this.getAdminDecisions()
      this.loading = false
    },
    showAdminDecisionDetail(decision: UserKycAdminDecision) {
      this.showingAdminDecision = decision
      this.showAdminDecisionDetailModal = true
    },
  },
})
</script>
