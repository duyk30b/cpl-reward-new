<template>
  <div class="card spinner">
    <div class="card-header border-0 pt-6 mb-3">
      <div class="card-title">{{ $t('dividendScreen.dividendDetail') }}</div>
      <div class="card-toolbar d-flex">
        <button
          class="btn btn-primary"
          :disabled="dividendDetail.status !== STATUS.PENDING"
          @click="redirectToEditPage"
        >
          {{ $t('edit') }}
        </button>
      </div>
    </div>

    <div class="row mx-5" v-if="Object.keys(dividendDetail).length > 0">
      <div class="col-6">
        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.dividendName')
          }}</label>
          <span class="detail-value">{{ dividendDetail.name }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.targetCurrency')
          }}</label>
          <span class="detail-value">{{
            uppercase(dividendDetail.target_currency)
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.distributedCurrency')
          }}</label>
          <span class="detail-value">{{
            uppercase(dividendDetail.distributed_currency)
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{ $t('dividendScreen.status') }}</label>
          <span class="detail-value">{{
            $t(`dividendScreen.statusList.${dividendDetail.status}`)
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.maximumUsers')
          }}</label>
          <span class="detail-value" v-if="dividendDetail.is_limited">{{
            dividendDetail.maximum_user_numbers
          }}</span>
          <span class="detail-value" v-else>{{
            $t('dividendScreen.unlimited')
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.joinedUser')
          }}</label>
          <span class="detail-value" v-if="dividendAdvanced">{{
            dividendDetail.maximum_user_numbers
              ? Math.min(
                  dividendAdvanced.total_joined_user,
                  dividendDetail.maximum_user_numbers,
                )
              : dividendAdvanced.total_joined_user
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.accumulatedDividend')
          }}</label>
          <span class="detail-value"
            >{{
              formatCurrencyAmount(
                dividendDetail.total_distributed_amount,
                dividendDetail.distributed_currency,
                0,
              )
            }}
            {{ uppercase(dividendDetail.distributed_currency) }}</span
          >
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.lastDividend')
          }}</label>
          <span
            class="detail-value"
            v-if="
              (dividendAdvanced.has_user &&
                dividendDetail.dividend_span === DIVIDEND_SPAN.ONCE) ||
              dividendAdvanced.last_distributed_amount < 0
            "
            >-</span
          >
          <span class="detail-value" v-else>
            {{
              formatCurrencyAmount(
                dividendAdvanced.last_distributed_amount,
                dividendDetail.distributed_currency,
                0,
              )
            }}
            {{ uppercase(dividendDetail.distributed_currency) }}
          </span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.totalTargetBalance')
          }}</label>
          <span
            class="detail-value"
            v-if="dividendDetail.target_currency === 'all'"
            >{{
              formatCurrencyAmount(
                dividendDetail.estimate_user_balance,
                dividendDetail.target_currency,
                0,
              )
            }}
            {{ 'usd'.toUpperCase() }}</span
          >
          <span class="detail-value" v-else
            >{{
              formatCurrencyAmount(
                dividendDetail.estimate_user_balance,
                dividendDetail.target_currency,
                0,
              )
            }}
            {{ uppercase(dividendDetail.target_currency) }}</span
          >
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.nextGuessDividend')
          }}</label>
          <span
            class="detail-value"
            v-if="
              (dividendAdvanced.has_user &&
                dividendDetail.dividend_span === DIVIDEND_SPAN.ONCE) ||
              dividendDetail.status === STATUS.CANCELLED ||
              dividendDetail.status === STATUS.FINISHED
            "
            >-</span
          >
          <span class="detail-value" v-else
            >{{
              formatCurrencyAmount(
                dividendAdvanced.estimate_distribute_amount,
                dividendDetail.distributed_currency,
                0,
              )
            }}
            {{ uppercase(dividendDetail.distributed_currency) }}</span
          >
        </div>

        <div class="detail-item d-flex" v-if="dividendDetail.is_gift === 1">
          <label class="detail-label">{{ $t('dividendScreen.gift') }}</label>
          <span class="detail-value">
            {{
              formatCurrencyAmount(
                dividendDetail.gift_amount,
                dividendDetail.gift_currency,
                0,
              )
            }}
            {{ uppercase(dividendDetail.gift_currency) }}
          </span>
        </div>
      </div>

      <div class="col-6">
        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.maximumDividendAmount')
          }}</label>
          <span
            class="detail-value"
            v-if="dividendDetail.dividend_limited === 0"
            >{{ $t('dividendScreen.unlimited') }}</span
          >
          <span class="detail-value" v-else>
            {{ formatCurrencyAmount(dividendDetail.maximum_dividend_amount) }}
            {{ uppercase(dividendDetail.distributed_currency) }}
          </span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.dividendSpan')
          }}</label>
          <span class="detail-value">{{
            $t(`dividendScreen.span.${dividendDetail.dividend_span}`)
          }}</span>
        </div>

        <div
          class="detail-item d-flex"
          v-if="
            dividendDetail.dividend_span !== DIVIDEND_SPAN.ONCE &&
            dividendDetail.dividend_span !== DIVIDEND_SPAN.DAILY
          "
        >
          <label class="detail-label">{{
            $t('dividendScreen.dividendDate')
          }}</label>
          <span
            class="detail-value"
            v-if="dividendDetail.dividend_date_month"
            >{{ `${dividendDetail.dividend_date_month}月` }}</span
          >
          <span class="detail-value" v-if="dividendDetail.dividend_date_day">{{
            !isNaN(dividendDetail.dividend_date_day)
              ? `${dividendDetail.dividend_date_day}日`
              : $t(dividendDetail.dividend_date_day)
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.interestRateType')
          }}</label>
          <span class="detail-value">{{
            $t(
              `dividendScreen.dividendCalculatedMode.${dividendDetail.dividend_calculated_mode}`,
            )
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.dividendRate')
          }}</label>
          <span
            class="detail-value"
            v-if="
              dividendDetail.dividend_calculated_mode !==
              DIVIDEND_CALCULATED_MODE.NON_CONDITION
            "
            >{{ percentNoDecimal(dividendDetail.dividend_rate) }}</span
          >
          <span class="detail-value" v-else
            >{{
              formatCurrencyAmount(
                dividendDetail.dividend_rate,
                dividendDetail.distributed_currency,
                '0',
              )
            }}
            {{ uppercase(dividendDetail.distributed_currency) }}</span
          >
        </div>

        <div
          class="detail-item d-flex"
          v-if="dividendDetail.dividend_span !== DIVIDEND_SPAN.ONCE"
        >
          <label class="detail-label">{{
            $t('dividendScreen.executingTime')
          }}</label>
          <span class="detail-value">
            {{ formatTwoDigitNumber(time.hour) }} :
            {{ formatTwoDigitNumber(time.minute) }}</span
          >
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.startDate')
          }}</label>
          <span class="detail-value">{{
            formatUTCToLocalTime12h(dividendDetail.start_date)
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{ $t('dividendScreen.endDate') }}</label>
          <span class="detail-value" v-if="dividendDetail.unlimited_end_date">{{
            $t('dividendScreen.undecided')
          }}</span>
          <span class="detail-value" v-else>{{
            formatUTCToLocalTime12h(dividendDetail.end_date)
          }}</span>
        </div>

        <div class="detail-item d-flex">
          <label class="detail-label">{{
            $t('dividendScreen.distributeType')
          }}</label>
          <span class="detail-value">{{
            $t(
              `dividendScreen.distributeTypes.${dividendDetail.distribute_type}`,
            )
          }}</span>
        </div>

        <div
          class="detail-item d-flex"
          v-if="
            dividendDetail.distribute_type === DISTRIBUTE_TYPE.INDICATED_BALANCE
          "
        >
          <label class="detail-label">{{
            $t('dividendScreen.dividendCondition')
          }}</label>
          <span class="detail-value"
            >{{ '>=' }}
            {{
              formatCurrencyAmount(
                dividendDetail.distribute_amount,
                dividendDetail.target_currency,
                '0',
              )
            }}
            {{
              uppercase(
                dividendDetail.target_currency === 'all'
                  ? 'usd'
                  : dividendDetail.target_currency,
              )
            }}</span
          >
        </div>
      </div>
    </div>

    <div class="row mx-5 mb-5">
      <div class="col-1">
        <button class="btn btn-primary" @click="back">Back</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { DividendService } from '@/views/dividend/services/DividendService'
import {
  formatCurrencyAmount as formatCurrencyAmountHelper,
  convertUTCToLocalTime,
  formatUTCToLocalTime,
} from '@/core/helpers/util'
import numeral from 'numeral'
import { Mutations } from '@/store/enums/StoreEnums'
import {
  DIVIDEND_SPAN,
  DIVIDEND_CALCULATED_MODE,
  DISTRIBUTE_TYPE,
  STATUS,
} from '@/views/dividend/definition/dividend.enum'
import {
  Dividend,
  DividendAdvanced,
} from '@/views/dividend/definition/dividend.interface'

export default defineComponent({
  name: 'Dividend Detail',

  data() {
    return {
      dividendDetail: {} as Dividend,
      dividendAdvanced: {} as DividendAdvanced,
      STATUS,
      DIVIDEND_SPAN,
      DIVIDEND_CALCULATED_MODE,
      DISTRIBUTE_TYPE,
      time: {},
    }
  },
  created() {
    this.getDividendDetail()
  },
  mounted() {
    setCurrentPageBreadcrumbs('dividendScreen.dividendDetail', [
      'dividendScreen.dividendList',
    ])
  },
  methods: {
    async getDividendDetail() {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      const dividendId = this.$route.params.id || ''
      const { success, data } = await DividendService.getDividendDetail(
        +dividendId,
      )
      if (success) {
        this.dividendDetail = data.data
        this.getAdvancedDividendDetail()
        if (
          this.dividendDetail &&
          'dividend_date_hour' in this.dividendDetail &&
          'dividend_date_minute' in this.dividendDetail
        ) {
          const hour = this.dividendDetail['dividend_date_hour']
          const minute = this.dividendDetail['dividend_date_minute']
          this.time = convertUTCToLocalTime(hour, minute)
        }
      }
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },
    async getAdvancedDividendDetail() {
      if (this.dividendDetail) {
        const dividendDetail = this.dividendDetail as any
        const { success, data } = await DividendService.getDividendAdvanced(
          +dividendDetail.id,
        )
        if (success) {
          this.dividendAdvanced = data.data
        }
      }
    },

    back() {
      const query = {}
      if (this.$route.query.page && this.$route.query.size) {
        query['page'] = this.$route.query.page
        query['size'] = this.$route.query.size
      }
      this.$router.push({ name: 'dividend.listScreen', query })
    },

    redirectToEditPage() {
      if (this.dividendDetail.status === STATUS.PENDING) {
        this.$router.push({
          name: 'dividend.editScreen',
          params: { id: this.dividendDetail.id },
        })
      }
    },

    formatCurrencyAmount(
      amount,
      currency,
      zeroValue,
      numberOfDecimalDigits = null,
    ) {
      return formatCurrencyAmountHelper(
        amount,
        currency,
        zeroValue,
        numberOfDecimalDigits,
      )
    },

    percentNoDecimal(value, currency = 'btc') {
      return `${formatCurrencyAmountHelper(
        numeral(value * 100).format('0.00000000'),
        currency,
        null,
        null,
      )}%`
    },

    formatUTCToLocalTime12h(date, format = 'YYYY-MM-DD hh:mm A') {
      return formatUTCToLocalTime(date, format)
    },

    uppercase(value) {
      if (value) {
        return value.toUpperCase()
      }
      return ''
    },

    formatTwoDigitNumber(number) {
      return ('0' + number).slice(-2)
    },
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/dividend/scss/detail.scss';
</style>
