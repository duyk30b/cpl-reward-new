<template>
  <div
    class="modal fade"
    id="new-dividend-modal"
    ref="newDividendModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <Form
          ref="dividendForm"
          class="pb-10"
          :validation-schema="schema"
          @submit.prevent="onSubmit"
        >
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('dividendScreen.dividendNew') }}</h5>
            <div
              class="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fas fa-times"></i>
            </div>
          </div>

          <div class="modal-body">
            <div class="row mx-5">
              <div class="col-6">
                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.dividendName')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="dividend_name"
                      as="input"
                      v-model="dividend.dividend_name"
                      class="form-control"
                    >
                    </Field>
                    <span class="text-danger" v-if="dividendNameError">{{
                      dividendNameError
                    }}</span>
                    <ErrorMessage
                      name="dividend_name"
                      class="text-danger"
                      v-else
                    />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.targetCurrency')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="target_currency"
                      as="select"
                      v-model="dividend.target_currency"
                      class="form-select"
                    >
                      <option value="" disabled selected>
                        {{ $t('dividendScreen.pleaseSelect') }}
                      </option>
                      <option
                        v-for="currency in currencyOptions"
                        :value="currency"
                        :key="`target${currency}`"
                      >
                        {{ currency.toUpperCase() }}
                      </option>
                    </Field>
                    <ErrorMessage name="target_currency" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.distributedCurrency')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="distributed_currency"
                      as="select"
                      v-model="dividend.distributed_currency"
                      class="form-select"
                    >
                      <option value="" disabled selected>
                        {{ $t('dividendScreen.pleaseSelect') }}
                      </option>
                      <option
                        v-for="currency in currencyOptions"
                        :value="currency"
                        :key="`distributed${currency}`"
                      >
                        {{ currency.toUpperCase() }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="distributed_currency"
                      class="text-danger"
                    />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.maximumUsers')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <imask-input
                      name="joined_user_maximum"
                      v-model="dividend.joined_user_maximum"
                      class="form-control"
                      :mask="/^\d{1,5}$/"
                      :disabled="unlimitJoinedUserMaximum"
                    />
                    <Field
                      hidden
                      name="joined_user_maximum"
                      as="input"
                      class="form-control"
                      v-model="dividend.joined_user_maximum"
                    />
                    <ErrorMessage
                      name="joined_user_maximum"
                      :class="['text-danger']"
                    />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-8 offset-4 d-flex">
                    <input
                      type="checkbox"
                      v-model="unlimitJoinedUserMaximum"
                      class="form-check"
                      id="unlimit-joined-user-maximum-checkbox"
                    />

                    <label
                      class="fw-bolder ms-2"
                      for="unlimit-joined-user-maximum-checkbox"
                      >{{
                        $t('dividendScreen.unlimitedJoinedUserMaximum')
                      }}</label
                    >
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.maximumDividendAmount')
                    }}</span>
                  </div>
                  <div class="col-8 input-unit">
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      v-if="unlimitDividendMaximum"
                    />
                    <currency-input
                      name="dividend_maximum"
                      v-model.lazy="dividend.dividend_maximum"
                      v-else
                    />
                    <span class="unit" v-if="dividend.distributed_currency">{{
                      dividend.distributed_currency.toUpperCase()
                    }}</span>
                    <Field
                      name="dividend_maximum"
                      as="input"
                      class="form-control d-none"
                      v-model="dividend.dividend_maximum"
                    />
                    <ErrorMessage name="dividend_maximum" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-8 offset-4 d-flex">
                    <input
                      type="checkbox"
                      v-model="unlimitDividendMaximum"
                      class="form-check"
                      id="unlimit-dividend-maximum-checkbox"
                    />

                    <label
                      class="fw-bolder ms-2"
                      for="unlimit-dividend-maximum-checkbox"
                    >
                      {{ $t('dividendScreen.unlimitedDividendMaximum') }}
                    </label>
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.dividendSpan')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="dividend_span"
                      as="select"
                      v-model="dividend.dividend_span"
                      class="form-select"
                    >
                      <option value="" disabled selected>
                        {{ $t('dividendScreen.pleaseSelect') }}
                      </option>
                      <option
                        v-for="span in DIVIDEND_SPAN"
                        :value="span"
                        :key="`span${span}`"
                      >
                        {{ $t(`dividendScreen.span.${span}`) }}
                      </option>
                    </Field>
                    <ErrorMessage name="dividend_span" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.dividendDate')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      v-if="
                        !dividend.dividend_span ||
                        dividend.dividend_span === DIVIDEND_SPAN.DAILY ||
                        dividend.dividend_span === DIVIDEND_SPAN.ONCE
                      "
                    />
                    <div class="row" v-else>
                      <div class="col-6">
                        <Field
                          name="dividend_date_month"
                          as="select"
                          v-model="dividend.dividend_date.month"
                          class="form-select"
                          :disabled="
                            dividend.dividend_span === DIVIDEND_SPAN.MONTHLY
                          "
                        >
                          <option value="" disabled selected>Month</option>
                          <option
                            v-for="(month, index) in allMonths"
                            :value="month"
                            :key="`month${index}`"
                            :label="month"
                          />
                        </Field>
                        <ErrorMessage
                          name="dividend_date_month"
                          class="text-danger"
                        />
                      </div>
                      <div class="col-6">
                        <Field
                          name="dividend_date_date"
                          as="select"
                          v-model="dividend.dividend_date.date"
                          class="form-select"
                        >
                          <option value="" disabled selected>Date</option>
                          <option
                            v-for="(date, index) in allDates"
                            :value="date"
                            :key="`date${index}`"
                            :label="date"
                          />
                        </Field>
                        <ErrorMessage
                          name="dividend_date_date"
                          class="text-danger"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.startDate')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      hidden
                      name="start_date"
                      as="input"
                      class="form-control"
                      v-model="dividend.start_date"
                    />
                    <date-time-picker
                      v-model="dividend.start_date"
                      :disabledDate="disabledDate"
                    />
                    <ErrorMessage name="start_date" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.endDate')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      v-if="dividend.unlimited_end_date"
                    />
                    <date-time-picker
                      v-else
                      v-model="dividend.end_date"
                      :disabledDate="disabledDate"
                    />
                    <Field
                      name="end_date"
                      as="input"
                      class="form-control d-none"
                      v-model="dividend.end_date"
                    />
                    <ErrorMessage name="end_date" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-8 offset-4 d-flex">
                    <input
                      type="checkbox"
                      v-model="dividend.unlimited_end_date"
                      class="form-check"
                      id="unlimited-end-date-checkbox"
                    />

                    <label
                      class="fw-bolder ms-2"
                      for="unlimited-end-date-checkbox"
                    >
                      {{ $t('dividendScreen.dividendUnlimitedEndDate') }}
                    </label>
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.executingTime')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="executing_time"
                      as="input"
                      class="form-control d-none"
                      v-model="dividend.executing_time"
                    />
                    <time-picker
                      v-if="dividend.dividend_span !== DIVIDEND_SPAN.ONCE"
                      format="HH:mm"
                      placeholder=""
                      v-model="dividend.executing_time"
                    />
                    <input type="text" v-else class="form-control" disabled />

                    <ErrorMessage name="executing_time" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.interestRateType')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="dividend_calculated_mode"
                      as="select"
                      v-model="dividend.dividend_calculated_mode"
                      class="form-select"
                    >
                      <option value="" disabled selected>
                        {{ $t('dividendScreen.pleaseSelect') }}
                      </option>
                      <option
                        v-for="mode in DIVIDEND_CALCULATED_MODE"
                        :value="mode"
                        :key="`calculated${mode}`"
                      >
                        {{
                          $t(`dividendScreen.dividendCalculatedMode.${mode}`)
                        }}
                      </option>
                    </Field>
                    <ErrorMessage
                      name="dividend_calculated_mode"
                      class="text-danger"
                    />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.dividendRate')
                    }}</span>
                  </div>
                  <div class="col-8 input-unit">
                    <currency-input
                      name="dividend_rate"
                      v-model.lazy="dividend.dividend_rate"
                    />
                    <Field
                      name="dividend_rate"
                      as="input"
                      class="form-control d-none"
                      v-model="dividend.dividend_rate"
                    />
                    <span
                      class="unit"
                      v-if="
                        dividend.dividend_calculated_mode ===
                        DIVIDEND_CALCULATED_MODE.NON_CONDITION
                      "
                      >{{ dividend.distributed_currency.toUpperCase() }}</span
                    >
                    <span
                      class="unit"
                      v-if="
                        dividend.dividend_calculated_mode &&
                        dividend.dividend_calculated_mode !==
                          DIVIDEND_CALCULATED_MODE.NON_CONDITION
                      "
                      >%</span
                    >
                    <ErrorMessage name="dividend_rate" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.distributeType')
                    }}</span>
                  </div>
                  <div class="col-8">
                    <Field
                      name="dividend_type"
                      as="select"
                      v-model="dividend.dividend_type"
                      class="form-select"
                    >
                      <option value="" disabled selected>
                        {{ $t('dividendScreen.pleaseSelect') }}
                      </option>
                      <option
                        v-for="type in DISTRIBUTE_TYPE"
                        :value="type"
                        :key="`distribute${type}`"
                      >
                        {{ $t(`dividendScreen.distributeTypes.${type}`) }}
                      </option>
                    </Field>
                    <ErrorMessage name="dividend_type" class="text-danger" />
                  </div>
                </div>

                <div class="row mt-5 align-items-center">
                  <div class="col-4">
                    <span class="fw-bolder">{{
                      $t('dividendScreen.indicatedAmount')
                    }}</span>
                  </div>
                  <div class="col-8 input-unit">
                    <input
                      type="text"
                      class="form-control"
                      disabled
                      v-if="
                        dividend.dividend_type === DISTRIBUTE_TYPE.INPUT_CODE ||
                        dividend.dividend_type ===
                          DISTRIBUTE_TYPE.NON_INDICATED_BALANCE
                      "
                    />
                    <currency-input
                      name="indicated_amount"
                      v-model.lazy="dividend.indicated_amount"
                      v-else
                    />
                    <Field
                      hidden
                      name="indicated_amount"
                      as="input"
                      class="form-control"
                      v-model="dividend.indicated_amount"
                    />
                    <span
                      class="unit"
                      v-if="
                        dividend.target_currency === 'all' &&
                        dividend.dividend_type ===
                          DISTRIBUTE_TYPE.INDICATED_BALANCE
                      "
                      >USD</span
                    >
                    <span
                      class="unit"
                      v-if="
                        dividend.target_currency !== 'all' &&
                        dividend.dividend_type ===
                          DISTRIBUTE_TYPE.INDICATED_BALANCE
                      "
                      >{{ dividend.target_currency.toUpperCase() }}</span
                    >
                    <ErrorMessage name="indicated_amount" class="text-danger" />
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-5 d-flex justify-content-center">
              <button class="btn btn-primary me-5" @click.prevent="onCancel">
                {{ $t('cancel') }}
              </button>
              <button
                type="button"
                class="btn btn-primary float-right"
                :data-kt-indicator="onSubmitting ? 'on' : ''"
                :disabled="onSubmitting"
                @click="onSubmit"
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
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { hideModal } from '@/core/helpers/dom'
import moment from 'moment'
import {
  STATUS,
  DIVIDEND_CALCULATED_MODE,
  DIVIDEND_SPAN,
  DISTRIBUTE_TYPE,
} from '@/views/dividend/definition/dividend.enum'
import { Currency } from '@/views/dividend/definition/dividend.interface'
import { DividendService } from '@/views/dividend/services/DividendService'
import { IMaskComponent } from 'vue-imask'
import CurrencyInput from '@/views/currency/components/CurrencyInput.vue'
import { getTimzoneOffset, convertLocalTimeToUTC } from '@/core/helpers/util'
import * as yup from 'yup'
import { debounce } from 'lodash'

export default defineComponent({
  name: 'DividendNew',
  components: {
    Form,
    Field,
    ErrorMessage,
    CurrencyInput,
    'imask-input': IMaskComponent,
  },
  data: () => ({
    dividend: {
      dividend_name: '',
      unlimited_end_date: false,
      target_currency: '',
      distributed_currency: '',
      dividend_span: '',
      dividend_date: {
        date: '',
        month: '',
      },
      dividend_calculated_mode: '',
      executing_time: new Date(),
      dividend_type: '',
      start_date: moment().format('YYYY-MM-DD HH:mm'),
      end_date: moment().add(7, 'days').format('YYYY-MM-DD HH:mm') as
        | string
        | null,
      is_limited: true,
      dividend_limited: true,
      joined_user_maximum: '',
      indicated_amount: '' as string | number,
      dividend_maximum: '',
      dividend_rate: '',
    },
    unlimitJoinedUserMaximum: false,
    unlimitDividendMaximum: false,
    onSubmitting: false,
    STATUS,
    DIVIDEND_SPAN,
    DIVIDEND_CALCULATED_MODE,
    DISTRIBUTE_TYPE,
    listCurrency: [] as Currency[],
    allDates: [] as (string | number)[],
    allMonths: [] as (string | number)[],
    dividendNameError: '',
    disabledDate: (time: Date) => {
      return time.getTime() < new Date().setHours(0, 0, 0, 0)
    },
  }),
  computed: {
    currencyOptions: function (): string[] {
      const allSymbols: string[] = []
      for (let currency of this.listCurrency) {
        if (currency.coin !== 'b-usdt') {
          allSymbols.push(currency.coin)
        }
      }
      return [...new Set(allSymbols)]
    },
    allHours() {
      const hours: string[] = []
      for (let hour = 1; hour < 24; hour++) {
        hours.push(`0${hour}`.slice(-2))
      }
      return hours
    },
    allMinutes() {
      const minutes: string[] = []
      for (let minute = 0; minute < 60; minute++) {
        minutes.push(`0${minute}`.slice(-2))
      }
      return minutes
    },
    schema() {
      const schemaObject = {
        dividend_name: yup
          .string()
          .required(
            this.$t('dividendScreen.validateSchema.dividend_name.required'),
          )
          .max(80, this.$t('dividendScreen.validateSchema.dividend_name.max')),
        target_currency: yup
          .string()
          .required(
            this.$t('dividendScreen.validateSchema.target_currency.required'),
          ),
        distributed_currency: yup
          .string()
          .required(
            this.$t(
              'dividendScreen.validateSchema.distributed_currency.required',
            ),
          ),
        dividend_span: yup
          .string()
          .required(
            this.$t('dividendScreen.validateSchema.dividend_span.required'),
          ),
        start_date: yup
          .date()
          .required(
            this.$t('dividendScreen.validateSchema.start_date.required'),
          )
          .typeError(
            this.$t('dividendScreen.validateSchema.start_date.required'),
          ),
        dividend_calculated_mode: yup
          .string()
          .required(
            this.$t(
              'dividendScreen.validateSchema.dividend_calculated_mode.required',
            ),
          ),
        dividend_type: yup
          .string()
          .required(
            this.$t('dividendScreen.validateSchema.dividend_type.required'),
          ),
      }

      // 1. dynamic validate with yup
      if (!this.unlimitJoinedUserMaximum) {
        schemaObject['joined_user_maximum'] = yup
          .number()
          .required(
            this.$t(
              'dividendScreen.validateSchema.joined_user_maximum.required',
            ),
          )
          .min(
            1,
            this.$t('dividendScreen.validateSchema.joined_user_maximum.min'),
          )
          .typeError(
            this.$t(
              'dividendScreen.validateSchema.joined_user_maximum.required',
            ),
          )
      }

      // 2 dynamic validate with yup
      if (this.dividend.dividend_span !== DIVIDEND_SPAN.ONCE) {
        schemaObject['executing_time'] = yup
          .date()
          .required(
            this.$t('dividendScreen.validateSchema.executing_time.required'),
          )
          .typeError(
            this.$t('dividendScreen.validateSchema.executing_time.required'),
          )
      }

      // 3 dynamic validate with yup
      if (
        this.dividend.dividend_span === DIVIDEND_SPAN.MONTHLY ||
        this.dividend.dividend_span === DIVIDEND_SPAN.YEARLY
      ) {
        schemaObject['dividend_date_date'] = yup
          .string()
          .required(
            this.$t(
              'dividendScreen.validateSchema.dividend_date_date.required',
            ),
          )
      }

      // 4 dynamic validate with yup
      if (this.dividend.dividend_span === DIVIDEND_SPAN.YEARLY) {
        schemaObject['dividend_date_month'] = yup
          .string()
          .required(
            this.$t(
              'dividendScreen.validateSchema.dividend_date_month.required',
            ),
          )
      }

      // 5. dynamic validate with yup
      if (!this.dividend.unlimited_end_date) {
        schemaObject['end_date'] = yup
          .date()
          .required(this.$t('dividendScreen.validateSchema.end_date.required'))
          .min(
            yup.ref('start_date'),
            this.$t('dividendScreen.validateSchema.end_date.min'),
          )
          .typeError(this.$t('dividendScreen.validateSchema.end_date.required'))
      }

      // 6. dynamic validate with yup
      if (!this.unlimitDividendMaximum) {
        schemaObject['dividend_maximum'] = yup
          .number()
          .required(
            this.$t('dividendScreen.validateSchema.dividend_maximum.required'),
          )
          .min(
            0.00001,
            this.$t('dividendScreen.validateSchema.dividend_maximum.min'),
          )
          .typeError(
            this.$t('dividendScreen.validateSchema.dividend_maximum.required'),
          )
      }

      // 7 dynamic validate with yup
      if (
        !(
          this.dividend.dividend_type === DISTRIBUTE_TYPE.INPUT_CODE ||
          this.dividend.dividend_type === DISTRIBUTE_TYPE.NON_INDICATED_BALANCE
        )
      ) {
        schemaObject['indicated_amount'] = yup
          .string()
          .required(
            this.$t('dividendScreen.validateSchema.indicated_amount.required'),
          )
          .typeError(
            this.$t('dividendScreen.validateSchema.indicated_amount.required'),
          )
      }

      // 8 dynamic validate with yup
      if (
        this.dividend.dividend_calculated_mode !==
        DIVIDEND_CALCULATED_MODE.NON_CONDITION
      ) {
        schemaObject['dividend_rate'] = yup
          .number()
          .required(
            this.$t('dividendScreen.validateSchema.dividend_rate.required'),
          )
          .min(
            0.00001,
            this.$t('dividendScreen.validateSchema.dividend_rate.min'),
          )
          .max(100, this.$t('dividendScreen.validateSchema.dividend_rate.max'))
          .typeError(
            this.$t('dividendScreen.validateSchema.dividend_rate.required'),
          )
      } else {
        schemaObject['dividend_rate'] = yup
          .number()
          .required()
          .min(0.00001)
          .typeError(
            this.$t('dividendScreen.validateSchema.dividend_rate.required'),
          )
      }

      return yup.object(schemaObject)
    },
  },
  created() {
    this.getListCurrency()
    this.getAllDatesAndAllMonths(31, 12)
  },
  methods: {
    async onSubmit() {
      const dividendForm = this.$refs.dividendForm as any
      const form = await dividendForm.validate()
      if (!form.valid || this.dividendNameError) {
        return
      }
      if (
        this.dividend.dividend_type === DISTRIBUTE_TYPE.NON_INDICATED_BALANCE
      ) {
        this.dividend.indicated_amount = 0
      }
      const hour = this.dividend.executing_time.getHours()
      const minute = this.dividend.executing_time.getMinutes()
      const time = convertLocalTimeToUTC(hour, minute)
      const dividendParams = {
        ...this.dividend,
        ...{
          start_date: moment(this.dividend.start_date).format(
            'YYYY-MM-DD HH:mm',
          ),
          end_date: this.dividend.unlimited_end_date
            ? null
            : moment(this.dividend.end_date).format('YYYY-MM-DD HH:mm'),
          offset: getTimzoneOffset(),
        },
        executing_time: {
          HH: time.hour,
          mm: time.minute,
        },
      }
      this.onSubmitting = true
      const { success, data } = await DividendService.createDividend(
        dividendParams,
      )
      if (success && data?.data?.id) {
        this.resetForm()
        this.createDividendSuccess()
        this.$toastr.success(this.$t('success'))
      } else {
        this.$toastr.error(this.$t('error'))
      }
      this.onSubmitting = false
    },
    onCancel() {
      this.resetForm()
      this.closeModal()
    },
    resetForm() {
      const dividendForm = this.$refs.dividendForm as any
      dividendForm.resetForm()

      // reset data
      this.resetData()
    },
    resetData() {
      ;(this.dividend.dividend_name = ''),
        (this.dividend.unlimited_end_date = false),
        (this.dividend.target_currency = ''),
        (this.dividend.distributed_currency = ''),
        (this.dividend.dividend_span = ''),
        (this.dividend.dividend_date.date = ''),
        (this.dividend.dividend_date.month = ''),
        (this.dividend.dividend_calculated_mode = ''),
        (this.dividend.executing_time = new Date()),
        (this.dividend.dividend_type = ''),
        (this.dividend.start_date = moment().format('YYYY-MM-DD HH:mm')),
        (this.dividend.end_date = moment()
          .add(7, 'days')
          .format('YYYY-MM-DD HH:mm')),
        (this.dividend.is_limited = true),
        (this.dividend.dividend_limited = true),
        (this.dividend.joined_user_maximum = ''),
        (this.dividend.indicated_amount = ''),
        (this.dividend.dividend_maximum = ''),
        (this.dividend.dividend_rate = ''),
        (this.unlimitJoinedUserMaximum = false)
      this.unlimitDividendMaximum = false
    },
    async getListCurrency() {
      const data = await DividendService.getListCurrency()
      this.listCurrency = data ?? []
    },
    getAllDatesAndAllMonths(allDate, allMonth) {
      for (let date = 1; date < allDate + 1; date++) {
        this.allDates.push(date)
      }
      for (let month = 1; month < allMonth + 1; month++) {
        this.allMonths.push(month)
      }
      if (this.dividend.dividend_span === DIVIDEND_SPAN.MONTHLY) {
        this.allDates.push('last_day')
      }
    },
    getAllDateInMonth(month) {
      const year = new Date().getFullYear()
      const allDateInMonth = new Date(year, month, 0).getDate()
      this.allDates = []
      this.allMonths = []
      this.getAllDatesAndAllMonths(allDateInMonth, 12)
    },
    async checkDividendNameExist(dividendName) {
      this.dividendNameError = ''
      if (dividendName) {
        const { data } = await DividendService.getDividendNamesWithCancel()
        const dividendNames = data.data
        const names: any[] = []
        for (const [id, name] of Object.entries(dividendNames)) {
          names.push(name)
        }
        const filterName = names.filter((item) => item === dividendName)
        this.dividendNameError = filterName.length
          ? this.$t('dividendScreen.validateSchema.dividend_name.check_exist')
          : ''
      }
    },
  },
  watch: {
    unlimitJoinedUserMaximum() {
      this.dividend.is_limited = !this.unlimitJoinedUserMaximum
      this.dividend.joined_user_maximum = ''
    },
    unlimitDividendMaximum() {
      this.dividend.dividend_limited = !this.unlimitDividendMaximum
      if (this.unlimitDividendMaximum) {
        this.dividend.dividend_maximum = ''
      }
    },
    'dividend.dividend_span': function () {
      if (this.dividend.dividend_span === DIVIDEND_SPAN.ONCE) {
        this.dividend.dividend_date.date = ''
        this.dividend.dividend_date.month = ''
      }
      if (this.dividend.dividend_span === DIVIDEND_SPAN.MONTHLY) {
        this.allDates = []
        this.dividend.dividend_date.month = ''
        this.getAllDatesAndAllMonths(31, 12)
      }
      if (this.dividend.dividend_span === DIVIDEND_SPAN.YEARLY) {
        this.dividend.dividend_date.date = ''
        this.dividend.dividend_date.month = ''
      }
    },
    'dividend.dividend_date.month': function () {
      this.getAllDateInMonth(this.dividend.dividend_date.month)
    },
    'dividend.dividend_type': function () {
      this.dividend.indicated_amount = ''
    },
    'dividend.unlimited_end_date'() {
      this.dividend.unlimited_end_date
        ? (this.dividend.end_date = '')
        : (this.dividend.end_date = moment()
            .add(7, 'days')
            .format('YYYY-MM-DD HH:mm'))
    },
    'dividend.dividend_name': debounce(async function (this: any, newDividend) {
      this.checkDividendNameExist(newDividend)
    }, 300),
  },
  setup(props, { emit }) {
    const newDividendModalRef = ref(null)

    const closeModal = () => {
      hideModal(newDividendModalRef.value)
    }

    const createDividendSuccess = async () => {
      emit('createDividendSuccess')
      hideModal(newDividendModalRef.value)
    }

    return {
      newDividendModalRef,
      closeModal,
      createDividendSuccess,
    }
  },
})
</script>

<style>
.disable-currency .form-control {
  background-color: #eff2f5;
}
</style>

<style lang="scss" scoped>
.input-unit {
  position: relative;
  .unit {
    position: absolute;
    right: 1.5rem;
    top: 1rem;
  }
}

.modal {
  .modal-dialog {
    min-width: 992px;
  }
}
</style>
