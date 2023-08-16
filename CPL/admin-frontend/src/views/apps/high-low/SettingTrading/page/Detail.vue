<template>
  <div class="card p-8 limit-page">
    <div class="row justify-content-between">
      <div class="d-flex col-md-4 align-items-center">
        <div class="me-4 cursor-pointer" @click="handleBack">
          <span class="svg-icon svg-icon-1 rotate-180">
            <inline-svg src="media/svg/shapes/arrow-left.svg" />
          </span>
        </div>
        <div class="title-back">{{ $t('back') }}</div>
      </div>

      <div class="d-flex col-md-4 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="handleRedirectDetailPage"
          :title="$t('update')"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="">{{ $t('update') }}</span>
        </button>
      </div>
    </div>
    <div class="d-flex align-items-center">
      <div class="card-title main-label py-4 border-bottom">
        [{{ $t('highLow.tradingMode') }}] {{ pageTitle || '...' }}
      </div>
    </div>
    <div class="card-body p-0">
      <section class="row">
        <div class="col-md-6">
          <div class="main-label mt-6">{{ $t('highLow.generalSetting') }}</div>
          <section class="">
            <!-- <div class="col-md-6"> -->
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.transactionStartTime') }}
              </div>
              <div class="value-title">{{ user.startTime }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.transactionEndTime') }}
              </div>
              <div class="value-title">
                {{ user.endTime }} ({{ $t('highLow.tomorrow') }})
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.sellOPtion') }}
              </div>
              <div class="value-title">
                {{ +user.allowResell ? 'On' : 'Off' }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.expiryTimeBeforeReceivingOrder') }}
              </div>
              <div class="value-title">{{ user.orderExpireTime }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.oddsMode') }}
              </div>
              <div class="value-title">{{ +user.oddsMode ? 'On' : 'Off' }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.xDay') }}
              </div>
              <div class="value-title">{{ user.restrictedDayUnit }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.maximumTimesOrderxDay') }}
              </div>
              <div class="value-title">{{ user.restrictedDayOrderTimes }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.orderAmountMaximumxDay') }}
              </div>
              <div class="value-title">
                {{ user.restrictedDayOrderAmount }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <template v-if="user.mode === 'H' || user.mode === 'HS'">
              <div class="d-flex mt-6">
                <div class="label-title">
                  {{ $t('highLow.maximumTimesOrderTimeFrame') }}
                </div>
                <div class="value-title">{{ user.restrictedOrderTimes }}</div>
              </div>
              <div class="d-flex mt-6">
                <div class="label-title">
                  {{ $t('highLow.orderAmountMaximumTimeFrame') }}
                </div>
                <div class="value-title">
                  {{ user.restrictedOrderAmount }} {{ $t('highLow.usdt') }}
                </div>
              </div>
            </template>
            <!-- </div> -->
            <!-- <div class="col-md-6"> -->
            <div class="d-flex mt-6">
              <div class="label-title">
                {{
                  $t('highLow.amountSuggestion', {
                    number: 1,
                  })
                }}
              </div>
              <div class="value-title">
                {{ user.suggestion1 }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{
                  $t('highLow.amountSuggestion', {
                    number: 2,
                  })
                }}
              </div>
              <div class="value-title">
                {{ user.suggestion2 }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{
                  $t('highLow.amountSuggestion', {
                    number: 3,
                  })
                }}
              </div>
              <div class="value-title">
                {{ user.suggestion3 }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.maximumOrderAmountPerOrder') }}
              </div>
              <div class="value-title">
                {{ user.maxUsdtPerOrder }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.maximumBCASTAmountPerOrder') }}
              </div>
              <div class="value-title">
                {{ user.maxBcastPerOrder }} {{ $t('highLow.bcast') }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.orderAmountMinimum') }}
              </div>
              <div class="value-title">
                {{ user.limitOrderMin }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.oddsFee') }}
              </div>
              <div class="value-title">{{ user.oddsFee }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.orderAmountUnit') }}
              </div>
              <div class="value-title">{{ user.orderUnit }}</div>
            </div>
            <!-- </div> -->
          </section>
        </div>
        <div class="col-md-6">
          <div class="main-label mt-6">{{ $t('highLow.payoutSetting') }}</div>
          <section class="">
            <!-- <div class="col-md-6"> -->
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.defaultPayout') }}
              </div>
              <div class="value-title">{{ user.payout }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.allowScalingViaUseBCAST') }}
              </div>
              <div class="value-title">
                {{ +user.scalingActive ? 'On' : 'Off' }}
              </div>
            </div>
            <div class="d-flex mt-6" v-if="+user.scalingActive">
              <div class="label-title">
                {{ $t('highLow.scalingValue') }}
              </div>
              <div class="value-title">{{ user.scalingValue }}</div>
            </div>
            <div class="d-flex mt-6" v-if="+user.scalingActive">
              <div class="label-title">
                {{ $t('highLow.scalingBCASTUseRateUPNecessary') }}
              </div>
              <div class="value-title">
                {{ user.scalingBcast }} {{ $t('highLow.bcast') }}
              </div>
            </div>
            <div class="d-flex mt-6" v-if="+user.scalingActive">
              <div class="label-title">
                {{ $t('highLow.payoutScalingUnit') }}
              </div>
              <div class="value-title">{{ user.payoutScalingUnit }}</div>
            </div>
            <div
              class="d-flex mt-6"
              v-if="+user.scalingActive || +user.rankScalingActive"
            >
              <div class="label-title">
                {{ $t('highLow.payoutMaximum') }}
              </div>
              <div class="value-title">{{ user.payoutMax }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.allowScalingViaHoldingBCAST') }}
              </div>
              <div class="value-title">
                {{ +user.rankScalingActive ? 'On' : 'Off' }}
              </div>
            </div>
            <div class="d-flex mt-6" v-if="+user.rankScalingActive">
              <div class="label-title">
                {{
                  $t('highLow.bcastRank', {
                    number: 1,
                  })
                }}
              </div>
              <div class="value-title">
                {{ user.rank1ScaleBcast }} {{ $t('highLow.payout') }}
              </div>
            </div>
            <div class="d-flex mt-6" v-if="+user.rankScalingActive">
              <div class="label-title">
                {{
                  $t('highLow.bcastRank', {
                    number: 2,
                  })
                }}
              </div>
              <div class="value-title">
                {{ user.rank2ScaleBcast }} {{ $t('highLow.payout') }}
              </div>
            </div>
            <div class="d-flex mt-6" v-if="+user.rankScalingActive">
              <div class="label-title">
                {{
                  $t('highLow.bcastRank', {
                    number: 3,
                  })
                }}
              </div>
              <div class="value-title">
                {{ user.rank3ScaleBcast }} {{ $t('highLow.payout') }}
              </div>
            </div>
          </section>
        </div>
      </section>

      <section class="row mt-8">
        <div class="col-md-6">
          <div class="main-label mt-6">{{ $t('highLow.limitSetting') }}</div>
          <section class="row">
            <!-- <div class="col-md-6"> -->
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.restricted') }}
              </div>
              <div class="value-title">{{ user.limitDayUnit }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.restrictedMaximumTimesOrderDay') }}
              </div>
              <div class="value-title">{{ user.limitOrderTimes }}</div>
            </div>
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.restrictedOrderAmountMaximumDay') }}
              </div>
              <div class="value-title">
                {{ user.limitOrderAmount }} {{ $t('highLow.usdt') }}
              </div>
            </div>
            <!-- <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.diffDirectionInterval') }}
              </div>
              <div class="value-title">{{ user.diffDirectionInterval }}</div>
            </div> -->
            <!-- </div> -->
            <!-- <div class="col-md-6"> -->
            <template v-if="user.mode === 'H' || user.mode === 'HS'">
              <div class="d-flex mt-6">
                <div class="label-title">
                  {{ $t('highLow.restrictedMaximumTimesOrderTimeFrame') }}
                </div>
                <div class="value-title">{{ user.limitOrderMax }}</div>
              </div>
              <div class="d-flex mt-6">
                <div class="label-title">
                  {{ $t('highLow.restrictedOrderAmountMaximumTimeFrame') }}
                </div>
                <div class="value-title">
                  {{ user.limitOrderMaxAmount }} {{ $t('highLow.usdt') }}
                </div>
              </div>
            </template>
            <!-- <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.sameDirectionInterval') }}
              </div>
              <div class="value-title">{{ user.sameDirectionInterval }}</div>
            </div> -->
            <!-- </div> -->
          </section>
        </div>
        <div class="col-md-6">
          <div class="main-label mt-6">
            {{ $t('highLow.emergencySetting') }}
          </div>
          <section class="row">
            <div class="d-flex mt-6">
              <div class="label-title">
                {{ $t('highLow.modeTradingEmergencyStopThreshold') }}
              </div>
              <div class="value-title">
                {{ user.stopThresholdValue }} {{ $t('highLow.usdt') }}
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { HighLowService } from '@/services/HighLowService'
import { defineComponent } from 'vue'
import { getPeriodByValue, getModeByValue } from '@/core/helpers/common.helper'

export default defineComponent({
  name: 'detail',
  mounted() {
    this.getDetailSetting(this.id)
  },
  computed: {
    id() {
      return this.$route.params.id as string
    },
  },
  watch: {
    id(newVal) {
      this.getDetailSetting(newVal)
    },
  },
  data() {
    return {
      loading: false,
      user: {
        startTime: '',
        endTime: '',
        allowResell: '',
        orderExpireTime: '',
        oddsMode: '',
        restrictedDayUnit: '',
        restrictedDayOrderTimes: '',
        restrictedDayOrderAmount: '',
        restrictedOrderTimes: '',
        restrictedOrderAmount: '',
        suggestion1: '',
        suggestion2: '',
        suggestion3: '',
        maxUsdtPerOrder: '',
        maxBcastPerOrder: '',
        mode: '',
        limitOrderMin: '',
        oddsFee: '',
        orderUnit: '',

        payout: '',
        scalingActive: '',
        scalingValue: '',
        scalingBcast: '',
        payoutScalingUnit: '',
        payoutMax: '',
        rankScalingActive: '',
        rank1ScaleBcast: '',
        rank2ScaleBcast: '',
        rank3ScaleBcast: '',

        limitDayUnit: '',
        limitOrderTimes: '',
        limitOrderAmount: '',
        diffDirectionInterval: '',
        limitOrderMax: '',
        limitOrderMaxAmount: '',
        sameDirectionInterval: '',

        stopThresholdValue: '',
      },
      pageTitle: '',
    }
  },
  methods: {
    handleBack() {
      // giang update loop back
      this.$router.push({
        name: 'high-low-setting-trading',
        query: { tab: 'trading' },
      })
    },
    handleRedirectDetailPage() {
      this.$router.push({
        name: 'high-low-setting-trading-detail',
        params: { id: this.id },
        query: { type: 'edit' },
      })
    },
    async getDetailSetting(id) {
      this.loading = true
      const response = await HighLowService.getTradingMode(id)
      this.loading = false
      const {
        data: {
          startTime,
          endTime,
          allowResell,
          orderExpireTime,
          oddsMode,
          restrictedDayUnit,
          restrictedDayOrderTimes,
          restrictedDayOrderAmount,
          restrictedOrderTimes,
          restrictedOrderAmount,
          suggestion1,
          suggestion2,
          suggestion3,
          maxUsdtPerOrder,
          maxBcastPerOrder,
          mode,
          limitOrderMin,
          oddsFee,
          orderUnit,

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
          period,

          limitDayUnit,
          limitOrderTimes,
          limitOrderAmount,
          diffDirectionInterval,
          limitOrderMax,
          limitOrderMaxAmount,
          sameDirectionInterval,
          stopThresholdValue,
        },
        status,
      } = response
      if (status === 200) {
        this.user = {
          startTime,
          endTime,
          allowResell,
          orderExpireTime,
          oddsMode,
          restrictedDayUnit,
          restrictedDayOrderTimes,
          restrictedDayOrderAmount,
          restrictedOrderTimes,
          restrictedOrderAmount,
          suggestion1,
          suggestion2,
          suggestion3,
          maxUsdtPerOrder,
          maxBcastPerOrder,
          mode,
          limitOrderMin,
          oddsFee,
          orderUnit,
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
        }
        this.pageTitle = `${getModeByValue(mode)} - ${getPeriodByValue(period)}`

        const timeStartTime = startTime.split(':')
        const dateStartTime = new Date(
          new Date().setUTCHours(
            timeStartTime[0],
            timeStartTime[1],
            timeStartTime[2],
          ),
        )
        this.user.startTime =
          (dateStartTime.getHours() < 10
            ? '0' + dateStartTime.getHours()
            : dateStartTime.getHours()) +
          ':' +
          (dateStartTime.getMinutes() < 10
            ? '0' + dateStartTime.getMinutes()
            : dateStartTime.getMinutes()) +
          ':' +
          (dateStartTime.getSeconds() < 10
            ? '0' + dateStartTime.getSeconds()
            : dateStartTime.getSeconds())

        const timeEndTime = endTime.split(':')
        const dateEndTime = new Date(
          new Date().setUTCHours(
            timeEndTime[0],
            timeEndTime[1],
            timeEndTime[2],
          ),
        )
        this.user.endTime =
          (dateEndTime.getHours() < 10
            ? '0' + dateEndTime.getHours()
            : dateEndTime.getHours()) +
          ':' +
          (dateEndTime.getMinutes() < 10
            ? '0' + dateEndTime.getMinutes()
            : dateEndTime.getMinutes()) +
          ':' +
          (dateEndTime.getSeconds() < 10
            ? '0' + dateEndTime.getSeconds()
            : dateEndTime.getSeconds())
        return
      }
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
  width: 350px;
}

.value-title {
  font-size: 1rem;
  font-weight: 500;
}
</style>
