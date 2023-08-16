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
            <span class="error" v-if="internalAdjustmentRateMaxValidate">{{ $t(internalAdjustmentRateMaxErrorMessage) }}</span>
          </div>
        </section>
      </section>
      <div class="hr-1 my-8"></div>
      <section class="">
        <h2>{{ $t('highLow.bufferRate') }}</h2>
        <section class="section-warpper mt-6">
          <h3>BTC/USD</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minBTCUSD"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxBTCUSD"
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
          <h3>ETH/USD</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minETHUSD"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxETHUSD"
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
          <h3>BCH/USD</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minBCHUSD"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxBCHUSD"
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
          <h3>XRP/USD</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minXRPUSD"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxXRPUSD"
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
          <h3>LTC/USD</h3>
          <section class="row mt-4">
            <div class="col-md-6">
              <CustomInput
                v-model="minLTCUSD"
                label="highLow.min"
                name="min"
                type="number"
                :required="true"
                v-on:keyup="this.$data.name = $event.target.value;isNumber($event)"
              />
            </div>
            <div class="col-md-6">
              <CustomInput
                v-model="maxLTCUSD"
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
              v-model="binance"
              label="Binance"
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
                v-model="binanceActive"
              />
            </div>
          </div>
        </section>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="coinbase"
              label="Coinbase"
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
                v-model="coinbaseActive"
              />
            </div>
          </div>
        </section>
        <section class="row mt-4 align-items-end">
          <div class="col-md-6">
            <CustomInput
              v-model="huobi"
              label="Huobi"
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
                v-model="huobiActive"
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
  name: 'crypto_setting_crawler',
  data() {
    return {
      tableReloadKey: 0,
      min: 0,
      max: 0,
      minBTCUSD: 0,
      maxBTCUSD: 0,
      minETHUSD: 0,
      maxETHUSD: 0,
      minBCHUSD: 0,
      maxBCHUSD: 0,
      minXRPUSD: 0,
      maxXRPUSD: 0,
      minLTCUSD: 0,
      maxLTCUSD: 0,

      binance: 0,
      binanceActive: false,
      huobi: 0,
      huobiActive: false,
      coinbase: 0,
      coinbaseActive: false,

      internal: 0,
      sameExchange: 0,
      samePrice: 0,

      keepTime: 0,
      priceKeepModeAdjustmentRate: 0,
      priceKeepModeActivationRate: 0,

      internalAdjustmentRateMaxValidate:false,
      internalAdjustmentRateMaxErrorMessage: ''
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
      sum += +this.binance
      sum += +this.huobi
      sum += +this.coinbase
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
          settingKey: 'adjustment_rate',
          settingValue: JSON.stringify({
            from: !isNaN(+this.min) ? +this.min : 0,
            to: !isNaN(+this.max) ? +this.max : 0,
          }),
        },
        {
          settingKey: 'buffer_rate',
          settingValue: JSON.stringify([
            {
              pair: 'BTC/USD',
              from: !isNaN(+this.minBTCUSD) ? +this.minBTCUSD : 0,
              to: !isNaN(+this.maxBTCUSD) ? +this.maxBTCUSD : 0,
            },
            {
              pair: 'ETH/USD',
              from: !isNaN(+this.minETHUSD) ? +this.minETHUSD : 0,
              to: !isNaN(+this.maxETHUSD) ? +this.maxETHUSD : 0,
            },
            {
              pair: 'BCH/USD',
              from: !isNaN(+this.minBCHUSD) ? +this.minBCHUSD : 0,
              to: !isNaN(+this.maxBCHUSD) ? +this.maxBCHUSD : 0,
            },
            {
              pair: 'XRP/USD',
              from: !isNaN(+this.minXRPUSD) ? +this.minXRPUSD : 0,
              to: !isNaN(+this.maxXRPUSD) ? +this.maxXRPUSD : 0,
            },
            {
              pair: 'LTC/USD',
              from: !isNaN(+this.minLTCUSD) ? +this.minLTCUSD : 0,
              to: !isNaN(+this.maxLTCUSD) ? +this.maxLTCUSD : 0,
            },
          ]),
        },
        {
          settingKey: 'exchange_rate',
          settingValue: JSON.stringify([
            {
              exchange: 'binance',
              rate: !isNaN(+this.binance) ? +this.binance : 0,
              is_make_internal: this.binanceActive,
            },
            {
              exchange: 'coinbase',
              rate: !isNaN(+this.coinbase) ? +this.coinbase : 0,
              is_make_internal: this.coinbaseActive,
            },
            {
              exchange: 'huobi',
              rate: !isNaN(+this.huobi) ? +this.huobi : 0,
              is_make_internal: this.huobiActive,
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
          settingKey: 'internal_activation',
          settingValue: JSON.stringify({
            keep_time: !isNaN(+this.keepTime) ? +this.keepTime : 0,
            activation_rate: !isNaN(+this.priceKeepModeActivationRate) ? +this.priceKeepModeActivationRate : 0,
            adjustment_rate: !isNaN(+this.priceKeepModeAdjustmentRate) ? +this.priceKeepModeAdjustmentRate : 0,
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

      const ajustmentRate = data.find(o => o.setting_key === 'adjustment_rate')

      const buffer = data.find(o => o.setting_key === 'buffer_rate')

      const exchange = data.find(o => o.setting_key === 'exchange_rate')

      const internalActivision = data.find(o => o.setting_key === 'internal_activation')
      
      // Ajustment
      const { from, to } = ajustmentRate.setting_value
      this.min = from
      this.max = to

      // Buffer
      const [BTC, ETH, BCH, XRP, LTC] = buffer.setting_value

      const { from: fromBTC, to: toBTC } = BTC
      this.minBTCUSD = fromBTC
      this.maxBTCUSD = toBTC

      const { from: fromETH, to: toETH } = ETH
      this.minETHUSD = fromETH
      this.maxETHUSD = toETH

      const { from: fromBCH, to: toBCH } = BCH
      this.minBCHUSD = fromBCH
      this.maxBCHUSD = toBCH

      const { from: fromXRP, to: toXRP } = XRP
      this.minXRPUSD = fromXRP
      this.maxXRPUSD = toXRP

      const { from: fromLTC, to: toLTC } = LTC
      this.minLTCUSD = fromLTC
      this.maxLTCUSD = toLTC

      // Exchange
      const [binance, coinbase, huobi, internal, sameExchange, samePrice] =
        exchange.setting_value

      this.binance = binance.rate
      this.coinbase = coinbase.rate
      this.huobi = huobi.rate
      this.internal = internal.rate
      this.sameExchange = sameExchange.rate
      this.samePrice = samePrice.rate
      this.binanceActive = binance.is_make_internal
      this.huobiActive = huobi.is_make_internal
      this.coinbaseActive = coinbase.is_make_internal

      // Internal
      const { activation_rate, adjustment_rate, keep_time } =
        internalActivision.setting_value

      this.keepTime = keep_time
      this.priceKeepModeActivationRate = activation_rate
      this.priceKeepModeAdjustmentRate = adjustment_rate
    },
    isNumber (evt) {
      const value = +evt.target.value
      const keysAllowed: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
      const keyPressed: string = evt.key;
      
      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }

      if (isNaN(value)) {
        evt.target.value = 0;
        evt.preventDefault()
      }
    },
    isNumberInteger (evt) {
      // includes 0 -> 9, delete, enter, .
      const keysAllowed: number[] = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 13, 190, 8];
      const keyPressed: number = evt.keyCode;

      if (!keysAllowed.includes(keyPressed)) {
        evt.target.value = 0;
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
        this.internalAdjustmentRateMaxErrorMessage = 'Internal Adjustment Rate Min must greater 0'
      }

      if (max <= 0) {
        this.internalAdjustmentRateMaxValidate = true
        this.internalAdjustmentRateMaxErrorMessage = 'Internal Adjustment Rate Min must greater 0'
      }

      if (min > max) {
        this.internalAdjustmentRateMaxValidate = true
        this.internalAdjustmentRateMaxErrorMessage = 'Internal Adjustment Rate Max must greater Min'
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
