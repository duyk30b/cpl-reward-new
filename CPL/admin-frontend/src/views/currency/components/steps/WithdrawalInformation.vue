<template>
  <Form
    ref="WithdrawalInformationForm"
    @submit.prevent="registerCurrency"
    :validation-schema="validateSchema"
  >
    <div class="card-title">
      <span>{{
        $t(
          'currencyScreen.registerNewCurrencyScreen.withdrawalInformationTitle',
        )
      }}</span>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{ $t('currencyScreen.coin') }}</span>
      </div>
      <div class="col-8">
        <el-input name="token" v-model="params.params.coin" disabled></el-input>
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{ $t('currencyScreen.deposit') }}</span>
      </div>
      <div class="col-8">
        <label
          class="form-check form-switch form-check-custom form-check-solid"
        >
          <input
            class="form-check-input"
            name="deposit"
            type="checkbox"
            v-model="params.params.on_deposit"
          />
        </label>
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.withdraw')
        }}</span>
      </div>
      <div class="col-8">
        <label
          class="form-check form-switch form-check-custom form-check-solid"
        >
          <input
            class="form-check-input"
            name="withdraw"
            type="checkbox"
            v-model="params.params.on_withdrawal"
          />
        </label>
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.minimumWithdrawal')
        }}</span>
      </div>
      <div class="col-8">
        <currency-input
          name="minimum_withdrawal"
          v-model.lazy="params.params.minimum_withdrawal"
        />

        <Field
          name="minimum_withdrawal"
          as="input"
          v-model="params.params.minimum_withdrawal"
          class="form-control d-none"
        >
        </Field>
        <ErrorMessage name="minimum_withdrawal" class="text-danger" />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.fee')
        }}</span>
      </div>
      <div class="col-8">
        <currency-input name="fee" v-model.lazy="params.params.fee" />

        <Field
          name="fee"
          as="input"
          v-model="params.params.fee"
          class="form-control d-none"
        >
        </Field>
        <ErrorMessage
          name="fee"
          class="text-danger fv-plugins-message-container invalid-feedback"
        />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.withdrawalLimit')
        }}</span>
      </div>
      <div class="col-8">
        <currency-input
          name="withdrawal_limit"
          v-model.lazy="params.params.withdrawal_limit"
        />

        <Field
          name="withdrawal_limit"
          as="input"
          v-model="params.params.withdrawal_limit"
          class="form-control d-none"
        >
        </Field>
        <ErrorMessage name="withdrawal_limit" class="text-danger" />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.timeReset')
        }}</span>
      </div>
      <div class="col-8">
        <currency-input name="time_reset" v-model="params.params.time_reset" />

        <Field
          name="time_reset"
          as="input"
          v-model="params.params.time_reset"
          class="form-control d-none"
        >
        </Field>
        <ErrorMessage name="time_reset" class="text-danger" />
      </div>
    </div>

    <div class="card-title">
      <span>{{
        $t('currencyScreen.registerNewCurrencyScreen.withdrawalThresholdTitle')
      }}</span>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.withdrawalThreshold')
        }}</span>
      </div>
      <div class="col-8">
        <currency-input
          name="withdrawal_threshold"
          v-model.lazy="params.params.withdrawal_threshold"
        />

        <Field
          name="withdrawal_threshold"
          as="input"
          v-model="params.params.withdrawal_threshold"
          class="form-control d-none"
        >
        </Field>
        <ErrorMessage name="withdrawal_threshold" class="text-danger" />
      </div>
    </div>

    <div class="card-title">
      <span>{{
        $t('currencyScreen.registerNewCurrencyScreen.minorPriceTitle')
      }}</span>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold"
          >{{ $t('currencyScreen.registerNewCurrencyScreen.price') }} ($)</span
        >
      </div>
      <div class="col-8">
        <currency-input name="price" v-model.lazy="params.params.price" />
        <Field
          name="price"
          as="input"
          v-model="params.params.price"
          class="form-control d-none"
        >
        </Field>
        <ErrorMessage name="price" class="text-danger" />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col">
        <button class="btn btn-light" @click.prevent="backStep">
          {{ $t('currencyScreen.registerNewCurrencyScreen.backBtn') }}
        </button>

        <button
          type="button"
          class="btn btn-primary float-right"
          :data-kt-indicator="isSubmitting ? 'on' : ''"
          :disabled="isSubmitting"
          @click="registerCurrency"
        >
          <span class="indicator-label">
            {{ $t('currencyScreen.registerNewCurrencyScreen.registerBtn') }}
          </span>
          <span class="indicator-progress">
            {{ $t('currencyScreen.registerNewCurrencyScreen.registerBtn') }}

            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
      </div>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Swal, { SweetAlertResult } from 'sweetalert2'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { CurrencyService } from '@/views/currency/services/CurrencyService'
import CurrencyInput from '@/views/currency/components/CurrencyInput.vue'
import * as Yup from 'yup'

export default defineComponent({
  name: 'WithdrawalInformation',
  components: { Form, Field, ErrorMessage, CurrencyInput },
  inject: ['params', 'isERCBEP20'],
  data() {
    return {
      rootParams: this.params, // initial data based on injected value
      isSubmitting: false,
      validateSchema: Yup.object().shape({}),
    }
  },
  created() {
    this.initValidate()
  },
  methods: {
    backStep() {
      this.$emit('pre-step')
    },
    async registerCurrency() {
      const WithdrawalInformationForm = this.$refs
        .WithdrawalInformationForm as any
      const form = await WithdrawalInformationForm.validate()
      if (!form.valid) {
        return
      }

      const body = (this.rootParams as any).params
      this.isSubmitting = true
      try {
        const { data } = await CurrencyService.createNewCurrency(body)
        if ('coin' in data) {
          this.registerSuccess()
        } else {
          const errors = data?.response?.errors ?? null
          this.showErrors(errors)
        }
        this.isSubmitting = false
      } catch (error) {
        this.$toastr.error(
          this.$t('currencyScreen.registerNewCurrencyScreen.registerFail'),
        )
        this.isSubmitting = false
      }
    },
    showErrors(errors) {
      let message = this.$t(
        'currencyScreen.registerNewCurrencyScreen.registerFail',
      )

      // handle contract address error from server
      if (errors?.contract_address) {
        const contractAddressErrors = errors?.contract_address
        if (contractAddressErrors.includes('validation.unique')) {
          message = this.$t(
            'currencyScreen.registerNewCurrencyScreen.validateSchema.contract_address_exist',
          )
        }
      }
      this.$toastr.error(message)
    },
    async registerSuccess() {
      const confirm: SweetAlertResult = await Swal.fire({
        icon: 'success',
        title: this.$t('currencyScreen.registerSuccess.title'),
        html: this.$t('currencyScreen.registerSuccess.html'),
        showCancelButton: true,
        confirmButtonText: this.$t(
          'currencyScreen.registerSuccess.confirmButtonText',
        ),
        cancelButtonText: this.$t(
          'currencyScreen.registerSuccess.cancelButtonText',
        ),
        customClass: {
          confirmButton: 'btn btn-primary w-100',
          cancelButton: 'btn btn-danger w-100',
        },
      })

      if (confirm.isConfirmed) {
        this.$router.push({ name: 'walletSetting.depositSetting' })
      }

      if (
        confirm.isDismissed &&
        confirm.dismiss === Swal.DismissReason.cancel
      ) {
        this.$router.push({ name: 'walletSetting.withdrawSetting' })
      } else if (
        confirm.isDismissed &&
        confirm.dismiss === Swal.DismissReason.backdrop
      ) {
        this.$router.push({ name: 'currency.setting' })
      }
    },
    initValidate() {
      const validateSchema = Yup.object().shape({
        minimum_withdrawal: Yup.number()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.minimum_withdrawal_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.minimum_withdrawal_required',
            ),
          ),
        fee: Yup.number()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.fee_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.fee_required',
            ),
          ),
        withdrawal_limit: Yup.number()
          .min(
            Yup.ref('minimum_withdrawal'),
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.withdrawal_limit_greater',
            ),
          )
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.withdrawal_limit_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.withdrawal_limit_required',
            ),
          ),
        time_reset: Yup.number()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.time_reset_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.time_reset_required',
            ),
          ),
        withdrawal_threshold: Yup.number()
          .min(
            Yup.ref('minimum_withdrawal'),
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.withdrawal_threshold_greater',
            ),
          )
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.withdrawal_threshold_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.withdrawal_threshold_required',
            ),
          ),
        price: Yup.number()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.price_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.price_required',
            ),
          ),
      })
      this.validateSchema = validateSchema
    },
  },
  watch: {
    '$i18n.locale': function () {
      this.initValidate()
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/register_currency.scss';
</style>
