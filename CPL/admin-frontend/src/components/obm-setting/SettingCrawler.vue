<template>
  <Form ref="crawlerForm">
    <div class="row gy-5 g-xl-8 mb-5">
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.adjustmentRate')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="adjustment_rate"
              as="input"
              v-model="crawler.adjustment_rate"
              rules="required|isStringNumber|minMaxCustom:0,100"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="adjustment_rate" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              disabled
              :value="$t('obmSetting.percent')"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{
            $t('obmSetting.commissionFee')
          }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="commission_fee"
              as="input"
              v-model="crawler.commission_fee"
              rules="required|isStringNumber|minMaxCustom:0,100"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="commission_fee" class="text-danger" />
          </div>
          <div class="col-sm-6 mx-2">
            <input
              as="input"
              disabled
              :value="$t('obmSetting.percent')"
              class="form-control"
            />
          </div>
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.roundDigits') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="round_digits"
              as="input"
              type="number"
              disabled
              v-model="crawler.round_digits"
              rules="required|integer|minMaxCustom:0,8"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="round_digits" class="text-danger" />
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
import { ObmCrawlerSetting } from '@/models/setting-obm/GeneralOBM'

export default defineComponent({
  name: 'crawler',
  components: { Form, Field, ErrorMessage },
  props: {
    data: {
      type: Object,
      default: plainToInstance(
        ObmCrawlerSetting,
        {},
        { exposeDefaultValues: true },
      ),
    },
  },
  data() {
    return {
      crawler: this.data,
    }
  },
  methods: {
    async checkForm() {
      const form = await (this.$refs.crawlerForm as any).validate()
      if (!form.valid) {
        return false
      }
      return true
    },
  },
})
</script>
