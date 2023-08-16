<template>
  <div class="card p-8">
    <div class="row">
      <div class="col-md-2 offset-md-10">
        <div class="d-flex w-100 align-self-end justify-content-end">
          <button
            class="btn btn-danger mx-2"
            :disabled="loading"
            title="Generate"
            type="button"
            @click="handleGenerate"
          >
            <i v-show="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="">Generate</span>
          </button>
          <button
            class="btn btn-primary"
            :disabled="loading"
            :title="$t('reset')"
            type="button"
            @click="handleSubmit"
          >
            <i v-show="loading" class="fas fa-spinner fa-spin fa-fw"></i>
            <span class="">{{ $t('save') }}</span>
          </button>
        </div>
      </div>
    </div>
    <Form ref="leaderBoardForm">
      <div class="row">
        <div class="col-md-6">
          <label>{{ 'Investment plus (%)' }}</label>
          <Field
            name="investmentPlus"
            as="input"
            class="form-control"
            rules="required|isStringNumber|positiveNumber"
            v-model="formValue.investmentPlus"
            :disabled="loading"
          />
          <ErrorMessage name="investmentPlus" class="text-danger" />
        </div>
        <div class="col-md-6">
          <label>{{ 'Top 1 Investment plus' }}</label>
          <Field
            name="top1InvestmentPlus"
            as="input"
            class="form-control"
            rules="required|isRangeIntegerNumber|maxRange:1000000"
            v-model="formValue.top1InvestmentPlus"
            :disabled="loading"
          />
          <ErrorMessage name="top1InvestmentPlus" class="text-danger" />
        </div>
        <div class="col-md-6 mt-4">
          <label>{{ 'Win rate random (%)' }}</label>
          <Field
            name="winRateRandom"
            as="input"
            class="form-control"
            rules="required|isRangeFloatNumber:2|maxRange:100"
            v-model="formValue.winRateRandom"
            :disabled="loading"
          />
          <ErrorMessage name="winRateRandom" class="text-danger" />
        </div>
        <div class="col-md-6 mt-4">
          <label>{{ 'Top 1 Order plus' }}</label>
          <Field
            name="top1OrderPlus"
            as="input"
            class="form-control"
            rules="required|isRangeIntegerNumber"
            v-model="formValue.top1OrderPlus"
            :disabled="loading"
          />
          <ErrorMessage name="top1OrderPlus" class="text-danger" />
        </div>
        <div class="col-md-6 mt-4">
          <label>{{ 'Total order plus (%)' }}</label>
          <Field
            name="totalOrderPlus"
            as="input"
            class="form-control"
            rules="required|isStringNumber|positiveNumber"
            v-model="formValue.totalOrderPlus"
            :disabled="loading"
          />
          <ErrorMessage name="totalOrderPlus" class="text-danger" />
        </div>
        <div class="col-md-6 mt-4">
          <label>{{ 'Top 1 win rate random (%)' }}</label>
          <Field
            name="top1WinRateRandom"
            as="input"
            class="form-control"
            rules="required|isRangeFloatNumber:2|maxRange:100"
            v-model="formValue.top1WinRateRandom"
            :disabled="loading"
          />
          <ErrorMessage name="top1WinRateRandom" class="text-danger" />
        </div>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { defineComponent } from 'vue'
import { Field, Form, ErrorMessage } from 'vee-validate'
import { HighLowService } from '@/services/HighLowService'
import { HttpStatus } from '@/core/variables/common.enum'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'leaderBoard',
  components: {
    Field,
    Form,
    ErrorMessage,
  },
  data() {
    return {
      formValue: {
        investmentPlus: '',
        top1InvestmentPlus: '',
        winRateRandom: '',
        top1OrderPlus: '',
        totalOrderPlus: '',
        top1WinRateRandom: '',
      },
      formIds: {
        investmentPlus: '',
        top1InvestmentPlus: '',
        winRateRandom: '',
        top1OrderPlus: '',
        totalOrderPlus: '',
        top1WinRateRandom: '',
      },
      loading: false,
      dataUpdate: [],
    }
  },
  mounted() {
    setCurrentPageBreadcrumbs('menu.leaderBoard', ['highLow.highLow'])
    this.getSettings()
  },
  methods: {
    async handleGenerate() {
      await Swal.fire({
        text: 'Are you sure re-generate leader board user?',
        icon: 'question',
        buttonsStyling: false,
        showCancelButton: true,
        confirmButtonText: this.$t('Yes'),
        customClass: {
          confirmButton: 'btn btn-success',
          cancelButton: 'btn btn-secondary',
        },
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          this.loading = true
          await Promise.all([
            HighLowService.generateLeaderBoard({
              key: 'laravel:BO_TOP_RANK_YESTERDAY_TOTAL_ORDER',
            }),
            HighLowService.generateLeaderBoard({
              key: 'laravel:BO_TOP_9_USER_FAKE',
            }),
            HighLowService.generateLeaderBoard({
              key: 'laravel:BO_TOP_1_USER_FAKE',
            }),
            HighLowService.generateLeaderBoard({
              key: 'laravel:BO_TOP_RANK_YESTERDAY_TOTAL_INVEST',
            }),
          ])
          // call api clean cache
        },
      }).then((result) => {
        this.loading = false
        if (result.isConfirmed) {
          this.$toastr.success(this.$t('success'))
        }
      })
    },
    async handleSubmit() {
      const form = await (this.$refs.leaderBoardForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('error'))
        return
      }
      const data = [
        {
          id: this.formIds.investmentPlus,
          code: 'lb_invest',
          value: this.formValue.investmentPlus,
        },
        {
          id: this.formIds.winRateRandom,
          code: 'lb_win_rate',
          value: this.formValue.winRateRandom,
        },
        {
          id: this.formIds.totalOrderPlus,
          code: 'lb_order',
          value: this.formValue.totalOrderPlus,
        },
        {
          id: this.formIds.top1InvestmentPlus,
          code: 'lb_t1_invest',
          value: this.formValue.top1InvestmentPlus,
        },
        {
          id: this.formIds.top1OrderPlus,
          code: 'lb_t1_order',
          value: this.formValue.top1OrderPlus,
        },
        {
          id: this.formIds.top1WinRateRandom,
          code: 'lb_t1_win_rate',
          value: this.formValue.top1WinRateRandom,
        },
      ]
      const res = await HighLowService.updateSettings(data)
      this.loading = false
      if (res.status === HttpStatus.OK) {
        this.$toastr.success(this.$t('success'))
        return
      }
      this.$toastr.error(this.$t('error'))
    },
    async getSettings() {
      const res = await HighLowService.getSettings({ page: 1, limit: 50 })
      const { data } = res.data
      // mapping data bo-setting to formValue
      const lb_invest = data.filter((elm) => elm.code === 'lb_invest')
      if (lb_invest.length) {
        this.formValue.investmentPlus = lb_invest[0].value
        this.formIds.investmentPlus = lb_invest[0].id
      }

      const lb_win_rate = data.filter((elm) => elm.code === 'lb_win_rate')
      if (lb_win_rate.length) {
        this.formValue.winRateRandom = lb_win_rate[0].value
        this.formIds.winRateRandom = lb_win_rate[0].id
      }

      const lb_order = data.filter((elm) => elm.code === 'lb_order')
      if (lb_order.length) {
        this.formValue.totalOrderPlus = lb_order[0].value
        this.formIds.totalOrderPlus = lb_order[0].id
      }

      const lb_t1_invest = data.filter((elm) => elm.code === 'lb_t1_invest')
      if (lb_t1_invest.length) {
        this.formValue.top1InvestmentPlus = lb_t1_invest[0].value
        this.formIds.top1InvestmentPlus = lb_t1_invest[0].id
      }

      const lb_t1_order = data.filter((elm) => elm.code === 'lb_t1_order')
      if (lb_t1_order.length) {
        this.formValue.top1OrderPlus = lb_t1_order[0].value
        this.formIds.top1OrderPlus = lb_t1_order[0].id
      }

      const lb_t1_win_rate = data.filter((elm) => elm.code === 'lb_t1_win_rate')
      if (lb_t1_win_rate.length) {
        this.formValue.top1WinRateRandom = lb_t1_win_rate[0].value
        this.formIds.top1WinRateRandom = lb_t1_win_rate[0].id
      }
    },
  },
})
</script>
