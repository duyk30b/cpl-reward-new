<template>
  <Form @submit="submit" ref="formEl">
    <div class="section-block">
      <div class="row">
        <div class="col-md-6">
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
        </div>
        <div class="col-md-6">
          <div class="form-group">
            <label>{{ $t('description') }}</label>
            <input class="form-control" v-model="form.description" />
          </div>
        </div>
      </div>
    </div>
    <screen-permission-form v-model="form.screens"></screen-permission-form>
    <api-permission-form v-model="form.permissions"></api-permission-form>
    <div class="py-3">
      <button
        class="btn btn-primary me-3"
        type="submit"
        :disabled="loadingSubmit"
      >
        <i v-if="loadingSubmit" class="fas fa-spinner fa-spin me-3"></i>
        {{ $t('submit') }}
      </button>
      <button class="btn btn-secondary" type="button" @click="confirmCancel">
        {{ $t('cancel') }}
      </button>
    </div>
  </Form>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Role } from '@/models/admin-permission/Role'
import { instanceToInstance } from 'class-transformer'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import ApiPermissionForm from '@/components/common/ApiPermissionForm.vue'
import { ElMessageBox } from 'element-plus'
import { formatServerErrors } from '@/core/helpers/common.helper'
import ScreenPermissionForm from '@/components/common/ScreenPermissionForm.vue'

export default defineComponent({
  emits: ['submit'],
  components: {
    ScreenPermissionForm,
    Form,
    Field,
    ErrorDisplay,
    ApiPermissionForm,
  },
  props: {
    role: {
      type: Role,
      default: new Role(),
    },
    loadingSubmit: {
      type: Boolean,
      default: false,
    },
    errors: null,
  },
  watch: {
    role: function () {
      this.form = instanceToInstance(this.role, { exposeDefaultValues: true })
    },
    errors: function () {
      if (this.errors && this.$refs.formEl) {
        ;(this.$refs.formEl as any).setErrors(formatServerErrors(this.errors))
      }
    },
  },
  data() {
    return {
      form: new Role(),
    }
  },
  methods: {
    submit() {
      this.$emit('submit', this.form)
    },
    confirmCancel() {
      ElMessageBox.confirm(this.$t('unsafeToLeave'), this.$t('confirm'), {
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
        type: 'warning',
      }).then(() => {
        this.$router.push({ name: 'role.list' })
      })
    },
  },
})
</script>
