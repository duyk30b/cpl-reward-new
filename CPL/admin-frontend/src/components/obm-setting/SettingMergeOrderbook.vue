<template>
  <Form ref="mergeOrderbookForm">
    <div class="row gy-5 g-xl-8 mb-5">
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.precision') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <div
              v-for="pre of getPrecisionList"
              :key="pre"
              class="badge badge-success m-1"
            >
              {{ pre }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.defaultPrecision')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="default_precision"
              as="input"
              disabled
              v-model="mergeOrderbook.default_precision"
              class="form-control"
            >
            </Field>
            <ErrorMessage name="default_precision" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              disabled
              :value="$t('obmSetting.number')"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.minAmount') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="min_amount"
              as="input"
              v-model="mergeOrderbook.min_amount"
              disabled
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="min_amount" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              disabled
              :value="$t('obmSetting.number')"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.maxAmount') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="max_amount"
              as="input"
              v-model="mergeOrderbook.max_amount"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="max_amount" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              :value="$t('obmSetting.number')"
              disabled
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.decimalMOB') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="decimal"
              as="select"
              disabled
              v-model="mergeOrderbook.decimal"
              class="form-control"
            >
              <option v-for="item of precisionList" :value="item" :key="item">
                {{ item }}
              </option>
            </Field>
            <ErrorMessage name="decimal" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              disabled
              :value="$t('obmSetting.number')"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.limitOrder') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="limit_order"
              as="input"
              v-model="mergeOrderbook.limit_order"
              rules="required|integer|minMaxCustom:1,100"
              class="form-control"
            >
            </Field>
            <ErrorMessage name="limit_order" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              :value="$t('obmSetting.number')"
              disabled
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.thresholdPriceBuy')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="threshold_price_buy"
              as="input"
              v-model="mergeOrderbook.threshold_price_buy"
              rules="required|isStringNumber|minMaxCustom:0,100"
              class="form-control"
            >
            </Field>
            <ErrorMessage name="threshold_price_buy" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              :value="$t('obmSetting.percent')"
              disabled
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.thresholdPriceSell')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="threshold_price_sell"
              as="input"
              v-model="mergeOrderbook.threshold_price_sell"
              rules="required|isStringNumber|minMaxCustom:0,100"
              class="form-control"
            >
            </Field>
            <ErrorMessage name="threshold_price_sell" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              :value="$t('obmSetting.percent')"
              disabled
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.thresholdVolumeBuy')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="threshold_volume_buy"
              as="input"
              v-model="mergeOrderbook.threshold_volume_buy"
              rules="required|isStringNumber|minMaxCustom:0,100000000000"
              class="form-control"
            >
            </Field>
            <ErrorMessage name="threshold_volume_buy" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              :value="$t('obmSetting.number')"
              disabled
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.thresholdVolumeSell')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="threshold_volume_sell"
              as="input"
              v-model="mergeOrderbook.threshold_volume_sell"
              rules="required|isStringNumber|minMaxCustom:0,100000000000"
              class="form-control"
            >
            </Field>
            <ErrorMessage name="threshold_volume_sell" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              :value="$t('obmSetting.number')"
              disabled
              class="form-control"
            />
          </div>
        </div>
      </div>
    </div>
  </Form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { plainToInstance } from 'class-transformer'
import { ObmMergeOrderbookSetting } from '@/models/setting-obm/GeneralOBM'
import CONFIG from '@/config'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'merge-orderbook',
  components: { Form, Field, ErrorMessage },
  props: {
    data: {
      type: Object,
      default: plainToInstance(
        ObmMergeOrderbookSetting,
        {},
        { exposeDefaultValues: true },
      ),
    },
    pair: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      mergeOrderbook: this.data,
      precisionListExchange: [] as string[],
      precisionList: CONFIG.OBM_PRECISION_LIST,
      precisionShow: CONFIG.DECIMAL_LIST,
    }
  },
  computed: {
    getPrecisionList() {
      if (typeof this.mergeOrderbook.precisions == 'object')
        return this.mergeOrderbook.precisions
      return [this.mergeOrderbook.precisions]
    },
  },
  async mounted() {
    await this.getPairExchange(this.pair)
  },
  methods: {
    async getPairExchange(pair) {
      const [coin, currency] = pair.split('/')
      const pairData = await SettingExchangeService.getPairList({
        coin,
        currency,
      })
      if (pairData.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.error'))
        this.precisionListExchange = []
        return
      }
      this.precisionListExchange = pairData.data?.data[0]?.precisions || []
    },
    async checkForm() {
      const form = await (this.$refs.mergeOrderbookForm as any).validate()
      if (!form.valid) {
        return false
      }
      return true
    },
  },
})
</script>
