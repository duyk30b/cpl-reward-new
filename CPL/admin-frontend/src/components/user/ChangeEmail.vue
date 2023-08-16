<template>
  <Form @submit="submit" v-slot="{ meta: formMeta }" ref="formEl">
    <base-modal title="changeEmail" :show="show" @close="close">
      <template v-slot:body>
        <div class="form-group">
          <label>{{ $t('currentEmail') }}</label>
          <input class="form-control" :value="user?.email" disabled />
        </div>
        <Field
          v-model="form.newEmail"
          name="newEmail"
          v-slot="{ field, errorMessage }"
          :rules="`required`"
        >
          <div class="form-group">
            <label class="required">{{ $t('newEmail') }}</label>
            <input class="form-control" v-bind="field" />
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
        <Field
          v-model="form.emailConfirmation"
          name="emailConfirmation"
          v-slot="{ field, errorMessage }"
          :rules="`required|confirmed:@newEmail`"
        >
          <div class="form-group">
            <label class="required">{{ $t('emailConfirmation') }}</label>
            <input class="form-control" v-bind="field" />
            <error-display :message="errorMessage"></error-display>
          </div>
        </Field>
      </template>
      <template v-slot:footer>
        <button
          class="btn btn-primary me-2"
          type="submit"
          :disabled="loading || !formMeta.valid"
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
import { UserService } from '@/services/UserService'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import {
  formatServerErrors,
  getSubErrorCode,
} from '@/core/helpers/common.helper'
import { SubErrorCode } from '@/core/variables/common.enum'
import { User } from '@/models/user/User'

export class ChangeEmailForm {
  newEmail: string
  emailConfirmation: string
}

export default defineComponent({
  emits: ['close', 'submited'],
  components: { Form, Field, ErrorDisplay, BaseModal },
  props: {
    show: Boolean,
    user: {
      type: User,
      required: true,
    },
  },
  data() {
    return {
      form: new ChangeEmailForm(),
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
      const res = await UserService.changeEmail(
        this.user.id,
        this.form.newEmail,
      )
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
      this.form = new ChangeEmailForm()
    },
  },
})
</script>
