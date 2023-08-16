<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'trading-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="tradingForm">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-4">
            <h4 class="mb-10 text-uppercase">{{ $t('setting.pairInfo') }}</h4>
            <div class="d-flex flex-stack mb-10">
              <div class="me-5 col-md-3">
                <label for="pair_select" class="fs-6 fw-bold">{{
                  $t('setting.pair')
                }}</label>
              </div>
              <div class="col-md-9">
                <Field
                  name="pair_select"
                  type="text"
                  as="input"
                  rules="required"
                  v-model="pair"
                  class="form-control hide-input"
                />
                <v-select
                  :options="pairListOptions"
                  option-value="value"
                  option-label="name"
                  placeholder="Choose a pair"
                  v-model="pair"
                  searchable
                  :can-deselect="false"
                  @change="choosePair()"
                  :disabled="!isNew"
                ></v-select>
                <ErrorMessage name="pair_select" class="text-danger" />
              </div>
            </div>
            <div class="d-flex flex-stack">
              <div class="me-5 col-md-3">
                <label class="fs-6 fw-bold">
                  {{ $t('setting.pairStatus') }}
                </label>
              </div>
              <label
                class="col-md-9 form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="status"
                  type="checkbox"
                  id="status_pair"
                  v-model="editTrading.status"
                  :true-value="1"
                  :false-value="0"
                />
              </label>
            </div>
          </div>
          <div class="col-md-8">
            <template v-if="isNew">
              <div class="mb-8 d-flex flex-stack"></div>
            </template>
            <template v-else>
              <h4 class="mb-10 text-uppercase">
                {{ $t('setting.precisionBlock') }}
              </h4>
              <div class="d-flex flex-stack mb-10">
                <div class="me-5 col-md-3">
                  <label class="fs-6 fw-bold">
                    {{ $t('setting.obmStatus') }}
                  </label>
                </div>
                <label
                  class="col-md-9 form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input"
                    name="obm-status"
                    type="checkbox"
                    disabled
                    id="status_obm"
                    v-model="editTrading.obm_active"
                    :true-value="1"
                    :false-value="0"
                  />
                </label>
              </div>
            </template>
            <div class="mb-10">
              <label for="new_precision" class="form-label">
                {{ $t('setting.precisions') }}
              </label>
              <div class="precision-ex d-flex">
                <div class="col-sm-4">
                  <Field
                    name="new_precision"
                    type="text"
                    as="input"
                    class="form-control hide-input"
                    rules="required"
                    v-model="precisionSelected"
                  />
                  <v-select
                    :options="precisionOptions"
                    option-value="value"
                    option-label="name"
                    placeholder="Choose a precision"
                    searchable
                    :can-deselect="false"
                    @change="addPrecision($event)"
                  ></v-select>
                  <ErrorMessage name="new_precision" class="text-danger" />
                </div>
                <div class="col-sm-8 pl-2">
                  <div
                    v-for="(pre, idx) of editTrading.precisions"
                    :key="pre"
                    class="badge badge-success m-1"
                  >
                    {{ pre }}
                    <span @click="removePrecision(pre, idx)" class="remove-pre">
                      x
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div class="mb-10 col-md-4">
              <label for="default_precision" class="form-label">
                {{ $t('setting.defaultPrecision') }}
              </label>
              <Field
                name="default_precision"
                type="text"
                rules="required"
                as="input"
                v-model="editTrading.default_precision"
                class="form-control hide-input"
              />
              <v-select
                :options="defaultPrecisionOptions"
                option-value="value"
                option-label="name"
                placeholder="Choose a default precision"
                v-model="editTrading.default_precision"
                searchable
                :can-deselect="false"
              ></v-select>
              <ErrorMessage name="default_precision" class="text-danger" />
            </div>
          </div>
        </div>
        <div class="row gy-5 g-xl-8">
          <div class="col-md-4">
            <h4 class="mb-10 text-uppercase">
              {{ $t('setting.tradingLimit') }}
            </h4>
            <div class="mb-10">
              <label for="n_day_amount_limit" class="form-label">
                {{ $t('setting.nDayAmountLimit') }}
              </label>
              <Field
                name="n_day_amount_limit"
                type="text"
                as="input"
                :rules="`required|isStringNumber|positiveNumber|min:${editTrading.minimum_amount},minimum amount|maximumTotalNumber:${MAX_DECIMAL_VOLUME_ROUND}`"
                v-model="editTrading.n_day_amount_limit"
                class="form-control"
                v-on:keypress="isDigit($event)"
              />
              <ErrorMessage name="n_day_amount_limit" class="text-danger" />
            </div>
            <div class="mb-10">
              <label for="n_day_total_limit" class="form-label">
                {{ $t('setting.nDayTotalLimit') }}
              </label>
              <!-- max decimal of nDayTotalLimit = max decimal of nDayAmountLimit -->
              <Field
                name="n_day_total_limit"
                type="text"
                as="input"
                :rules="`required|isStringNumber|positiveNumber|min:${editTrading.minimum_total},minimum total|maximumTotalNumber:${MAX_DECIMAL_VOLUME_ROUND}`"
                v-model="editTrading.n_day_total_limit"
                class="form-control"
                v-on:keypress="isDigit($event)"
              />
              <ErrorMessage name="n_day_total_limit" class="text-danger" />
            </div>
            <div class="mb-10">
              <label for="limit_span" class="form-label">
                {{ $t('setting.nDay') }}
              </label>
              <Field
                name="limit_span"
                type="text"
                as="input"
                :rules="`required|isStringNumber|positiveNumber|minMaxCustom:1,${MAX_N_DAY}|integer`"
                v-model="editTrading.limit_span"
                class="form-control"
                v-on:keypress="isDigit($event)"
              />
              <ErrorMessage name="limit_span" class="text-danger" />
            </div>
          </div>
          <div class="col-md-8">
            <div class="row gy-5 g-xl-8">
              <h4 class="text-uppercase">
                {{ $t('setting.tradingFee') }}
              </h4>
              <div class="col-xl-6">
                <div class="mb-10">
                  <label for="charge_by" class="form-label">
                    {{ $t('setting.chargeBy') }}
                  </label>
                  <Field
                    name="charge_by"
                    type="number"
                    as="input"
                    class="form-control hide-input"
                    rules="required"
                    v-model="editTrading.charge_by"
                  />
                  <v-select
                    :options="[
                      {
                        name: $t('setting.chargeByDefault'),
                        value: CHARGE_BY.DEFAULT,
                      },
                      {
                        name: $t('setting.chargeByReward'),
                        value: CHARGE_BY.REWARD,
                      },
                    ]"
                    option-value="value"
                    option-label="name"
                    placeholder="Choose a Charge By"
                    v-model="editTrading.charge_by"
                  ></v-select>
                  <ErrorMessage name="charge_by" class="text-danger" />
                </div>
                <div class="mb-10">
                  <label for="buy_fee_currency" class="form-label">
                    {{ $t('setting.buyFeeCurrency') }}
                  </label>
                  <Field
                    name="buy_fee_currency"
                    type="text"
                    as="input"
                    rules="required"
                    v-model="editTrading.buy_fee_currency"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="buyFeeCurrency"
                    option-value="value"
                    option-label="name"
                    placeholder="The pair is not defined yet"
                    v-model="editTrading.buy_fee_currency"
                    searchable
                    :can-deselect="false"
                  ></v-select>
                  <ErrorMessage name="buy_fee_currency" class="text-danger" />
                </div>
                <div class="mb-10">
                  <label for="buy_fee_type" class="form-label">
                    {{ $t('setting.buyFeeType') }}
                  </label>
                  <Field
                    name="buy_fee_type"
                    type="text"
                    as="input"
                    rules="required"
                    v-model="editTrading.buy_fee_type"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="feeTypes"
                    option-value="value"
                    option-label="name"
                    placeholder="Choose a fee type"
                    v-model="editTrading.buy_fee_type"
                    searchable
                    :can-deselect="false"
                  ></v-select>
                  <ErrorMessage name="buy_fee_type" class="text-danger" />
                </div>
                <div class="mb-10">
                  <label for="buy_fee" class="form-label">
                    {{ $t('setting.buyFee') }}
                  </label>
                  <div class="d-flex align-items-center position-relative">
                    <Field
                      name="buy_fee"
                      type="text"
                      as="input"
                      rules="required|isStringNumber|feeSetting"
                      v-model="editTrading.buy_fee"
                      class="form-control input"
                      v-on:keypress="isDigit($event)"
                    />
                    <span class="fixed-icon-percentage">{{
                      editTrading.buy_fee_type === FEE_TYPE.PERCENTAGE
                        ? '%'
                        : ''
                    }}</span>
                  </div>
                  <ErrorMessage name="buy_fee" class="text-danger" />
                </div>
              </div>
              <div class="col-xl-6">
                <div class="mb-10">
                  <label for="sell_fee_currency" class="form-label">
                    {{ $t('setting.sellFeeCurrency') }}
                  </label>
                  <Field
                    name="sell_fee_currency"
                    type="text"
                    as="input"
                    rules="required"
                    v-model="editTrading.sell_fee_currency"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="sellFeeCurrency"
                    option-value="value"
                    option-label="name"
                    placeholder="The pair is not defined yet"
                    v-model="editTrading.sell_fee_currency"
                    searchable
                    :can-deselect="false"
                  ></v-select>
                  <ErrorMessage name="sell_fee_currency" class="text-danger" />
                </div>
                <div class="mb-10">
                  <label for="sell_fee_type" class="form-label">
                    {{ $t('setting.sellFeeType') }}
                  </label>
                  <Field
                    name="sell_fee_type"
                    type="text"
                    as="input"
                    rules="required"
                    v-model="editTrading.sell_fee_type"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="feeTypes"
                    option-value="value"
                    option-label="name"
                    placeholder="Choose a fee type"
                    v-model="editTrading.sell_fee_type"
                    searchable
                    :can-deselect="false"
                  ></v-select>
                  <ErrorMessage name="sell_fee_type" class="text-danger" />
                </div>
                <div class="mb-10">
                  <label for="sell_fee" class="form-label">
                    {{ $t('setting.sellFee') }}
                  </label>
                  <div class="d-flex align-items-center position-relative">
                    <Field
                      name="sell_fee"
                      type="text"
                      as="input"
                      rules="required|isStringNumber|feeSetting"
                      v-model="editTrading.sell_fee"
                      class="form-control input"
                      v-on:keypress="isDigit($event)"
                    />
                    <span class="fixed-icon-percentage">
                      {{
                        editTrading.sell_fee_type === FEE_TYPE.PERCENTAGE
                          ? '%'
                          : ''
                      }}</span
                    >
                  </div>
                  <ErrorMessage name="sell_fee" class="text-danger" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row gy-5 g-xl-8">
          <h4 class="mb-10 text-uppercase">
            {{ $t('setting.tradingPair') }}
          </h4>
          <div class="row col-md-12">
            <div class="col-md-4">
              <div class="mb-10">
                <label for="init_price" class="form-label">
                  {{ $t('setting.marketPrice') }}
                </label>
                <div class="disable-field">
                  <a @click="toggleDisableInitPrice" v-if="!isNew">
                    {{ $t('setting.edit') }}
                  </a>
                  <Field
                    name="init_price"
                    type="text"
                    as="input"
                    :rules="`required|isStringNumber|min:0|maximumTotalNumber:${MAX_DECIMAL_PRICE_ROUND}`"
                    v-model="editTrading.init_price"
                    class="form-control"
                    v-on:keypress="isDigit($event)"
                    :disabled="shouldDisableInitPrice"
                  />
                </div>
                <ErrorMessage name="init_price" class="text-danger" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-10">
                <label for="decimal_of_price" class="form-label">
                  {{ $t('setting.decimalPlaceOfPrice') }}
                </label>
                <Field
                  name="decimal_of_price"
                  type="text"
                  as="input"
                  rules="required"
                  v-model="editTrading.decimal_of_price"
                  class="form-control hide-input"
                />
                <v-select
                  :options="precisionOptions"
                  option-value="value"
                  option-label="name"
                  placeholder="Choose a precision"
                  v-model="editTrading.decimal_of_price"
                  searchable
                  :can-deselect="false"
                  @change="changeDecimalOfPrice"
                ></v-select>
                <ErrorMessage name="decimal_of_price" class="text-danger" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-10">
                <label for="minimum_amount" class="form-label">
                  {{ $t('setting.minimumAmount') }}
                </label>
                <Field
                  name="minimum_amount"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber|decimals:${decimalOfAmount()},Decimal place of minimum amount,Decimal place of amount|maximumTotalNumber:${MAX_DECIMAL_VOLUME_ROUND}`"
                  v-model="editTrading.minimum_amount"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <ErrorMessage name="minimum_amount" class="text-danger" />
              </div>
            </div>
          </div>

          <div class="row col-md-12">
            <div class="col-md-4">
              <div class="mb-10">
                <label for="init_time" class="form-label">
                  {{ $t('setting.initTime') }}
                </label>
                <Field
                  name="init_time"
                  type="text"
                  as="input"
                  rules="required"
                  v-model="datetime"
                  class="form-control hide-input"
                />
                <div class="disable-field">
                  <a @click="toggleDisableInitTime" v-if="!isNew">
                    {{ $t('setting.edit') }}
                  </a>
                  <date-time-picker
                    v-model="datetime"
                    placeholder="Choose init time"
                    :disabled="shouldDisableInitTime"
                  />
                </div>
                <ErrorMessage name="init_time" class="text-danger" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-10">
                <label for="decimal_of_amount" class="form-label">
                  {{ $t('setting.decimalPlaceOfAmount') }}
                </label>
                <Field
                  name="decimal_of_amount"
                  type="text"
                  as="input"
                  :rules="`required|decimalPlace:${editTrading.decimal_of_price}`"
                  v-model="editTrading.decimal_of_amount"
                  class="form-control hide-input"
                />
                <v-select
                  :options="amountPrecisionOptions"
                  option-value="value"
                  option-label="name"
                  placeholder="Choose a precision"
                  v-model="editTrading.decimal_of_amount"
                  searchable
                  :can-deselect="false"
                  @change="changeDecimalOfAmount"
                ></v-select>
                <ErrorMessage name="decimal_of_amount" class="text-danger" />
              </div>
            </div>
            <div class="col-md-4">
              <div class="mb-10">
                <label for="minimum_total" class="form-label">
                  {{ $t('setting.minimumTotal') }}
                </label>
                <Field
                  name="minimum_total"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber|decimals:${decimalOfTotal},Decimal place of minimum total, the sum of Decimal place of amount and Decimal place of price|maximumMinimumTotalNumber`"
                  v-model="editTrading.minimum_total"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <ErrorMessage name="minimum_total" class="text-danger" />
              </div>
            </div>
          </div>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="submitForm">
        {{ $t('setting.save') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import {
  PairItem,
  MAXIMUM_NUMBER_OF_DAYS_TO_SAVE_VOLUME,
  FEE_TYPE,
  CHARGE_BY,
} from '@/models/setting-exchange/TradingPair'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { getListPair } from '@/core/helpers/util'
import CONFIG from '@/config'
import { HttpStatus, PAIR_STATUS } from '@/core/variables/common.enum'
import { plainToInstance } from 'class-transformer'
import { BigNumber } from 'bignumber.js'
import _ from 'lodash'
import {
  getPrecision,
  divNumberString,
  mulNumberString,
} from '@/core/helpers/util'
import Swal from 'sweetalert2'
import { SettingOBMService } from '@/services/SettingOBMService'
import { GetListCoinName } from '@/models/setting-exchange/CoinSetting'
import { SORT_TYPE } from '@/core/variables/common.enum'
import {
  MAX_DECIMAL_PRICE_ROUND,
  MAX_DECIMAL_TOTAL_ROUND,
  MAX_DECIMAL_VOLUME_ROUND,
} from '@/core/variables/common.const'
import moment from 'moment'

export default defineComponent({
  name: 'edit-trading-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    trading: {
      type: Object,
      default: new PairItem(),
    },
    show: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      FEE_TYPE: FEE_TYPE,
      CHARGE_BY: CHARGE_BY,
      feeTypes: [
        {
          value: FEE_TYPE.PERCENTAGE,
          name: '%',
        },
      ],
      precisionSelected: '',
      editTrading: plainToInstance(PairItem, {
        ...this.trading,
        precisions: (this.trading.precisions || []).sort(
          (a, b) => getPrecision(b) - getPrecision(a == '1' ? 0 : a),
        ),
      }),
      pairList: [] as PairItem[],
      pair: '',
      newPrecision: '',
      precisionOptions: CONFIG.EX_PRECISION_LIST.sort(
        (a, b) => getPrecision(b) - getPrecision(a == '1' ? 0 : a),
      ).map((item) => ({ name: item, value: item })),
      amountPrecisionOptions: CONFIG.EX_AMOUNT_PRECISION_LIST.sort(
        (a, b) => getPrecision(b) - getPrecision(a == '1' ? 0 : a),
      ).map((item) => ({ name: item, value: item })),
      MAX_N_DAY: MAXIMUM_NUMBER_OF_DAYS_TO_SAVE_VOLUME,
      NUMBER_PERCENT: '100',
      MAX_DECIMAL_PRICE_ROUND: MAX_DECIMAL_PRICE_ROUND,
      MAX_DECIMAL_TOTAL_ROUND: MAX_DECIMAL_TOTAL_ROUND,
      MAX_DECIMAL_VOLUME_ROUND: MAX_DECIMAL_VOLUME_ROUND,
      datetime: null as Date | null,
      MINUTE_TO_MILLISECOND: 60000, // 1 minute = 60000 milliseconds
      shouldDisableInitPrice: true as boolean,
      shouldDisableInitTime: true as boolean,
    }
  },
  computed: {
    modalTitle() {
      return this.isNew ? 'setting.tradingAddTitle' : 'setting.tradingEditTitle'
    },
    buyFeeCurrency() {
      return this.handleFeeCurrency(this.editTrading.coin)
    },
    sellFeeCurrency() {
      return this.handleFeeCurrency(this.editTrading.currency)
    },
    defaultPrecisionOptions() {
      return (this.editTrading.precisions || [])
        .sort((a, b) => getPrecision(b) - getPrecision(a == '1' ? 0 : a))
        .map((item) => ({ name: item, value: item }))
    },
    pairListOptions() {
      return this.pairList.map((item) => ({
        name: `${item.coin.toUpperCase()}/${item.currency.toUpperCase()}`,
        value: `${item.coin}/${item.currency}`,
      }))
    },
    decimalOfTotal(): number {
      return (
        getPrecision(this.editTrading.decimal_of_price) +
        getPrecision(this.editTrading.decimal_of_amount)
      )
    },
    precisionList() {
      return this.precisionOptions.map((item) => item.value).reverse()
    },
  },
  async mounted() {
    this.pair = this.isNew
      ? ''
      : `${this.editTrading.coin}/${this.editTrading.currency}`
    if (this.editTrading.precisions.length) {
      this.precisionSelected = this.editTrading.precisions[0]
    }
    if (this.editTrading.buy_fee_type === FEE_TYPE.PERCENTAGE) {
      this.editTrading.buy_fee = mulNumberString(
        this.editTrading.buy_fee,
        this.NUMBER_PERCENT,
      )
    }
    if (this.editTrading.sell_fee_type === FEE_TYPE.PERCENTAGE) {
      this.editTrading.sell_fee = mulNumberString(
        this.editTrading.sell_fee,
        this.NUMBER_PERCENT,
      )
    }
    if (this.editTrading.init_time) {
      const date = new Date(+this.editTrading.init_time)

      this.datetime = new Date(
        date.getTime() + date.getTimezoneOffset() * this.MINUTE_TO_MILLISECOND,
      )
    }
    let ignoreListPair: PairItem[] = []
    if (this.isNew) {
      ignoreListPair = await this.getPairList()
      this.shouldDisableInitPrice = false
      this.shouldDisableInitTime = false
    }
    const coinList = await this.getCoinList()
    this.pairList = getListPair(_.sortBy(coinList), ignoreListPair)
  },
  methods: {
    toggleDisableInitPrice() {
      this.shouldDisableInitPrice = !this.shouldDisableInitPrice
    },
    toggleDisableInitTime() {
      this.shouldDisableInitTime = !this.shouldDisableInitTime
    },
    changeDecimalOfPrice() {
      const pricePrecision = getPrecision(this.editTrading.decimal_of_price)
      if (pricePrecision < 10) {
        if (
          MAX_DECIMAL_TOTAL_ROUND - pricePrecision >
          MAX_DECIMAL_VOLUME_ROUND
        ) {
          this.editTrading.decimal_of_amount = this.generatePrecision(
            MAX_DECIMAL_VOLUME_ROUND,
          )
          return
        }
        this.editTrading.decimal_of_amount = this.generatePrecision(
          MAX_DECIMAL_TOTAL_ROUND - pricePrecision,
        )
        return
      }
      if (pricePrecision >= 10) {
        this.editTrading.decimal_of_amount = this.generatePrecision(0)
        return
      }
    },
    changeDecimalOfAmount() {
      if (
        this.editTrading?.decimal_of_price &&
        getPrecision(this.editTrading?.decimal_of_price) >= 10 &&
        getPrecision(this.editTrading?.decimal_of_amount) > 0
      ) {
        this.editTrading.decimal_of_amount = this.generatePrecision(0)
        this.$toastr.warning(this.$t('setting.informDecimalAmount'))
      }
    },
    generatePrecision(maxPrecision: number) {
      if (maxPrecision === 0) return '1'
      return '0.' + '0'.repeat(maxPrecision - 1) + '1'
    },
    handleFeeCurrency(coin?: string) {
      const options: Array<{ value: string; name: string }> = []
      if (!coin) return
      options.push({
        value: coin,
        name: coin?.toUpperCase(),
      })
      return options
    },
    isDigit(e) {
      let char = String.fromCharCode(e.keyCode) // Get the character
      if (/^[0-9.]+$/.test(char)) return true
      // Match with regex
      else e.preventDefault() // If not match, don't add to input text
    },
    decimalOfAmount() {
      return getPrecision(this.editTrading.decimal_of_amount)
    },
    minimumTotal() {
      try {
        const price = new BigNumber(this.editTrading.decimal_of_price)
        const amount = new BigNumber(this.editTrading.decimal_of_amount)
        const result = price.multipliedBy(amount)
        const arr = result.toString().split('e')
        if (arr.length > 1) {
          return result.toFixed(-+arr[1])
        }
        return price.multipliedBy(amount).toNumber() || 0
      } catch {
        return 0
      }
    },
    maximumAmount() {
      try {
        const total = new BigNumber(0.0000000000000001)
        const result = total.div(+this.editTrading.decimal_of_price)
        const arr = result.toString().split('e')
        if (arr.length > 1) {
          return result.toFixed(-+arr[1])
        }
        return result
      } catch {
        return 0
      }
    },
    choosePair() {
      const [coin, currency] = this.pair.split('/')
      this.editTrading = { ...this.editTrading, ...{ coin, currency } }
    },
    addPrecision(selected: string) {
      this.precisionSelected = selected

      const index = this.precisionList.findIndex((pre) => pre === selected)
      if (index === -1) return
      if (index === 0) {
        this.editTrading.precisions = [
          ...new Set([selected, ...this.editTrading.precisions]),
        ]
        return
      }
      if (index === this.precisionList.length - 1) {
        this.editTrading.precisions = this.precisionList.slice()
        return
      }

      this.editTrading.precisions = [
        ...new Set([
          ...this.precisionList.slice(0, index + 1),
          ...this.editTrading.precisions,
        ]),
      ]
    },
    removePrecision(pre, idx) {
      if (
        this.editTrading.obm_active == 1 &&
        pre == this.editTrading.precisions_obm
      ) {
        this.$toastr.error("can't remove precision is exist in OBM!")
        return
      }
      this.editTrading.precisions.splice(idx, 1)
      if (this.editTrading.default_precision == pre)
        this.editTrading.default_precision = ''
    },
    async getPairList() {
      const pairData = await SettingExchangeService.getPairList({})
      if (!pairData) return []
      return pairData.data['data']
    },
    async getCoinList() {
      const instance = plainToInstance(
        GetListCoinName,
        {
          sort_type: SORT_TYPE.ASC,
          per_page: 1000,
        },
        { exposeDefaultValues: true },
      )
      const coinData = await SettingExchangeService.getListCoinName(instance)
      if (!coinData) return []
      return coinData.data['data']
    },
    close() {
      this.$emit('close')
    },
    async submitForm() {
      const form = await (this.$refs.tradingForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }
      if (
        this.trading.status == PAIR_STATUS.ACTIVE &&
        this.trading.obm_active == PAIR_STATUS.ACTIVE &&
        this.editTrading.status == PAIR_STATUS.INACTIVE
      ) {
        Swal.fire({
          text: 'Save data change!',
          icon: 'warning',
          buttonsStyling: false,
          confirmButtonText: `Warning: OBM operation will be disabled!`,
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-primary',
            cancelButton: 'btn btn-default',
          },
        }).then(async (result) => {
          if (result.isConfirmed) {
            await this.updateOBMPair()
            this.updatePair()
          }
        })
      } else {
        this.updatePair()
      }
    },
    async updateOBMPair() {
      await SettingOBMService.patchPairOBMSetting([
        {
          coin: this.editTrading.coin,
          currency: this.editTrading.currency,
          status: 2,
          update_by: 'admin',
        },
      ])
    },
    async updatePair() {
      const method = this.isNew ? 'postPairSetting' : 'patchPairSetting'
      if (!this.datetime) {
        this.$toastr.error(this.$t('setting.chooseInitTime'))
        return
      }
      this.editTrading.init_time = moment(this.datetime.toString())
        .seconds(0)
        .milliseconds(0)
        .utc(true)
        .valueOf()
        .toString()

      const tradingCloned = _.cloneDeep(this.editTrading)
      if (tradingCloned.sell_fee_type === FEE_TYPE.PERCENTAGE) {
        tradingCloned.sell_fee = divNumberString(
          tradingCloned.sell_fee,
          this.NUMBER_PERCENT,
        )
      }
      if (tradingCloned.buy_fee_type === FEE_TYPE.PERCENTAGE) {
        tradingCloned.buy_fee = divNumberString(
          tradingCloned.buy_fee,
          this.NUMBER_PERCENT,
        )
      }

      const result = await SettingExchangeService[method](
        tradingCloned as PairItem,
      )
      if (result.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.savePairError'))
        return
      }
      this.$toastr.success(this.$t('setting.savePairSuccess'))
      this.close()
      this.$emit('updated')
    },
  },
})
</script>

<style lang="scss">
.disable-field {
  position: relative;
  a {
    position: absolute;
    right: 0;
    top: -60%;
    color: #009ef7 !important;
    text-transform: capitalize;
    font-weight: bold;
    &:hover {
      cursor: pointer;
      text-decoration: underline !important;
    }
  }
}
.trading-modal {
  max-width: 1200px;
  .modal-content {
    width: 1200px;
  }
}
.remove-pre {
  color: #555;
  margin-left: 5px;
  cursor: pointer;
}
.obm-pre {
  background-color: rgb(218, 144, 144);
}
.fixed-icon-percentage {
  position: absolute;
  right: 5%;
}
.input {
  padding-right: 10%;
}
.hide-input {
  display: none;
}
</style>
1
