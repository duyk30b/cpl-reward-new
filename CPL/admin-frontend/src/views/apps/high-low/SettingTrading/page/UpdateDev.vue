<template>
  <div class="card p-8 limit-page">
    <div class="row justify-content-between">
      <div class="d-flex col-md-10 align-items-center">
        <div class="me-4 cursor-pointer" @click="handleBack">
          <span class="svg-icon svg-icon-1 rotate-180">
            <inline-svg src="media/svg/shapes/arrow-left.svg" />
          </span>
        </div>
        <div class="title-back">{{ $t('back') }}</div>
      </div>

      <div class="d-flex col-md-2 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="updateMode"
          :title="$t('submit')"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="">{{ $t('submit') }}</span>
        </button>
      </div>
    </div>
    <div class="d-flex align-items-center">
      <div class="card-title main-label py-4 border-bottom">
        [{{ $t('highLow.tradingMode') }} - {{ getPairById(user.pairId) }}]
        {{ pageTitle || '...' }}
      </div>
    </div>
    <div class="card-body p-0">
      <section class="row">
        <div class="main-label mt-6">{{ $t('highLow.generalSetting') }}</div>
        <section class="row">
          <div class="col-md-6">
            <div class="d-flex align-items-center mt-6 h-40">
              <div class="label-title">
                {{ $t('highLow.status') }}
              </div>
              <div
                class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="notifications"
                  v-model="user.status"
                />
              </div>
            </div>
            <div class="d-flex align-items-center mt-6 h-40">
              <div class="label-title">
                {{ $t('highLow.transactionStartTime') }}
              </div>
              <div class="w-40">
                <el-time-picker v-model="user.startTime" format="HH:mm">
                </el-time-picker>
              </div>
            </div>
            <div class="d-flex align-items-center mt-6 h-40">
              <div class="label-title">
                {{ $t('highLow.transactionEndTime') }}
              </div>
              <div class="d-flex align-items-center">
                <div class="w-40">
                  <el-time-picker v-model="user.endTime" format="HH:mm">
                  </el-time-picker>
                </div>
                <div class="ml-16">({{ $t('highLow.tomorrow') }})</div>
              </div>
            </div>
            <div class="d-flex align-items-center mt-6 h-40">
              <div class="label-title">
                {{ $t('highLow.sellOPtion') }}
              </div>
              <div
                class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="notifications"
                  v-model="user.allowResell"
                />
              </div>
            </div>
            <div
              class="d-flex align-items-center mt-6 h-40"
              v-if="user.mode === 'H' || user.mode === 'HS'"
            >
              <div class="label-title">
                {{ $t('highLow.expiryTimeBeforeReceivingOrder') }}
              </div>
              <div class="w-40 d-flex align-items-center">
                <el-time-picker
                  v-model="user.orderExpireTime"
                  format="HH:mm:ss"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.oddsMode') }}
              </div>
              <div
                class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="notifications"
                  v-model="user.oddsMode"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.xDay') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.restrictedDayUnit"
                  placeholder="tuanh"
                  name="xDay"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.maximumTimesOrderxDay') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.restrictedDayOrderTimes"
                  placeholder="tuanh"
                  name="maximumTimesOrderxDay"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.orderAmountMaximumxDay') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.restrictedDayOrderAmount"
                  placeholder="tuanh"
                  name="orderAmountMaximumxDay"
                />
              </div>
            </div>
            <template v-if="user.mode === 'H' || user.mode === 'HS'">
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.maximumTimesOrderTimeFrame') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.restrictedOrderTimes"
                    placeholder="tuanh"
                    name="maximumTimesOrderTimeFrame"
                  />
                </div>
              </div>
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.orderAmountMaximumTimeFrame') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.restrictedOrderAmount"
                    placeholder="tuanh"
                    name="orderAmountMaximumTimeFrame"
                  />
                </div>
              </div>
            </template>
          </div>
          <div class="col-md-6">
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{
                  $t('highLow.amountSuggestion', {
                    number: 1,
                  })
                }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.suggestion_1"
                  placeholder="tuanh"
                  suffix="highLow.usdt"
                  name="amountSuggestion1"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{
                  $t('highLow.amountSuggestion', {
                    number: 2,
                  })
                }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.suggestion_2"
                  placeholder="tuanh"
                  suffix="highLow.usdt"
                  name="amountSuggestion2"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{
                  $t('highLow.amountSuggestion', {
                    number: 3,
                  })
                }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.suggestion_3"
                  placeholder="tuanh"
                  suffix="highLow.usdt"
                  name="amountSuggestion3"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.maximumOrderAmountPerOrder') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.maxUsdtPerOrder"
                  placeholder="tuanh"
                  suffix="highLow.usdt"
                  name="maximumOrderAmountPerOrder"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40 d-none">
              <div class="label-title">
                {{ $t('highLow.maximumBCASTAmountPerOrder') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.maxBcastPerOrder"
                  placeholder="tuanh"
                  suffix="highLow.bcast"
                  name="maximumBCASTAmountPerOrder"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center">
              <div class="label-title">
                {{ $t('highLow.orderAmountMinimum') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.limitOrderMin"
                  placeholder="tuanh"
                  suffix="highLow.usdt"
                  name="orderAmountMinimum"
                  v-on:keyup="isInvalidForm"
                />
                <span class="text-danger" v-if="valid.limitOrderMin">
                  {{ valid.limitOrderMin }}
                </span>
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.oddsFee') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.oddsFee"
                  placeholder="tuanh"
                  suffix="%"
                  name="oddsFee"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center">
              <div class="label-title">
                {{ $t('highLow.orderAmountUnit') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.orderUnit"
                  placeholder="tuanh"
                  name="orderAmountUnit"
                  v-on:keyup="isInvalidForm"
                />
                <span class="text-danger" v-if="valid.orderUnit">
                  {{ valid.orderUnit }}
                </span>
              </div>
            </div>
          </div>
        </section>
      </section>
      <section class="row">
        <div class="">
          <div class="main-label mt-6">{{ $t('highLow.payoutSetting') }}</div>
          <section class="row">
            <div class="col-md-6">
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.defaultPayout') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.payout"
                    placeholder=""
                    name="defaultPayout"
                    v-on:keyup="isInvalidForm"
                  />
                  <span class="text-danger" v-if="valid.defaultPayout">
                    {{ valid.defaultPayout }}
                  </span>
                </div>
              </div>
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.allowScalingViaUseBCAST') }}
                </div>
                <div
                  class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="notifications"
                    v-model="user.scalingActive"
                  />
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center h-40"
                v-if="user.scalingActive"
              >
                <div class="label-title">
                  {{ $t('highLow.scalingValue') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.scalingValue"
                    :disabled="!user.scalingActive"
                    name="scalingValue"
                  />
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center h-40"
                v-if="user.scalingActive"
              >
                <div class="label-title">
                  {{ $t('highLow.scalingBCASTUseRateUPNecessary') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.scalingBcast"
                    :disabled="!user.scalingActive"
                    name="scalingBCASTUseRateUPNecessary"
                  />
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.scalingActive"
              >
                <div class="label-title">
                  {{ $t('highLow.payoutScalingUnit') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.payoutScalingUnit"
                    placeholder=""
                    name="payoutScalingUnit"
                    v-on:keyup="isInvalidForm"
                    :disabled="!user.scalingActive"
                    maxLength="8"
                  />
                  <span
                    class="text-danger"
                    v-if="valid.payoutScalingUnit && user.scalingActive"
                  >
                    {{ valid.payoutScalingUnit }}
                  </span>
                </div>
              </div>
            </div>
            <div class="col-md-6 align-items-center">
              <div
                class="d-flex mt-6"
                v-if="user.scalingActive || user.rankScalingActive"
              >
                <div class="label-title">
                  {{ $t('highLow.payoutMaximum') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.payoutMax"
                    placeholder=""
                    name="payoutMaximum"
                    v-on:keyup="isInvalidForm"
                    :disabled="!user.scalingActive && !user.rankScalingActive"
                  />
                  <span
                    class="text-danger"
                    v-if="
                      valid.payoutMax &&
                      (user.scalingActive || user.rankScalingActive)
                    "
                  >
                    {{ valid.payoutMax }}
                  </span>
                </div>
              </div>
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.allowScalingViaHoldingBCAST') }}
                </div>
                <div
                  class="form-check form-switch form-switch-sm form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    name="notifications"
                    v-model="user.rankScalingActive"
                  />
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.rankScalingActive"
              >
                <div class="label-title">
                  {{
                    $t('highLow.bcastRank', {
                      number: 1,
                    })
                  }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.rank1ScaleBcast"
                    placeholder=""
                    name="bcastRank1"
                    v-on:keyup="isInvalidForm"
                    maxLength="8"
                    :disabled="!user.rankScalingActive"
                  />
                  <span
                    class="text-danger"
                    v-if="valid.rank1ScaleBcast && user.rankScalingActive"
                  >
                    {{ valid.rank1ScaleBcast }}
                  </span>
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.rankScalingActive && user.scalingActive"
              >
                <div class="label-title">
                  {{
                    $t('highLow.maxPayoutBcastRank', {
                      number: 1,
                    })
                  }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.maxBcastRank1"
                    placeholder=""
                    name="maxBcastRank1"
                    :disabled="true"
                  />
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.rankScalingActive"
              >
                <div class="label-title">
                  {{
                    $t('highLow.bcastRank', {
                      number: 2,
                    })
                  }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.rank2ScaleBcast"
                    placeholder=""
                    name="bcastRank2"
                    v-on:keyup="isInvalidForm"
                    maxLength="8"
                    :disabled="!user.rankScalingActive"
                  />
                  <span
                    class="text-danger"
                    v-if="valid.rank2ScaleBcast && user.rankScalingActive"
                  >
                    {{ valid.rank2ScaleBcast }}
                  </span>
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.rankScalingActive && user.scalingActive"
              >
                <div class="label-title">
                  {{
                    $t('highLow.maxPayoutBcastRank', {
                      number: 2,
                    })
                  }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.maxBcastRank2"
                    placeholder=""
                    name="maxBcastRank2"
                    :disabled="true"
                  />
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.rankScalingActive"
              >
                <div class="label-title">
                  {{
                    $t('highLow.bcastRank', {
                      number: 3,
                    })
                  }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.rank3ScaleBcast"
                    placeholder=""
                    name="bcastRank3"
                    v-on:keyup="isInvalidForm"
                    maxLength="8"
                    :disabled="!user.rankScalingActive"
                  />
                  <span
                    class="text-danger"
                    v-if="valid.rank3ScaleBcast && user.rankScalingActive"
                  >
                    {{ valid.rank3ScaleBcast }}
                  </span>
                </div>
              </div>
              <div
                class="d-flex mt-6 align-items-center"
                v-if="user.rankScalingActive && user.scalingActive"
              >
                <div class="label-title">
                  {{
                    $t('highLow.maxPayoutBcastRank', {
                      number: 3,
                    })
                  }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.maxBcastRank3"
                    placeholder=""
                    name="maxBcastRank3"
                    :disabled="true"
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
      <section class="row mt-8">
        <div class="main-label mt-6">{{ $t('highLow.limitSetting') }}</div>
        <section class="row">
          <div class="col-md-6">
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.restricted') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.limitDayUnit"
                  placeholder="tuanh"
                  name="restricted"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.restrictedMaximumTimesOrderDay') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.limitOrderTimes"
                  placeholder="tuanh"
                  name="restrictedMaximumTimesOrderDay"
                />
              </div>
            </div>
            <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.restrictedOrderAmountMaximumDay') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.limitOrderAmount"
                  placeholder="tuanh"
                  name="restrictedOrderAmountMaximumDay"
                />
              </div>
            </div>
            <!-- <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.diffDirectionInterval') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.diffDirectionInterval"
                  placeholder="tuanh"
                  suffix=""
                  name="diffDirectionInterval"
                />
              </div>
            </div> -->
          </div>
          <div class="col-md-6">
            <template v-if="user.mode === 'H' || user.mode === 'HS'">
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.restrictedMaximumTimesOrderTimeFrame') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.limitOrderMax"
                    placeholder="tuanh"
                    name="restrictedMaximumTimesOrderTimeFrame"
                  />
                </div>
              </div>
              <div class="d-flex mt-6 align-items-center h-40">
                <div class="label-title">
                  {{ $t('highLow.restrictedOrderAmountMaximumTimeFrame') }}
                </div>
                <div class="w-40">
                  <CustomInput
                    v-model="user.limitOrderMaxAmount"
                    placeholder="tuanh"
                    name="restrictedOrderAmountMaximumTimeFrame"
                  />
                </div>
              </div>
            </template>
            <!-- <div class="d-flex mt-6 align-items-center h-40">
              <div class="label-title">
                {{ $t('highLow.sameDirectionInterval') }}
              </div>
              <div class="w-40">
                <CustomInput
                  v-model="user.sameDirectionInterval"
                  placeholder="tuanh"
                  suffix=""
                  name="sameDirectionInterval"
                />
              </div>
            </div> -->
          </div>
        </section>
      </section>
      <div class="col-md-6">
        <div class="main-label mt-6">
          {{ $t('highLow.emergencySetting') }}
        </div>
        <section class="row">
          <div class="d-flex mt-6 align-items-center h-40">
            <div class="label-title">
              {{ $t('highLow.modeTradingEmergencyStopThreshold') }}
            </div>
            <div class="w-40">
              <CustomInput
                v-model="user.stopThresholdValue"
                placeholder="tuanh"
                name="modeTradingEmergencyStopThreshold"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import CustomInput from '@/components/form/CustomInputText.vue'
import { HighLowService } from '@/services/HighLowService'
import { getPeriodByValue, getModeByValue } from '@/core/helpers/common.helper'

export default defineComponent({
  components: {
    // TimePicker,
    CustomInput,
  },
  name: 'detail',
  async mounted() {
    this.getDetailSetting(this.id)
    this.getPairs()
  },
  computed: {
    id() {
      return this.$route.params.id as string
    },
  },
  data() {
    return {
      loading: false,
      pairOptions: [{ id: '', name: '' }],
      valid: {
        defaultPayout: '',
        payoutMax: '',
        rank1ScaleBcast: '',
        rank2ScaleBcast: '',
        rank3ScaleBcast: '',
        payoutScalingUnit: '',
        limitOrderMin: '',
        orderUnit: '',
      },
      user: {
        status: false,
        id: '',
        mode: '',
        period: '',
        activeThresholdValue: '',
        orderMinimum: '',
        expireTime: '',
        emergencyThreshold: '',
        apiToken: '',

        startTime: new Date(),
        endTime: new Date(),
        allowResell: false,
        orderExpireTime: new Date(),
        oddsMode: false,
        restrictedDayUnit: '',
        restrictedDayOrderTimes: '',
        restrictedDayOrderAmount: '',
        restrictedOrderTimes: '',
        restrictedOrderAmount: '',
        suggestion_1: '',
        suggestion_2: '',
        suggestion_3: '',
        maxUsdtPerOrder: '',
        maxBcastPerOrder: '',
        limitOrderMin: '',
        oddsFee: '',
        orderUnit: '',

        pairId: '',
        payout: '',
        scalingActive: false,
        scalingValue: '',
        scalingBcast: '',
        payoutScalingUnit: '',
        payoutMax: '',
        rankScalingActive: false,
        rank1ScaleBcast: '',
        rank2ScaleBcast: '',
        rank3ScaleBcast: '',
        maxBcastRank1: '',
        maxBcastRank2: '',
        maxBcastRank3: '',

        limitDayUnit: '',
        limitOrderTimes: '',
        limitOrderAmount: '',
        diffDirectionInterval: '',
        limitOrderMax: '',
        limitOrderMaxAmount: '',
        sameDirectionInterval: '',

        stopThresholdValue: '',
      },
      pageTitle: '...',
    }
  },
  methods: {
    getPairs: async function () {
      this.pairOptions = []

      const response = await HighLowService.getSettingTradingPair({
        get_only: true,
      })
      const { data } = response
      data.data.forEach((item) => {
        const temp = {
          id: item.id,
          name: item.symbol,
        }

        this.pairOptions.push(temp)
      })
    },
    getPairById(pairId: string) {
      if (this.pairOptions && this.pairOptions.length > 0) {
        const pair = this.pairOptions.filter((item) => {
          return +item.id === +pairId
        })
        if (pair.length === 1) {
          return pair[0].name
        }
      }
      return ''
    },
    transformBody(data) {
      const res = Object.assign({}, data)
      const startTime: Date = data.startTime
      const endTime: Date = data.endTime
      const orderExpireTime: Date = data.orderExpireTime

      const transformNumber = (data: number): string =>
        data < 10 ? `0${data}` : `${data}`

      res.startTime = `${transformNumber(
        startTime.getUTCHours(),
      )}:${transformNumber(startTime.getUTCMinutes())}:00`

      res.endTime = `${transformNumber(
        endTime.getUTCHours(),
      )}:${transformNumber(endTime.getUTCMinutes())}:00`

      // orderExpireTime don't need transform to UTC
      res.orderExpireTime = `${transformNumber(
        orderExpireTime.getHours(),
      )}:${transformNumber(orderExpireTime.getMinutes())}:${transformNumber(
        orderExpireTime.getSeconds(),
      )}`
      // transform status
      res.status = res.status ? '1' : '0'
      return res
    },
    handleBack() {
      // giang update loop back
      this.$router.push({
        name: 'high-low-setting-trading',
        query: { tab: 'trading-dev', pair: this.user.pairId },
      })
    },
    handleRedirectDetailPage() {
      this.$router.push({
        name: 'high-low-setting-trading-detail',
        params: { id: this.$route.params.id, slug: 'view' },
        query: { type: 'view-dev' },
      })
    },
    async getDetailSetting(id) {
      this.loading = true
      const response = await HighLowService.getTradingMode(id)
      this.loading = false

      const {
        data: {
          status,
          mode,
          period,
          activeThresholdValue,
          orderMinimum,
          expireTime,
          emergencyThreshold,
          apiToken,

          startTime,
          endTime,
          allowResell,
          orderExpireTime,
          oddsMode,
          restrictedDayOrderTimes,
          restrictedDayOrderAmount,
          restrictedOrderTimes,
          restrictedOrderAmount,
          restrictedDayUnit,
          suggestion_1,
          suggestion_2,
          suggestion_3,
          maxUsdtPerOrder,
          maxBcastPerOrder,
          limitOrderMin,
          oddsFee,
          orderUnit,

          pairId,
          payout,
          scalingActive,
          scalingValue,
          scalingBcast,
          payoutScalingUnit,
          payoutMax,
          rankScalingActive,
          rank1ScaleBcast,
          rank2ScaleBcast,
          rank3ScaleBcast,

          limitDayUnit,
          limitOrderTimes,
          limitOrderAmount,
          diffDirectionInterval,
          limitOrderMax,
          limitOrderMaxAmount,
          sameDirectionInterval,
          stopThresholdValue,
        },
      } = response
      if (response.status === 200) {
        this.user = {
          status: status === '1',
          id,
          mode,
          period,
          activeThresholdValue,
          orderMinimum,
          expireTime,
          emergencyThreshold,
          apiToken,

          startTime,
          endTime,
          allowResell: Boolean(+allowResell),
          orderExpireTime,
          oddsMode: Boolean(+oddsMode),
          restrictedDayUnit,
          restrictedDayOrderTimes,
          restrictedDayOrderAmount,
          restrictedOrderTimes,
          restrictedOrderAmount,
          suggestion_1,
          suggestion_2,
          suggestion_3,
          maxUsdtPerOrder,
          maxBcastPerOrder,
          limitOrderMin,
          oddsFee,
          orderUnit,

          pairId,
          payout,
          scalingActive: Boolean(+scalingActive),
          scalingValue,
          scalingBcast,
          payoutScalingUnit,
          payoutMax,
          rankScalingActive: Boolean(+rankScalingActive),
          rank1ScaleBcast,
          rank2ScaleBcast,
          rank3ScaleBcast,
          maxBcastRank1: this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            rank1ScaleBcast,
          ).toString(),
          maxBcastRank2: this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            rank2ScaleBcast,
          ).toString(),
          maxBcastRank3: this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            rank3ScaleBcast,
          ).toString(),
          limitDayUnit,
          limitOrderTimes,
          limitOrderAmount,
          diffDirectionInterval,
          limitOrderMax,
          limitOrderMaxAmount,
          sameDirectionInterval,
          stopThresholdValue,
        }

        this.pageTitle = `${getModeByValue(mode)} - ${getPeriodByValue(period)}`

        this.user.suggestion_1 = response.data.suggestion1
        this.user.suggestion_2 = response.data.suggestion2
        this.user.suggestion_3 = response.data.suggestion3

        const timeStartTime = startTime.split(':')
        const dateStartTime = new Date(
          new Date().setUTCHours(
            timeStartTime[0],
            timeStartTime[1],
            timeStartTime[2],
          ),
        )
        this.user.startTime = dateStartTime

        const timeEndTime = endTime.split(':')
        const dateEndTime = new Date(
          new Date().setUTCHours(
            timeEndTime[0],
            timeEndTime[1],
            timeEndTime[2],
          ),
        )
        this.user.endTime = dateEndTime

        const timeOrderExpireTime = orderExpireTime.split(':')
        const dateOrderExpireTime = new Date(
          new Date().setHours(
            timeOrderExpireTime[0],
            timeOrderExpireTime[1],
            timeOrderExpireTime[2],
          ),
        )
        this.user.orderExpireTime = dateOrderExpireTime
      }
    },
    resetValidate() {
      this.valid = {
        defaultPayout: '',
        payoutMax: '',
        rank1ScaleBcast: '',
        rank2ScaleBcast: '',
        rank3ScaleBcast: '',
        payoutScalingUnit: '',
        limitOrderMin: '',
        orderUnit: '',
      }
    },
    getMaxPurchasePayoutForRank(payoutMax, payout, rankScaleBcast): number {
      return +(+(+payoutMax - +payout - +rankScaleBcast).toPrecision(
        12,
      )).toFixed(10)
    },
    moduloCalculate(src: string, des: string): number {
      let numSrc = 1
      let numDes = 1
      const partSrc = src.split('.')
      let max = 0
      if (partSrc.length < 2) {
        numSrc = +src
      } else {
        max = partSrc[1].length
      }
      const partDes = des.split('.')
      if (partDes.length < 2) {
        numDes = +des
      } else if (max < partDes[1].length) {
        max = partDes[1].length
      }
      if (max > 0) {
        numSrc = Math.round(+src * Math.pow(10, max))
        numDes = Math.round(+des * Math.pow(10, max))
      }

      return numSrc % numDes
    },
    validatePayoutScalingUnit(compareValue): boolean {
      const { payoutScalingUnit } = this.user
      return this.moduloCalculate(compareValue, payoutScalingUnit) !== 0
    },
    checkIsPositiveNumber(): boolean {
      let isValidForm = true
      const {
        limitOrderMin,
        orderUnit,
        payoutScalingUnit,
        rank1ScaleBcast,
        rank2ScaleBcast,
        rank3ScaleBcast,
        payoutMax,
        payout,
      } = this.user
      if (isNaN(+limitOrderMin)) {
        this.valid.limitOrderMin = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+limitOrderMin <= 0) {
        this.valid.limitOrderMin = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+orderUnit)) {
        this.valid.orderUnit = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+orderUnit <= 0) {
        this.valid.orderUnit = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+payoutScalingUnit)) {
        this.valid.payoutScalingUnit = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+payoutScalingUnit <= 0) {
        this.valid.payoutScalingUnit = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+rank1ScaleBcast)) {
        this.valid.rank1ScaleBcast = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+rank1ScaleBcast <= 0) {
        this.valid.rank1ScaleBcast = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+rank2ScaleBcast)) {
        this.valid.rank2ScaleBcast = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+rank2ScaleBcast <= 0) {
        this.valid.rank2ScaleBcast = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+rank3ScaleBcast)) {
        this.valid.rank3ScaleBcast = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+rank3ScaleBcast <= 0) {
        this.valid.rank3ScaleBcast = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+payoutMax)) {
        this.valid.payoutMax = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+payoutMax <= 0) {
        this.valid.payoutMax = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      if (isNaN(+payout)) {
        this.valid.defaultPayout = this.$t('highLow.valid.isNumber')
        isValidForm = false
      } else if (+payout <= 0) {
        this.valid.defaultPayout = this.$t('highLow.valid.isPositiveNumber')
        isValidForm = false
      }
      return isValidForm
    },
    checkIsIntegerNumber(): boolean {
      let isValidForm = true
      const { limitOrderMin, orderUnit } = this.user
      if (limitOrderMin.indexOf('.') !== -1) {
        this.valid.limitOrderMin = this.$t('highLow.valid.isInteger')
        isValidForm = false
      }
      if (orderUnit.indexOf('.') !== -1) {
        this.valid.orderUnit = this.$t('highLow.valid.isInteger')
        isValidForm = false
      }
      return isValidForm
    },
    checkValidScalingUnit(): boolean {
      if (this.user.scalingActive) {
        const {
          payoutMax,
          payout,
          rank1ScaleBcast,
          rank2ScaleBcast,
          rank3ScaleBcast,
          payoutScalingUnit,
        } = this.user
        // valid decimal leng of payoutScalingUnit
        const indexDecimals = payoutScalingUnit.indexOf('.')
        if (
          indexDecimals !== -1 &&
          payoutScalingUnit.length - indexDecimals > 3
        ) {
          this.valid.payoutScalingUnit = this.$t(
            'highLow.valid.maxDecimalsPayoutScalingUnit',
          )
          return false
        }
        if (this.user.rankScalingActive) {
          // validate rankScalingActive only
          let value = this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            rank1ScaleBcast,
          )
          this.user.maxBcastRank1 = value < 0 ? '' : value.toString()

          value = this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            rank2ScaleBcast,
          )
          this.user.maxBcastRank2 = value < 0 ? '' : value.toString()

          value = this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            rank3ScaleBcast,
          )
          this.user.maxBcastRank3 = value < 0 ? '' : value.toString()

          const { maxBcastRank1, maxBcastRank2, maxBcastRank3 } = this.user

          if (
            this.validatePayoutScalingUnit(maxBcastRank1) ||
            this.validatePayoutScalingUnit(maxBcastRank2) ||
            this.validatePayoutScalingUnit(maxBcastRank3)
          ) {
            this.valid.payoutScalingUnit = this.$t(
              'highLow.valid.payoutScalingUnit',
            )
            return false
          }
        } else {
          // validate scalingActive first
          const value = this.getMaxPurchasePayoutForRank(
            payoutMax,
            payout,
            0,
          ).toString()
          if (this.validatePayoutScalingUnit(value)) {
            this.valid.payoutScalingUnit = this.$t(
              'highLow.valid.payoutScalingUnitOnly',
              {
                value,
              },
            )
            return false
          }
        }
      }
      return true
    },
    checkValidRankField(): boolean {
      let isValidForm = true
      if (this.user.rankScalingActive) {
        const { rank1ScaleBcast, rank2ScaleBcast, rank3ScaleBcast } = this.user
        if (+rank2ScaleBcast < +rank1ScaleBcast) {
          this.valid.rank2ScaleBcast = this.$t('highLow.valid.bcashRank2')
          isValidForm = false
        }
        if (+rank3ScaleBcast < +rank2ScaleBcast) {
          this.valid.rank3ScaleBcast = this.$t('highLow.valid.bcashRank3')
          isValidForm = false
        }
      }
      return isValidForm
    },
    checkPayoutMax(): boolean {
      const { payoutMax, payout, rank3ScaleBcast } = this.user
      if (this.user.rankScalingActive) {
        if (+payoutMax < +payout + +rank3ScaleBcast) {
          this.valid.payoutMax = this.$t('highLow.valid.payoutMax', {
            value: +payout + +rank3ScaleBcast,
          })
          return false
        }
      } else if (this.user.scalingActive) {
        if (+payoutMax < +payout) {
          this.valid.payoutMax = this.$t(
            'highLow.valid.payoutMaxWithoutRankScroling',
            { defaultPayout: +payout },
          )
          return false
        }
      }
      return true
    },
    isInvalidForm() {
      this.resetValidate()
      return (
        this.checkIsPositiveNumber() &&
        this.checkIsIntegerNumber() &&
        this.checkPayoutMax() &&
        this.checkValidRankField() &&
        this.checkValidScalingUnit()
      )
    },
    async updateMode(e) {
      e.preventDefault()
      if (!this.isInvalidForm()) {
        this.$toastr.error(this.$t('highLow.valid.commonFail'))
        return
      }
      this.user.id = this.id
      const body = this.transformBody(this.user)
      this.loading = true
      const res = await HighLowService.updateTradingMode(this.id, body)
      this.loading = false

      if (res && res.status == 200) {
        this.$toastr.success(this.$t('success'))
        this.$emit('updated')
        return this.handleRedirectDetailPage()
      }
      return this.$toastr.error(this.$t('error'))
    },
  },
})
</script>
<style lang="scss" scoped>
.limit-page {
  height: 760px;
  overflow: scroll;
}

.cursor-pointer {
  cursor: pointer;
}

.ml-16 {
  margin-left: 16px;
}

.h-40 {
  height: 40px;
}

.w-40 {
  width: 215px;
}

.title-back {
  font-size: 1.5rem;
  font-weight: 500;
}

.main-label {
  font-weight: 600;
  font-size: 2rem;
}

.label-title {
  font-size: 1rem;
  width: 250px;
  padding-right: 16px;
}

.value-title {
  font-size: 1rem;
  font-weight: 500;
}
</style>
