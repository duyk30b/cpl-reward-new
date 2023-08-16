<template>
  <Form ref="botAForm">
    <div class="row gy-5 g-xl-8 mb-5">
      <div class="flex-stack mb-3">
        <div class="me-5">
          <label class="fs-6 fw-bold">{{ $t('obmSetting.minTotal') }}</label>
        </div>
        <div class="d-flex">
          <div class="col-sm-6">
            <Field
              name="min_total"
              as="input"
              v-model="botA.min_total"
              disabled
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
              v-model="botA.max_total"
              :rules="`required|isStringNumber|minMaxCustom:${botA.min_total},100000000000`"
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
              v-model="botA.min_amount"
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
              v-model="botA.max_amount"
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
    </div>
  </Form>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { plainToInstance } from 'class-transformer'
import { ObmBotASetting } from '@/models/setting-obm/GeneralOBM'

export default defineComponent({
  name: 'bot-a',
  components: { Form, Field, ErrorMessage },
  props: {
    data: {
      type: Object,
      default: plainToInstance(
        ObmBotASetting,
        {},
        { exposeDefaultValues: true },
      ),
    },
  },
  data() {
    return {
      botA: this.data,
    }
  },
  methods: {
    async checkForm() {
      const form = await (this.$refs.botAForm as any).validate()
      if (!form.valid) {
        return false
      }
      return true
    },
  },
})
</script>
