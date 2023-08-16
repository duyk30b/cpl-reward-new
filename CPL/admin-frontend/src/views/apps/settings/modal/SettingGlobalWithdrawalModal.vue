<template>
  <div class="modal global-setting">
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header px-8">
          <h2 class="fw-bolder">
            {{ $t('setting.globalWithdrawal.editModalHeader') }}
          </h2>
          <div
            class="btn btn-icon btn-sm btn-active-icon-primary"
            :class="{ disabled: loading }"
            @click="close"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="modal-body p-5 px-8">
          <Form
            class="mb-5"
            ref="editWithdrawalSetting"
            @submit.prevent=""
            :validation-schema="validateSchema"
          >
            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.coin') }}
              </div>
              <div v-if="formData.coin" class="col-6 ms-2">
                {{ formData.coin.toUpperCase() }}
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.withdrawalEnable') }}
              </div>
              <div class="col-6 form-switch ms-4">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="formData.withdrawalEnable"
                  @change="onSwitch()"
                />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.minimumWithdrawal') }}
              </div>
              <div class="col-6">
                <!-- <input
                  class="form-control"
                  v-model.lazy="formData.minimumWithdrawal"
                /> -->
                <imask-input
                  v-model.lazy="formData.minimumWithdrawal"
                  :mask="/^([1-9]\d{0,8}|0)(\.\d{0,5})?$/"
                  class="form-control"
                />
                <Field
                  name="minimumWithdrawal"
                  as="input"
                  v-model="formData.minimumWithdrawal"
                  class="d-none"
                >
                </Field>
                <ErrorMessage name="minimumWithdrawal" class="text-danger" />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.maximumWithdrawal') }}
              </div>
              <div class="col-6">
                <!-- <input
                  class="form-control"
                  v-model.lazy="formData.maximumWithdrawal"
                /> -->
                <imask-input
                  v-model.lazy="formData.maximumWithdrawal"
                  :mask="/^([1-9]\d{0,8}|0)(\.\d{0,5})?$/"
                  class="form-control"
                />
                <Field
                  name="maximumWithdrawal"
                  as="input"
                  v-model="formData.maximumWithdrawal"
                  class="d-none"
                />
                <ErrorMessage name="maximumWithdrawal" class="text-danger" />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.maximumResetTimeDay') }}
              </div>
              <div class="col-6">
                <input
                  v-model="formData.maximumResetTime"
                  type="number"
                  class="form-control"
                  placeholder=""
                  maxlength="255"
                  min="0"
                />
                <Field
                  name="maximumResetTime"
                  as="input"
                  v-model="formData.maximumResetTime"
                  class="d-none"
                />
                <ErrorMessage name="maximumResetTime" class="text-danger" />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.withdrawalThreshold') }}
              </div>
              <div class="col-6">
                <!-- <input
                  class="form-control"
                  v-model.lazy="formData.autoWithdrawalThreshold"
                /> -->
                <imask-input
                  v-model.lazy="formData.autoWithdrawalThreshold"
                  :mask="/^([1-9]\d{0,8}|0)(\.\d{0,5})?$/"
                  class="form-control"
                />
                <Field
                  name="autoWithdrawalThreshold"
                  as="input"
                  v-model="formData.autoWithdrawalThreshold"
                  class="d-none"
                >
                </Field>
                <ErrorMessage
                  name="autoWithdrawalThreshold"
                  class="text-danger"
                />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.decimalOfFee') }}
              </div>
              <div class="col-6">
                <el-select
                  v-model="formData.decimalOfFee"
                  @change="changeDecimalOfFee"
                >
                  <el-option
                    v-for="amountPresicion in amountPrecisionOptions"
                    :value="amountPresicion"
                    :key="amountPresicion"
                    :label="amountPresicion"
                  />
                </el-select>
                <Field
                  name="decimalOfFee"
                  as="input"
                  v-model="formData.decimalOfFee"
                  class="d-none"
                >
                </Field>
                <ErrorMessage name="decimalOfFee" class="text-danger" />
              </div>
            </div>

            <div class="row mb-4">
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.feeMode') }}
              </div>
              <div class="col-8">
                <el-radio-group
                  v-model="formData.feeMode"
                  @change="changeFeeMode"
                  class="ml-4"
                >
                  <el-radio label="USDT" size="large">USDT</el-radio>
                  <el-radio label="COIN" size="large">COIN</el-radio>
                  <el-radio label="GLOBAL_USDT" size="large"
                    >GLOBAL_USDT</el-radio
                  >
                </el-radio-group>
              </div>
            </div>

            <div
              class="row mb-4"
              v-if="
                formData.feeMode === 'USDT' ||
                formData.feeMode === 'GLOBAL_USDT'
              "
            >
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.feeUsd') }}
              </div>
              <div class="col-6">
                <input
                  v-if="formData.feeMode === 'GLOBAL_USDT'"
                  v-model="globalUsdtAmountMutation"
                  type="text"
                  class="form-control"
                  placeholder=""
                  maxlength="255"
                  disabled
                />
                <imask-input
                  v-else
                  v-model="formData.feeUsdtAmount"
                  :mask="/^([1-9]\d{0,8}|0)(\.\d{0,5})?$/"
                  @change="changeFeeUsdtAmount"
                  class="form-control"
                />
                <Field
                  name="feeUsdtAmount"
                  as="input"
                  v-model="formData.feeUsdtAmount"
                  class="d-none"
                />
                <ErrorMessage name="feeUsdtAmount" class="text-danger" />
              </div>
            </div>
            <div
              class="row mb-4"
              v-if="
                (formData.feeMode === 'USDT' ||
                  formData.feeMode === 'GLOBAL_USDT') &&
                !isCastle
              "
            >
              <div class="col-4 d-flex align-items-center">
                {{ $t('walletGeneral.feeUsdCastle') }}
              </div>
              <div class="col-6">
                <input
                  v-if="formData.feeMode === 'GLOBAL_USDT'"
                  v-model="globalUsdtCastleAmountMutation"
                  type="text"
                  class="form-control"
                  placeholder=""
                  maxlength="255"
                  disabled
                />
                <imask-input
                  v-else
                  v-model="formData.feeUsdtCastleAmount"
                  :mask="/^([1-9]\d{0,8}|0)(\.\d{0,5})?$/"
                  @change="changeFeeUsdtCastleAmount"
                  class="form-control"
                />
                <Field
                  name="feeUsdtCastleAmount"
                  as="input"
                  v-model="formData.feeUsdtCastleAmount"
                  class="d-none"
                />
                <ErrorMessage name="feeUsdtCastleAmount" class="text-danger" />
              </div>
            </div>

            <div
              v-for="(feeSetting, i) in formData.feeSettings"
              :key="i"
              class="mt-8"
            >
              <div>
                {{
                  feeSetting.network
                    ? feeSetting.network.toUpperCase()
                    : feeSetting.network
                }}
                {{ $t('walletGeneral.network') }}
              </div>
              <div class="border border-2 rounded p-4 mb-4">
                <div class="row mb-4">
                  <div class="col-4 d-flex align-items-center">
                    {{ $t('walletGeneral.feeType') }}
                  </div>
                  <div class="col-6 pe-0">
                    <el-select
                      v-model="feeSetting.fees.regular.feeType"
                      @change="changeFeeType"
                    >
                      <el-option
                        v-for="option in getFeeTypeOptions(feeSetting.network)"
                        :value="option.value"
                        :key="`${option.value}_${i}`"
                        :label="option.label"
                        :disabled="option.disable"
                      />
                    </el-select>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-4 d-flex align-items-center">
                    {{ $t('walletGeneral.feeAmount') }}
                    <span v-if="feeSetting.fees.regular.feeType">
                      ({{
                        getFeeByType(
                          feeSetting.fees.regular.feeType,
                          feeSetting.network,
                        )
                      }})</span
                    >
                  </div>
                  <div class="col-6 pe-0">
                    <input
                      v-if="formData.feeMode === 'GLOBAL_USDT'"
                      v-model="feeSetting.fees.regular.feeAmountBaseUsdt"
                      type="text"
                      class="form-control"
                      placeholder=""
                      maxlength="255"
                      disabled
                    />
                    <input
                      v-else-if="formData.feeMode === 'USDT'"
                      v-model="feeSetting.fees.regular.feeAmountBaseUsdt"
                      type="text"
                      class="form-control"
                      placeholder=""
                      maxlength="255"
                      disabled
                    />
                    <!-- <input
                      v-else
                      v-model="feeSetting.fees.regular.feeAmount"
                      type="text"
                      class="form-control"
                      placeholder=""
                      maxlength="255"
                    /> -->
                    <imask-input
                      v-else
                      v-model="feeSetting.fees.regular.feeAmount"
                      :mask="/^([1-9]\d{0,8}|0)(\.\d{0,8})?$/"
                      class="form-control"
                    />
                    <Field
                      v-if="formData.feeMode === 'GLOBAL_USDT'"
                      name="feeAmount"
                      as="input"
                      v-model="feeSetting.fees.regular.feeAmountBaseUsdt"
                      class="d-none"
                    >
                    </Field>
                    <Field
                      v-else-if="formData.feeMode === 'USDT'"
                      name="feeAmount"
                      as="input"
                      v-model="feeSetting.fees.regular.feeAmountBaseUsdt"
                      class="d-none"
                    >
                    </Field>
                    <Field
                      v-else
                      name="feeAmount"
                      as="input"
                      v-model="feeSetting.fees.regular.feeAmount"
                      class="d-none"
                    >
                    </Field>
                    <ErrorMessage name="feeAmount" class="text-danger" />
                  </div>
                </div>

                <div
                  class="row"
                  :class="{ 'mb-4': feeSetting.fees.castle.isActive }"
                >
                  <div class="col-4 d-flex align-items-center">
                    {{ $t('walletGeneral.castleFeeSetting') }}
                  </div>
                  <div class="col-6">
                    <el-radio-group
                      v-model="feeSetting.fees.castle.isActive"
                      class="ml-4"
                    >
                      <el-radio
                        :label="true"
                        :disabled="formData.coin === 'castle'"
                        size="large"
                        >{{ $t('yes') }}</el-radio
                      >
                      <el-radio :label="false" size="large">{{
                        $t('no')
                      }}</el-radio>
                    </el-radio-group>
                  </div>
                </div>

                <div v-if="feeSetting.fees.castle.isActive" class="row">
                  <div class="col-4 d-flex align-items-center">
                    {{ $t('walletGeneral.feeCastle') }}
                  </div>
                  <div class="col-6 pe-0">
                    <input
                      v-if="formData.feeMode === 'GLOBAL_USDT'"
                      v-model="feeSetting.fees.castle.feeAmountBaseUsdt"
                      type="text"
                      class="form-control"
                      placeholder=""
                      maxlength="255"
                      disabled
                    />
                    <input
                      v-else-if="formData.feeMode === 'USDT'"
                      v-model="feeSetting.fees.castle.feeAmountBaseUsdt"
                      type="text"
                      class="form-control"
                      placeholder=""
                      maxlength="255"
                      disabled
                    />
                    <!-- <input
                      v-else
                      v-model="feeSetting.fees.castle.feeAmount"
                      type="text"
                      class="form-control"
                      placeholder=""
                      maxlength="255"
                    /> -->
                    <imask-input
                      v-else
                      v-model="feeSetting.fees.castle.feeAmount"
                      :mask="/^([1-9]\d{0,8}|0)(\.\d{0,8})?$/"
                      class="form-control"
                    />
                    <Field
                      v-if="formData.feeMode === 'GLOBAL_USDT'"
                      name="feeCastleAmount"
                      as="input"
                      v-model="feeSetting.fees.castle.feeAmountBaseUsdt"
                      class="d-none"
                    >
                    </Field>
                    <Field
                      v-else-if="formData.feeMode === 'USDT'"
                      name="feeCastleAmount"
                      as="input"
                      v-model="feeSetting.fees.castle.feeAmountBaseUsdt"
                      class="d-none"
                    >
                    </Field>
                    <Field
                      v-else
                      name="feeCastleAmount"
                      as="input"
                      v-model="feeSetting.fees.castle.feeAmount"
                      class="d-none"
                    >
                    </Field>
                    <ErrorMessage name="feeCastleAmount" class="text-danger" />
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex w-100 justify-content-center mt-8">
              <el-button
                type="success"
                class="btn btn-success me-4"
                @click="onSave"
                :disabled="loading || !isValidForm"
                :loading="loading"
              >
                {{ $t('save') }}
              </el-button>
              <el-button type="" @click="close" text bg :disabled="loading">
                {{ $t('cancel') }}
              </el-button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ElMessageBox } from 'element-plus'
import {
  GlobalWithdrawalSettingModel,
  EWithdrawalFeeType,
  EWithdrawalFeeMode,
  ESpecialCoin,
  EGlobalUsdtType,
} from '@/models/setting-withdrawal/GlobalWithdrawal'
import { toRaw } from 'vue'
import { SettingWithdrawalService } from '@/services/SettingWithdrawalService'
import { Form, Field, ErrorMessage } from 'vee-validate'
import * as Yup from 'yup'
import BigNumber from 'bignumber.js'
// import CurrencyInput from '@/views/currency/components/CurrencyInput.vue'
import { IMaskComponent } from 'vue-imask'
import CONFIG from '@/config'

const CustomBN = BigNumber.clone({ DECIMAL_PLACES: 8 })
CustomBN.config({
  EXPONENTIAL_AT: [-256, 256],
})

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
    'imask-input': IMaskComponent,
  },
  props: {
    item: {
      type: GlobalWithdrawalSettingModel,
      default: () => {
        return {}
      },
    },
    pairPrices: {
      default: () => {
        return {}
      },
    },
    globalUsdtAmount: {
      type: String,
      default: () => {
        return '0'
      },
    },
    globalUsdtCastleAmount: {
      type: String,
      default: () => {
        return '0'
      },
    },
  },
  computed: {
    isEdit() {
      return this.$route.query.isEdit == 'true'
    },
  },
  data() {
    return {
      formData: {
        coin: '',
        withdrawalEnable: false,
        minimumWithdrawal: '',
        maximumWithdrawal: '',
        maximumResetTime: '',
        feeMode: '',
        feeUsdtAmount: '',
        feeUsdtCastleAmount: '',
        feeSettings: [],
      },
      amountPrecisionOptions: CONFIG.EX_AMOUNT_PRECISION_LIST,
      loading: false,
      isValid: true,
      isValidForm: true,
      isCastle: false,
      feeTypeOptions: [
        {
          value: EWithdrawalFeeType.ORIGINAL,
        },
        {
          value: EWithdrawalFeeType.NATIVE,
        },
      ],
      globalUsdtAmountMutation: '0',
      globalUsdtCastleAmountMutation: '0',
      validateSchema: Yup.object().shape({
        maximumWithdrawal: Yup.number()
          .min(
            Yup.ref('minimumWithdrawal'),
            this.$t('walletGeneral.minimumWithdrawalMaxLimit'),
          )
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        minimumWithdrawal: Yup.number()
          .lessThan(
            Yup.ref('autoWithdrawalThreshold'),
            this.$t('walletGeneral.minimumWithdrawalMax'),
          )
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        maximumResetTime: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        autoWithdrawalThreshold: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        feeUsdtAmount: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        feeUsdtCastleAmount: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        feeAmount: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        feeCastleAmount: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
        decimalOfFee: Yup.number()
          .min(0, this.$t('walletGeneral.validateMin', { min: 0 }))
          .typeError(this.$t('VALIDATION.IS_NUMBER')),
      }),
    }
  },
  mounted() {
    this.formData = {
      coin: this.item.coin,
      withdrawalEnable: this.item.withdrawalEnable,
      minimumWithdrawal: this.item.minimumWithdrawal,
      maximumWithdrawal: this.item.maximumWithdrawal,
      maximumResetTime: this.item.maximumResetTime,
      feeMode: this.item.feeMode,
      feeUsdtAmount: this.item.feeUsdtAmount,
      feeUsdtCastleAmount: this.item.feeUsdtCastleAmount,
      feeSettings: JSON.parse(JSON.stringify(this.item.feeSettings)),
      autoWithdrawalThreshold: this.item.autoWithdrawalThreshold,
      decimalOfFee: this.item.decimalOfFee,
    }

    this.globalUsdtAmountMutation = this.globalUsdtAmount
    this.globalUsdtCastleAmountMutation = this.globalUsdtCastleAmount

    this.isCastle = this.item.coin === ESpecialCoin.CASTLE
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async checkValidForm() {
      const editForm = this.$refs.editWithdrawalSetting
      const validResult = await editForm.validate()

      if (validResult.valid) {
        this.isValidForm = true
      } else {
        this.isValidForm = false
      }
    },
    async onSave() {
      await this.checkValidForm()

      if (!this.isValidForm) {
        return false
      }

      ElMessageBox.confirm(this.$t('walletGeneral.areYouSureToUpdate'), {
        confirmButtonText: this.$t('submit'),
        cancelButtonText: this.$t('cancel'),
      }).then(() => {
        this.loading = true
        SettingWithdrawalService.updateGlobalWithdrawalSettings({
          ...toRaw(this.formData),
          feeSettings: toRaw(this.formData.feeSettings),
        })
          .then((res) => {
            if (res) {
              this.loading = false
              this.$toastr.success(
                this.$t('menu.walletSettingSub.updateSettingSuccess'),
              )
              this.$emit('close', { success: true })
            }
          })
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .catch((err) => {
            console.log(`[error] > :`, err)
            this.loading = false
            this.$toastr.error(
              this.$t('menu.walletSettingSub.updateSettingFailed'),
            )
          })
      })
    },
    onSwitch() {
      this.formData.withdrawalEnable = !this.formData.withdrawalEnable
    },
    getFeeTypeOptions(network) {
      const transformedOptions = []

      this.feeTypeOptions.forEach((option) => {
        switch (option.value) {
          case EWithdrawalFeeType.ORIGINAL:
            return transformedOptions.push({
              value: option.value,
              label: this.item.coin.toUpperCase(),
              disable: false,
            })
          case EWithdrawalFeeType.NATIVE:
            if (network === 'erc20') {
              return transformedOptions.push({
                value: option.value,
                label: 'ETH',
                disable: false,
              })
            }

            if (network === 'bep20') {
              return transformedOptions.push({
                value: option.value,
                label: 'BNB',
                disable: true,
              })
            }

            return
          default:
            return
        }
      })

      return transformedOptions
    },
    getFeeByType(type, network) {
      switch (type) {
        case EWithdrawalFeeType.ORIGINAL:
          return this.item.coin.toUpperCase()
        case EWithdrawalFeeType.NATIVE:
          if (network === 'erc20') {
            return 'ETH'
          }

          if (network === 'bep20') {
            return 'BNB'
          }

          return ''
        default:
          return ''
      }
    },
    changeDecimalOfFee() {
      this.changeFeeMode()
    },
    changeFeeMode() {
      switch (this.formData.feeMode) {
        case 'USDT':
          this.changeValueBaseOnFeeMode(
            this.formData.feeUsdtAmount,
            EGlobalUsdtType.USDT,
          )
          this.changeValueBaseOnFeeMode(
            this.formData.feeUsdtCastleAmount,
            EGlobalUsdtType.USDT_CASTLE,
          )
          break
        case 'GLOBAL_USDT':
          this.changeValueBaseOnFeeMode(
            this.globalUsdtAmount,
            EGlobalUsdtType.USDT,
          )
          this.changeValueBaseOnFeeMode(
            this.globalUsdtCastleAmount,
            EGlobalUsdtType.USDT_CASTLE,
          )
          break
        default:
      }
    },
    changeValueBaseOnFeeMode(usdtFee, type) {
      this.formData.feeSettings.forEach((feeSettingItem) => {
        if (!feeSettingItem['fees']) {
          return
        }

        const { regular, castle } = feeSettingItem['fees']

        let coin = this.formData.coin

        switch (type) {
          case EGlobalUsdtType.USDT:
            if (!regular) {
              return
            }

            /**
             * * Only support for eth
             */
            if (regular['feeType'] === EWithdrawalFeeType.NATIVE) {
              coin = 'eth'
            }

            regular.feeAmountBaseUsdt = this.getFeeAmountBaseUsdt(
              usdtFee,
              coin,
              this.formData.decimalOfFee,
            )
            break
          case EGlobalUsdtType.USDT_CASTLE:
            if (!castle || this.isCastle) {
              return
            }

            castle.feeAmountBaseUsdt = this.getFeeAmountBaseUsdt(
              usdtFee,
              'castle',
            )
            break
        }

        return

        // if (regular) {
        //   let coin = this.formData.coin

        //   /**
        //    * * Only support for eth
        //    */
        //   if (regular['feeType'] === EWithdrawalFeeType.NATIVE) {
        //     coin = 'eth'
        //   }

        //   regular.feeAmountBaseUsdt = this.getFeeAmountBaseUsdt(usdtFee, coin)
        // }

        // if (castle) {
        //   castle.feeAmountBaseUsdt = this.getFeeAmountBaseUsdt(
        //     usdtFee,
        //     'castle',
        //   )
        // }
      })
      return
    },
    getFeeAmountBaseUsdt(usdtFee, coin, decimalOfFee) {
      const pairPriceData = this.pairPrices[coin]

      if (!pairPriceData) {
        return 0
      }

      let decimalPlace = pairPriceData.decimalPlace

      if (decimalOfFee) {
        decimalPlace = new BigNumber(decimalOfFee).dp()
      }

      const convertValue = +pairPriceData.price
        ? new CustomBN(+usdtFee || 0)
            .dividedBy(pairPriceData.price)
            .dp(decimalPlace, BigNumber.ROUND_HALF_EVEN)
            .toString()
        : '0'

      return convertValue
    },
    changeFeeUsdtAmount() {
      this.changeValueBaseOnFeeMode(
        this.formData.feeUsdtAmount,
        EGlobalUsdtType.USDT,
      )
    },
    changeFeeUsdtCastleAmount() {
      this.changeValueBaseOnFeeMode(
        this.formData.feeUsdtCastleAmount,
        EGlobalUsdtType.USDT_CASTLE,
      )
    },
    changeFeeType() {
      const feeMode = this.formData.feeMode

      switch (feeMode) {
        case EWithdrawalFeeMode.USDT:
          this.changeValueBaseOnFeeMode(
            this.formData.feeUsdtAmount,
            EGlobalUsdtType.USDT,
          )
          this.changeValueBaseOnFeeMode(
            this.formData.feeUsdtCastleAmount,
            EGlobalUsdtType.USDT_CASTLE,
          )
          break
        case EWithdrawalFeeMode.GLOBAL_USDT:
          this.changeValueBaseOnFeeMode(
            this.globalUsdtAmount,
            EGlobalUsdtType.USDT,
          )
          this.changeValueBaseOnFeeMode(
            this.globalUsdtCastleAmount,
            EGlobalUsdtType.USDT_CASTLE,
          )
          break
        default:
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.global-setting {
  display: block;
  background-color: #00000080;

  .modal-content {
    max-height: 70vh;
    overflow: auto;

    .modal-body {
      max-height: 70vh;
      overflow: auto;
    }
  }
}
.p-0 {
  padding: 0;
}
</style>
