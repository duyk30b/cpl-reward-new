<template>
  <div
    class="modal fade"
    id="new-dividend-code-modal"
    ref="newDividendCodeModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <Form
          ref="dividendCodeForm"
          class="pb-10"
          :validation-schema="schema"
          @submit.prevent="onSubmit"
        >
          <div class="modal-header">
            <h5 class="modal-title">
              {{ $t('dividendScreen.dividendCodeNew') }}
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
            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">{{
                  $t('dividendScreen.dividendName')
                }}</span>
              </div>
              <div class="col-8">
                <Field
                  name="dividend_name"
                  as="select"
                  v-model="selectedDividendId"
                  class="form-select"
                >
                  <option value="" disabled selected>
                    {{ $t('dividendScreen.pleaseSelect') }}
                  </option>
                  <option
                    v-for="dividend in dividends"
                    :value="dividend.id"
                    :key="`dividend${dividend.id}`"
                  >
                    {{ dividend.name }}
                  </option>
                </Field>
                <ErrorMessage name="dividend_name" class="text-danger" />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">{{
                  $t('dividendScreen.quantity')
                }}</span>
              </div>
              <div class="col-8">
                <imask-input
                  name="quantity"
                  v-model="quantity"
                  class="form-control"
                  :mask="/^\d{1,5}$/"
                />
                <Field
                  hidden
                  name="quantity"
                  as="input"
                  class="form-control"
                  v-model="quantity"
                />
                <ErrorMessage name="quantity" class="text-danger" />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">{{
                  $t('dividendScreen.remainingCodes')
                }}</span>
              </div>
              <div class="col-8">
                <span v-if="selectedDividend.is_limited === 0">{{
                  $t('dividendScreen.unlimited')
                }}</span>
                <span v-else>{{ remainingCodes }}</span>
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4"></div>
              <div class="col-8">
                <button
                  class="btn btn-sm btn-primary mb-5"
                  :disabled="isDisableBtnGenerateCodes"
                  @click.prevent="generateCodes"
                >
                  {{ $t('dividendScreen.generate') }}
                </button>
                <div class="generated-code">
                  <div class="all-code">
                    <p v-for="code in codes" :key="`code${code}`">{{ code }}</p>
                  </div>
                </div>
                <ErrorMessage name="codes" class="text-danger" />
                <span class="text-danger" v-if="errGenerateCode">{{
                  $t('dividendScreen.validateSchema.codes.required')
                }}</span>
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
import { IMaskComponent } from 'vue-imask'
import { DividendService } from '@/views/dividend/services/DividendService'
import * as yup from 'yup'
import {
  ALLOCATE_STATUS,
  STATUS,
} from '@/views/dividend/definition/dividend.enum'

interface DividendCampain {
  id: string
  name: string
  is_limited: number
  maximum_user_numbers: number
  dividend_codes_count: number
  target_currency: string
}

const MANUAL = 'manual'

export default defineComponent({
  name: 'DividendNew',
  components: {
    Form,
    Field,
    ErrorMessage,
    'imask-input': IMaskComponent,
  },
  props: {
    dividendIdSelected: String,
  },
  data: () => ({
    selectedDividendId: '',
    selectedDividend: {} as DividendCampain,
    dividends: [] as DividendCampain[],
    quantity: '',
    codes: [] as string[],
    errGenerateCode: false,
    onSubmitting: false,
  }),
  computed: {
    remainingCodes() {
      if (this.selectedDividend.is_limited === 0) {
        return
      }

      const remainingCodes =
        (+this.selectedDividend.maximum_user_numbers || 0) -
        (+this.selectedDividend.dividend_codes_count || 0) -
        (+this.quantity || 0)
      if (remainingCodes < 0) {
        return (
          (+this.selectedDividend.maximum_user_numbers || 0) -
          (+this.selectedDividend.dividend_codes_count || 0)
        )
      }
      return remainingCodes
    },
    isDisableBtnGenerateCodes() {
      if (!this.selectedDividendId) {
        return true
      }

      if (+this.quantity === 0) {
        return true
      }

      if (this.selectedDividend.is_limited === 0) {
        return false
      }
      const remainingCodes =
        (+this.selectedDividend.maximum_user_numbers || 0) -
        (+this.selectedDividend.dividend_codes_count || 0) -
        (+this.quantity || 0)

      return remainingCodes < 0
    },
    schema() {
      const schemaObject = {
        dividend_name: yup
          .string()
          .required(
            this.$t('dividendScreen.validateSchema.dividend_name.required'),
          )
          .typeError(
            this.$t('dividendScreen.validateSchema.dividend_name.required'),
          ),

        quantity: yup
          .number()
          .required(this.$t('dividendScreen.validateSchema.quantity.required'))
          .min(1, this.$t('dividendScreen.validateSchema.quantity.min'))
          .typeError(
            this.$t('dividendScreen.validateSchema.quantity.required'),
          ),
      }

      // dynamic validate with yup
      if (this.selectedDividend.is_limited !== 0) {
        const remainingCodes =
          (+this.selectedDividend.maximum_user_numbers || 0) -
          (+this.selectedDividend.dividend_codes_count || 0) -
          (+this.quantity || 0)
        if (remainingCodes < 0) {
          schemaObject['quantity'] = yup
            .number()
            .required(
              this.$t('dividendScreen.validateSchema.quantity.required'),
            )
            .min(1, this.$t('dividendScreen.validateSchema.quantity.min'))
            .max(
              (+this.selectedDividend.maximum_user_numbers || 0) -
                (+this.selectedDividend.dividend_codes_count || 0),
              this.$t('dividendScreen.validateSchema.quantity.max'),
            )
            .typeError(
              this.$t('dividendScreen.validateSchema.quantity.required'),
            )
        }
      }

      return yup.object(schemaObject)
    },
  },
  created() {
    this.getDividendCampaigns()
  },
  methods: {
    async onSubmit() {
      const dividendCodeForm = this.$refs.dividendCodeForm as any
      if (!this.codes.length) {
        this.errGenerateCode = true
      }
      const form = await dividendCodeForm.validate()

      if (!form.valid || this.errGenerateCode) {
        return
      }
      const params = {
        codes: this.codes.map((code) => {
          return {
            dividend_campaign_id: this.selectedDividend.id,
            code: code,
            status: ALLOCATE_STATUS.NO_ALLOCATE,
            type: MANUAL,
          }
        }),
      }
      this.onSubmitting = true
      const { success, data } = await DividendService.createCodes(params)
      if (success && data.data.success) {
        this.createDividendCodeSuccess()
      }
      this.onSubmitting = false
    },
    onCancel() {
      this.closeModal()
    },
    async beforeOpen() {
      this.resetData()
      this.resetForm()
      await this.getDividendCampaigns()
      for (const dividend of this.dividends) {
        if (dividend.id === this.dividendIdSelected) {
          this.selectedDividendId = dividend.id
          this.selectedDividend = dividend
          return
        }
      }
    },
    resetData() {
      this.selectedDividendId = ''
      this.selectedDividend = {} as DividendCampain
      this.quantity = ''
      this.codes = []
      this.errGenerateCode = false
    },
    resetForm() {
      const dividendCodeForm = this.$refs.dividendCodeForm as any
      dividendCodeForm.resetForm()
    },
    generateCode() {
      return `${this.selectedDividend?.target_currency || ''}${Math.random()
        .toString(36)
        .substring(3)}`
    },
    generateCodes() {
      // check valid err
      this.codes = []
      for (let i = 0; i < +this.quantity; i++) {
        this.codes.push(this.generateCode())
      }
    },
    async getDividendCampaigns() {
      const { success, data } =
        await DividendService.getDividendCampaignsAdvanced({
          excluded_statuses: `${STATUS.CANCELLED},${STATUS.FINISHED}`,
          sort: 'name',
          sort_type: 'ASC',
        })
      if (success) {
        const dividends = data.data ?? []
        this.dividends = dividends
      }
    },
  },
  watch: {
    quantity() {
      this.codes = []
    },
    codes() {
      if (this.codes.length) {
        this.errGenerateCode = false
      }
    },
    selectedDividendId(dividendId) {
      this.codes = []
      for (const dividend of this.dividends) {
        if (dividend.id === dividendId) {
          this.selectedDividend = dividend
          return
        }
      }
    },
  },
  setup(props, { emit }) {
    const newDividendCodeModalRef = ref(null)

    const closeModal = () => {
      hideModal(newDividendCodeModalRef.value)
    }

    const createDividendCodeSuccess = async () => {
      emit('createDividendCodeSuccess')
      hideModal(newDividendCodeModalRef.value)
    }

    return {
      newDividendCodeModalRef,
      closeModal,
      createDividendCodeSuccess,
    }
  },
})
</script>

<style lang="scss" scoped>
.generated-code {
  width: 100%;
  height: 10rem;
  padding: 0.5rem 0;
  margin-bottom: 1rem;
  overflow: hidden;
  border: 1px solid #e4e6ef;
  border-radius: 0.475rem;

  .all-code {
    padding: 0 1rem;
    overflow-y: auto;
    max-height: 100%;
  }
}
</style>
