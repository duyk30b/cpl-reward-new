<template>
  <div class="card p-8">
    <h1 class="row m-0 fw-bold mb-6">Total balance</h1>
    <div class="row m-0 mb-8">
      <div class="col bg-light-warning px-6 py-8 me-7 rounded-2">
        <span class="svg-icon svg-icon-3x svg-icon-warning d-block my-2">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              xmlns="http://www.w3.org/2000/svg"
              x="8"
              y="9"
              width="3"
              height="10"
              rx="1.5"
              fill="black"
            ></rect>
            <rect
              xmlns="http://www.w3.org/2000/svg"
              opacity="0.5"
              x="13"
              y="5"
              width="3"
              height="14"
              rx="1.5"
              fill="black"
            ></rect>
            <rect
              xmlns="http://www.w3.org/2000/svg"
              x="18"
              y="11"
              width="3"
              height="8"
              rx="1.5"
              fill="black"
            ></rect>
            <rect
              xmlns="http://www.w3.org/2000/svg"
              x="3"
              y="13"
              width="3"
              height="6"
              rx="1.5"
              fill="black"
            ></rect>
          </svg>
        </span>
        <div>
          <a href="#" class="text-warning fw-bold fs-6 me-7">
            {{ $t('highLow.bcast') }}:
          </a>
          <span class="fw-bold">{{ getBcast }} {{ $t('highLow.bcast') }}</span>
        </div>
      </div>
      <div class="col bg-light-primary px-6 py-8 me-7 rounded-2">
        <span class="svg-icon svg-icon-3x svg-icon-primary d-block my-2"
          ><svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              xmlns="http://www.w3.org/2000/svg"
              opacity="0.5"
              x="11.364"
              y="20.364"
              width="16"
              height="2"
              rx="1"
              transform="rotate(-90 11.364 20.364)"
              fill="black"
            ></rect>
            <rect
              xmlns="http://www.w3.org/2000/svg"
              x="4.36396"
              y="11.364"
              width="16"
              height="2"
              rx="1"
              fill="black"
            ></rect>
          </svg>
        </span>
        <div>
          <a href="#" class="text-primary fw-bold fs-6 me-7">
            {{ $t('highLow.cashbackBalance') }}:
          </a>
          <span class="fw-bold"
            >{{ getCashback }} {{ $t('highLow.usdt') }}</span
          >
        </div>
      </div>
      <div class="col bg-light-danger px-6 py-8 rounded-2">
        <span class="svg-icon svg-icon-3x svg-icon-danger d-block my-2">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            height="24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              xmlns="http://www.w3.org/2000/svg"
              opacity="0.3"
              d="M21.25 18.525L13.05 21.825C12.35 22.125 11.65 22.125 10.95 21.825L2.75 18.525C1.75 18.125 1.75 16.725 2.75 16.325L4.04999 15.825L10.25 18.325C10.85 18.525 11.45 18.625 12.05 18.625C12.65 18.625 13.25 18.525 13.85 18.325L20.05 15.825L21.35 16.325C22.35 16.725 22.35 18.125 21.25 18.525ZM13.05 16.425L21.25 13.125C22.25 12.725 22.25 11.325 21.25 10.925L13.05 7.62502C12.35 7.32502 11.65 7.32502 10.95 7.62502L2.75 10.925C1.75 11.325 1.75 12.725 2.75 13.125L10.95 16.425C11.65 16.725 12.45 16.725 13.05 16.425Z"
              fill="black"
            ></path>
            <path
              xmlns="http://www.w3.org/2000/svg"
              d="M11.05 11.025L2.84998 7.725C1.84998 7.325 1.84998 5.925 2.84998 5.525L11.05 2.225C11.75 1.925 12.45 1.925 13.15 2.225L21.35 5.525C22.35 5.925 22.35 7.325 21.35 7.725L13.05 11.025C12.45 11.325 11.65 11.325 11.05 11.025Z"
              fill="black"
            ></path>
          </svg>
        </span>
        <div>
          <a href="#" class="text-danger fw-bold fs-6 me-7">
            {{ $t('highLow.usdt') }}:
          </a>
          <span class="fw-bold">{{ getUsdt }} {{ $t('highLow.usdt') }}</span>
        </div>
      </div>
    </div>
    <div class="card-body p-0">
      <h1 class="row m-0 fw-bold mb-6">Details</h1>
      <Detail />
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { BigNumber } from 'bignumber.js'
import { setPageFliud } from '@/core/helpers/common.helper'
import { UserBalanceService } from '@/services/UserBalanceService'
import { defineComponent } from 'vue'
import Detail from './Detail.vue'

export default defineComponent({
  name: 'userBalance',
  components: {
    Detail,
  },
  data() {
    return {
      bcast: 0,
      cashback: 0,
      usdt: 0,
      loading: false,
    }
  },
  computed: {
    getBcast(): string {
      const temp = new BigNumber(this.bcast)
      return temp.toFormat() || '0'
    },
    getCashback(): string {
      const temp = new BigNumber(this.cashback)
      return temp.toFormat() || '0'
    },
    getUsdt(): string {
      const temp = new BigNumber(this.usdt)
      return temp.toFormat() || '0'
    },
  },
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('highLow.userBalance', ['highLow.highLow'])
    this.getSummary()
  },
  methods: {
    async getSummary() {
      this.loading = true
      const response = await UserBalanceService.getBalanceSummary()

      if (response.status === 200) {
        const { bcast, cashback, usdt } = response.data
        this.bcast = bcast.total
        this.cashback = cashback.total
        this.usdt = usdt.total
      } else {
        this.$toastr.error('Something went wrong')
      }

      this.loading = false
    },
  },
})
</script>
