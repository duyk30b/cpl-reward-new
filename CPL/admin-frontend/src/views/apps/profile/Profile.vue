<template>
  <div class="d-flex flex-column flex-xl-row">
    <div class="flex-column flex-lg-row-auto w-100 w-xl-350px mb-10">
      <div class="card mb-5 mb-xl-8">
        <div class="card-body pt-15">
          <div class="d-flex flex-center flex-column mb-5">
            <div class="symbol symbol-100px symbol-circle mb-7">
              <img src="media/avatars/300-1.jpg" alt="image" />
            </div>
            <div class="fs-3 text-gray-800 fw-bolder mb-1">
              {{ currentUser.name }}
            </div>
            <div class="fs-5 fw-bold text-muted mb-6">
              <small>{{ currentUser.email }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-lg-row-fluid ms-lg-15">
      <ul
        class="nav nav-custom nav-tabs nav-line-tabs nav-line-tabs-2x border-0 fs-4 fw-bold mb-8"
      >
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4 active"
            data-bs-toggle="tab"
            href="#security"
          >
            {{ $t('security') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4"
            data-bs-toggle="tab"
            href="#screens"
          >
            {{ $t('screenAccessPermissions') }}
          </a>
        </li>
        <li class="nav-item">
          <a
            class="nav-link text-active-primary pb-4"
            data-bs-toggle="tab"
            href="#permissions"
          >
            {{ $t('apiAccessPermissions') }}
          </a>
        </li>
      </ul>

      <div class="tab-content" id="myTabContent">
        <div class="tab-pane fade show active" id="security" role="tabpanel">
          <div class="card pt-4">
            <div class="card-header border-0">
              <div class="card-title">
                <h3>{{ $t('password') }}</h3>
              </div>
              <div class="card-toolbar">
                <button
                  type="button"
                  class="btn btn-sm btn-flex btn-light-primary"
                  @click="showChangePasswordModal = true"
                >
                  <i class="fas fa-lock"></i>
                  {{ $t('changePassword') }}
                </button>
              </div>
            </div>
            <div class="card-body pt-0 pb-5"></div>
          </div>
        </div>
        <div class="tab-pane fade" id="screens" role="tabpanel">
          <div class="card">
            <div class="card-body">
              <span>
                {{ $t('profilePermissionDescription') }}
              </span>
              <screen-permission-form
                v-model="currentUser.screens"
                :disabled="true"
              >
              </screen-permission-form>
            </div>
          </div>
        </div>
        <div class="tab-pane fade" id="permissions" role="tabpanel">
          <div class="card">
            <div class="card-body">
              <span>
                {{ $t('profilePermissionDescription') }}
              </span>
              <api-permission-form
                v-model="currentUser.permissions"
                :disabled="true"
              >
              </api-permission-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <change-password
    :show="showChangePasswordModal"
    @submited="passwordChanged"
    @close="closeChangePasswordModal"
  ></change-password>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { useStore } from 'vuex'
import ChangePassword from '@/views/apps/profile/ChangePassword.vue'
import { Actions } from '@/store/enums/StoreEnums'
import JwtService from '@/core/services/JwtService'
import ApiPermissionForm from '@/components/common/ApiPermissionForm.vue'
import ScreenPermissionForm from '@/components/common/ScreenPermissionForm.vue'

export default defineComponent({
  name: 'profile',
  components: { ChangePassword, ApiPermissionForm, ScreenPermissionForm },
  setup() {
    const store = useStore()

    const currentUser = computed(() => {
      return store.getters.currentUser
    })

    return {
      store,
      currentUser,
    }
  },
  mounted() {
    setCurrentPageBreadcrumbs('profile', [])

    const modal = this.$route.query?.modal
    switch (modal) {
      case 'changePassword':
        this.showChangePasswordModal = true
        break
      default:
        break
    }
  },
  data: function () {
    return {
      showChangePasswordModal: false,
    }
  },
  methods: {
    passwordChanged() {
      this.store.dispatch(Actions.REFRESH_ACCESS_TOKEN, {
        api_token: JwtService.getToken(),
      })
    },
    closeChangePasswordModal() {
      this.showChangePasswordModal = false
      let query = Object.assign({}, this.$route.query)
      delete query.modal
      this.$router.replace({ query })
    },
  },
})
</script>
