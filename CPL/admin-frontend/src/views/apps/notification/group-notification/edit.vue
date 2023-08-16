<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('edit') }}
      </div>
    </div>
    <div class="card-body pt-0">
      <group-notification-form
        :loadingSubmit="loading.submit"
        :loadingNotification="loading.notification"
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
import { Optional } from '@/models/common/Optional'

export default defineComponent({
  name: 'basic-info',
  mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.groupNotification', ['menu.notification'])
  },
  created() {
    this.getData()
  },
  components: {
    GroupNotificationForm,
  },
  data() {
    return {
      form: null as Optional<GroupNotification>,
      loading: {
        submit: false,
        notification: false,
      },
      errors: {},
    }
  },
  computed: {
    id() {
      return this.$route.params.id as string
    },
  },
  methods: {
    async getData() {
      this.loading.notification = true
      this.form = await NotificationService.findById(this.id)
      if (!this.form) {
        this.$router.replace({ name: '404' })
      }
      this.loading.notification = false
    },
    async submit() {
      if (!this.form?.id) return
      this.loading.submit = true
      const res = await NotificationService.update(this.form.id, this.form)
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
