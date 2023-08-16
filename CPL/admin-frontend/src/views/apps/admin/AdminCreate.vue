<template>
  <Form @submit="submit" v-slot="{ meta: formMeta }" ref="formEl">
    <base-modal title="createAdmin" :show="show" @close="close">
      <template v-slot:body>
        <Field
          v-model="form.email"
          type="text"
          name="email"
          v-slot="{ field, errorMessage }"
          :rules="`required|email`"
        >
          <div class="form-group">
            <label class="required">{{ $t('email') }}</label>
            <input type="email" class="form-control" v-bind="field" />
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
        <Field
          v-model="form.name"
          type="text"
          name="name"
          v-slot="{ field, errorMessage }"
          :rules="`required`"
        >
          <div class="form-group">
            <label class="required">{{ $t('name') }}</label>
            <input class="form-control" v-bind="field" />
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-primary me-2"
          type="submit"
          :disabled="!formMeta.valid"
        >
          {{ $t('submit') }}
        </button>
        <button class="btn btn-secondary" type="button" @click="close">
          {{ $t('cancel') }}
        </button>
      </template>
    </base-modal>
  </Form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AdminService } from '@/services/AdminService'
import { Admin } from '@/models/admin-permission/Admin'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import {
  formatServerErrors,
  getSubErrorCode,
} from '@/core/helpers/common.helper'
import { SubErrorCode } from '@/core/variables/common.enum'

export default defineComponent({
  components: { Form, Field, ErrorDisplay, BaseModal },
  props: {
    show: Boolean,
  },
  data() {
    return {
      form: new Admin(),
      loading: false,
      errors: {} as Record<string, any>,
    }
  },
  methods: {
    close() {
      this.$emit('close')
      this.reset()
    },
    async submit() {
      this.loading = true
      const res = await AdminService.createAdmin(this.form)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.close()
        this.$emit('adminCreated', res)
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          ;(this.$refs.formEl as any).setErrors(formatServerErrors(res.errors))
        }
      }
      this.loading = false
    },
    reset() {
      this.form = new Admin()
    },
  },
})
</script>
