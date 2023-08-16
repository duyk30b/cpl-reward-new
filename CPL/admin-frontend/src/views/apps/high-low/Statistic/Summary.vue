<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-6">
        <!-- Date range -->
        <div class="col-md-10">
          <label class="form-label">{{ $t('highLow.date') }}</label>
          <date-range-picker-options
            :start-placeholder="$t('startDate')"
            :end-placeholder="$t('endDate')"
            v-model="dateRange"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
      </div>

      <div class="d-flex col-md-6 col-lg-4 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100 me-8"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="">{{ $t('search') }}</span>
        </button>
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onExport"
          :title="$t('downloadCSV')"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <div class="">{{ $t('downloadCSV') }}</div>
        </button>
      </div>
    </div>
    <div class="card-body p-0 mt-8 mb-7">
      <div class="d-flex flex-wrap m-0">
        <div class="col-md-7 bg-gray-9 px-6 py-8 rounded-2 me-7 mb-5">
          <div class="mt-6">
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.numberOfUsers') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.numberOfUsers).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.activeUsers') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.activeUsers).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.winningUsers') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.winningUsers).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.losingUsers') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.losingUsers).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.userWins') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.userWins).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.userLose') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.userLoses).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.userWinRates') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.userWinRate).toLocaleString() }} %
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.totalUserBalance') }}
              </div>
              <div class="fw-bold font-base">
                {{ summary.totalUserBalance }} USDT
              </div>
            </div>
          </div>
          <div class="">
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.numberOfWithdrawalTimes') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.numberOfWithdrawalTimes).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.numberOfWithdrawers') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.numberOfWithdrawers).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.numberOfDepositors') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.numberOfDepositors).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.accumulatedWithdrawalAmount') }}
              </div>
              <div class="fw-bold font-base">
                {{ summary.accumulatedWithdrawalAmount }}
                USDT
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.averageWithdrawalAmount') }}
              </div>
              <div class="fw-bold font-base">
                {{ summary.averageWithdrawalAmount }}
                USDT
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.accumulatedDeposits') }}
              </div>
              <div class="fw-bold font-base">
                {{ summary.acumulativeDepositAmount }}
                USDT
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.withdrawalRatio') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.withdrawalRatio).toLocaleString() }} %
              </div>
            </div>
          </div>
          <div class="">
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.operatingProfit') }}
              </div>
              <div class="fw-bold font-base">
                {{ summary.operatingProfit }} USDT
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.orderTimes') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.orderTimes).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.in') }}
              </div>
              <div class="fw-bold font-base">{{ summary.in }} USDT</div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.out') }}
              </div>
              <div class="fw-bold font-base">{{ summary.out }} USDT</div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.payoutRate') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.payoutRate).toLocaleString() }} %
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.bcastRank', { number: 1 }) }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.bcastRankOne).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.bcastRank', { number: 2 }) }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.bcastRankTwo).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.bcastRank', { number: 3 }) }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.bcastRankThree).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.orderLimitUsers') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(summary.orderLimitUsers).toLocaleString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  endOfMonth,
  startOfMonth,
  subMonths,
  startOfYear,
  startOfDay,
  endOfDay,
} from 'date-fns'
import { defineComponent } from 'vue'
import { HighLowService } from '@/services/HighLowService'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { formatNumberString } from '@/core/helpers/util'

export default defineComponent({
  name: 'summary',
  setup() {
    const i18n = useI18n()

    const getLang = () => i18n.locale.value
    return {
      getLang,
    }
  },
  data() {
    return {
      loading: false,
      tableReloadKey: 1,
      // date
      dateRange: [startOfDay(startOfYear(new Date())), endOfDay(new Date())],
      shortcuts: [
        {
          text: this.$t('highLow.lastMonth'),
          value: () => {
            const end = endOfMonth(subMonths(new Date(), 1))
            const start = startOfMonth(subMonths(new Date(), 1))
            return [start, end]
          },
        },
        {
          text: this.$t('highLow.thisMonth'),
          value: () => {
            const end = new Date()
            const start = startOfMonth(new Date())
            return [start, end]
          },
        },
      ],
      summary: {
        activeUsers: '0',
        acumulativeDepositAmount: '0',
        averageWithdrawalAmount: '0',
        in: '0',
        losingUsers: '0',
        numberOfDepositors: '0',
        numberOfUsers: '0',
        numberOfWithdrawalTimes: '0',
        numberOfWithdrawers: '0',
        operatingProfit: '0',
        orderLimitUsers: '0',
        orderTimes: '0',
        out: '0',
        payoutRate: '0',
        totalUserBalance: '0',
        userLoses: '0',
        userWinRate: '0',
        userWins: '0',
        winningUsers: '0',
        withdrawalRatio: '0',
        bcastRankOne: '0',
        bcastRankThree: '0',
        bcastRankTwo: '0',
        accumulatedWithdrawalAmount: '0',
      },
    }
  },
  computed: {
    query: function (): any {
      return {
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
      }
    },
    fromTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => this.validateDate(item))[0]
        .toString()
    },
    toTime: function (): string {
      return Array.prototype.slice
        .call(this.dateRange)
        .map((item) => this.validateDate(item))[1]
        .toString()
    },
  },
  mounted() {
    this.getDataSummary()
  },
  methods: {
    onSearch() {
      this.getDataSummary()
      // this.refreshTable()
    },
    async onExport() {
      const query = {
        ...this.query,
        lang: this.getLang(),
        start_date: this.getDateByUTC(+this.query.start_date, true),
        end_date: this.getDateByUTC(+this.query.end_date, false),
      }
      const { data, status } = await HighLowService.exportStatisticSummary(
        query,
      )

      if (status === 200) {
        this.$toastr.success(this.$t('success'))
      }
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    refreshTable() {
      this.loading = true

      this.tableReloadKey++
    },
    getDateByUTC(inputDate, isStartDate) {
      const data = new Date(inputDate)
      const date = data.getDate()
      const month =
        data.getMonth() + 1 < 10
          ? `0${data.getMonth() + 1}`
          : data.getMonth() + 1
      const year = data.getFullYear()
      const newDate = moment.utc(`${year}-${month}-${date} 00:00:00`)
      return isStartDate ? newDate.valueOf() : newDate.valueOf() + 86399000
    },
    async getDataSummary() {
      const params = {
        ...this.query,
        start_date: this.getDateByUTC(+this.query.start_date, true),
        end_date: this.getDateByUTC(+this.query.end_date, false),
      }
      this.loading = true
      const { data, status } = await HighLowService.getStatisticSummary(params)
      this.loading = false
      if (status === 200) {
        const {
          activeUsers,
          acumulativeAmount,
          acumulativeDepositAmount,
          averageWithdrawalAmount,
          in: getIn,
          losingUsers,
          numberOfDepositors,
          numberOfUsers,
          numberOfWithdrawalTimes,
          numberOfWithdrawers,
          operatingProfit,
          orderLimitUsers,
          orderTimes,
          out,
          payoutRate,
          totalUserBalance,
          userLoses,
          userWinRate,
          userWins,
          winningUsers,
          withdrawalRatio,
          bcastRankOne,
          bcastRankThree,
          bcastRankTwo,
        } = data

        this.summary = {
          activeUsers,
          acumulativeDepositAmount: formatNumberString(
            acumulativeDepositAmount,
          ),
          averageWithdrawalAmount: formatNumberString(averageWithdrawalAmount),
          in: formatNumberString(getIn),
          losingUsers,
          numberOfDepositors,
          numberOfUsers,
          numberOfWithdrawalTimes,
          numberOfWithdrawers,
          operatingProfit: formatNumberString(operatingProfit),
          orderLimitUsers,
          orderTimes,
          out: formatNumberString(out),
          payoutRate,
          totalUserBalance: formatNumberString(totalUserBalance),
          userLoses,
          userWinRate,
          userWins,
          winningUsers,
          withdrawalRatio,
          bcastRankOne,
          bcastRankThree,
          bcastRankTwo,
          accumulatedWithdrawalAmount: formatNumberString(acumulativeAmount),
        }
      } else {
        this.$toastr.error(this.$t('error'))
        return
      }
    },
  },
})
</script>
<style lang="scss" scoped>
.hr-sperate {
  height: 1px;
  width: 100%;
  background-color: #f3f3f3;
  margin: 3px 0;
}
</style>
