<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('create') }}
      </div>
    </div>
    <div class="card-body pt-0">
      <group-notification-form
        :loadingSubmit="loading.submit"
        :errors="errors"
        v-model="form"
        @submit="submit"
      ></group-notification-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setPageFliud } from '@/core/helpers/common.helper'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import GroupNotificationForm from './form.vue'
import { GroupNotification } from '@/models/notification/Notification'
import { NotificationService } from '@/services/NotificationService'

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.groupNotification', ['menu.notification'])
  },
  components: {
    GroupNotificationForm,
  },
  data() {
    return {
      form: new GroupNotification(),
      loading: {
        submit: false,
      },
      errors: {},
    }
  },
  methods: {
    async submit() {
      this.loading.submit = true
      const res = await NotificationService.create(this.form)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$router.back()
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
        this.errors = res.errors
      }
      this.loading.submit = false
    },
  },
})
</script>
