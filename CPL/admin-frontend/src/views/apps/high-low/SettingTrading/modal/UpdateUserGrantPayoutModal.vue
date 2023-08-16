<template>
  <div
    class="modal fade"
    id="kt_update_modal_user_grant_payout_modal"
    ref="userGrantPayoutModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('highLow.updateGrantPayout') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_update_modal_user_grant_payout_close"
            data-bs-dismiss="modal"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->
        <!--begin::Form-->
        <div class="m-6">
          <CustomInput
            v-model="dataUser.dataUser"
            label="highLow.email"
            textAlign="left"
            type="number"
            disabled
          />
        </div>
        <div class="m-6">
          <CustomInput
            v-model="dataUser.userId"
            label="highLow.userId"
            textAlign="left"
            type="number"
            disabled
          />
        </div>
        <div class="m-6">
          <label class="form-label d-block">
            {{ $t('highLow.payoutBonus') }}
          </label>
          <mark class="form-label d-inline-block" style="font-style: italic">
            {{ $t('highLow.noteGrantPayout') }}
          </mark>
          <CustomInputText
            v-model="dataUser.payoutBonus"
            textAlign="left"
            type="number"
            maxLength="5"
            @keyup="validatePayoutBonus"
          />
          <span class="text-danger" v-if="valid.payoutBonus">
            {{ valid.payoutBonus }}
          </span>
        </div>
        <div class="m-6 text-center">
          <a
            class="btn btn-primary text-uppercase mt-4 px-16"
            @click="handleGrantPayoutUser"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin fa-fw"></i>
            {{ $t('submit') }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import CustomInput from '@/components/form/CustomInput.vue'
import CustomInputText from '@/components/form/CustomInputText.vue'
import { hideModal } from '@/core/helpers/dom'
import { HighLowService } from '@/services/HighLowService'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'update-user-grant-payout-modal',
  components: { CustomInput, CustomInputText },
  props: {
    dataModal: {
      type: Object,
      default: () => {
        return {
          userSelected: null,
          userId: '',
          reason: '',
        }
      },
    },
  },
  data() {
    return {
      dataUser: this.dataModal,
      isLoading: false,
      options: [],
      email: '',
      valid: {
        payoutBonus: '',
      },
    }
  },
  watch: {
    dataModal: {
      handler(newVal) {
        if (this.valid.payoutBonus) {
          this.valid.payoutBonus = ''
        }
        this.dataUser = newVal
      },
      immediate: true,
    },
  },
  setup(_, { emit }) {
    const userGrantPayoutModalRef = ref(null)

    const close = () => {
      hideModal(userGrantPayoutModalRef.value)
    }

    return {
      userGrantPayoutModalRef,
      close,
    }
  },
  methods: {
    isPrecise(value: string) {
      const parts = value.split('.')
      if (parts.length == 1) {
        return true
      }
      if (parts.length == 2) {
        if (parts[1].length <= 2) {
          return true
        }
        return false
      }
      return false
    },
    validatePayoutBonus() {
      const { payoutBonus } = this.dataUser
      if (payoutBonus.indexOf('+') !== -1) {
        this.valid.payoutBonus = 'Number of payout must be number'
        return false
      }
      if (isNaN(+payoutBonus) || +payoutBonus <= 0) {
        this.valid.payoutBonus = 'Number of payout must be positive number'
        return false
      }
      if (!this.isPrecise(payoutBonus)) {
        this.valid.payoutBonus =
          'Number of payout must be less than or equal to 2 decimals'
        return false
      }
      this.valid.payoutBonus = ''
      return true
    },
    async handleGrantPayoutUser() {
      if (!this.validatePayoutBonus()) {
        return
      }
      this.isLoading = true
      const res = await HighLowService.updateUserGrantPayout(
        {
          payoutBonus: +this.dataUser.payoutBonus,
        },
        +this.dataUser.userId,
      )
      this.isLoading = false

      if (res.data['success']) {
        this.$toastr.success(this.$t('success'))
        this.dataUser.userSelected = null
        this.close()
        this.$emit('refreshTable')
      } else {
        const { message } = res.data
        this.$toastr.error(message)
      }
    },
  },
})
</script>
