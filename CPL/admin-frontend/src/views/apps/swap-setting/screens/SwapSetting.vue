<template>
  <div class="card">
    <div class="card-body">
      <Form
        ref="swapSettingForm"
        :validation-schema="schema"
        @submit.prevent="onSubmit"
      >
        <div class="row align-items-center">
          <el-button-group>
            <el-button
              class="btn btn-light"
              :class="{ 'btn-primary': walletType === WALLET_TYPE.SPOT }"
              @click="walletType = WALLET_TYPE.SPOT"
              >{{ $t('swapSettingScreen.spotWallet') }}</el-button
            >
            <el-button
              class="btn btn-light"
              :class="{ 'btn-primary': walletType === WALLET_TYPE.REWARD }"
              @click="walletType = WALLET_TYPE.REWARD"
              >{{ $t('swapSettingScreen.rewardWallet') }}</el-button
            >
          </el-button-group>
        </div>

        <div class="row">
          <div class="col-6">
            <button
              type="button"
              class="btn btn-primary mt-5"
              @click="openPairsModal"
            >
              {{ $t('swapSettingScreen.addPair') }}
            </button>

            <div
              class="row mt-5 align-items-center"
              v-if="Object.keys(groupPairsChecked).length === 0"
            >
              <div class="col-12 mt-20 d-flex justify-content-center">
                <span> {{ $t('noData') }}</span>
              </div>
            </div>
            <div v-else class="pick-pair d-flex mt-5">
              <ul
                v-for="(pairs, currency) of groupPairsChecked"
                :key="currency"
                class="list-group col-sm-3"
              >
                <li class="list-group-item text-uppercase bg-light rounded-0">
                  <div class="d-flex">
                    <span class="ms-2">{{ currency }}</span>
                  </div>
                </li>

                <li
                  v-for="pair of groupPairsChecked[`${currency}`]"
                  :key="pair"
                  class="list-group-item text-uppercase rounded-0"
                >
                  <div class="d-flex">
                    <span class="ms-2">{{ pair }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div class="col-6">
            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">
                  {{ $t('swapSettingScreen.settingType') }}
                </span>
              </div>
              <div class="col-8">
                <Field
                  name="setting_type"
                  as="select"
                  v-model="settingType"
                  class="form-select"
                  rules="required"
                >
                  <option
                    v-for="type in settingTypes"
                    :value="type"
                    :key="type"
                  >
                    {{ type }}
                  </option>
                </Field>
                <ErrorMessage name="setting_type" class="text-danger" />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">
                  {{ $t('swapSettingScreen.minimumAmount') }}
                </span>
              </div>
              <div class="col-8 input-unit">
                <currency-input
                  name="minimum_amount"
                  v-model.lazy="setting.minimum_amount"
                />
                <Field
                  hidden
                  name="minimum_amount"
                  as="input"
                  class="form-control"
                  v-model="setting.minimum_amount"
                />

                <span class="unit">USDT</span>
                <ErrorMessage name="minimum_amount" class="text-danger" />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">
                  {{ $t('swapSettingScreen.maximumAmount') }}
                </span>
              </div>
              <div class="col-8 input-unit">
                <currency-input
                  name="maximum_amount"
                  v-model.lazy="setting.maximum_amount"
                />
                <Field
                  hidden
                  name="maximum_amount"
                  as="input"
                  class="form-control"
                  v-model="setting.maximum_amount"
                />

                <span class="unit">USDT</span>
                <ErrorMessage name="maximum_amount" class="text-danger" />
              </div>
            </div>

            <div
              class="row mt-5 align-items-center"
              v-if="
                walletType === WALLET_TYPE.REWARD ||
                (walletType === WALLET_TYPE.SPOT &&
                  settingType === SETTING_TYPE.CASTLE)
              "
            >
              <div class="col-4">
                <span class="fw-bolder">
                  {{ $t('swapSettingScreen.maximumAmountPerDay') }}
                </span>
              </div>
              <div class="col-8 input-unit">
                <currency-input
                  name="maximum_amount_per_day"
                  v-model.lazy="setting.maximum_amount_per_day"
                />
                <Field
                  hidden
                  name="maximum_amount_per_day"
                  as="input"
                  class="form-control"
                  v-model="setting.maximum_amount_per_day"
                />

                <span class="unit">USDT</span>
                <ErrorMessage
                  name="maximum_amount_per_day"
                  class="text-danger"
                />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">{{ $t('swapSettingScreen.fee') }}</span>
              </div>
              <div class="col-8 input-unit">
                <currency-input
                  name="fee_value"
                  v-model.lazy="setting.fee_value"
                />
                <Field
                  hidden
                  name="fee_value"
                  as="input"
                  class="form-control"
                  v-model="setting.fee_value"
                />

                <span class="unit">%</span>
                <ErrorMessage name="fee_value" class="text-danger" />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <span class="text-muted">
                {{ $t('swapSettingScreen.feeWarning') }}
              </span>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-4">
                <span class="fw-bolder">{{
                  $t('swapSettingScreen.minMaxFee')
                }}</span>
              </div>
              <div class="col-4">
                <label class="fw-bolder">{{ $t('from') }}</label>
                <div class="input-unit mt-2">
                  <currency-input
                    name="minimum_fee_value"
                    v-model.lazy="setting.minimum_fee_value"
                  />
                  <Field
                    hidden
                    name="minimum_fee_value"
                    as="input"
                    class="form-control"
                    v-model="setting.minimum_fee_value"
                  />

                  <span class="unit">USDT</span>
                  <ErrorMessage name="minimum_fee_value" class="text-danger" />
                </div>
              </div>
              <div class="col-4">
                <label class="fw-bolder">{{ $t('to') }}</label>
                <div class="input-unit mt-2">
                  <currency-input
                    name="maximum_fee_value"
                    v-model.lazy="setting.maximum_fee_value"
                  />
                  <Field
                    hidden
                    name="maximum_fee_value"
                    as="input"
                    class="form-control"
                    v-model="setting.maximum_fee_value"
                  />

                  <span class="unit">USDT</span>
                  <ErrorMessage name="maximum_fee_value" class="text-danger" />
                </div>
              </div>
            </div>

            <div class="mt-10 d-flex justify-content-end">
              <button
                class="btn btn-primary me-5"
                @click.prevent="onClear"
                :disabled="onSubmitting"
              >
                {{ $t('swapSettingScreen.clearBtn') }}
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
        </div>
      </Form>
      <pairs ref="pairsRef" @updateCheckedPairs="updateCheckedPairs" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CurrencyInput from '@/views/currency/components/CurrencyInput.vue'
import Pairs from '@/views/apps/swap-setting/components/Pairs.vue'
import {
  WALLET_TYPE,
  SETTING_TYPE,
  SWAP_COMMON,
  SWAP_MODULE_TYPE,
  CURRENCY,
  SETTING_STATUS,
} from '@/views/apps/swap-setting/definition/swap-setting.enum'
import { getEnumValues } from '@/core/helpers/common.helper'
import { sortPairFn } from '@/core/helpers/util'
import * as yup from 'yup'
import { SwapSettingService } from '@/views/apps/swap-setting/services/SwapSettingService'
import { difference } from 'lodash'
import Swal from 'sweetalert2'
import {
  GroupPairs,
  SettingByModule,
} from '@/views/apps/swap-setting/definition/swap-setting.dto'
import { Mutations } from '@/store/enums/StoreEnums'

const swapSettingDefault = {
  minimum_amount: '',
  maximum_amount: '',
  fee_value: '',
  minimum_fee_value: '',
  maximum_fee_value: '',
  maximum_amount_per_day: '',
}

const MAIN_GROUP_CURRENCY = ['usdt', 'btc', 'castle', 'eth']
const OTHER_GROUP = 'other'
const FROM_CASTLE = 'from_castle'

export default defineComponent({
  name: 'SwapSetting',
  components: {
    Form,
    Field,
    ErrorMessage,
    CurrencyInput,
    Pairs,
  },
  data: () => ({
    WALLET_TYPE,
    SETTING_TYPE,
    walletType: WALLET_TYPE.SPOT,
    settingType: SETTING_TYPE.COMMON,
    setting: {
      minimum_amount: swapSettingDefault.minimum_amount,
      maximum_amount: swapSettingDefault.maximum_amount,
      fee_value: swapSettingDefault.fee_value,
      minimum_fee_value: swapSettingDefault.minimum_fee_value,
      maximum_fee_value: swapSettingDefault.maximum_fee_value,
      maximum_amount_per_day: swapSettingDefault.maximum_amount_per_day,
    },
    allPairs: [] as string[],
    groupPairs: {} as GroupPairs,
    settingByModule: {} as SettingByModule,
    checkedPairs: [] as string[],
    onSubmitting: false,
  }),
  created() {
    this.getAllPairs()
  },
  mounted() {
    setCurrentPageBreadcrumbs('swapSettingScreen.title', [])
  },
  computed: {
    settingTypes() {
      if (this.walletType === WALLET_TYPE.SPOT) {
        return getEnumValues(SETTING_TYPE)
      } else if (this.walletType === WALLET_TYPE.REWARD) {
        return [SETTING_TYPE.COMMON]
      }
      return []
    },
    groupPairsChecked() {
      const checkedGroupPairs = {}
      const sortGroupPairs: Array<{ coin: string; currency: string }> = []
      for (const pair of this.checkedPairs) {
        const pairSplit = this.getCoinCurrencyFromPair(pair)
        if (pairSplit) {
          sortGroupPairs.push(pairSplit)
        }
      }
      sortGroupPairs
        .sort((a, b) => {
          const pair1 = [a.coin, a.currency]
          const pair2 = [b.coin, b.currency]
          return sortPairFn(pair1, pair2) as any
        })
        .map((pair) => {
          if (
            pair.coin === CURRENCY.CASTLE &&
            this.settingType === SETTING_TYPE.CASTLE
          ) {
            checkedGroupPairs[FROM_CASTLE] =
              checkedGroupPairs[FROM_CASTLE] || []
            checkedGroupPairs[FROM_CASTLE].push(`${pair.coin}/${pair.currency}`)
          } else if (MAIN_GROUP_CURRENCY.includes(pair.currency)) {
            checkedGroupPairs[pair.currency] =
              checkedGroupPairs[pair.currency] || []
            checkedGroupPairs[pair.currency].push(
              `${pair.coin}/${pair.currency}`,
            )
          } else {
            checkedGroupPairs[OTHER_GROUP] =
              checkedGroupPairs[OTHER_GROUP] || []
            checkedGroupPairs[OTHER_GROUP].push(`${pair.coin}/${pair.currency}`)
          }
        })

      return this.groupPairsSort(checkedGroupPairs)
    },
    schema() {
      const schemaObject = {
        minimum_amount: yup
          .number()
          .required(
            this.$t('swapSettingScreen.validateSchema.minimum_amount.required'),
          )
          .typeError(
            this.$t('swapSettingScreen.validateSchema.minimum_amount.required'),
          )
          .min(
            0.00001,
            this.$t('swapSettingScreen.validateSchema.minimum_amount.min'),
          ),
        maximum_amount: yup
          .number()
          .required(
            this.$t('swapSettingScreen.validateSchema.maximum_amount.required'),
          )
          .typeError(
            this.$t('swapSettingScreen.validateSchema.maximum_amount.required'),
          )
          .min(
            0.00001,
            this.$t('swapSettingScreen.validateSchema.maximum_amount.min_0'),
          ),
        fee_value: yup
          .number()
          .required(
            this.$t('swapSettingScreen.validateSchema.fee_value.required'),
          )
          .typeError(
            this.$t('swapSettingScreen.validateSchema.fee_value.required'),
          )
          .min(
            0.00001,
            this.$t('swapSettingScreen.validateSchema.fee_value.min'),
          )
          .max(100, this.$t('swapSettingScreen.validateSchema.fee_value.max')),
      }
      if (
        this.walletType === WALLET_TYPE.REWARD ||
        (this.walletType === WALLET_TYPE.SPOT &&
          this.settingType === SETTING_TYPE.CASTLE)
      ) {
        if (this.setting.maximum_amount) {
          schemaObject['maximum_amount_per_day'] = yup
            .number()
            .required(
              this.$t(
                'swapSettingScreen.validateSchema.maximum_amount_per_day.required',
              ),
            )
            .typeError(
              this.$t(
                'swapSettingScreen.validateSchema.maximum_amount_per_day.required',
              ),
            )
            .min(
              yup.ref('maximum_amount'),
              this.$t(
                'swapSettingScreen.validateSchema.maximum_amount_per_day.min',
              ),
            )
        } else {
          schemaObject['maximum_amount_per_day'] = yup
            .number()
            .required(
              this.$t(
                'swapSettingScreen.validateSchema.maximum_amount_per_day.required',
              ),
            )
            .typeError(
              this.$t(
                'swapSettingScreen.validateSchema.maximum_amount_per_day.required',
              ),
            )
            .min(
              0.00001,
              this.$t(
                'swapSettingScreen.validateSchema.maximum_amount_per_day.min_0',
              ),
            )
        }
      }

      if (this.setting.minimum_fee_value) {
        ;(schemaObject['minimum_fee_value'] = yup
          .number()
          .typeError(
            this.$t(
              'swapSettingScreen.validateSchema.minimum_fee_value.number',
            ),
          )
          .min(
            0.00001,
            this.$t('swapSettingScreen.validateSchema.minimum_fee_value.min'),
          )),
          (schemaObject['minimum_amount'] = yup
            .number()
            .required(
              this.$t(
                'swapSettingScreen.validateSchema.minimum_amount.required',
              ),
            )
            .typeError(
              this.$t(
                'swapSettingScreen.validateSchema.minimum_amount.required',
              ),
            )
            .min(
              Number(this.setting.minimum_fee_value) * 4,
              this.$t(
                'swapSettingScreen.validateSchema.minimum_amount.min_fee',
              ),
            ))
      }

      if (this.setting.maximum_fee_value) {
        schemaObject['maximum_fee_value'] = yup
          .number()
          .typeError(
            this.$t(
              'swapSettingScreen.validateSchema.maximum_fee_value.number',
            ),
          )
          .min(
            0.00001,
            this.$t('swapSettingScreen.validateSchema.maximum_fee_value.min'),
          )
      }

      if (this.setting.minimum_amount) {
        schemaObject['maximum_amount'] = yup
          .number()
          .required(
            this.$t('swapSettingScreen.validateSchema.maximum_amount.required'),
          )
          .typeError(
            this.$t('swapSettingScreen.validateSchema.maximum_amount.required'),
          )
          .min(
            yup.ref('minimum_amount'),
            this.$t('swapSettingScreen.validateSchema.maximum_amount.min'),
          )
      }

      return yup.object(schemaObject)
    },
  },
  methods: {
    async getAllPairs() {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const data: Array<{ coin: string; currency: string }> = []
      await this.getAllSettingFromServer()
      if (Object.keys(this.settingByModule).length > 0) {
        for (const module in this.settingByModule) {
          for (const pair in this.settingByModule[module]['pairs']) {
            const pairSplit = this.getCoinCurrencyFromPair(pair)
            if (pairSplit) {
              data.push(pairSplit)
            }
          }
        }
      }

      const pairsFromExchange = await SwapSettingService.getPairs()
      data.push(...pairsFromExchange)

      const groupPairs = {}
      const allPairs: string[] = []
      const regexPair = new RegExp('^([a-zA-Z0-9]+)/([a-zA-Z0-9]+)$')
      if (data.length > 0) {
        data
          .sort((a, b) => {
            const pair1 = [a.coin, a.currency]
            const pair2 = [b.coin, b.currency]
            return sortPairFn(pair1, pair2) as any
          })
          .filter((pair) => {
            return regexPair.test(`${pair.coin}/${pair.currency}`)
          })
          .map((pair) => {
            if (!(`${pair.coin}/${pair.currency}` in allPairs)) {
              if (pair.coin === CURRENCY.CASTLE) {
                groupPairs[FROM_CASTLE] = groupPairs[FROM_CASTLE] || []
                groupPairs[FROM_CASTLE].push(`${pair.coin}/${pair.currency}`)
                if (pair.currency === CURRENCY.USDT) {
                  groupPairs[pair.currency] = groupPairs[pair.currency] || []
                  groupPairs[pair.currency].push(
                    `${pair.coin}/${pair.currency}`,
                  )
                }
              } else if (MAIN_GROUP_CURRENCY.includes(pair.currency)) {
                groupPairs[pair.currency] = groupPairs[pair.currency] || []
                groupPairs[pair.currency].push(`${pair.coin}/${pair.currency}`)
              } else {
                groupPairs[OTHER_GROUP] = groupPairs[OTHER_GROUP] || []
                groupPairs[OTHER_GROUP].push(`${pair.coin}/${pair.currency}`)
              }
            }
            allPairs[`${pair.coin}/${pair.currency}`] = {
              ...pair,
              pair: `${pair.coin}/${pair.currency}`,
            }
          })
        this.allPairs = allPairs
        this.groupPairs = groupPairs
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },
    getAllowedGroupPairs() {
      const groupPairs = JSON.parse(JSON.stringify(this.groupPairs))

      if (this.walletType === WALLET_TYPE.REWARD) {
        return {
          [CURRENCY.USDT]: groupPairs[CURRENCY.USDT],
        }
      } else if (this.settingType === SETTING_TYPE.COMMON) {
        delete groupPairs?.[CURRENCY.CASTLE]
        delete groupPairs?.[FROM_CASTLE]
        // delete castle/usdt in groupPairs
        if (
          groupPairs[CURRENCY.USDT] &&
          groupPairs[CURRENCY.USDT].includes(
            `${CURRENCY.CASTLE}/${CURRENCY.USDT}`,
          )
        ) {
          this.removeElement(
            groupPairs[CURRENCY.USDT],
            `${CURRENCY.CASTLE}/${CURRENCY.USDT}`,
          )
        }
      } else if (this.settingType === SETTING_TYPE.CASTLE) {
        const allowedGroupData = {}
        if (CURRENCY.CASTLE in groupPairs) {
          allowedGroupData[CURRENCY.CASTLE] = groupPairs[CURRENCY.CASTLE]
        }

        if (FROM_CASTLE in groupPairs) {
          allowedGroupData[FROM_CASTLE] = groupPairs[FROM_CASTLE]
        }
        return allowedGroupData
      }
      return groupPairs
    },
    async getAllSettingFromServer() {
      await this.getSettingByModule(SWAP_MODULE_TYPE.SWAP_SPOT_COMMON)
      await this.getSettingByModule(SWAP_MODULE_TYPE.SWAP_SPOT_CASTLE)
      await this.getSettingByModule(SWAP_MODULE_TYPE.SWAP_REWARD_COMMON)
      await this.setCurrentSetting()
    },
    async getSettingByModule(module) {
      const settings = await SwapSettingService.getSwapSettingByModule({
        search_field: 'module',
        search_text: module,
        limit: 10000,
        size: 10000,
      })

      const pairs = []
      let swapCommon = {}
      if ('data' in settings) {
        settings.data.map((setting) => {
          if (setting.code === SWAP_COMMON) {
            swapCommon = {
              ...setting,
              value: JSON.parse(setting['value']),
            }
          } else {
            pairs[setting.code] = setting
          }
        })
      }
      const settingByModule = { ...this.settingByModule }
      settingByModule[module] = {
        pairs,
        swapCommon,
      }
      this.settingByModule = settingByModule
      return {
        pairs,
        swapCommon,
      }
    },
    setCurrentSetting() {
      ;(this.setting = { ...swapSettingDefault }), (this.checkedPairs = [])
      const currentModule = this.getCurrentModule()
      if (
        currentModule in this.settingByModule &&
        'value' in this.settingByModule[currentModule]['swapCommon']
      ) {
        this.setting =
          this.settingByModule[currentModule]['swapCommon']['value']
        this.checkedPairs = Object.keys(
          this.settingByModule[currentModule]['pairs'],
        )
      }
    },
    getCurrentModule() {
      let moduleType = ''
      if (this.walletType && this.settingType) {
        if (
          this.walletType === WALLET_TYPE.SPOT &&
          this.settingType === SETTING_TYPE.COMMON
        ) {
          moduleType = SWAP_MODULE_TYPE.SWAP_SPOT_COMMON
        } else if (
          this.walletType === WALLET_TYPE.SPOT &&
          this.settingType === SETTING_TYPE.CASTLE
        ) {
          moduleType = SWAP_MODULE_TYPE.SWAP_SPOT_CASTLE
        } else if (
          this.walletType === WALLET_TYPE.REWARD &&
          this.settingType === SETTING_TYPE.COMMON
        ) {
          moduleType = SWAP_MODULE_TYPE.SWAP_REWARD_COMMON
        }
      }
      return moduleType
    },
    openPairsModal() {
      if (!this.settingType) {
        return this.$toastr.warning(
          this.$t('swapSettingScreen.selectSettingType'),
        )
      }
      const groupPairs = this.getAllowedGroupPairs()
      const pairsRef = this.$refs.pairsRef as any
      pairsRef.beforeOpen(this.groupPairsSort(groupPairs), this.checkedPairs)
    },
    updateCheckedPairs(pairs) {
      this.checkedPairs = [...pairs]
    },
    async onSubmit() {
      const swapSettingForm = this.$refs.swapSettingForm as any
      const form = await swapSettingForm.validate()
      if (!form.valid) {
        return
      }
      this.onSubmitting = true
      const currentModule = this.getCurrentModule()
      let checkedPairsFromServer: string[] = []
      if (currentModule in this.settingByModule) {
        checkedPairsFromServer = Object.keys(
          this.settingByModule[currentModule]['pairs'],
        )
      }

      const settingActions: any[] = []
      const swapCommon = { ...this.setting }
      const swapSettingObject = {
        module: currentModule,
        code: SWAP_COMMON,
        value: JSON.stringify(swapCommon),
        status: SETTING_STATUS.ENABLE,
      }

      if (this.settingByModule?.[currentModule]?.['swapCommon']?.['id']) {
        settingActions.push(
          SwapSettingService.updateSwapSetting(
            this.settingByModule?.[currentModule]?.['swapCommon']?.['id'],
            {
              id: this.settingByModule?.[currentModule]?.['swapCommon']?.['id'],
              ...swapSettingObject,
            },
          ),
        )
      } else {
        settingActions.push(
          SwapSettingService.createSwapSetting(swapSettingObject),
        )
      }

      // create
      for (const pair of difference(
        this.checkedPairs,
        checkedPairsFromServer,
      )) {
        settingActions.push(
          SwapSettingService.createSwapSetting({
            module: currentModule,
            code: pair,
            value: `${SETTING_STATUS.ENABLE}`,
            status: SETTING_STATUS.ENABLE,
          }),
        )
      }

      // delete
      for (const pair of difference(
        checkedPairsFromServer,
        this.checkedPairs,
      )) {
        settingActions.push(
          SwapSettingService.deleteSwapSetting(
            this.settingByModule?.[currentModule]?.['pairs']?.[pair]?.['id'],
          ),
        )
      }

      Promise.all(settingActions)
        .then(() => {
          return this.getAllSettingFromServer()
        })
        .then(() => {
          this.onSubmitting = false
          this.$toastr.success(this.$t('success'))
        })
        .catch(() => {
          this.onSubmitting = false
          this.$toastr.error(this.$t('error'))
        })
    },
    async onClear() {
      const { isConfirmed } = await Swal.fire({
        icon: 'warning',
        text: this.$t('swapSettingScreen.clearPopupTitle'),
        showCancelButton: true,
        confirmButtonText: this.$t('swapSettingScreen.agreeClearBtn'),
        cancelButtonText: this.$t('swapSettingScreen.cancelClearBtn'),
      })

      if (isConfirmed) {
        ;(this.checkedPairs = []), (this.setting = { ...swapSettingDefault })
      }
    },
    groupPairsSort(groupPairs) {
      const sortedKeys = Object.keys(groupPairs).sort()
      const sortedObj = {}
      let hasOtherGroup = false
      let hasFromCastleGroup = false
      for (let key of sortedKeys) {
        if (key === FROM_CASTLE) {
          hasFromCastleGroup = true
          continue
        }
        if (key === OTHER_GROUP) {
          hasOtherGroup = true
          continue
        }
        sortedObj[key] = groupPairs[key]
      }
      if (hasFromCastleGroup) {
        sortedObj[FROM_CASTLE] = groupPairs[FROM_CASTLE]
      }
      if (hasOtherGroup) {
        sortedObj[OTHER_GROUP] = groupPairs[OTHER_GROUP]
      }
      return sortedObj
    },
    getCoinCurrencyFromPair(pair) {
      const regexPair = new RegExp('^([a-zA-Z0-9]+)/([a-zA-Z0-9]+)$')
      if (!regexPair.test(pair)) {
        return null
      }
      const [coin, currency] = pair.split('/')
      return { coin, currency }
    },
    removeElement(arr, elem) {
      var index = arr.indexOf(elem)
      if (index > -1) {
        arr.splice(index, 1)
      }
      return arr
    },
  },
  watch: {
    walletType: function (newType) {
      if (newType === WALLET_TYPE.REWARD) {
        this.settingType = SETTING_TYPE.COMMON
      }
      this.setCurrentSetting()
    },
    settingType: function () {
      this.setCurrentSetting()
    },
  },
})
</script>

<style lang="scss" scoped>
.input-unit {
  position: relative;
  .unit {
    position: absolute;
    right: 1.5rem;
    top: 1rem;
  }
}
</style>
