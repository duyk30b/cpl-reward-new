<template>
  <div class="card">
    <div class="card-header pt-2">
      <div class="card-title page-header text-header d-block">
        [{{ $t('permissions') }}] {{ admin?.email }}
      </div>
    </div>

    <div class="card-body pt-4" v-if="admin">
      <Form @submit="submit">
        <div class="section-block">
          <div class="row">
            <div class="col-md-12">
              <div class="form-group">
                <label>{{ $t('roles') }}</label>
                <v-select
                  option-value="id"
                  option-label="name"
                  :placeholder="$t('roles')"
                  v-model="admin.roles"
                  searchable
                  :multiple="true"
                  :can-deselect="true"
                  :remote="true"
                  :sourceFunction="roleRemoteOptions"
                >
                </v-select>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-5">
          <h5>{{ $t('screenAccessPermissions') }}</h5>
          <span> {{ $t('userMapPermissionExplain') }}</span>
          <screen-permission-form
            v-model="admin.directScreens"
          ></screen-permission-form>
        </div>

        <div class="mt-8">
          <h5>{{ $t('apiAccessPermissions') }}</h5>
          <span> {{ $t('userMapPermissionExplain') }}</span>
          <api-permission-form
            v-model="admin.directPermissions"
          ></api-permission-form>
        </div>
        <div class="py-3">
          <button
            class="btn btn-primary me-3"
            type="submit"
            :disabled="loading"
          >
            <i v-if="loading" class="fas fa-spinner fa-spin me-3"></i>
            {{ $t('submit') }}
          </button>
          <button
            class="btn btn-secondary"
            type="button"
            @click="confirmCancel"
          >
            {{ $t('cancel') }}
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { Mutations } from '@/store/enums/StoreEnums'
import { Optional } from '@/models/common/Optional'
import { Admin } from '@/models/admin-permission/Admin'
import { AdminService } from '@/services/AdminService'
import { ElMessageBox } from 'element-plus'
import { RoleService } from '@/services/RoleService'
import { Form } from 'vee-validate'
import ApiPermissionForm from '@/components/common/ApiPermissionForm.vue'
import ScreenPermissionForm from '@/components/common/ScreenPermissionForm.vue'

export default defineComponent({
  components: {
    ScreenPermissionForm,
    Form,
    ApiPermissionForm,
  },
  mounted() {
    setCurrentPageBreadcrumbs('permissions', ['menu.accounts'])
    this.getData()
  },
  watch: {
    '$route.params.id': function () {
      this.getData()
    },
  },
  data() {
    return {
      admin: null as Optional<Admin>,
      loading: false,
    }
  },
  computed: {
    adminId(): string {
      return this.$route.params.id as string
    },
  },
  methods: {
    async getData() {
      this.$store.commit(Mutations.SHOW_API_LOADING, true)
      await this.getAdmin()
      this.$store.commit(Mutations.SHOW_API_LOADING, false)
    },
    async getAdmin(): Promise<void> {
      if (!this.adminId) return
      this.admin = await AdminService.findByIdWithRoleAndPermission(
        this.adminId,
      )
      if (!this.admin) this.$router.replace({ name: '404' })
    },
    async submit() {
      this.loading = true
      const res = await AdminService.setPermission(this.adminId, this.admin)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$router.push({
          name: 'admin.list',
        })
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
      }
      this.loading = false
    },
    confirmCancel() {
      ElMessageBox.confirm(this.$t('unsafeToLeave'), this.$t('confirm'), {
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
        type: 'warning',
      }).then(() => {
        this.$router.push({ name: 'admin.list' })
      })
    },
    roleRemoteOptions: async (text) => {
      const result = await RoleService.getListRoles({
        search_field: 'name',
        search_text: text,
        sort: 'name',
        sort_type: 'ASC',
      })
      return result?.data?.data
    },
  },
})
</script>
