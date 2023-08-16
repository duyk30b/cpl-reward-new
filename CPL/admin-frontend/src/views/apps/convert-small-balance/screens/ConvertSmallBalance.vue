<template>
  <div class="card">
    <div class="card-body">
      <Form
        ref="convertSmallBalanceForm"
        class="pb-10"
        :validation-schema="schema"
        @submit.prevent="onSubmit"
      >
        <div class="row">
          <div class="col-6 col-xl-4">
            <h5>{{ $t('convertSmallBalanceScreen.pairSetting') }}</h5>

            <div class="table-wrapper">
              <div class="table-responsive">
                <table class="table table-bordered common-table">
                  <thead class="fw-bolder text-muted">
                    <tr>
                      <th class="bg-light">
                        {{ $t('convertSmallBalanceScreen.coin') }}
                      </th>
                      <th class="bg-light">
                        <label
                          class="form-check form-switch form-check-custom form-check-solid"
                        >
                          <input
                            class="form-check-input me-2"
                            type="checkbox"
                            v-model="checkAll"
                          />
                          {{ $t('convertSmallBalanceScreen.status') }}
                        </label>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr
                      v-for="coinItem in coins"
                      :key="`coin-item-${coinItem.coin}`"
                    >
                      <td>
                        <span
                          :title="coinItem.coin.toUpperCase()"
                          v-if="coinItem.coin?.length < 20"
                          >{{ coinItem.coin.toUpperCase() }}</span
                        >

                        <span :title="coinItem.coin.toUpperCase()" v-else
                          >{{
                            coinItem.coin.slice(0, 20).toUpperCase()
                          }}
                          ...</span
                        >
                      </td>
                      <td>
                        <label
                          class="form-check form-switch form-check-custom form-check-solid"
                        >
                          <input
                            class="form-check-input"
                            type="checkbox"
                            v-model="coinsChecked"
                            :value="coinItem.coin"
                          />
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="col-6 col-xl-6 offset-xl-2">
            <h5>{{ $t('convertSmallBalanceScreen.commonSetting') }}</h5>

            <div class="row mt-5 align-items-center">
              <div class="col-6">
                <span class="fw-bolder">
                  {{ $t('convertSmallBalanceScreen.balanceAmount') }} (&le;)
                </span>
              </div>
              <div class="col-6 input-unit">
                <currency-input
                  name="max_balance_amount"
                  v-model.lazy="convertSetting.max_balance_amount"
                />
                <Field
                  hidden
                  name="max_balance_amount"
                  as="input"
                  class="form-control"
                  v-model="convertSetting.max_balance_amount"
                />

                <span class="unit">{{
                  convertSetting.unit.toUpperCase()
                }}</span>
                <ErrorMessage name="max_balance_amount" class="text-danger" />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-6">
                <span class="fw-bolder">{{
                  $t('convertSmallBalanceScreen.maximumConvertPerDay')
                }}</span>
              </div>
              <div class="col-6 input-unit">
                <currency-input
                  name="maximum_convert_amount_per_day"
                  v-model.lazy="convertSetting.maximum_convert_amount_per_day"
                />
                <Field
                  hidden
                  name="maximum_convert_amount_per_day"
                  as="input"
                  class="form-control"
                  v-model="convertSetting.maximum_convert_amount_per_day"
                />

                <span class="unit">{{
                  convertSetting.unit.toUpperCase()
                }}</span>
                <ErrorMessage
                  name="maximum_convert_amount_per_day"
                  class="text-danger"
                />
              </div>
            </div>

            <div class="row mt-5 align-items-center">
              <div class="col-6">
                <span class="fw-bolder">{{
                  $t('convertSmallBalanceScreen.fee')
                }}</span>
              </div>
              <div class="col-6 input-unit">
                <currency-input
                  name="fee_value"
                  v-model.lazy="convertSetting.fee_value"
                />
                <Field
                  hidden
                  name="fee_value"
                  as="input"
                  class="form-control"
                  v-model="convertSetting.fee_value"
                />

                <span class="unit">%</span>
                <ErrorMessage name="fee_value" class="text-danger" />
              </div>
            </div>

            <div class="mt-10 d-flex justify-content-end">
              <button
                class="btn btn-primary me-5"
                @click.prevent="onClear"
                :disabled="onSubmitting"
              >
                {{ $t('convertSmallBalanceScreen.clearBtn') }}
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
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import {
  Coin,
  ConvertSmallBalance,
} from '@/views/apps/convert-small-balance/definition/convert-small-balance.dto'
import { ConvertSmallBalanceService } from '@/views/apps/convert-small-balance/services/ConvertSmallBalanceService'
import {
  SETTING_CONVERT_OPERATOR,
  SETTING_MODULE,
  SETTING_STATUS,
  SETTING_CONVERT_SMALL_COMMON_CODE,
} from '@/views/apps/convert-small-balance/definition/convert-small-balance.enum'
import CurrencyInput from '@/views/currency/components/CurrencyInput.vue'
import * as yup from 'yup'
import Swal from 'sweetalert2'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { difference, intersection } from 'lodash'
import { Mutations } from '@/store/enums/StoreEnums'

const convertSettingDefault = {
  unit: 'usdt',
  max_balance_amount: 10,
  maximum_convert_amount_per_day: 100,
  fee_value: 5,
}

export default defineComponent({
  name: 'ConvertSmallBalanceNew',
  components: {
    Form,
    Field,
    ErrorMessage,
    CurrencyInput,
  },
  data: () => ({
    coins: [] as Coin[], // list coins
    coinsChecked: [] as string[], // list coin enable
    convertSetting: {
      unit: convertSettingDefault.unit,
      max_balance_amount: convertSettingDefault.max_balance_amount,
      maximum_convert_amount_per_day:
        convertSettingDefault.maximum_convert_amount_per_day,
      fee_value: convertSettingDefault.fee_value,
    },
    convertSettingId: '',
    convertSettings: [] as ConvertSmallBalance[], // get from server
    SETTING_CONVERT_OPERATOR,
    onSubmitting: false,
    onFetchingCoin: false,
  }),
  created() {
    this.getCoins()
  },
  mounted() {
    setCurrentPageBreadcrumbs(
      'convertSmallBalanceScreen.convertSmallBalanceList',
      [],
    )
  },
  methods: {
    async getCoins(hasLoading = true) {
      if (hasLoading) {
        this.$store.commit(Mutations.SHOW_API_LOADING, true)
      }
      const data = await ConvertSmallBalanceService.getCoins()
      this.coins = data

      await this.getAllSettings()
      if (hasLoading) {
        this.$store.commit(Mutations.SHOW_API_LOADING, false)
      }
    },

    resetForm() {
      const convertSmallBalanceForm = this.$refs.convertSmallBalanceForm as any
      convertSmallBalanceForm.resetForm()

      this.resetData()
    },

    resetData() {
      ;(this.coinsChecked = []),
        (this.convertSetting.unit = convertSettingDefault.unit),
        (this.convertSetting.max_balance_amount =
          convertSettingDefault.max_balance_amount),
        (this.convertSetting.maximum_convert_amount_per_day =
          convertSettingDefault.maximum_convert_amount_per_day),
        (this.convertSetting.fee_value = convertSettingDefault.fee_value)
    },

    async getAllSettings() {
      const allSettings =
        await ConvertSmallBalanceService.getAllConvertSmallBalance({
          search_field: 'module',
          search_text: SETTING_MODULE.CONVERT_SMALL_BALANCE,
          limit: 10000,
          size: 10000,
        })
      if ('data' in allSettings) {
        const convertSettings = []
        allSettings.data.map((setting) => {
          if (setting.code !== SETTING_CONVERT_SMALL_COMMON_CODE) {
            convertSettings[setting.code] = setting
          }
        })
        this.convertSettings = convertSettings
        if (allSettings.data?.length > 0) {
          const coinsChecked: string[] = []
          for (const setting of allSettings.data) {
            if (setting.status === SETTING_STATUS.ENABLE) {
              coinsChecked.push(setting.code)
            }
            if (setting.code === SETTING_CONVERT_SMALL_COMMON_CODE) {
              const convertSetting = JSON.parse(setting['value'])
              this.convertSetting = convertSetting
              this.convertSettingId = setting['id']
            }
          }
          this.coinsChecked = coinsChecked
        }
      }
    },

    async onSubmit() {
      const convertSmallBalanceForm = this.$refs.convertSmallBalanceForm as any
      const form = await convertSmallBalanceForm.validate()
      if (!form.valid) {
        return
      }
      this.onSubmitting = true

      const settingActions: any[] = []
      const coinsSettingFromServer: string[] = Object.keys(this.convertSettings)
      const coinsFromServer: string[] = this.coins.map((coin) => coin.coin)

      const convertSettingObject = {
        module: SETTING_MODULE.CONVERT_SMALL_BALANCE,
        code: SETTING_CONVERT_SMALL_COMMON_CODE,
        value: JSON.stringify(this.convertSetting),
        status: SETTING_STATUS.ENABLE,
      }

      if (!this.convertSettingId) {
        settingActions.push(
          ConvertSmallBalanceService.createConvertSmallBalance(
            convertSettingObject,
          ),
        )
      } else {
        settingActions.push(
          ConvertSmallBalanceService.updateConvertSmallBalance(
            this.convertSettingId,
            {
              id: this.convertSettingId,
              ...convertSettingObject,
            },
          ),
        )
      }

      // create
      for (const coin of difference(coinsFromServer, coinsSettingFromServer)) {
        settingActions.push(
          ConvertSmallBalanceService.createConvertSmallBalance({
            module: SETTING_MODULE.CONVERT_SMALL_BALANCE,
            code: coin,
            value: `${
              this.coinsChecked.includes(coin)
                ? SETTING_STATUS.ENABLE
                : SETTING_STATUS.DISABLE
            }`,
            status: this.coinsChecked.includes(coin)
              ? SETTING_STATUS.ENABLE
              : SETTING_STATUS.DISABLE,
          }),
        )
      }

      // delete
      for (const coin of difference(coinsSettingFromServer, coinsFromServer)) {
        settingActions.push(
          ConvertSmallBalanceService.deleteConvertSmallBalance(
            this.convertSettings[coin]['id'],
          ),
        )
      }

      // update
      for (const coin of intersection(
        coinsFromServer,
        coinsSettingFromServer,
      )) {
        const status = this.coinsChecked.includes(coin)
          ? SETTING_STATUS.ENABLE
          : SETTING_STATUS.DISABLE
        if (status !== this.convertSettings[coin]['status']) {
          settingActions.push(
            ConvertSmallBalanceService.updateConvertSmallBalance(
              this.convertSettings[coin]['id'],
              {
                id: this.convertSettings[coin]['id'],
                module: SETTING_MODULE.CONVERT_SMALL_BALANCE,
                code: coin,
                value: `${
                  this.coinsChecked.includes(coin)
                    ? SETTING_STATUS.ENABLE
                    : SETTING_STATUS.DISABLE
                }`,
                status,
              },
            ),
          )
        }
      }

      Promise.all(settingActions)
        .then(() => {
          return this.getCoins(false)
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
        text: this.$t('convertSmallBalanceScreen.clearPopupTitle'),
        showCancelButton: true,
        confirmButtonText: this.$t('convertSmallBalanceScreen.agreeClearBtn'),
        cancelButtonText: this.$t('convertSmallBalanceScreen.cancelClearBtn'),
      })

      if (isConfirmed) {
        ;(this.coinsChecked = []),
          (this.convertSetting.unit = convertSettingDefault.unit),
          (this.convertSetting.max_balance_amount =
            convertSettingDefault.max_balance_amount),
          (this.convertSetting.maximum_convert_amount_per_day =
            convertSettingDefault.maximum_convert_amount_per_day),
          (this.convertSetting.fee_value = convertSettingDefault.fee_value)
      }
    },
  },
  computed: {
    checkAll: {
      get() {
        return this.coins.every((coin) => this.coinsChecked.includes(coin.coin))
      },
      set(newValue) {
        if (!newValue) {
          this.coinsChecked = []
          return
        }
        const coinsChecked = this.coins.map((coin) => coin.coin)
        this.coinsChecked = coinsChecked
      },
    },
    schema() {
      const schemaObject = {
        max_balance_amount: yup
          .number()
          .required(
            this.$t(
              'convertSmallBalanceScreen.validateSchema.max_balance_amount.required',
            ),
          )
          .typeError(
            this.$t(
              'convertSmallBalanceScreen.validateSchema.max_balance_amount.required',
            ),
          )
          .min(
            0.00001,
            this.$t(
              'convertSmallBalanceScreen.validateSchema.max_balance_amount.min',
            ),
          ),
        maximum_convert_amount_per_day: yup
          .number()
          .required(
            this.$t(
              'convertSmallBalanceScreen.validateSchema.maximum_convert_amount_per_day.required',
            ),
          )
          .typeError(
            this.$t(
              'convertSmallBalanceScreen.validateSchema.maximum_convert_amount_per_day.required',
            ),
          )
          .min(
            0.00001,
            this.$t(
              'convertSmallBalanceScreen.validateSchema.maximum_convert_amount_per_day.min',
            ),
          ),
        fee_value: yup
          .number()
          .required(
            this.$t(
              'convertSmallBalanceScreen.validateSchema.fee_value.required',
            ),
          )
          .typeError(
            this.$t(
              'convertSmallBalanceScreen.validateSchema.fee_value.required',
            ),
          )
          .min(
            0.00001,
            this.$t('convertSmallBalanceScreen.validateSchema.fee_value.min'),
          )
          .max(
            100,
            this.$t('convertSmallBalanceScreen.validateSchema.fee_value.max'),
          ),
      }
      return yup.object(schemaObject)
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

.modal {
  .modal-dialog {
    min-width: 992px;
  }
}

.table-wrapper {
  .table-responsive {
    position: relative;
    height: 35rem;
    overflow-y: scroll;

    thead {
      tr {
        th {
          top: -1px;
          position: -webkit-sticky;
          position: sticky;
        }
      }
    }
  }
}
</style>
