<template>
  <template v-if="userId && checkPermission(Permission.TOGGLE_BAN_USER)">
    <button
      v-if="isBanned"
      class="btn btn-sm btn-success mx-1"
      :class="btnClass"
      @click="confirmUnbanUser"
      :disabled="loading.submit"
    >
      <i class="fas fa-spinner fa-spin" v-if="loading.submit"></i>
      {{ $t('unban') }}
    </button>
    <button
      v-else
      class="btn btn-sm btn-danger mx-1"
      :class="btnClass"
      @click="selectReason"
      :disabled="loading.submit"
    >
      <i class="fas fa-spinner fa-spin" v-if="loading.submit"></i>
      {{ $t('ban') }}
    </button>
  </template>

  <rejection-reason
    :show="modal.reason"
    :reason-type="ReasonCategoryTypeEnum.BAN_USER"
    :loading="loading.submit"
    @close="modal.reason = false"
    @submit="confirmBanUser"
  ></rejection-reason>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { Permission } from '@/core/variables/common.enum'
import { checkPermission } from '@/core/helpers/common.helper'
import { UserService } from '@/services/UserService'
import RejectionReason from '@/components/modals/RejectionReason.vue'
import { ReasonCategoryTypeEnum } from '@/enums/user-reason.enum'
import { IBanUserReason } from '@/interfaces/reason.interface'
import { ElMessageBox } from 'element-plus'

export default defineComponent({
  components: {
    RejectionReason,
  },
  props: {
    userId: {
      type: String,
      required: true,
    },
    isBanned: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    loading: {
      submit: false,
    },
    modal: {
      reason: false,
    },
    Permission,
    ReasonCategoryTypeEnum,
  }),
  methods: {
    confirmUnbanUser() {
      ElMessageBox.confirm(this.$t('confirmAction'), this.$t('confirm'), {
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
        type: 'warning',
      }).then(async () => {
        await this.unbanUser()
      })
    },
    confirmBanUser(reasons: IBanUserReason[]) {
      ElMessageBox.confirm(this.$t('confirmAction'), this.$t('confirm'), {
        confirmButtonText: this.$t('yes'),
        cancelButtonText: this.$t('no'),
        type: 'warning',
      }).then(async () => {
        await this.banUser(reasons)
      })
    },
    async unbanUser() {
      if (!this.userId) return
      this.loading.submit = true
      const res = await UserService.unbanUser(this.userId)
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$emit('banStatusChange', false)
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
      }
      this.loading.submit = false
    },
    selectReason() {
      this.modal.reason = true
    },
    async banUser(reasons: IBanUserReason[]) {
      if (!this.userId) return
      this.loading.submit = true
      const res = await UserService.banUser(this.userId, { reasons })
      if (res.success) {
        this.$toastr.success(this.$t('success'))
        this.$emit('banStatusChange', true)
      } else if (res.message) {
        this.$toastr.error(this.$t(res.message))
      }
      this.loading.submit = false
    },
    checkPermission,
  },
})
</script>
