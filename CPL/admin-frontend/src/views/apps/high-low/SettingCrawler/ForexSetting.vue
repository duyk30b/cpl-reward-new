<template>
  <div class="card">
    <div class="card-body">
      <section>
        <h2>{{ $t('highLow.internalAdjustmentRate') }}</h2>
        <section class="row mt-4">
          <div class="col-md-6">
            <CustomInput
              v-model="min"
              label="highLow.min"
              name="min"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              v-on:input="validateInternalAdjustmentRateMax()"
            />
          </div>
          <div class="col-md-6">
            <CustomInput
              v-model="max"
              label="highLow.max"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              v-on:input="validateInternalAdjustmentRateMax()"
            />
            <span class="error" v-if="internalAdjustmentRateMaxValidate">{{
              $t(internalAdjustmentRateMaxErrorMessage)
            }}</span>
          </div>
        </section>
      </section>
      <div class="hr-1 my-8"></div>
      <section class="">
        <h2>{{ $t('highLow.bufferRate') }}</h2>
        <section class="section-warpper mt-6">
          <h3>EUR/USD</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minEURUSD"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxEURUSD"
                label="highLow.max"
                name="max"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
          </section>
        </section>
        <section class="section-warpper mt-6">
          <h3>USD/JPY</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minUSDJPY"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxUSDJPY"
                label="highLow.max"
                name="max"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
          </section>
        </section>
      </section>
      <div class="hr-1 my-8"></div>
      <section>
        <h2>{{ $t('highLow.selectionRate') }}</h2>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="mt5"
              label="MT5"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
          <div class="col-md-6">
            <div
              class="form-check form-switch form-switch-lg form-check-custom form-check-solid h-43"
            >
              <input
                class="form-check-input"
                type="checkbox"
                name="notifications"
                v-model="mt5Active"
              />
            </div>
          </div>
        </section>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="internal"
              label="highLow.internal"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
        </section>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="sameExchange"
              label="highLow.sameExchange"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
        </section>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="samePrice"
              label="highLow.samePrice"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
        </section>
      </section>
      <div class="hr-1 my-8"></div>
      <section>
        <h2>{{ $t('highLow.internalActivation') }}</h2>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="keepTime"
              label="highLow.keepTime"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
          <div class="col-md-6">
            <CustomInput
              v-model="priceKeepModeAdjustmentRate"
              label="highLow.priceKeepModeAdjustmentRate"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
        </section>

        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="priceKeepModeActivationRate"
              label="highLow.priceKeepModeActivationRate"
              name="max"
              type="number"
              :required="true"
              v-on:keyup="this.$data.name = $event.target.value;isNumberInteger($event)"
            />
          </div>
        </section>
      </section>
      <div class="hr-1 my-8"></div>
      <section class="row mt-8">
        <div class="col-md-6 text-end">
          <button
            class="btn btn-primary w-auto"
            @click="handleReset"
            :title="$t('highLow.clear')"
          >
            <span class="">{{ $t('highLow.clear') }}</span>
          </button>
        </div>
        <div class="col-md-6 mt-6 mt-md-0">
          <button
            class="btn btn-primary w-auto"
            :disabled="internalAdjustmentRateMaxValidate"
            @click="updateSetting"
            :title="$t('save')"
          >
            <span class="">{{ $t('save') }}</span>
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import CustomInput from '@/components/form/CustomInput.vue'
import { HttpStatus } from '@/core/variables/common.enum'
import { HighLowService } from '@/services/HighLowService'
import { defineComponent } from 'vue'

export default defineComponent({
  components: { CustomInput },
  name: 'forex_setting_crawler',
  data() {
    return {
      tableReloadKey: 0,
      min: 0,
      max: 0,
      minEURUSD: 0,
      maxEURUSD: 0,
      minUSDJPY: 0,
      maxUSDJPY: 0,

      mt5: 0,
      mt5Active: false,

      internal: 0,
      sameExchange: 0,
      samePrice: 0,

      keepTime: 0,
      priceKeepModeAdjustmentRate: 0,
      priceKeepModeActivationRate: 0,

      internalAdjustmentRateMaxValidate: false,
      internalAdjustmentRateMaxErrorMessage: '',
    }
  },
  async mounted() {
    this.getCrawler()
  },
  methods: {
    handleReset() {
      this.getCrawler()
      this.$toastr.success(this.$t('success'))
    },
    refreshTable() {
      this.tableReloadKey++
    },
    async updateSetting() {
      // giang add check validate active rate must be 100
      let sum = 0
      sum += +this.mt5
      sum += +this.internal
      sum += +this.sameExchange
      sum += +this.samePrice
      if (sum !== 100) {
        this.$toastr.error(
          this.$t('highLow.validateMessage.selectionRateMustBe100'),
        )
        return
      }
      // end
      const res = await HighLowService.updateSettingCrawler([
        {
          settingKey: 'adjustment_rate2',
          settingValue: JSON.stringify({
            from: !isNaN(+this.min) ? +this.min : 0,
            to: !isNaN(+this.max) ? +this.max : 0,
          }),
        },
        {
          settingKey: 'buffer_rate2',
          settingValue: JSON.stringify([
            {
              pair: 'EUR/USD',
              from: !isNaN(+this.minEURUSD) ? +this.minEURUSD : 0,
              to: !isNaN(+this.maxEURUSD) ? +this.maxEURUSD : 0,
            },
            {
              pair: 'USD/JPY',
              from: !isNaN(+this.minUSDJPY) ? +this.minUSDJPY : 0,
              to: !isNaN(+this.maxUSDJPY) ? +this.maxUSDJPY : 0,
            },
          ]),
        },
        {
          settingKey: 'exchange_rate2',
          settingValue: JSON.stringify([
            {
              exchange: 'mt5',
              rate: !isNaN(+this.mt5) ? +this.mt5 : 0,
              is_make_internal: this.mt5Active,
            },
            {
              exchange: 'internal',
              rate: !isNaN(+this.internal) ? +this.internal : 0,
              is_make_internal: false,
            },
            {
              exchange: 'same-exchange',
              rate: !isNaN(+this.sameExchange) ? +this.sameExchange : 0,
              is_make_internal: false,
            },
            {
              exchange: 'same-price',
              rate: !isNaN(+this.samePrice) ? +this.samePrice : 0,
              is_make_internal: false,
            },
          ]),
        },
        {
          settingKey: 'internal_activation2',
          settingValue: JSON.stringify({
            keep_time: !isNaN(+this.keepTime) ? +this.keepTime : 0,
            activation_rate: !isNaN(+this.priceKeepModeActivationRate)
              ? +this.priceKeepModeActivationRate
              : 0,
            adjustment_rate: !isNaN(+this.priceKeepModeAdjustmentRate)
              ? +this.priceKeepModeAdjustmentRate
              : 0,
          }),
        },
      ])

      if (res.status === HttpStatus.OK) {
        this.$toastr.success(this.$t('success'))
        this.handleReset()
        return
      }
      this.$toastr.error(this.$t('error'))
    },
    async getCrawler() {
      const response = await HighLowService.getSettingCrawler()
      const data: any[] = response.data.data

      const ajustmentRate = data.find(
        (o) => o.setting_key === 'adjustment_rate2',
      )

      const buffer = data.find((o) => o.setting_key === 'buffer_rate2')

      const exchange = data.find((o) => o.setting_key === 'exchange_rate2')

      const internalActivision = data.find(
        (o) => o.setting_key === 'internal_activation2',
      )

      // Ajustment
      const { from, to } = ajustmentRate.setting_value
      this.min = from
      this.max = to

      // Buffer
      const [EUR, JPY] = buffer.setting_value

      const { from: fromEUR, to: toEUR } = EUR
      this.minEURUSD = fromEUR
      this.maxEURUSD = toEUR

      const { from: fromJPY, to: toJPY } = JPY
      this.minUSDJPY = fromJPY
      this.maxUSDJPY = toJPY

      // Exchange
      const [mt5, internal, sameExchange, samePrice] = exchange.setting_value

      this.mt5 = mt5.rate
      this.internal = internal.rate
      this.sameExchange = sameExchange.rate
      this.samePrice = samePrice.rate
      this.mt5Active = mt5.is_make_internal

      // Internal
      const { activation_rate, adjustment_rate, keep_time } =
        internalActivision.setting_value

      this.keepTime = keep_time
      this.priceKeepModeActivationRate = activation_rate
      this.priceKeepModeAdjustmentRate = adjustment_rate
    },
    isNumber(evt) {
      const value = +evt.target.value
      const keysAllowed: string[] = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '.',
      ]
      const keyPressed: string = evt.key

      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }

      if (isNaN(value)) {
        evt.target.value = 0
        evt.preventDefault()
      }
    },
    isNumberInteger(evt) {
      // includes 0 -> 9, delete, enter, .
      const keysAllowed: number[] = [
        48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 13, 190, 8,
      ]
      const keyPressed: number = evt.keyCode

      if (!keysAllowed.includes(keyPressed)) {
        evt.target.value = 0
        evt.preventDefault()
      }
    },
    validateInternalAdjustmentRateMax() {
      const min = +this.min
      const max = +this.max

      this.internalAdjustmentRateMaxValidate = false
      this.internalAdjustmentRateMaxErrorMessage = ''

      if (min <= 0) {
        this.internalAdjustmentRateMaxValidate = true
        this.internalAdjustmentRateMaxErrorMessage =
          'Internal Adjustment Rate Min must greater 0'
      }

      if (max <= 0) {
        this.internalAdjustmentRateMaxValidate = true
        this.internalAdjustmentRateMaxErrorMessage =
          'Internal Adjustment Rate Min must greater 0'
      }

      if (min > max) {
        this.internalAdjustmentRateMaxValidate = true
        this.internalAdjustmentRateMaxErrorMessage =
          'Internal Adjustment Rate Max must greater Min'
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.h-43 {
  height: 43px;
}
.hr-1 {
  height: 1px;
  background-color: #eaeaea;
  width: 100%;
}
.section-warpper {
  // background-color: #d8d8d8;
  padding: 8px;
  border-radius: 8px;
}

span.error {
  margin-top: 5px;
  color: red;
  font-size: 0.8em;
}
</style>
