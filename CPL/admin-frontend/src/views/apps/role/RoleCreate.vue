<template>
  <div class="card">
    <div class="card-header pt-2">
      <div class="card-title page-header text-header d-block">
        {{ $t('createRole') }}
      </div>
    </div>

    <div class="card-body pt-4">
      <role-form
        :role="role"
        :loadingSubmit="loading"
        @submit="submit"
        :errors="errors"
      ></role-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import RoleForm from './RoleForm.vue'
import { RoleService } from '@/services/RoleService'
import { Role } from '@/models/admin-permission/Role'
import { SubErrorCode } from '@/core/variables/common.enum'
import { getSubErrorCode } from '@/core/helpers/common.helper'

export default defineComponent({
  components: { RoleForm },
  mounted() {
    setCurrentPageBreadcrumbs('createRole', ['menu.roles'])
  },
  data() {
    return {
      role: new Role(),
      loading: false,
      errors: {} as Record<string, any>,
    }
  },
  methods: {
    async submit(data) {
      this.loading = true
      const res = await RoleService.createRole(data)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$router.push({
          name: 'role.list',
        })
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
        if (getSubErrorCode(res) == SubErrorCode.VALIDATION_FAIL) {
          this.errors = res.errors
        }
      }
      this.loading = false
    },
  },
})
</script>
