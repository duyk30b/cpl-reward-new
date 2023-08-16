<template>
  <Form @submit="submit" v-slot="{ meta: formMeta }" ref="formEl">
    <base-modal title="changePassword" :show="show" @close="close">
      <template v-slot:body>
        <Field
          v-model="form.oldPassword"
          name="oldPassword"
          v-slot="{ field, errorMessage }"
          :rules="`required`"
        >
          <div class="form-group">
            <label class="required">{{ $t('currentPassword') }}</label>
            <input type="password" class="form-control" v-bind="field" />
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
        <Field
          v-model="form.newPassword"
          name="newPassword"
          v-slot="{ field, errorMessage }"
          :rules="`required`"
        >
          <div class="form-group">
            <label class="required">{{ $t('newPassword') }}</label>
            <input type="password" class="form-control" v-bind="field" />
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
        <Field
          v-model="form.passwordConfirmation"
          name="passwordConfirmation"
          v-slot="{ field, errorMessage }"
          :rules="`required|confirmed:@newPassword`"
        >
          <div class="form-group">
            <label class="required">{{ $t('passwordConfirmation') }}</label>
            <input type="password" class="form-control" v-bind="field" />
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
import { AccountService } from '@/services/AccountService'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import {
  formatServerErrors,
  getSubErrorCode,
} from '@/core/helpers/common.helper'
import { SubErrorCode } from '@/core/variables/common.enum'
import { Expose } from 'class-transformer'

export class ChangePasswordForm {
  @Expose({ name: 'old_password' })
  oldPassword: string

  @Expose({ name: 'new_password' })
  newPassword: string

  passwordConfirmation: string
}

export default defineComponent({
  emits: ['close', 'submited'],
  components: { Form, Field, ErrorDisplay, BaseModal },
  props: {
    show: Boolean,
  },
  data() {
    return {
      form: new ChangePasswordForm(),
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
      const res = await AccountService.changePassword(this.form)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.close()
        this.$emit('submited', res)
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          ;(this.$refs.formEl as any).setErrors(formatServerErrors(res.errors))
        }
      }
      this.loading = false
    },
    reset() {
      this.form = new ChangePasswordForm()
    },
  },
})
</script>
