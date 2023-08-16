<template>
  <Form
    ref="coinInformationForm"
    :validation-schema="validateSchema"
    @submit.prevent="nextStep"
  >
    <div class="row">
      <div class="col-4 card-title">
        <span>{{
          $t('currencyScreen.registerNewCurrencyScreen.addCurrencyTitle')
        }}</span>
      </div>
      <div class="col-8 pt-2" v-if="!isERCBEP20">
        <span class="text-warning"
          >(*)
          {{
            $t('currencyScreen.registerNewCurrencyScreen.addCurrencyWarning')
          }}</span
        >
      </div>
    </div>

    <div class="row">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.type')
        }}</span>
      </div>
      <div class="col-8">
        <template v-if="isERCBEP20">
          <Field
            name="type"
            as="select"
            v-model="params.params.type"
            class="form-select"
          >
            <option value="erc20" key="erc20">ERC20</option>
            <option value="bep20" key="bep20">BEP20</option>
          </Field>
          <ErrorMessage name="type" class="text-danger" />
        </template>

        <template v-else>
          <Field
            v-model="params.params.type"
            name="type"
            as="input"
            class="form-control d-none"
          />
          <p class="not-wallet">
            {{ $t('currencyScreen.registerNewCurrencyScreen.notWallet') }}
          </p>
        </template>
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.contractAddress')
        }}</span>
      </div>
      <div class="col-8 contract-address">
        <imask-input
          name="contract_address"
          :mask="/[a-zA-Z0-9]+$/"
          v-model="contract_address"
          class="form-control"
          maxlength="255"
        />
        <Field
          name="contract_address"
          as="input"
          v-model="contract_address"
          class="form-control d-none"
        >
        </Field>
        <i class="fas fa-spinner fa-spin" v-if="isVerifyAddress"></i>
        <span class="text-danger" v-if="contractAddressError">
          {{ contractAddressError }}
        </span>
        <ErrorMessage v-else name="contract_address" class="text-danger" />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{ $t('currencyScreen.coin') }}</span>
      </div>
      <div class="col-8">
        <imask-input
          name="coin"
          :mask="/[a-zA-Z0-9]+$/"
          v-model="params.params.coin"
          class="form-control"
          maxlength="255"
        />
        <Field
          name="coin"
          as="input"
          class="form-control d-none"
          v-model="params.params.coin"
        />

        <span
          v-if="coinError"
          :class="['text-danger', isERCBEP20 ? 'd-none' : '']"
          >{{ coinError }}</span
        >
        <ErrorMessage
          v-else
          name="coin"
          :class="['text-danger', isERCBEP20 ? 'd-none' : '']"
        />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.coinName')
        }}</span>
      </div>
      <div class="col-8">
        <imask-input
          name="coin_name"
          :mask="/[a-zA-Z0-9\s]+$/"
          v-model="params.params.coin_name"
          class="form-control"
          maxlength="255"
        />
        <Field
          name="coin_name"
          as="input"
          class="form-control d-none"
          v-model="params.params.coin_name"
        />
        <span v-if="coinNameError" class="text-danger">{{
          coinNameError
        }}</span>
        <ErrorMessage v-else name="coin_name" class="text-danger" />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.icon')
        }}</span>
      </div>
      <div class="col-8">
        <input
          type="file"
          class="d-none"
          ref="fileUpload"
          accept="image/x-png,image/png"
          @change="fileChange"
        />

        <button
          type="button"
          class="btn btn-primary ml-2"
          :data-kt-indicator="isUploading ? 'on' : ''"
          :disabled="isUploading"
          @click="chooseFile"
        >
          <span class="indicator-label">
            {{ $t('currencyScreen.registerNewCurrencyScreen.chooseFile') }}
          </span>
          <span class="indicator-progress">
            {{ $t('currencyScreen.registerNewCurrencyScreen.chooseFile') }}
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>

        <span :class="['ml-1', file ? '' : 'text-warning']">{{
          file
            ? file.name
            : `(*) ${$t(
                'currencyScreen.registerNewCurrencyScreen.filePngRequired',
              )}`
        }}</span>

        <div>
          <Field name="icon" v-model="params.params.icon" class="d-none" />
          <span class="text-danger" v-if="iconError">
            {{ iconError }}
          </span>
          <ErrorMessage v-else name="icon" class="text-danger" />
        </div>
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.decimals')
        }}</span>
      </div>
      <div class="col-8">
        <currency-input
          name="decimals"
          v-model.lazy="params.params.decimals"
          v-if="!isERCBEP20"
        />
        <Field
          name="decimals"
          as="input"
          :class="['form-control', !isERCBEP20 ? 'd-none' : '']"
          v-model="params.params.decimals"
          :disabled="isERCBEP20"
        />
        <ErrorMessage
          name="decimals"
          class="text-danger"
          :class="['text-danger', isERCBEP20 ? 'd-none' : '']"
        />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.transactionExplorer')
        }}</span>
      </div>
      <div class="col-8">
        <imask-input
          name="transaction_explorer"
          v-model="params.params.transaction_explorer"
          class="form-control"
          maxlength="255"
          :disabled="isERCBEP20"
        />
        <Field
          name="transaction_explorer"
          as="input"
          class="form-control d-none"
          v-model="params.params.transaction_explorer"
          :disabled="isERCBEP20"
        />
        <ErrorMessage
          name="transaction_explorer"
          :class="['text-danger', isERCBEP20 ? 'd-none' : '']"
        />
      </div>
    </div>

    <div class="row mt-5 align-items-center">
      <div class="col-4">
        <span class="font-weight-bold">{{
          $t('currencyScreen.registerNewCurrencyScreen.transactionPath')
        }}</span>
      </div>
      <div class="col-8">
        <imask-input
          name="transaction_path"
          v-model="params.params.transaction_path"
          class="form-control"
          maxlength="255"
          :disabled="isERCBEP20"
        />
        <Field
          name="transaction_path"
          as="input"
          class="form-control d-none"
          v-model="params.params.transaction_path"
          :disabled="isERCBEP20"
        />
        <ErrorMessage
          name="transaction_path"
          :class="['text-danger', isERCBEP20 ? 'd-none' : '']"
        />
      </div>
    </div>

    <div class="row mt-5">
      <div class="col">
        <button
          type="button"
          class="btn btn-primary float-right"
          :data-kt-indicator="isVerifyCurrency ? 'on' : ''"
          :disabled="isVerifyCurrency"
          @click="nextStep"
        >
          <span class="indicator-label">
            {{ $t('currencyScreen.registerNewCurrencyScreen.nextBtn') }}
          </span>
          <span class="indicator-progress">
            {{ $t('currencyScreen.registerNewCurrencyScreen.nextBtn') }}

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
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as Yup from 'yup'
import { CurrencyService } from '@/views/currency/services/CurrencyService'
import CurrencyInput from '@/views/currency/components/CurrencyInput.vue'
import _ from 'lodash'
import { HttpStatus } from '@/core/variables/common.enum'
import { IMaskComponent } from 'vue-imask'

export default defineComponent({
  name: 'CoinInformation',
  components: {
    Form,
    Field,
    ErrorMessage,
    CurrencyInput,
    'imask-input': IMaskComponent,
  },
  inject: ['params', 'isERCBEP20'],
  data() {
    return {
      file: null,
      contract_address: '',
      contractAddressError: '',
      coinNameError: '',
      coinError: '',
      iconError: '',
      validateSchema: Yup.object().shape({}),
      rootParams: this.params, // initial data based on injected value
      isVerifyAddress: false,
      isUploading: false,
      isVerifyCurrency: false,
    }
  },
  created() {
    this.initValidate()
  },
  methods: {
    async nextStep() {
      // reset error before check
      this.contractAddressError = ''
      this.coinError = ''
      this.coinNameError = ''

      const coinInformationForm = this.$refs.coinInformationForm as any
      const form = await coinInformationForm.validate()
      if (!form.valid || this.iconError || this.contractAddressError) {
        return
      }

      await this.checkValidParams()
      if (this.contractAddressError || this.coinError || this.coinNameError) {
        this.$toastr.error(
          this.contractAddressError || this.coinError || this.coinNameError,
        )
        return
      }

      this.$emit('next-step')
    },
    chooseFile() {
      ;(this.$refs['fileUpload'] as any).click()
    },
    async fileChange(event) {
      this.iconError = ''
      const fileTypeAllowed = ['image/png']
      const file = event.target.files[0]
      const fileType = file.type
      if (!fileTypeAllowed.includes(fileType)) {
        // return this.clearFileInput()
        this.file = file
        this.iconError = this.$t(
          'currencyScreen.registerNewCurrencyScreen.validateSchema.image_png',
        )
        return
      }

      try {
        this.isUploading = true
        const { data } = await CurrencyService.uploadCurrencyIcon(file)
        if ('url' in data) {
          this.file = file
          ;(this.rootParams as any).params.icon = data.url
        } else {
          this.$toastr.error(
            this.$t('currencyScreen.registerNewCurrencyScreen.uploadFileFail'),
          )
        }
        this.isUploading = false
      } catch (error) {
        this.isUploading = false
        this.$toastr.error(
          this.$t('currencyScreen.registerNewCurrencyScreen.uploadFileFail'),
        )
        return
      }
    },
    clearFileInput() {
      ;(this.$refs['fileUpload'] as any).value = null
      this.file = null
      ;(this.rootParams as any).params.icon = ''
    },
    initValidate() {
      const validateSchema = Yup.object().shape({
        type: Yup.string().required(
          this.$t(
            'currencyScreen.registerNewCurrencyScreen.validateSchema.type_required',
          ),
        ),
        contract_address: Yup.string()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.contract_address_required',
            ),
          )
          .max(255)
          .matches(/^[^!"#$%&'()\-^\\@[;:\],./\\=~|`{+*}<>?_\s]*$/, {
            message: this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.contract_address_special',
            ),
            excludeEmptyString: true,
          }),
        coin: Yup.string()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_required',
            ),
          )
          .max(255)
          .matches(/^[^`!@#$%^&*()+\\=\\[\]{};':"\\|,.<>\\/?~\s]*$/, {
            message: this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_special',
            ),
            excludeEmptyString: true,
          }),
        coin_name: Yup.string()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_required',
            ),
          )
          .max(255)
          .matches(/^[^`!@#$%^&*()+\\=\\[\]{};':"\\|,.<>\\/?~]*$/, {
            message: this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_special',
            ),
            excludeEmptyString: true,
          }),
        icon: Yup.string().required(
          this.$t(
            'currencyScreen.registerNewCurrencyScreen.validateSchema.icon_required',
          ),
        ),
        decimals: Yup.number()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.decimals_required',
            ),
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.decimals_required',
            ),
          ),
        transaction_explorer: Yup.string()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.exploder_required',
            ),
          )
          .max(255)
          .matches(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.${}]+$/,
            {
              message: this.$t(
                'currencyScreen.registerNewCurrencyScreen.validateSchema.exploder_url',
              ),
              excludeEmptyString: true,
            },
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.exploder_required',
            ),
          ),
        transaction_path: Yup.string()
          .required(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.transaction_path_required',
            ),
          )
          .max(255)
          .matches(
            /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\\.-]+)+[\w\-\\._~:/?#[\]@!\\$&'\\(\\)\\*\\+,;=.${}]+$/,
            {
              message: this.$t(
                'currencyScreen.registerNewCurrencyScreen.validateSchema.transaction_path_url',
              ),
              excludeEmptyString: true,
            },
          )
          .typeError(
            this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.transaction_path_required',
            ),
          ),
      })
      this.validateSchema = validateSchema
    },
    resetData(this: any) {
      this.params.params.coin = ''
      this.params.params.coin_name = ''
      this.params.params.decimals = null
      this.params.params.required_confirmations = null
      this.params.params.transaction_explorer = ''
      this.params.params.transaction_path = ''
    },
    async getSmartContract(this: any, address) {
      this.contractAddressError = ''
      const type = this.params.params.type

      if (!type || !this.isERCBEP20) {
        return
      }

      if (!address) {
        this.resetData()
      } else {
        this.isVerifyAddress = true
        try {
          const resp = await CurrencyService.getSmartContract({
            address: address,
            chain_code: type,
          })
          const { data } = resp
          if ('coin' in data) {
            this.params.params.coin = data.coin
            this.params.params.coin_name = data.coin_name
            this.params.params.decimals = data.decimal
            this.params.params.required_confirmations =
              data.require_confirmation
            this.params.params.transaction_explorer = data.transaction_explorer
            this.params.params.transaction_path = data.transaction_path
          } else {
            if (data.status_code === HttpStatus.BAD_REQUEST) {
              this.contractAddressError = this.$t(
                'currencyScreen.registerNewCurrencyScreen.validateSchema.contract_address_invalid',
              )
            }
            this.resetData()
          }
          this.isVerifyAddress = false
        } catch (error) {
          this.isVerifyAddress = false
          this.resetData()
        }
      }
    },
    // check valid currency
    async checkValidParams(this: any) {
      // 1. check coin name empty
      if (!this.rootParams.params.coin_name.trim()) {
        this.coinNameError = this.$t(
          'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_required',
        )
        return
      }

      // 2. check valid from api
      this.isVerifyCurrency = true
      const { data } = await CurrencyService.checkValidCurrency({
        coin: this.rootParams.params.coin,
        coin_name: this.rootParams.params.coin_name,
        contract_address: this.rootParams.params.contract_address,
      })
      this.isVerifyCurrency = false

      // 3. handle errors
      if (!data.result) {
        const errors = data?.response?.errors ?? null

        // handle contract address error from server
        if (errors?.contract_address) {
          if (errors?.contract_address.includes('validation.unique')) {
            this.contractAddressError = this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.contract_address_exist',
            )
          }
        }

        // handle coin error from server
        if (errors?.coin) {
          if (errors?.coin.includes('validation.unique')) {
            this.coinError = this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_exist',
            )
          }
        }

        // handle contract address error from server
        if (errors?.coin_name) {
          if (errors?.coin_name.includes('validation.unique')) {
            this.coinNameError = this.$t(
              'currencyScreen.registerNewCurrencyScreen.validateSchema.coin_name_exist',
            )
          }
        }
      }
    },
  },
  watch: {
    contract_address: _.debounce(async function (this: any, newAddress) {
      this.params.params.contract_address = newAddress
      this.getSmartContract(newAddress)
    }, 300),
    'params.params.type': function (this: any) {
      this.getSmartContract(this.params.params.contract_address)
    },
    '$i18n.locale': function () {
      this.initValidate()
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/register_currency.scss';
</style>
