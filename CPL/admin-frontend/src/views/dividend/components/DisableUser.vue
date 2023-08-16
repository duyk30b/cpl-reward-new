<template>
  <div
    class="modal fade"
    id="disable-user-modal"
    ref="disableUserModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t('dividendScreen.disableDividendUser') }}
          </h5>
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <i class="fas fa-times"></i>
          </div>
        </div>

        <div class="modal-body">
          <div class="row mt-5 align-items-center">
            <div class="col-4">
              <span class="fw-bolder">{{ $t('email') }}</span>
            </div>
            <div class="col-8">
              <el-select
                v-model="selectedUserId"
                filterable
                clearable
                remote
                reserve-keyword
                :placeholder="$t('email')"
                remote-show-suffix
                :remote-method="getUsersRegistrant"
                :loading="remoteLoading"
              >
                <el-option
                  v-for="user in users"
                  :key="user.user_id"
                  :label="user.email"
                  :value="user.user_id"
                />
              </el-select>
              <span class="text-danger" v-if="error">{{
                $t(`dividendScreen.validateSchema.unlimit_user.${error}`)
              }}</span>
            </div>
          </div>

          <div class="mt-5 d-flex justify-content-center">
            <button class="btn btn-primary me-5" @click.prevent="onCancel">
              {{ $t('cancel') }}
            </button>
            <button
              type="button"
              class="btn btn-primary float-right"
              :data-kt-indicator="onSubmitting ? 'on' : ''"
              :disabled="onSubmitting"
              @click="onSubmit"
            >
              <span class="indicator-label">
                {{ $t('submit') }}
              </span>
              <span class="indicator-progress">
                {{ $t('submit') }}

                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { hideModal } from '@/core/helpers/dom'
import { UserService } from '@/services/UserService'
import { DividendService } from '@/views/dividend/services/DividendService'

interface User {
  user_id: string
  email: string
}

export default defineComponent({
  name: 'DisableUser',
  props: {
    dividendNameSelected: String,
  },
  data: () => ({
    selectedUserId: '',
    users: [] as User[],
    remoteLoading: false,
    onSubmitting: false,
    error: '',
  }),
  methods: {
    async onSubmit() {
      if (!this.selectedUserId) {
        this.error = 'required'
        return
      }
      this.onSubmitting = true
      const { success, data } = await DividendService.disableUserDividend(
        +this.selectedUserId,
      )
      if (success && data?.data?.id) {
        this.disableDividendUserSuccess()
        this.$toastr.success(this.$t('success'))
      } else if (!success && 'id' in data?.error) {
        if (data?.error?.id.some((e) => e === 'validation.unique')) {
          this.error = 'exist'
        }
      } else {
        this.$toastr.error(this.$t('error'))
      }
      this.onSubmitting = false
    },
    onCancel() {
      this.closeModal()
    },
    beforeOpen() {
      this.resetData()
      this.error = ''
    },
    resetData() {
      this.selectedUserId = ''
    },
    async getUsersRegistrant(query) {
      this.remoteLoading = true
      const data = await UserService.getListUsers({
        search_field: 'email',
        search_text: query,
      })
      this.remoteLoading = false
      this.users = data?.data?.data ?? []
    },
  },
  watch: {
    selectedUserId: function (newUserId) {
      if (newUserId) {
        this.error = ''
      }
    },
  },
  setup(props, { emit }) {
    const disableUserModalRef = ref(null)

    const closeModal = () => {
      hideModal(disableUserModalRef.value)
    }

    const disableDividendUserSuccess = async () => {
      emit('disableDividendUserSuccess')
      hideModal(disableUserModalRef.value)
    }

    return {
      disableUserModalRef,
      closeModal,
      disableDividendUserSuccess,
    }
  },
})
</script>
