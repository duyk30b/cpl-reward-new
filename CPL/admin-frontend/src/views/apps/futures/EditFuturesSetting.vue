<template>
  <div class="card mb-5">
    <div class="card-header pt-2">
      <div class="card-title page-header text-header d-block">
        {{ submitData.pairName?.toUpperCase() }}
      </div>
      <div class="card-toolbar">
        <button
          type="button"
          class="btn btn-sm btn-primary me-3"
          @click="savePair"
        >
          {{ $t('save') }}
        </button>
        <button
          type="button"
          class="btn btn-sm btn-secondary me-3"
          @click="cancelPair"
        >
          {{ $t('cancel') }}
        </button>
      </div>
    </div>
    <div class="card-body pt-4">
      <Form @submit="savePair" ref="futureForm">
        <el-tabs v-model="selectTab">
          <el-tab-pane :label="$t('orderbook').toUpperCase()" name="orderbook">
            <div class="section-block">
              <div class="row mb-4 info-section">
                <div
                  class="col-xl-6"
                  style="border-right: solid; border-right-width: 1px"
                >
                  <div class="section-header">
                    {{ $t('futures.setting.crawler') }}
                  </div>
                  <hr />
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.crawlerExternalPriceScale') }}
                      </label>
                      <Field
                        name="crawlerExternalPriceScale"
                        type="text"
                        as="input"
                        rules="required"
                        v-model="submitData.crawlerExternalPriceScale"
                        class="form-control hide-input"
                      />
                      <v-select
                        :options="externalScaleList"
                        v-model="submitData.crawlerExternalPriceScale"
                        option-value="key"
                        option-label="value"
                        :can-deselect="false"
                        @change="changeCrawlerExternalPriceScale"
                        searchable
                      >
                      </v-select>
                      <ErrorMessage
                        name="crawlerExternalPriceScale"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.crawlerExternalAmountScale') }}
                      </label>
                      <Field
                        name="crawlerExternalAmountScale"
                        type="text"
                        as="input"
                        rules="required"
                        v-model="submitData.crawlerExternalAmountScale"
                        class="form-control hide-input"
                      />
                      <v-select
                        :options="externalScaleList"
                        v-model="submitData.crawlerExternalAmountScale"
                        option-value="key"
                        option-label="value"
                        :can-deselect="false"
                        @change="changeCrawlerExternalAmountScale"
                        searchable
                      >
                      </v-select>
                      <ErrorMessage
                        name="crawlerExternalAmountScale"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.crawlerAdjustmentRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="crawlerAdjustmentRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.crawlerAdjustmentRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage
                        name="crawlerAdjustmentRate"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.crawlerMinAmount') }}
                      </label>
                      <Field
                        name="crawlerMinAmount"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.crawlerMinAmount"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      ></Field>
                      <ErrorMessage
                        name="crawlerMinAmount"
                        class="text-danger"
                      />
                    </div>
                  </div>

                  <div class="section-header">
                    {{ $t('futures.setting.orderbook') }}
                  </div>
                  <hr />
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obExternalLimitOrders') }}
                      </label>
                      <Field
                        name="obExternalLimitOrders"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.obExternalLimitOrders"
                        class="form-control px-5"
                        v-on:keypress="isNumber($event)"
                      />
                      <ErrorMessage
                        name="obExternalLimitOrders"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obAmountScale') }}
                      </label>
                      <Field
                        name="obAmountScale"
                        type="text"
                        as="input"
                        rules="required"
                        v-model="submitData.obAmountScale"
                        class="form-control hide-input"
                      />
                      <v-select
                        :options="externalScaleList"
                        v-model="submitData.obAmountScale"
                        option-value="key"
                        option-label="value"
                        :can-deselect="false"
                        @change="changeObAmountScale"
                        searchable
                      >
                      </v-select>
                      <ErrorMessage name="obAmountScale" class="text-danger" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obExternalMaxAmount') }}
                      </label>
                      <Field
                        name="obExternalMaxAmount"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.obExternalMaxAmount"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage
                        name="obExternalMaxAmount"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obExternalMinAmount') }}
                      </label>
                      <Field
                        name="obExternalMinAmount"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.obExternalMinAmount"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage
                        name="obExternalMinAmount"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obMinTotal') }}
                      </label>
                      <Field
                        name="obMinTotal"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.obMinTotal"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage name="obMinTotal" class="text-danger" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obMaxTotal') }}
                      </label>
                      <Field
                        name="obMaxTotal"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.obMaxTotal"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage name="obMaxTotal" class="text-danger" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obDefaultPriceScale') }}
                      </label>
                      <Field
                        name="obDefaultPriceScale"
                        type="text"
                        as="input"
                        rules="required"
                        v-model="submitData.obDefaultPriceScale"
                        class="form-control hide-input"
                      />
                      <v-select
                        :options="externalScaleList"
                        v-model="submitData.obDefaultPriceScale"
                        option-value="key"
                        option-label="value"
                        :can-deselect="false"
                        @change="changeObDefaultPriceScale"
                        searchable
                      >
                      </v-select>
                      <ErrorMessage
                        name="obDefaultPriceScale"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.obListPriceScale') }}
                      </label>
                      <Field
                        name="obListPriceScale"
                        type="text"
                        as="input"
                        rules="requiredObListPriceScale"
                        v-model="submitData.obListPriceScale"
                        class="form-control hide-input"
                      />
                      <v-select
                        :options="priceScaleOptions"
                        option-value="key"
                        option-label="value"
                        :can-deselect="false"
                        @change="changeObListPriceScale($event)"
                        searchable
                      >
                      </v-select>
                      <ErrorMessage
                        name="obListPriceScale"
                        class="text-danger"
                      />
                      <div class="col-sm-8 pl-2">
                        <div
                          v-for="pre of submitData.obListPriceScale"
                          :key="pre"
                          class="badge badge-success m-1"
                        >
                          {{ pre }}
                          <span
                            @click="removeListPriceScale(pre)"
                            class="remove-pre"
                          >
                            x
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-xl-6">
                  <div class="section-header">
                    {{ $t('futures.setting.fee') }}
                  </div>
                  <hr />
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.orderFeeRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="orderFeeRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.orderFeeRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage name="orderFeeRate" class="text-danger" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.fundingRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="fundingRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.fundingRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage name="fundingRate" class="text-danger" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.insuranceFeeRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="insuranceFeeRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.insuranceFeeRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage
                        name="insuranceFeeRate"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.marginFeeRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="marginFeeRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.marginFeeRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage name="marginFeeRate" class="text-danger" />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.positionFeeRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="positionFeeRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.positionFeeRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage
                        name="positionFeeRate"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.maintenanceMarginRate') }}
                      </label>
                      <div class="input-group">
                        <Field
                          name="maintenanceMarginRate"
                          type="text"
                          as="input"
                          rules="required|isStringNumber"
                          v-model="submitData.maintenanceMarginRate"
                          class="form-control"
                          v-on:keypress="isDigit($event)"
                        />
                        <div class="input-group-append">
                          <span class="input-group-text">%</span>
                        </div>
                      </div>
                      <ErrorMessage
                        name="maintenanceMarginRate"
                        class="text-danger"
                      />
                    </div>
                  </div>

                  <div class="section-header">
                    {{ $t('futures.setting.markPrice') }}
                  </div>
                  <hr />
                  <div class="row">
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.markPriceThresholdAdjustment') }}
                      </label>
                      <Field
                        name="markPriceThresholdAdjustment"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.markPriceThresholdAdjustment"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage
                        name="markPriceThresholdAdjustment"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.markPriceAvgTime') }}
                      </label>
                      <Field
                        name="markPriceAvgTime"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.markPriceAvgTime"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage
                        name="markPriceAvgTime"
                        class="text-danger"
                      />
                    </div>
                    <div class="form-group col-md-6">
                      <label for="key" class="form-label required">
                        {{ $t('futures.setting.markPriceRandomOscillation') }}
                      </label>
                      <Field
                        name="markPriceRandomOscillation"
                        type="text"
                        as="input"
                        rules="required|isStringNumber|min:0"
                        v-model="submitData.markPriceRandomOscillation"
                        class="form-control px-5"
                        v-on:keypress="isDigit($event)"
                      />
                      <ErrorMessage
                        name="markPriceRandomOscillation"
                        class="text-danger"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('trading').toUpperCase()" name="trading">
            <div class="section-block">
              <div class="row mb-4 info-section">
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingMaxAmount') }}
                  </label>
                  <Field
                    name="tradingMaxAmount"
                    type="text"
                    as="input"
                    rules="required|isStringNumber|min:0"
                    v-model="submitData.tradingMaxAmount"
                    class="form-control px-5"
                    v-on:keypress="isDigit($event)"
                  />
                  <ErrorMessage name="tradingMaxAmount" class="text-danger" />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingMinAmount') }}
                  </label>
                  <Field
                    name="tradingMinAmount"
                    type="text"
                    as="input"
                    rules="required|isStringNumber|min:0"
                    v-model="submitData.tradingMinAmount"
                    class="form-control px-5"
                    v-on:keypress="isDigit($event)"
                  />
                  <ErrorMessage name="tradingMinAmount" class="text-danger" />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingMaxTotal') }}
                  </label>
                  <Field
                    name="tradingMaxTotal"
                    type="text"
                    as="input"
                    rules="required|isStringNumber|min:0"
                    v-model="submitData.tradingMaxTotal"
                    class="form-control px-5"
                    v-on:keypress="isDigit($event)"
                  />
                  <ErrorMessage name="tradingMaxTotal" class="text-danger" />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingMinTotal') }}
                  </label>
                  <Field
                    name="tradingMinTotal"
                    type="text"
                    as="input"
                    rules="required|isStringNumber|min:0"
                    v-model="submitData.tradingMinTotal"
                    class="form-control px-5"
                    v-on:keypress="isDigit($event)"
                  />
                  <ErrorMessage name="tradingMinTotal" class="text-danger" />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingPriceScale') }}
                  </label>
                  <Field
                    name="tradingPriceScale"
                    type="text"
                    as="input"
                    rules="required"
                    v-model="submitData.tradingPriceScale"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="externalScaleList"
                    v-model="submitData.tradingPriceScale"
                    option-value="key"
                    option-label="value"
                    :can-deselect="false"
                    @change="changeTradingPriceScale"
                    searchable
                  >
                  </v-select>
                  <ErrorMessage name="tradingPriceScale" class="text-danger" />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingAmountScale') }}
                  </label>
                  <Field
                    name="tradingAmountScale"
                    type="text"
                    as="input"
                    rules="required"
                    v-model="submitData.tradingAmountScale"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="externalScaleList"
                    v-model="submitData.tradingAmountScale"
                    option-value="key"
                    option-label="value"
                    :can-deselect="false"
                    @change="changeTradingAmountScale"
                    searchable
                  >
                  </v-select>
                  <ErrorMessage name="tradingAmountScale" class="text-danger" />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingMinShortRate') }}
                  </label>
                  <Field
                    name="tradingMinShortRate"
                    type="text"
                    as="input"
                    rules="required|isStringNumber|min:0"
                    v-model="submitData.tradingMinShortRate"
                    class="form-control px-5"
                    v-on:keypress="isDigit($event)"
                  />
                  <ErrorMessage
                    name="tradingMinShortRate"
                    class="text-danger"
                  />
                </div>
                <div class="form-group col-md-3">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingMaxLongRate') }}
                  </label>
                  <Field
                    name="tradingMaxLongRate"
                    type="text"
                    as="input"
                    rules="required|isStringNumber|min:0"
                    v-model="submitData.tradingMaxLongRate"
                    class="form-control px-5"
                    v-on:keypress="isDigit($event)"
                  />
                  <ErrorMessage name="tradingMaxLongRate" class="text-danger" />
                </div>
                <div class="form-group col-md-4">
                  <label for="key" class="form-label required">
                    {{ $t('futures.setting.tradingListLeverage') }}
                  </label>
                  <Field
                    name="tradingListLeverage"
                    type="text"
                    as="input"
                    rules="requiredTradingListLeverage"
                    v-model="submitData.tradingListLeverage"
                    class="form-control hide-input"
                  />
                  <v-select
                    :options="leverageOptions"
                    option-value="key"
                    option-label="value"
                    :can-deselect="false"
                    @change="changeTradingListLeverage($event)"
                    searchable
                  >
                  </v-select>
                  <ErrorMessage
                    name="tradingListLeverage"
                    class="text-danger"
                  />
                  <div class="col-sm-8 pl-2">
                    <div
                      v-for="pre of submitData.tradingListLeverage"
                      :key="pre"
                      class="badge badge-success m-1"
                    >
                      {{ pre }}
                      <span @click="removeListLeverage(pre)" class="remove-pre">
                        x
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="section-block">
              <table
                class="table align-middle fs-6 gy-5 common-table table-bordered"
              >
                <tr>
                  <th class="text-center">
                    <b>{{ $t('futures.setting.headerLeverage') }}</b>
                  </th>
                  <th class="text-center">
                    <b>{{ $t('futures.setting.headerMaxMarginByLeverage') }}</b>
                  </th>
                </tr>
                <tr
                  v-for="(
                    value, key, index
                  ) in submitData.tradingMaxMarginByLeverage"
                  :key="index"
                >
                  <td class="text-center">
                    {{ key }}
                  </td>
                  <td class="text-center">
                    <input
                      type="text"
                      class="form-control px-5 trading-max-margin-by-leverage-input"
                      :name="`tradingMaxMarginByLeverage[${key}]`"
                      v-model="submitData.tradingMaxMarginByLeverage[key]"
                      maxlength="255"
                      v-on:keypress="isNumber($event)"
                    />
                  </td>
                </tr>
              </table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import _ from 'lodash'
import { FutureService } from '@/services/FutureService'
import {
  ExternalScaleList,
  FutureSetting,
  LeverageOptions,
  PriceScaleOptions,
} from '@/models/future/FutureSetting'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { isDigit, isNumber } from '@/core/helpers/util'
import { instanceToPlain } from 'class-transformer'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'edit-futures-setting',
  components: { Form, Field, ErrorMessage },
  beforeMount() {
    this.getDetailPair()
  },
  computed: {
    coin() {
      return this.$route.params.coin as string
    },
    currency() {
      return this.$route.params.currency as string
    },
  },
  watch: {
    '$route.params.coin': function () {
      this.getDetailPair()
    },
    '$route.params.currency': function () {
      this.getDetailPair()
    },
  },
  methods: {
    isDigit(e) {
      return isDigit(e)
    },
    isNumber(e) {
      return isNumber(e)
    },
    async getDetailPair() {
      const setting = await FutureService.getSingleSetting(
        this.coin,
        this.currency,
      )
      if (setting === null) return this.cancelPair()
      this.submitData = setting
    },
    cancelPair() {
      this.$router.push({ name: 'futures.setting' })
      return
    },
    async savePair() {
      const form = await (this.$refs.futureForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }
      const result = await FutureService.setupSetting(
        instanceToPlain(this.submitData),
      )

      if (result.status !== HttpStatus.CREATED) {
        return this.$toastr.error(this.$t('futures.setting.setPairFailed'))
      }

      this.$toastr.success(this.$t('futures.setting.setPairSuccess'))
    },
    changeTradingListLeverage(selected: string) {
      let tradingMaxMarginByLeverage = _.cloneDeep(
        this.submitData.tradingMaxMarginByLeverage,
      )
      let tradingListLeverage = _.cloneDeep(this.submitData.tradingListLeverage)
      tradingListLeverage = _.union(tradingListLeverage, [selected])

      if (!_.has(tradingMaxMarginByLeverage, selected)) {
        tradingMaxMarginByLeverage[selected] = '0'
      }
      this.submitData.tradingListLeverage = tradingListLeverage.sort(
        (one, two) => (parseInt(one, 10) > parseInt(two, 10) ? 1 : -1),
      )
      this.submitData.tradingMaxMarginByLeverage = tradingMaxMarginByLeverage
    },
    removeListLeverage(pre) {
      _.remove(
        this.submitData.tradingListLeverage,
        (leverage) => leverage.toString() === pre.toString(),
      )
      delete this.submitData.tradingMaxMarginByLeverage[pre]
    },
    changeObListPriceScale(selected: string) {
      this.submitData.obListPriceScale = _.union(
        this.submitData.obListPriceScale,
        [selected],
      )
    },
    removeListPriceScale(pre) {
      _.remove(
        this.submitData.obListPriceScale,
        (priceScale) => priceScale.toString() === pre.toString(),
      )
    },
    changeTradingPriceScale(currentValue) {
      for (let key in this.externalScaleList) {
        const price = this.externalScaleList[key]
        if (price.key === currentValue)
          this.submitData.tradingPriceScale = price.value
      }
    },
    changeTradingAmountScale(currentValue) {
      for (let key in this.externalScaleList) {
        const amount = this.externalScaleList[key]
        if (amount.key === currentValue)
          this.submitData.tradingAmountScale = amount.value
      }
    },
    changeCrawlerExternalPriceScale(currentValue) {
      for (let key in this.externalScaleList) {
        const price = this.externalScaleList[key]
        if (price.key === currentValue)
          this.submitData.crawlerExternalPriceScale = price.value
      }
    },
    changeCrawlerExternalAmountScale(currentValue) {
      for (let key in this.externalScaleList) {
        const amount = this.externalScaleList[key]
        if (amount.key === currentValue)
          this.submitData.crawlerExternalAmountScale = amount.value
      }
    },
    changeObAmountScale(currentValue) {
      for (let key in this.externalScaleList) {
        const amount = this.externalScaleList[key]
        if (amount.key === currentValue)
          this.submitData.obAmountScale = amount.value
      }
    },
    changeObDefaultPriceScale(currentValue) {
      for (let key in this.externalScaleList) {
        const amount = this.externalScaleList[key]
        if (amount.key === currentValue)
          this.submitData.obDefaultPriceScale = amount.value
      }
    },
  },
  data() {
    return {
      submitData: new FutureSetting(),
      selectTab: 'orderbook',
      externalScaleList: ExternalScaleList,
      priceScaleOptions: PriceScaleOptions,
      leverageOptions: LeverageOptions,
    }
  },
})
</script>

<style lang="scss" scoped>
hr {
  border-top: 1px solid #409eff;
}
.section-header {
  color: #409eff;
}
.remove-pre {
  color: #555;
  margin-left: 5px;
  cursor: pointer;
}
.trading-max-margin-by-leverage-input {
  border-width: 1px;
}
.hide-input {
  display: none;
}
</style>
