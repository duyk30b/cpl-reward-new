<template>
  <table class="table align-middle fs-6 gy-5 common-table table-bordered">
    <thead>
      <tr>
        <th>
          {{ $t('category') }}
        </th>
        <th>
          {{ $t('criteriaName') }}
        </th>
        <th>
          {{ $t('criteriaPercent') }}
        </th>
        <th>
          {{ $t('score') }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="loadingCynopsis">
        <td class="text-center" colspan="4">
          <i class="fas fa-spinner fa-spin"></i> {{ $t('loading') }}
        </td>
      </tr>
      <tr v-else-if="!riskReport">
        <td class="text-center text-muted" colspan="4">
          {{ $t('noData') }}
        </td>
      </tr>
      <template v-else>
        <tr v-for="item of riskDetails" :key="item.type">
          <td>{{ $t(`riskReportValue.category.${item.category}`) }}</td>
          <td>{{ $t(`riskReportValue.criteria.${item.criteria}`) }}</td>
          <td class="text-end">
            {{ $filters.fixedNumber(item.criteriaValue, 2) }}%
          </td>
          <td class="text-end">{{ $filters.fixedNumber(item.score, 2) }}%</td>
        </tr>
        <tr>
          <td colspan="2" class="fw-bolder fs-5">
            {{ $t('total') }}
          </td>
          <td class="text-end">
            {{ $filters.fixedNumber(riskTotal.criteriaValue, 2) }}%
          </td>
          <td class="text-end">
            {{ $filters.fixedNumber(riskTotal.score, 2) }}%
          </td>
        </tr>
        <tr>
          <td colspan="3" class="fw-bolder fs-5">
            {{ $t('computedRiskRating') }}
          </td>
          <td class="text-end">
            <div
              :class="`text-${riskReport?.riskJson?.riskRating || 'UNKNOWN'}`"
              v-if="riskReport"
            >
              {{
                riskReport?.riskJson?.riskRating
                  ? $t(`riskRatingValue.${riskReport?.riskJson?.riskRating}`)
                  : ''
              }}
            </div>
          </td>
        </tr>
      </template>
    </tbody>
  </table>
  <div v-if="isCurrentKycVersion" class="conclude-section border py-4 px-3">
    <div class="section-header mb-4">
      {{ $t('concludeAndSubmitApprovalStatus') }}
    </div>
    <Form as="" v-slot="{ meta: formMeta }">
      <div class="row">
        <div class="col-md-6">
          <Field
            v-model="form.riskRating"
            name="riskRating"
            v-slot="{ handleChange, value, field, errorMessage, meta }"
            rules="required"
            :validateOnChange="false"
            :validateOnInput="false"
          >
            <label class="mb-2 required">{{ $t('overrideRiskRating') }}</label>
            <v-select
              :options="overrideRiskRatingOptions"
              option-value="id"
              option-label="name"
              :placeholder="$t('overrideRiskRating')"
              :can-deselect="false"
              :disabled="!canConfirm"
              v-bind="field"
              :modelValue="value"
              @update:modelValue="handleChange"
              :class="{ error: meta.touched && !meta.valid }"
            >
            </v-select>
            <error-display :message="errorMessage"></error-display>
          </Field>
        </div>
        <div class="col-md-6 mb-4">
          <Field
            v-model="form.status"
            name="status"
            v-slot="{ handleChange, value, field, errorMessage, meta }"
            rules="required"
            :validateOnChange="false"
            :validateOnInput="false"
          >
            <label class="mb-2 required">{{ $t('approvalStatus') }}</label>
            <v-select
              :options="approvalStatusOptions"
              option-value="id"
              option-label="name"
              :placeholder="$t('approvalStatus')"
              :can-deselect="false"
              :disabled="!canConfirm"
              v-bind="field"
              :modelValue="value"
              @update:modelValue="handleChange"
              :class="{ error: meta.touched && !meta.valid }"
            >
            </v-select>
            <error-display :message="errorMessage"></error-display>
          </Field>
        </div>
      </div>
      <div>
        <button
          class="btn btn-primary"
          :disabled="!canConfirm || !formMeta.valid || loading.submit"
          @click="confirm()"
        >
          <i v-if="loading.submit" class="fas fa-spinner fa-spin"></i>
          {{ $t('confirm') }}
        </button>
      </div>
    </Form>
  </div>
  <rejection-reason
    :show="showRejectionReasonModal"
    :reason-type="rejectionReasonType"
    :loading="loading.submit"
    @close="showRejectionReasonModal = false"
    @submit="submit"
  ></rejection-reason>
</template>

<script lang="ts">
import {
  KycStatus,
  KycType,
  ReviewRiskRequest,
  RiskRating,
  UserKyc,
  UserKycHistory,
} from '@/models/user/UserKyc'
import { UserKycCynopsis } from '@/models/user/UserKycScanData'
import { UserKycService } from '@/services/UserKycService'
import { Expose, instanceToPlain, plainToInstance } from 'class-transformer'
import { defineComponent, PropType } from 'vue'
import RejectionReason from '@/components/modals/RejectionReason.vue'
import { Field, Form } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'

class ReviewRiskForm {
  @Expose()
  status: number

  @Expose({ name: 'risk_rating' })
  riskRating: number
}

const overrideRiskRatingValues = [
  RiskRating.LOW,
  RiskRating.MEDIUM,
  RiskRating.HIGH,
  RiskRating.UNKNOWN,
]

export default defineComponent({
  components: { RejectionReason, Form, Field, ErrorDisplay },
  name: 'risk-report-screen',
  props: {
    cynopsis: {
      type: UserKycCynopsis,
    },
    userKyc: {
      type: Object as PropType<UserKyc | UserKycHistory>,
    },
    currentUserKyc: {
      type: UserKyc,
    },
    loadingCynopsis: {
      type: Boolean,
    },
    isCurrentKycVersion: {
      type: Boolean,
    },
  },
  data() {
    return {
      form: new ReviewRiskForm(),
      loading: {
        submit: false,
      },
      showRejectionReasonModal: false,
      overrideRiskRatingOptions: overrideRiskRatingValues.map((val) => ({
        id: val,
        name: this.$t(`riskRatingValue.${val}`),
      })),
      approvalStatusOptions: [
        KycStatus.PENDING,
        KycStatus.ACCEPT,
        KycStatus.REJECT,
      ].map((status) => ({
        id: status,
        name: this.$t(`kycStatusValue.${status}`),
      })),
      riskDetails: [
        {
          category: 'countryRisk',
          criteria: 'CPI',
          type: 'cpi',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'countryRisk',
          criteria: 'FATF',
          type: 'fatf',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'taxRisk',
          criteria: 'OECD',
          type: 'oecd',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'taxRisk',
          criteria: 'FSI',
          type: 'fsi',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'taxRisk',
          criteria: 'FATCA',
          type: 'fatca',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'screeningRisk',
          criteria: 'PEP',
          type: 'screening',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'operationalRisk',
          criteria: 'onboardingMode',
          type: 'onboardingMode',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'operationalRisk',
          criteria: 'paymentModes',
          type: 'paymentModes',
          criteriaValue: 0,
          score: 0,
        },
        {
          category: 'operationalRisk',
          criteria: 'complexityOfProductsAndServices',
          type: 'productComplexity',
          criteriaValue: 0,
          score: 0,
        },
      ],
      riskTotal: {
        criteriaValue: 0,
        score: 0,
      },
    }
  },
  watch: {
    riskReport: function () {
      if (!this.riskReport) return
      const INDIVIDUAL =
        this.riskReport?.riskJson?.settings?.weight?.INDIVIDUAL || {}
      const componentScore = this.riskReport?.riskJson?.componentScore || {}
      this.riskTotal = { criteriaValue: 0, score: 0 }
      this.riskDetails.forEach((detail) => {
        const criteria = INDIVIDUAL[detail.type] || 0
        const score = componentScore[detail.type] || 0
        detail.criteriaValue = criteria
        detail.score = score
        this.riskTotal.criteriaValue += criteria
        this.riskTotal.score += score
      })
    },
    userKyc: function () {
      this.initForm()
    },
  },
  computed: {
    riskReport() {
      return this.cynopsis?.cynopsisData?.riskReport?.[0]
    },
    canConfirm() {
      return (
        this.userKyc instanceof UserKyc &&
        this.userKyc.status != KycStatus.ACCEPT &&
        this.userKyc.status != KycStatus.REJECT
      )
    },
    rejectionReasonType() {
      return !this.userKyc || this.userKyc.type == KycType.PERSONAL
        ? ReasonCategoryTypeEnum.KYC_PERSONAL
        : ReasonCategoryTypeEnum.KYC_ENTERPRISE
    },
  },
  methods: {
    initForm() {
      this.form = new ReviewRiskForm()
      if (this.userKyc instanceof UserKyc) {
        const userKyc = this.userKyc
        if (
          [KycStatus.PENDING, KycStatus.REJECT, KycStatus.ACCEPT].find(
            (val) => val == userKyc.status,
          )
        ) {
          this.form.status = userKyc.status
        }
        if (overrideRiskRatingValues.find((val) => val == userKyc.riskRating)) {
          this.form.riskRating = this.userKyc.riskRating
        }
      }
    },
    async confirm() {
      if (this.form.status == KycStatus.REJECT) {
        this.showRejectionReasonModal = true
      } else {
        this.submit()
      }
    },
    async submit(rejectionReasons?) {
      const selectedReasons = (rejectionReasons || []).map((reason) => ({
        reason_category_id: reason.categoryId,
        reason_category_name_en: reason.category?.en,
        reason_category_name_ja: reason.category?.ja,
        rejection_reason_id: reason.reasonId,
        rejection_reason_name_en: reason.reason?.en,
        rejection_reason_name_ja: reason.reason?.ja,
        category_id: reason.categoryId,
        reason_id: reason.reasonId,
      }))
      this.loading.submit = true
      const res = await UserKycService.reviewRisk(
        plainToInstance(ReviewRiskRequest, {
          ...instanceToPlain(this.form),
          user_id: this.userKyc?.userId,
          rejection_reasons: selectedReasons,
        }),
      )
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$router.back()
      } else {
        this.$toastr.error(this.$t(res.message))
      }
      this.loading.submit = false
    },
  },
})
</script>

<style lang="scss" scoped>
.text-LOW {
  color: #50cd89;
}
.text-MEDIUM {
  color: #ffc700;
}
.text-HIGH,
.text-UNKNOWN {
  color: #f1416c;
}
</style>
