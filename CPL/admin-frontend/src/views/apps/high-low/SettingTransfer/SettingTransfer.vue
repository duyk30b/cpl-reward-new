<template>
  <div class="card p-8">
    <div class="row">
      <div class="col-md-2 offset-md-10">
        <div class="d-flex w-100 align-self-end justify-content-end">
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
    <Form ref="settingTransferForm">
      <div class="row">
        <div class="col-md-2">
          <Field name="btc_transfer_pair" class="form-control">
            <div class="form-group">
              <label class="fs-6 fw-bold">{{ $t('highLow.pair') }}</label>
            </div>
            <select
              name="pair"
              v-model="pairSelected"
              class="form-control"
              @change="handleChangePair"
            >
              <option v-for="pair of pairList" :key="pair.coin" :value="pair">
                {{
                  `${pair.coin.toUpperCase()}/${pair.currency.toUpperCase()}`
                }}
              </option>
            </select>
          </Field>
        </div>
        <div class="col-md-2 offset-md-2">
          <Field name="transferActive" class="form-control">
            <div class="form-group">
              <label for="transferActive" class="white-space">
                {{ $t('highLow.activeBTCTransfer') }}
              </label>
              <div
                class="form-check form-switch form-switch-lg form-check-custom form-check-solid mt-2"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  name="transferActive"
                  v-model="formValue.transferActive"
                  :disabled="loading"
                />
              </div>
            </div>
          </Field>
        </div>
      </div>
      <div class="row">
        <div class="col-md-3 offset-md-4">
          <label
            >{{ $t('highLow.minimumAmountTransfer') }} ({{
              pairSelected.coin
            }})</label
          >
          <Field
            name="transferMinAmount"
            as="input"
            class="form-control"
            rules="isStringNumber|positiveNumber|maxLength:18"
            v-model="formValue.transferMinAmount"
            :disabled="loading"
          />
          <ErrorMessage name="transferMinAmount" class="text-danger" />
        </div>
        <div class="col-md-3">
          <label
            >{{ $t('highLow.maximumAmountTransfer') }} ({{
              pairSelected.coin
            }})</label
          >
          <Field
            name="transferMaxAmount"
            as="input"
            class="form-control"
            :rules="`isStringNumber|min:${formValue.transferMinAmount}|maxLength:18`"
            v-model="formValue.transferMaxAmount"
            :disabled="loading"
          />
          <ErrorMessage name="transferMaxAmount" class="text-danger" />
        </div>
        <div class="col-md-2" v-if="pairSelected.coin === 'CASTLE'">
          <label
            >{{ $t('highLow.maximumAmountTransferPerDay') }} ({{
              pairSelected.coin
            }})</label
          >
          <Field
            name="transferMaxAmountPerDay"
            as="input"
            class="form-control"
            rules="isStringNumber|min:0|maxLength:18"
            v-model="formValue.transferMaxAmountPerDay"
            :disabled="loading"
          />
          <ErrorMessage name="transferMaxAmountPerDay" class="text-danger" />
        </div>
      </div>
      <div class="row mt-4">
        <div class="d-flex col-md-1 offset-md-4 align-items-center">
          <span :style="{ marginRight: '5px' }"
            >{{ $t('highLow.inBTC') }} %
          </span>
          <input
            class="form-check-input"
            type="checkbox"
            v-model="isDisabledFeeAmount"
            :disabled="loading"
          />
        </div>
        <div class="col-md-3" v-if="!isDisabledFeeAmount">
          <label> {{ $t('highLow.transferFee') }} (USDT) </label>
          <Field
            name="transferFee"
            as="input"
            class="form-control"
            rules="isStringNumber|positiveNumber|maxLength:6"
            v-model="formValue.transferFee"
            :disabled="loading"
          />
          <ErrorMessage name="transferFee" class="text-danger" />
        </div>
        <div class="col-md-3" v-if="isDisabledFeeAmount">
          <label> {{ $t('highLow.transferFee') }} (%) </label>
          <Field
            name="transferFeeRatio"
            as="input"
            class="form-control"
            rules="isStringNumber|positiveNumber|maxLength:6"
            v-model="formValue.transferFeeRatio"
            :disabled="loading"
          />
          <ErrorMessage name="transferFeeRatio" class="text-danger" />
        </div>
        <div class="col-md-8 offset-md-4 mt-2" v-if="!isDisabledFeeAmount">
          {{ $t('highLow.btcTransferFeeNote') }}
        </div>
      </div>
      <div class="row mt-4" v-if="isDisabledFeeAmount">
        <div class="col-md-8 offset-md-4">
          <label> {{ $t('highLow.minMaxAmount') }} </label>
        </div>
        <div class="col-md-4 offset-md-4">
          <label> {{ $t('highLow.tableBTC.from') }} (USDT)</label>
          <Field
            name="transferMinFee"
            as="input"
            class="form-control"
            :rules="`isStringNumber|positiveNumber|maxLength:6`"
            v-model="formValue.transferMinFee"
            :disabled="loading"
          />
          <ErrorMessage name="transferMinFee" class="text-danger" />
        </div>
        <div class="col-md-4">
          <label> {{ $t('highLow.tableBTC.to') }} (USDT)</label>
          <Field
            name="transferMaxFee"
            as="input"
            class="form-control"
            :rules="`isStringNumber|min:${formValue.transferMinFee}|maxLength:6`"
            v-model="formValue.transferMaxFee"
            :disabled="loading"
          />
          <ErrorMessage name="transferMaxFee" class="text-danger" />
        </div>
      </div>
    </Form>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { defineComponent } from 'vue'
import { HighLowService } from '@/services/HighLowService'
import { Field, Form, ErrorMessage } from 'vee-validate'
import { HttpStatus } from '@/core/variables/common.enum'

export enum STATUS {
  CREATE = 0,
  FINISH = 1,
  PENDING = 2,
  FAILED = 3,
}

export default defineComponent({
  name: 'settingTransfer',
  components: {
    Field,
    Form,
    ErrorMessage,
  },
  data() {
    return {
      formValue: {
        transferFee: '',
        transferMaxFee: '',
        transferMinFee: '',
        transferMaxAmount: '',
        transferMinAmount: '',
        transferFeeRatio: '',
        transferActive: false,
        transferMaxAmountPerDay: '',
      },
      loading: false,
      isDisabledFeeAmount: false,
      pairSelected: {
        coin: 'BTC',
        currency: 'USDT',
      },
      pairList: [] as { coin: string; currency: string }[],
      dataUpdate: [],
      STATUS: STATUS,
    }
  },
  mounted() {
    this.getMajorCoin()
    setCurrentPageBreadcrumbs('menu.settingTransfer', ['highLow.highLow'])
  },
  methods: {
    async handleChangePair() {
      this.loading = true
      const res = await HighLowService.getDetailMajorCoin(
        this.pairSelected.coin,
      )
      this.loading = false
      const data = res.data.data
      this.formValue.transferActive = data.transferActive
      this.formValue.transferFee = `${data.transferFee}`
      this.formValue.transferFeeRatio = `${data.transferFeeRatio}`
      this.formValue.transferMaxAmount = `${data.transferMaxAmount}`
      this.formValue.transferMaxAmountPerDay = `${data.transferMaxAmountPerDay}`
      this.formValue.transferMaxFee = `${data.transferMaxFee}`
      this.formValue.transferMinAmount = `${data.transferMinAmount}`
      this.formValue.transferMinFee = `${data.transferMinFee}`
      this.isDisabledFeeAmount = data.transferFeeRatio > 0
    },
    updateDisabled() {
      this.isDisabledFeeAmount = !this.isDisabledFeeAmount
    },
    async handleSubmit() {
      const form = await (this.$refs.settingTransferForm as any).validate()
      if (!form.valid) {
        return
      }
      this.loading = true
      // transform data
      if (this.isDisabledFeeAmount) {
        this.formValue.transferFee = '0'
      } else {
        this.formValue.transferMaxFee = '0'
        this.formValue.transferMinFee = '0'
        this.formValue.transferFeeRatio = '0'
      }
      const data = {
        coin: this.pairSelected.coin,
        transferFee: +this.formValue.transferFee,
        transferMaxFee: +this.formValue.transferMaxFee,
        transferMinFee: +this.formValue.transferMinFee,
        transferMaxAmount: +this.formValue.transferMaxAmount,
        transferMaxAmountPerDay: +this.formValue.transferMaxAmountPerDay,
        transferMinAmount: +this.formValue.transferMinAmount,
        transferFeeRatio: +this.formValue.transferFeeRatio,
        transferActive: this.formValue.transferActive,
      }
      const res = await HighLowService.updateMajorCoin(data)
      this.loading = false
      if (res.status === HttpStatus.OK) {
        this.$toastr.success(this.$t('success'))
        return
      }
      this.$toastr.error(this.$t('error'))
    },
    async getMajorCoin() {
      this.loading = true
      let res = await HighLowService.getMajorCoin()
      if (res.status !== HttpStatus.OK) {
        this.$toastr.error(this.$t('error'))
      }
      this.loading = false
      let { data } = res.data
      let { value } = data.data[0]
      value = JSON.parse(value)
      this.pairList = Object.keys(value)
        .map((key) => ({
          coin: key,
          currency: 'USDT',
        }))
        .filter(
          (element) => element.coin !== 'USDT' && element.coin !== 'BCAST', // remove bcast & usdt
        )
        .sort((a, b) => a.coin.localeCompare(b.coin))
      this.pairSelected = this.pairList[0]
      await this.handleChangePair()
    },
  },
})
</script>
