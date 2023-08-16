<template>
  <Form ref="botPForm">
    <div class="row gy-5 g-xl-8 mb-5">
      <div class="d-flex mb-3">
        <div class="me-5 col-md-3">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.action') }}</label>
        </div>
        <div class="form-check me-5">
          <input
            type="checkbox"
            class="form-check-input"
            id="manual"
            name="option1"
            value="1"
            :checked="botP.action == 1"
            v-on:input="botP.action = $event.target.checked ? 1 : 2"
          />
          <label class="form-check-label" for="manual"
            ><b>{{ $t('obmSetting.manual') }}</b></label
          >
        </div>
        <div class="form-check">
          <input
            type="checkbox"
            class="form-check-input"
            id="auto"
            name="option2"
            value="2"
            :checked="botP.action == 2"
            v-on:input="botP.action = $event.target.checked ? 2 : 1"
          />
          <label class="form-check-label" for="auto"
            ><b>{{ $t('obmSetting.auto') }}</b></label
          >
        </div>
      </div>
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.volumeScale') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="volume_scale"
              as="input"
              v-model="botP.volume_scale"
              rules="required|isStringNumber|minMaxCustom:0,1"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="volume_scale" class="text-danger" />
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
          <label class="fs-6 fw-bold">{{ $t('obmSetting.minTotal') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="min_total"
              as="input"
              disabled
              v-model="botP.min_total"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="min_total" class="text-danger" />
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
          <label class="fs-6 fw-bold">{{ $t('obmSetting.maxTotal') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="max_total"
              as="input"
              v-model="botP.max_total"
              :rules="`required|isStringNumber|minMaxCustom:${botP.min_total},100000000000`"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="max_total" class="text-danger" />
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
          <label class="fs-6 fw-bold">{{ $t('obmSetting.minAmount') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="min_amount"
              as="input"
              disabled
              v-model="botP.min_amount"
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
              disabled
              v-model="botP.max_amount"
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
          <label class="fs-6 fw-bold">{{ $t('obmSetting.orderPeriod') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="order_period"
              as="input"
              v-model="botP.order_period"
              rules="required|integer|minMaxCustom:5,59"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="order_period" class="text-danger" />
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
          <label class="fs-6 fw-bold">{{ $t('obmSetting.skipVolume') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="skip_min_amount_rate"
              as="input"
              v-model="botP.skip_min_amount_rate"
              rules="required|isStringNumber|minMaxCustom:0,100000000000"
              class="form-control text-uppercase"
            >
            </Field>
            <ErrorMessage name="skip_min_amount_rate" class="text-danger" />
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
import { ObmBotPSetting } from '@/models/setting-obm/GeneralOBM'

export default defineComponent({
  name: 'bot-p',
  components: { Form, Field, ErrorMessage },
  props: {
    data: {
      type: Object,
      default: plainToInstance(
        ObmBotPSetting,
        {},
        { exposeDefaultValues: true },
      ),
    },
  },
  data() {
    return {
      botP: this.data,
    }
  },
  methods: {
    async checkForm() {
      const form = await (this.$refs.botPForm as any).validate()
      if (!form.valid) {
        return false
      }
      return true
    },
  },
})
</script>
