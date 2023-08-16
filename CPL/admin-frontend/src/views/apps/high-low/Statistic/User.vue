<template>
  <div class="card p-8">
    <div class="row justify-content-between">
      <div class="row col-md-6">
        <!-- Date range -->
        <div class="col-md-6">
          <label class="form-label">{{ $t('highLow.date') }}</label>
          <date-range-picker-options
            :start-placeholder="$t('startDate')"
            :end-placeholder="$t('endDate')"
            v-model="dateRange"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
          ></date-range-picker-options>
        </div>
        <div class="col-md-6 align-self-end">
          <el-autocomplete
            class="w-100"
            v-model="searchText"
            :fetch-suggestions="getUsersByEmail"
            :placeholder="$t('highLow.mailAddress')"
            @select="handleSelect"
          />
        </div>
      </div>

      <div class="d-flex col-md-6 col-lg-4 align-self-end justify-content-end">
        <button
          class="btn btn-primary w-100 me-6"
          :disabled="loading"
          @click="onSearch"
          :title="$t('search')"
        >
          <i v-if="!loading" class="fas fa-search fa-fw mx-1"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span>{{ $t('search') }}</span>
        </button>
        <button
          class="btn btn-primary w-100"
          :disabled="loading"
          @click="onExport"
          :title="$t('download')"
        >
          <i v-if="!loading" class="fas fa-download fa-fw mx-1"></i>
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span>{{ $t('download') }}</span>
        </button>
      </div>
    </div>
    <div class="card-body p-0 mt-8 mb-7">
      <div class="row m-0">
        <div class="col-md-7 bg-gray-10 px-6 py-8 rounded-2 me-7">
          <h1 class="text-warning fw-bold">{{ $t('users') }}</h1>

          <div class="mt-6">
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.numberOfWithdrawalTimes') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(user.numberOfWithdrawalTimes).toLocaleString() }}
              </div>
            </div>

            <div class="hr-sperate"></div>

            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.accumulatedWithdrawalAmount') }}
              </div>
              <div class="fw-bold font-base">
                {{ user.acumulativeAmount }} USDT
              </div>
            </div>

            <div class="hr-sperate"></div>

            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.averageWithdrawalAmount') }}
              </div>
              <div class="fw-bold font-base">
                {{ user.averageWithdrawalAmount }} USDT
              </div>
            </div>

            <div class="hr-sperate"></div>

            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.accumulatedDeposits') }}
              </div>
              <div class="fw-bold font-base">
                {{ user.acumulativeDepositAmount }}
                USDT
              </div>
            </div>

            <div class="hr-sperate"></div>

            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.totalBalance') }}
              </div>
              <div class="fw-bold font-base">{{ user.totalBalance }} USDT</div>
            </div>

            <div class="hr-sperate"></div>

            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.orderTimes') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(user.orderTimes).toLocaleString() }}
              </div>
            </div>

            <div class="hr-sperate"></div>

            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.winTimes') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(user.winTimes).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.loseTimes') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(user.loseTimes).toLocaleString() }}
              </div>
            </div>
            <div class="hr-sperate"></div>
            <div class="d-flex justify-content-between">
              <div class="font-base text-gray-12">
                {{ $t('highLow.winRates') }}
              </div>
              <div class="fw-bold font-base">
                {{ Number(+user.winRate * 100).toLocaleString() }} %
              </div>
            </div>
          </div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.in') }}
            </div>
            <div class="fw-bold font-base">{{ user.getIn }} USDT</div>
          </div>

          <div class="hr-sperate"></div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.out') }}
            </div>
            <div class="fw-bold font-base">{{ user.out }} USDT</div>
          </div>

          <div class="hr-sperate"></div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.payoutRate') }}
            </div>
            <div class="fw-bold font-base">
              {{ Number(user.payoutRate).toLocaleString() }} %
            </div>
          </div>

          <div class="hr-sperate"></div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.bcastRanks', { number: 2 }) }}
            </div>
            <div class="fw-bold font-base">
              {{ Number(user.bcastRank).toLocaleString() }}
            </div>
          </div>

          <div class="hr-sperate"></div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.bcastAmount') }}
            </div>
            <div class="fw-bold font-base">{{ user.bcastAmount }} BCAST</div>
          </div>

          <div class="hr-sperate"></div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.orderLimitUsers') }}
            </div>
            <div class="fw-bold font-base">
              {{ +user.orderLimitUser == 1 ? 'Yes' : 'No' }}
            </div>
          </div>

          <div class="hr-sperate"></div>

          <div class="d-flex justify-content-between">
            <div class="font-base text-gray-12">
              {{ $t('highLow.operatingProfit') }}
            </div>
            <div class="fw-bold font-base">{{ user.operatingProfit }} USDT</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  endOfDay,
  endOfMonth,
  startOfDay,
  startOfMonth,
  startOfYear,
  subMonths,
} from 'date-fns'
import { defineComponent } from 'vue'
import { HighLowService } from '@/services/HighLowService'
import { useI18n } from 'vue-i18n'
import moment from 'moment'
import { formatNumberString } from '@/core/helpers/util'

export default defineComponent({
  name: 'user',
  setup() {
    const i18n = useI18n()

    const getLang = () => i18n.locale.value
    return {
      getLang,
    }
  },
  data() {
    return {
      cacheData: [],
      searchText: '',
      loading: false,
      tableReloadKey: 1,
      selectedUserId: -1,
      // Data
      user: {
        averageWithdrawalAmount: '0',
        bcastAmount: '0',
        bcastRank: '0',
        acumulativeAmount: '0',
        acumulativeDepositAmount: '0',
        loseTimes: '0',
        numberOfWithdrawalTimes: '0',
        operatingProfit: '0',
        orderLimitUser: '0',
        orderTimes: '0',
        payoutRate: '0',
        totalBalance: '0',
        winRate: '0',
        winTimes: '0',
        withdrawalRatio: '0',
        getIn: '0',
        out: '0',
      },
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
    }
  },
  computed: {
    query: function (): any {
      return {
        search_text: '',
        start_date: this.fromTime || undefined,
        end_date: this.toTime || undefined,
        user_id: this.searchText || undefined,
        page: 1,
        limit: 25,
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
  methods: {
    onSearch() {
      this.getStatisticUser()
    },
    async onExport() {
      const query = {
        ...this.query,
        lang: this.getLang(),
        start_date: this.getDateByUTC(+this.query.start_date, true),
        end_date: this.getDateByUTC(+this.query.end_date, false),
      }
      const { data, status } = await HighLowService.exportUsersStatistic(query)

      if (status === 200) {
        this.$toastr.success(this.$t('success'))
      }
    },
    validateDate(date: Date) {
      return date ? new Date(date).getTime() : ''
    },
    refreshTable() {
      this.tableReloadKey++
    },
    async getUsersByEmail(queryString: string, cb: (arg) => void) {
      if (queryString === '' && this.cacheData.length) {
        cb(this.cacheData)
        return
      }
      this.query.search_text = queryString
      this.loading = true
      const response = await HighLowService.getUsersBalance({ ...this.query })
      this.loading = false
      if (response && response.data && response.data.data) {
        const data = response.data.data
        if (data.length > 0) {
          const temp = data.map((item) => ({
            id: item.id,
            value: item.email,
          }))
          if (queryString === '' && this.cacheData.length === 0) {
            this.cacheData = temp
          }
          cb(temp)
          return
        }
      }
      cb([])
    },
    handleSelect(item) {
      this.selectedUserId = item.id
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
    async getStatisticUser() {
      this.query.user_id = this.selectedUserId
      const params = {
        ...this.query,
        start_date: this.getDateByUTC(+this.query.start_date, true),
        end_date: this.getDateByUTC(+this.query.end_date, false),
      }
      this.loading = true
      const response = await HighLowService.getUsersStatistic(params)
      this.loading = false

      if (response.status === 200) {
        const { data } = response
        const {
          averageWithdrawalAmount,
          bcastAmount,
          bcastRank,
          acumulativeAmount,
          acumulativeDepositAmount,
          loseTimes,
          numberOfWithdrawalTimes,
          operatingProfit,
          orderLimitUser,
          orderTimes,
          payoutRate,
          totalBalance,
          winRate,
          winTimes,
          withdrawalRatio,
          in: getIn,
          out,
        } = data

        this.user = {
          averageWithdrawalAmount: formatNumberString(averageWithdrawalAmount),
          bcastAmount: formatNumberString(bcastAmount),
          bcastRank,
          acumulativeAmount: formatNumberString(acumulativeAmount),
          acumulativeDepositAmount: formatNumberString(
            acumulativeDepositAmount,
          ),
          loseTimes,
          numberOfWithdrawalTimes,
          operatingProfit: formatNumberString(operatingProfit),
          orderLimitUser,
          orderTimes,
          payoutRate,
          totalBalance: formatNumberString(totalBalance),
          winRate,
          winTimes,
          withdrawalRatio,
          getIn: formatNumberString(getIn),
          out: formatNumberString(out),
        }
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
