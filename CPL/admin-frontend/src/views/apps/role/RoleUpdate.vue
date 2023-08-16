<template>
  <div class="card">
    <div class="card-header pt-2">
      <div class="card-title page-header text-header d-block">
        {{ $t('updateRole') }}
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
import { Mutations } from '@/store/enums/StoreEnums'
import RoleForm from './RoleForm.vue'
import { RoleService } from '@/services/RoleService'
import { Optional } from '@/models/common/Optional'
import { Role } from '@/models/admin-permission/Role'
import { getSubErrorCode } from '@/core/helpers/common.helper'
import { SubErrorCode } from '@/core/variables/common.enum'

export default defineComponent({
  components: { RoleForm },
  mounted() {
    setCurrentPageBreadcrumbs('updateRole', ['menu.roles'])
    this.getData()
  },
  watch: {
    '$route.params.id': function () {
      this.getData()
    },
  },
  data() {
    return {
      role: null as Optional<Role>,
      loading: false,
      errors: {} as Record<string, any>,
    }
  },
  computed: {
    roleId(): string {
      return this.$route.params.id as string
    },
  },
  methods: {
    async getData() {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      await this.getRole()
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },
    async getRole() {
      if (!this.roleId) return
      this.role = await RoleService.findById(this.roleId)
      if (!this.role) this.$router.replace({ name: '404' })
    },
    async submit(data) {
      this.loading = true
      const res = await RoleService.updateRole(this.roleId, data)
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
