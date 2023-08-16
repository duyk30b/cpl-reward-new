<template>
  <div class="tab-pane" id="transger-balance-tab">
    <div
      class="modal fade"
      id="input-dividend-code-modal"
      aria-hidden="true"
      ref="inputCodeModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">
              {{ $t('dividendScreen.inputCodeModalTitle') }}
            </h5>
            <div
              class="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <div class="modal-body">
            <template v-if="modeReview">
              <div class="row mx-5">
                <el-input
                  :placeholder="$t('dividendScreen.inputCodeModalTitle')"
                  v-model="code"
                  clearable
                >
                </el-input>
                <span class="text-danger" v-if="inputCodeError">{{
                  $t(
                    `dividendScreen.validateSchema.input_code.${inputCodeError}`,
                  )
                }}</span>
              </div>
              <div class="mt-5 d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-primary float-right"
                  :data-kt-indicator="onReviewing ? 'on' : ''"
                  :disabled="onReviewing"
                  @click="review"
                >
                  <span class="indicator-label">
                    {{ $t('dividendScreen.verifyBtn') }}
                  </span>
                  <span class="indicator-progress">
                    {{ $t('dividendScreen.verifyBtn') }}
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
              </div>
            </template>

            <template v-else>
              <div class="row mt-5 align-items-center">
                <el-input v-model="code" :disabled="true" />
              </div>
              <div class="row mt-5 align-items-center">
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.dividendName')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>{{ dividend.name }}</span>
                </div>
              </div>

              <div class="row mt-5 align-items-center">
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.targetCurrency')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>{{ uppercase(dividend.target_currency) }}</span>
                </div>
              </div>

              <div class="row mt-5 align-items-center">
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.distributedCurrency')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>{{ uppercase(dividend.distributed_currency) }}</span>
                </div>
              </div>

              <div class="row mt-5 align-items-center">
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.dividendSpan')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>{{
                    $t(`dividendScreen.span.${dividend.dividend_span}`)
                  }}</span>
                </div>
              </div>

              <div
                class="row mt-5 align-items-center"
                v-if="
                  dividend.dividend_span !== DIVIDEND_SPAN.ONCE &&
                  dividend.dividend_span !== DIVIDEND_SPAN.DAILY
                "
              >
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.dividendDate')
                  }}</span>
                </div>
                <div class="col-8">
                  <span v-if="dividend.dividend_date_month">{{
                    `${dividend.dividend_date_month}月`
                  }}</span>
                  <span v-if="dividend.dividend_date_day">{{
                    !isNaN(dividend.dividend_date_day)
                      ? `${dividend.dividend_date_day}日`
                      : $t(dividend.dividend_date_day)
                  }}</span>
                </div>
              </div>

              <div class="row mt-5 align-items-center">
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.interestRateType')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>{{
                    $t(
                      `dividendScreen.dividendCalculatedMode.${dividend.dividend_calculated_mode}`,
                    )
                  }}</span>
                </div>
              </div>

              <div class="row mt-5 align-items-center">
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.dividendRate')
                  }}</span>
                </div>
                <div class="col-8">
                  <span
                    v-if="
                      dividend.dividend_calculated_mode !==
                      DIVIDEND_CALCULATED_MODE.NON_CONDITION
                    "
                    >{{ percentNoDecimal(dividend.dividend_rate) }}</span
                  >
                  <span v-else
                    >{{
                      formatCurrencyAmount(
                        dividend.dividend_rate,
                        dividend.distributed_currency,
                        '0',
                      )
                    }}
                    {{ uppercase(dividend.distributed_currency) }}</span
                  >
                </div>
              </div>

              <div
                class="row mt-5 align-items-center"
                v-if="dividend.is_gift === 1"
              >
                <div class="col-4">
                  <span class="fw-bolder">{{ $t('dividendScreen.gift') }}</span>
                </div>
                <div class="col-8">
                  <span>
                    {{
                      formatCurrencyAmount(
                        dividend.gift_amount,
                        dividend.gift_currency,
                        0,
                      )
                    }}
                    {{ uppercase(dividend.gift_currency) }}
                  </span>
                </div>
              </div>

              <div
                class="row mt-5 align-items-center"
                v-if="dividend.dividend_span !== DIVIDEND_SPAN.ONCE"
              >
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.executingTime')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>
                    {{ formatTwoDigitNumber(time.hour) }} :
                    {{ formatTwoDigitNumber(time.minute) }}</span
                  >
                </div>
              </div>

              <div
                class="row mt-5 align-items-center"
                v-if="
                  dividend.distribute_type === DISTRIBUTE_TYPE.INDICATED_BALANCE
                "
              >
                <div class="col-4">
                  <span class="fw-bolder">{{
                    $t('dividendScreen.dividendCondition')
                  }}</span>
                </div>
                <div class="col-8">
                  <span>
                    {{ '>=' }}
                    {{
                      formatCurrencyAmount(
                        dividend.distribute_amount,
                        dividend.target_currency,
                        '0',
                      )
                    }}
                    {{
                      uppercase(
                        dividend.target_currency === 'all'
                          ? 'usd'
                          : dividend.target_currency,
                      )
                    }}
                  </span>
                </div>
              </div>

              <div class="row mt-5 align-items-center">
                <span v-html="$t('dividendScreen.dividendNote')"></span>
              </div>

              <div class="row mt-5 align-items-center">
                <span class="text-danger text-center" v-if="errorMessage">{{
                  $t(`dividendScreen.validateSchema.input_code.${errorMessage}`)
                }}</span>
              </div>

              <div class="mt-5 d-flex justify-content-center">
                <button
                  type="button"
                  class="btn btn-primary float-right"
                  :data-kt-indicator="onSubmitting ? 'on' : ''"
                  :disabled="onSubmitting"
                  @click="submit"
                >
                  <span class="indicator-label">
                    {{ $t('submit') }}
                  </span>
                  <span class="indicator-progress">
                    {{ $t('submit') }}
                    <span
                      class="spinner-border spinner-border-sm align-middle ms-2"
                    ></span>
                  </span>
                </button>
              </div>
            </template>
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4">
      <div class="text-dark fw-bolder fs-5">
        {{ $t('dividendScreen.dividendInfo') }}
      </div>
    </div>

    <button
      type="button"
      class="btn btn-primary"
      data-bs-toggle="modal"
      data-bs-target="#input-dividend-code-modal"
      @click="beforeOpen"
    >
      {{ $t('dividendScreen.inputCodeBtn') }}
    </button>

    <div class="table-responsive mt-10">
      <table class="table align-middle common-table table-bordered">
        <thead>
          <tr>
            <th>{{ $t('dividendScreen.dividendName') }}</th>
            <th>{{ $t('dividendScreen.dividendCode') }}</th>
            <th>{{ $t('dividendScreen.dividendDate') }}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <template v-if="userDividend.length > 0">
            <tr v-for="dividend in userDividend" :key="dividend.code">
              <td class="text-center">{{ dividend.name }}</td>
              <td class="text-center">{{ dividend.code }}</td>
              <td class="text-center">
                {{ formatTimeStamp(dividend.established_date) }}
              </td>
              <td class="text-center">
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteDividend(dividend.code)"
                >
                  {{ $t('delete') }}
                </button>
              </td>
            </tr>
          </template>
          <td v-else colspan="4" class="text-center py-5 text-muted">
            {{ $t('noData') }}
          </td>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { DividendService } from '@/views/dividend/services/DividendService'
import { hideModal } from '@/core/helpers/dom'
import {
  DIVIDEND_SPAN,
  DIVIDEND_CALCULATED_MODE,
  DISTRIBUTE_TYPE,
  STATUS,
} from '@/views/dividend/definition/dividend.enum'
import {
  formatCurrencyAmount as formatCurrencyAmountHelper,
  convertUTCToLocalTime,
  formatTimeStamp as formatTimeStampHelper,
} from '@/core/helpers/util'
import numeral from 'numeral'
import Swal from 'sweetalert2'
import { Mutations } from '@/store/enums/StoreEnums'

interface DividendCampaign {
  dividend_span: string
  dividend_date_day: string
  dividend_date_month: string
  dividend_date_hour: string
  dividend_date_minute: string
}

interface UserDividend {
  code: string
  name: string
  established_date: string
}

export default defineComponent({
  name: 'DividendInputCode',
  data() {
    return {
      code: '',
      onReviewing: false,
      onSubmitting: false,
      modeReview: true,
      dividend: {} as DividendCampaign,
      userDividend: [] as UserDividend[],
      inputCodeError: '',
      errorMessage: '',
      isError: false,
      user: {},
      time: {},
      STATUS,
      DIVIDEND_SPAN,
      DIVIDEND_CALCULATED_MODE,
      DISTRIBUTE_TYPE,
    }
  },
  mounted() {
    this.getCodesOfUser()
  },
  methods: {
    beforeOpen() {
      this.code = ''
      this.onReviewing = false
      this.onSubmitting = false
      this.modeReview = true
      this.dividend = {} as DividendCampaign
      this.inputCodeError = ''
      this.errorMessage = ''
      this.isError = false
    },
    formatCurrencyAmount(
      amount,
      currency,
      zeroValue,
      numberOfDecimalDigits = null,
    ) {
      return formatCurrencyAmountHelper(
        amount,
        currency,
        zeroValue,
        numberOfDecimalDigits,
      )
    },

    percentNoDecimal(value, currency = 'btc') {
      return `${formatCurrencyAmountHelper(
        numeral(value * 100).format('0.00000000'),
        currency,
        null,
        null,
      )}%`
    },

    formatTwoDigitNumber(number) {
      return ('0' + number).slice(-2)
    },

    uppercase(value) {
      if (value) {
        return value.toUpperCase()
      }
      return ''
    },

    formatTimeStamp(value) {
      return formatTimeStampHelper(value)
    },

    async getCodesOfUser() {
      const userId = +this.$route.params.id
      const { success, data } = await DividendService.getCodesOfUser(userId)
      if (success) {
        this.userDividend = data.data
      }
    },

    async review() {
      if (!this.code) {
        this.inputCodeError = 'required'
        return
      }
      this.onReviewing = true
      const { success, data } = await DividendService.reviewCode({
        code: this.code,
        user_id: +this.$route.params.id,
      })
      this.onReviewing = false

      if (!success && 'error' in data) {
        let inputCodeError = 'invalid_code_exception'
        const errorSplit = (data.error?.msg ?? '').split('DIVIDEND.EXCEPTION.')
        if (errorSplit.length > 1) {
          inputCodeError = errorSplit[1].toLowerCase()
        }
        this.inputCodeError = inputCodeError
        return
      }

      this.dividend = data.data.dividend_campaign
      if (
        this.dividend &&
        'dividend_date_hour' in this.dividend &&
        'dividend_date_minute' in this.dividend
      ) {
        const hour = this.dividend.dividend_date_hour
        const minute = this.dividend.dividend_date_minute
        this.time = convertUTCToLocalTime(hour, minute)
      }
      this.modeReview = false
    },

    async submit() {
      this.onSubmitting = true
      const { success, data } = await DividendService.activeCode({
        code: this.code,
        user_id: +this.$route.params.id,
      })
      this.onSubmitting = false

      if (!success) {
        let errorMessage = 'invalid_code_exception'
        const errorSplit = (data.error?.msg ?? '').split('DIVIDEND.EXCEPTION.')
        if (errorSplit.length > 1) {
          errorMessage = errorSplit[1].toLowerCase()
        }
        this.errorMessage = errorMessage
        return
      }
      this.closeModal()
      this.getCodesOfUser()
    },

    async deleteDividend(dividendCode) {
      const { isConfirmed } = await Swal.fire({
        text: this.$t('dividendScreen.deleteCode', { code: dividendCode }),
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('yes'),
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-secondary',
        },
      })

      if (!isConfirmed) {
        return
      }

      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const { success } = await DividendService.deleteCode(dividendCode)
      this.$store.commit(Mutations.SHOW_API_LOADING, false)

      if (success) {
        this.$toastr.success(this.$t('dividendScreen.deleteCodeSuccess'))
        this.getCodesOfUser()
      }
    },
  },
  setup() {
    const inputCodeModalRef = ref(null)

    const closeModal = () => {
      hideModal(inputCodeModalRef.value)
    }
    return {
      inputCodeModalRef,
      closeModal,
    }
  },
})
</script>
