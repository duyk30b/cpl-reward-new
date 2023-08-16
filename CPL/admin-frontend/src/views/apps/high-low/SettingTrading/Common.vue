<template>
  <div class="card p-8">
    <Form
      :validation-schema="form"
      @submit="handleSubmit"
      :initial-values="formValue"
    >
      <div>
        <div class="title">{{ $t('highLow.serverTimeSetting') }}</div>
        <div class="row">
          <div class="col-md-6">
            <Field name="weightTime" rules="required" class="form-control">
              <CustomInput
                suffix="highLow.microsecond"
                label="highLow.weightTime"
                v-model="formValue.weightTime"
                name="weightTime"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
          <div class="col-md-6">
            <Field name="priceRetryTime" rules="required" class="form-control">
              <CustomInput
                suffix="highLow.microsecond"
                label="highLow.getPriceRetryTime"
                v-model="formValue.priceRetryTime"
                name="priceRetryTime"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <div class="title">{{ $t('highLow.commonSetting') }}</div>
        <div class="row">
          <div class="col-md-6">
            <Field name="thresholdRank1" rules="required" class="form-control">
              <CustomInput
                suffix="highLow.bcast"
                label="highLow.thresholdRank1"
                v-model="formValue.thresholdRank1"
                name="thresholdRank1"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
          <div class="col-md-6">
            <Field name="thresholdRank2" rules="required" class="form-control">
              <CustomInput
                suffix="highLow.bcast"
                label="highLow.thresholdRank2"
                v-model="formValue.thresholdRank2"
                name="thresholdRank2"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <Field name="thresholdRank3" rules="required" class="form-control">
              <CustomInput
                suffix="highLow.bcast"
                label="highLow.thresholdRank3"
                v-model="formValue.thresholdRank3"
                name="thresholdRank3"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
          <div class="col-md-6">
            <CustomInput
              v-model="formValue.tradingEmergencyStopThreshold"
              suffix="highLow.usdt"
              label="highLow.tradingEmergencyStopThreshold"
              name="tradingEmergencyStopThreshold"
              type="number"
              @keypress="isNumber($event)"
            />
          </div>
        </div>
        <div class="row mt-4">
          <div class="col-md-6">
            <Field
              name="tradingLimitActivationThreshold"
              rules="required"
              class="form-control"
            >
              <CustomInput
                suffix="highLow.usdt"
                label="highLow.tradingLimitActivationThreshold"
                v-model="formValue.tradingLimitActivationThreshold"
                name="tradingLimitActivationThreshold"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
        </div>
      </div>
      <div class="mt-8">
        <div class="title">{{ $t('highLow.resellRateCalculation') }}</div>
        <div class="row">
          <div class="col-md-6">
            <Field
              name="resellCommissionWin"
              rules="required"
              class="form-control"
            >
              <CustomInput
                suffix="highLow.percent"
                label="highLow.resellCommissionWin"
                v-model="formValue.resellCommissionWin"
                name="resellCommissionWin"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
          <div class="col-md-6">
            <Field
              name="resellCommissionLose"
              rules="required"
              class="form-control"
            >
              <CustomInput
                suffix="highLow.percent"
                label="highLow.resellCommissionLose"
                v-model="formValue.resellCommissionLose"
                name="resellCommissionLose"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
        </div>
      </div>
      <div class="row mt-8">
        <div class="col-md-6">
          <div class="title">{{ $t('highLow.offSpread') }}</div>
          <div
            class="form-check form-switch form-switch-lg form-check-custom form-check-solid mt-5"
          >
            <input
              class="form-check-input"
              type="checkbox"
              name="notifications"
              v-model="formValue.offSpread"
            />
            <label class="form-check-label">
              {{ $t('highLow.offSpread') }}
            </label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="title">{{ $t('highLow.transferSetting') }}</div>
          <div>
            <Field name="minTransferUsdt" rules="required" class="form-control">
              <CustomInput
                suffix="highLow.usdt"
                label="highLow.minTransferUsdt"
                v-model="formValue.minTransferUsdt"
                name="minTransferUsdt"
                @keypress="isNumber($event)"
              />
            </Field>
          </div>
        </div>
      </div>
      <div class="row mt-8" v-if="formValue.typeOffModePeriod !== ''">
        <div class="col-md-6">
          <div class="title">
            <span> FOREX SETTING </span>
          </div>
        </div>
        <label class="checklist-label mt-4">
          <input
            type="radio"
            class="checklist-radio"
            value="0"
            v-model="formValue.typeOffModePeriod"
          />
          OFF mode_period when its end time is at the closed time
        </label>
        <label class="checklist-label mt-4">
          <input
            type="radio"
            class="checklist-radio"
            value="1"
            v-model="formValue.typeOffModePeriod"
          />
          OFF mode_period when the time frame is not fully opened (Exist a close
          time in the time frame)
        </label>
      </div>
      <div class="mt-8">
        <div class="row">
          <div class="col-md-6">
            <div class="title">
              <span>
                {{ $t('highLow.balanceDecimals') }}
              </span>
            </div>
          </div>
        </div>
        <div class="row">
          <div
            class="col-md-6 d-flex justify-content-between align-items-center mt-4"
            v-for="decimalValue in formValue.balanceDecimals"
            :key="decimalValue.label"
          >
            <div style="width: calc(100% - 50px)">
              <CustomInputText
                :label="decimalValue.label"
                v-model="decimalValue.value"
                :name="decimalValue.label"
                @keyup="checkBalanceDecimals(decimalValue.label)"
                type="text"
              />
              <span v-if="valid[decimalValue.label]" class="text-danger">
                {{ valid[decimalValue.label] }}
              </span>
            </div>
            <!-- <button
              class="badge fs-8 fw-bold badge-danger border-0"
              @click="subBalanceDecimals($event, decimalValue)"
            >
              <i class="fas fa-minus"></i>
            </button> -->
          </div>
        </div>
        <!-- <div class="row">
          <div class="col-md-1 mt-4">
            <button
              class="badge fs-8 fw-bold badge-primary border-0"
              data-bs-toggle="modal"
              data-bs-target="#kt_modal_decimals_setting_insert_modal"
              @click="addbalanceDecimals"
            >
              <i class="fas fa-plus"></i>
            </button>
          </div>
        </div> -->
      </div>

      <div class="d-flex w-100 align-self-center justify-content-center mt-8">
        <button
          class="btn btn-primary w"
          :disabled="loading"
          :title="$t('reset')"
          type="submit"
        >
          <i v-if="loading" class="fas fa-spinner fa-spin fa-fw"></i>
          <span class="">{{ $t('submit') }}</span>
        </button>
      </div>
    </Form>
  </div>
  <ModalInsert
    @refreshForm="refreshForm"
    :balanceDecimalsData="balanceDecimals"
  />
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import CustomInput from './CustomInput.vue'
import CustomInputText from '@/components/form/CustomInputText.vue'
import { HighLowService } from '@/services/HighLowService'
import BigNumber from 'bignumber.js'
import * as Yup from 'yup'
import { Field, Form } from 'vee-validate'
import { HttpStatus } from '@/core/variables/common.enum'
import ModalInsert from './modal/InsertBalanceDecimalsModal.vue'

export default defineComponent({
  name: 'history',
  components: { CustomInput, CustomInputText, Field, Form, ModalInsert },
  data() {
    return {
      coinInsert: '',
      formIds: {
        time_alpha: '',
        time_beta: '',
        BCAST_RANK_1: '',
        BCAST_RANK_2: '',
        BCAST_RANK_3: '',
        STOP_THRESHOLD: '',
        ACTIVE_THRESHOLD: '',
        RESELL_WIN: '',
        RESELL_LOSE: '',
        bo_min_transfer_USDT: '',
        off_spread: '',
        balance_decimals: '',
        type_off_mode_period: '',
      },
      balanceDecimals: {
        currency: '',
      },
      formValue: {
        weightTime: '',
        priceRetryTime: '',
        thresholdRank1: '',
        thresholdRank2: '',
        thresholdRank3: '',
        tradingEmergencyStopThreshold: '',
        tradingLimitActivationThreshold: '',
        resellCommissionWin: '',
        resellCommissionLose: '',
        offSpread: false,
        minTransferUsdt: '',
        balanceDecimals: [
          { label: 'USDT', value: '8' },
          { label: 'BCAST', value: '8' },
        ],
        typeOffModePeriod: '',
      },
      valid: {
        USDT: '',
        BCAST: '',
      },
      loading: false,
      form: Yup.object().shape({
        weightTime: Yup.string().required().label('Weight Time'),
        priceRetryTime: Yup.number().required().label('Get Price Retry Time'),
        thresholdRank1: Yup.number().required().label('Threshold Rank'),
        thresholdRank2: Yup.number()
          .required()
          .moreThan(
            Yup.ref('thresholdRank1'),
            'The Threshold Rank 2 must be greater than Threshold Rank 1',
          )
          .label('Threshold Rank'),
        thresholdRank3: Yup.number()
          .required()
          .moreThan(
            Yup.ref('thresholdRank2'),
            'The Threshold Rank 3 must be greater than Threshold Rank 2',
          )
          .label('Threshold Rank'),
        tradingEmergencyStopThreshold: Yup.number()
          .required()
          .label('Trading Emergency Stop Threshold'),
        tradingLimitActivationThreshold: Yup.number()
          .required()
          .label('Trading Limit Activation Threshold'),
        resellCommissionWin: Yup.number()
          .required()
          .label('Resell Commission (win)'),
        resellCommissionLose: Yup.number()
          .required()
          .label('Resell Commission (lose)'),
        minTransferUsdt: Yup.number().required().label('Min Transfer USDT'),
      }),
    }
  },
  mounted() {
    this.getSetting()
  },
  methods: {
    refreshForm() {
      let { currency } = this.balanceDecimals
      currency = currency.toUpperCase()
      // check existed currency
      for (let i = 0; i < this.formValue.balanceDecimals.length; i++) {
        const item = this.formValue.balanceDecimals[i]
        if (item.label === currency) {
          this.$toastr.error(this.$t('highLow.valid.currencyExist'))
          return
        }
      }
      this.formValue.balanceDecimals.push({
        label: currency,
        value: '8',
      })
    },
    subBalanceDecimals(e, data) {
      e.preventDefault()
      const { label } = data
      for (let i = 0; i < this.formValue.balanceDecimals.length; i++) {
        if (this.formValue.balanceDecimals[i].label === label) {
          this.formValue.balanceDecimals.splice(i, 1)
          return
        }
      }
    },
    addbalanceDecimals(e) {
      e.preventDefault()
      this.balanceDecimals = {
        currency: '',
      }
    },
    async handleSubmit() {
      // validate all fields decimals setting
      for (let i = 0; i < this.formValue.balanceDecimals.length; i++) {
        const item = this.formValue.balanceDecimals[i]
        if (this.checkBalanceDecimals(item.label)) {
          this.$toastr.error(this.$t('error'))
          return
        }
      }

      this.loading = true
      const dataBody = [
        {
          id: this.formIds.time_alpha,
          code: 'time_alpha',
          value: this.formValue.weightTime,
        },
        {
          id: this.formIds.time_beta,
          code: 'time_beta',
          value: this.formValue.priceRetryTime,
        },
        {
          id: this.formIds.BCAST_RANK_1,
          code: 'BCAST_RANK_1',
          value: this.formValue.thresholdRank1,
        },
        {
          id: this.formIds.BCAST_RANK_2,
          code: 'BCAST_RANK_2',
          value: this.formValue.thresholdRank2,
        },
        {
          id: this.formIds.BCAST_RANK_3,
          code: 'BCAST_RANK_3',
          value: this.formValue.thresholdRank3,
        },
        {
          id: this.formIds.STOP_THRESHOLD,
          code: 'STOP_THRESHOLD',
          value: this.formValue.tradingEmergencyStopThreshold,
        },
        {
          id: this.formIds.ACTIVE_THRESHOLD,
          code: 'ACTIVE_THRESHOLD',
          value: this.formValue.tradingLimitActivationThreshold,
        },
        {
          id: this.formIds.RESELL_WIN,
          code: 'RESELL_WIN',
          value: this.formValue.resellCommissionWin,
        },
        {
          id: this.formIds.RESELL_LOSE,
          code: 'RESELL_LOSE',
          value: this.formValue.resellCommissionLose,
        },
        {
          id: this.formIds.bo_min_transfer_USDT,
          code: 'bo_min_transfer_USDT',
          value: this.formValue.minTransferUsdt,
        },
        {
          id: this.formIds.off_spread,
          code: 'off_spread',
          value: Number(this.formValue.offSpread),
        },
        {
          id: this.formIds.balance_decimals,
          code: 'balance_decimals',
          value: this.encodeBalanceDecimals(this.formValue.balanceDecimals),
        },
      ]
      if (this.formValue.typeOffModePeriod !== '') {
        dataBody.push({
          id: this.formIds.type_off_mode_period,
          code: 'type_off_mode_period',
          value: this.formValue.typeOffModePeriod,
        })
      }
      const res = await HighLowService.updateSettings(dataBody)
      this.loading = false
      if (res.status === HttpStatus.OK) {
        this.$toastr.success(this.$t('success'))
        return
      }
      this.$toastr.error(this.$t('error'))
    },
    encodeBalanceDecimals(input) {
      const output = input.reduce((rootObj, currentObj) => {
        rootObj[currentObj.label] = +currentObj.value
        return rootObj
      }, {})
      return JSON.stringify(output)
    },
    decodeBalanceDecimals(input: string) {
      const data = JSON.parse(input)
      const res = Object.keys(data)
        .map((key) => ({
          label: key,
          value: data[key],
        }))
        .sort((a, b) => a.label.localeCompare(b.label))
      return res
    },
    async getSetting() {
      const res = await HighLowService.getSettings({ page: 1, limit: 100 })
      const { data } = res.data

      // hot fix get id by giang
      // need improve in the future
      // each data update manual ids
      const settingKeys = Object.keys(this.formIds)

      const listKeyCodes = data
        .filter((item) => settingKeys.includes(item.code))
        .map((item) => {
          const obj = {}
          obj[item.code] = item.id
          return obj
        })

      this.formIds = Object.assign({}, ...listKeyCodes)
      // end hot fix

      this.formValue.weightTime = data.find(
        (item) => item.code === 'time_alpha',
      ).value

      this.formValue.weightTime = new BigNumber(
        this.formValue.weightTime,
      ).toFormat()

      this.formValue.priceRetryTime = data.find(
        (item) => item.code === 'time_beta',
      ).value

      this.formValue.priceRetryTime = new BigNumber(
        this.formValue.priceRetryTime.replaceAll(',', ''),
      ).toFormat()

      this.formValue.thresholdRank1 = data.find(
        (item) => item.code === 'BCAST_RANK_1',
      ).value

      this.formValue.thresholdRank1 = new BigNumber(
        this.formValue.thresholdRank1.replaceAll(',', ''),
      ).toFormat()

      this.formValue.thresholdRank2 = data.find(
        (item) => item.code === 'BCAST_RANK_2',
      ).value
      this.formValue.thresholdRank2 = new BigNumber(
        this.formValue.thresholdRank2.replaceAll(',', ''),
      ).toFormat()

      this.formValue.thresholdRank3 = data.find(
        (item) => item.code === 'BCAST_RANK_3',
      ).value
      this.formValue.thresholdRank3 = new BigNumber(
        this.formValue.thresholdRank3.replaceAll(',', ''),
      ).toFormat()

      this.formValue.tradingEmergencyStopThreshold = data.find(
        (item) => item.code === 'STOP_THRESHOLD',
      ).value
      this.formValue.tradingEmergencyStopThreshold = new BigNumber(
        this.formValue.tradingEmergencyStopThreshold,
      ).toFormat()

      this.formValue.tradingLimitActivationThreshold = data.find(
        (item) => item.code === 'ACTIVE_THRESHOLD',
      ).value
      this.formValue.tradingLimitActivationThreshold = new BigNumber(
        this.formValue.tradingLimitActivationThreshold,
      ).toFormat()

      this.formValue.resellCommissionWin = data.find(
        (item) => item.code === 'RESELL_WIN',
      ).value
      this.formValue.resellCommissionWin = new BigNumber(
        this.formValue.resellCommissionWin,
      ).toFormat()
      this.formValue.resellCommissionLose = data.find(
        (item) => item.code === 'RESELL_LOSE',
      ).value
      this.formValue.resellCommissionLose = new BigNumber(
        this.formValue.resellCommissionLose,
      ).toFormat()

      this.formValue.minTransferUsdt = data.find(
        (item) => item.code === 'bo_min_transfer_USDT',
      ).value
      this.formValue.minTransferUsdt = new BigNumber(
        this.formValue.minTransferUsdt,
      ).toFormat()

      this.formValue.offSpread = data.find(
        (item) => item.code === 'off_spread',
      ).value
      this.formValue.offSpread = !!Number(this.formValue.offSpread)

      this.formValue.balanceDecimals = this.decodeBalanceDecimals(
        data.find((item) => item.code === 'balance_decimals').value,
      )

      const typeOffModePeriod = data.find(
        (item) => item.code === 'type_off_mode_period',
      )
      if (typeOffModePeriod !== undefined) {
        this.formValue.typeOffModePeriod = typeOffModePeriod.value
      }
    },
    checkBalanceDecimals(type: string): boolean {
      for (let i = 0; i < this.formValue.balanceDecimals.length; i++) {
        if (this.formValue.balanceDecimals[i].label === type) {
          this.valid[type] = ''
          const { value } = this.formValue.balanceDecimals[i]
          if (isNaN(+value)) {
            this.valid[type] = this.$t('highLow.valid.isNumber')
            return true
          }
          if (value.toString().indexOf('.') !== -1) {
            this.valid[type] = this.$t('highLow.valid.isInteger')
            return true
          }
          if (
            value.toString().indexOf('-') !== -1 ||
            +value < 0 ||
            +value > 11
          ) {
            this.valid[type] = this.$t('highLow.valid.currencyValue')
            return true
          }
        }
      }
      return false
    },
    isNumber(evt: KeyboardEvent): void {
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
      ]
      const keyPressed: string = evt.key

      if (!keysAllowed.includes(keyPressed)) {
        evt.preventDefault()
      }
    },
  },
})
</script>
<style lang="scss">
.title {
  font-size: 16px;
  margin-bottom: 10px;
  font-weight: 700;
  text-transform: uppercase;
}

.suffix {
  padding-left: 5px;
}
</style>
