<template>
  <div
    class="modal fade"
    id="kt_modal_payout_bank_transfer_modal"
    ref="updatePayoutModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_payout_bank_transfer_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder text-primary">Bank Transfer Confirmation</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_payout_bank_transfer_close"
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
          <Form>
            <div
              class="card"
              style="border-bottom: 1px solid rgb(226, 228, 230) !important"
            >
              <div class="card-body">
                <h5 class="card-title">User Infomation</h5>
                <span>Email: {{ payoutUpdate.email }}</span>
                <span>Phone number: {{ payoutUpdate.phoneNumber }}</span>
                <span>MT5 ID: {{ payoutUpdate.mt5Id }}</span>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <div class="col-md-1 bg-info"></div>
                <div class="col-md-11">
                  <h5 class="card-title">Bank Transfer Infomation</h5>
                  <span>Bank name: {{ payoutUpdate.bankName }}</span>
                  <span>Bank branch code: {{ payoutUpdate.bankBranch }}</span>
                  <span
                    >Account holder name: {{ payoutUpdate.accountName }}</span
                  >
                  <span>Account type: {{ payoutUpdate.accountType }}</span>
                  <span>Account number: {{ payoutUpdate.accountNumber }}</span>
                  <span>Amount: {{ payoutUpdate.totalAmount }} ¥</span>
                </div>
              </div>
            </div>
            <div>
              <p>
                Status:
                <span class="text-primary font-weight-bold">{{
                  payoutUpdate.payoutStatus == 'BANK_TRANSFER'
                    ? 'WAITING FOR TRANSFER'
                    : payoutUpdate.payoutStatus
                }}</span>
              </p>
              <p>Payout Code: {{ payoutUpdate.payoutId }}</p>
            </div>
            <div>
              <Field
                v-model="payoutUpdate.reasonConfirmBankTransfer"
                type="text"
                name="remark"
                v-slot="{ field, errorMessage }"
                :rules="`required`"
              >
                <div class="form-group">
                  <label>Remark</label>
                  <textarea
                    :disabled="
                      payoutUpdate.payoutStatus == 'DONE' ||
                      payoutUpdate.payoutStatus == 'REJECTED' ||
                      payoutUpdate.payoutStatus == 'FAILED'
                    "
                    rows="3"
                    class="form-control"
                    v-bind="field"
                    placeholder="Write something here ..."
                  ></textarea>
                  <error-display :message="errorMessage"></error-display>
                </div>
              </Field>
            </div>
            <div class="d-flex flex-wrap">
              <button
                v-if="
                  payoutUpdate.payoutStatus.toUpperCase() ==
                  PaymentStatus.BANK_TRANSFER
                "
                type="submit"
                @click="approve"
                class="btn btn-success"
                style="margin-right: 10px"
              >
                Confirm
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#kt_modal_payout_bank_transfer_modal .card .card-body span {
  display: block;
  margin: 0.5rem 0;
}
</style>

<script>
import { computed } from 'vue'
import { ref } from 'vue'
import { hideModal } from '@/core/helpers/dom'
import { MT5Service } from '@/services/MT5Service'
import { Form, Field } from 'vee-validate'
import ErrorDisplay from '@/components/ErrorDisplay.vue'
import { Mutations } from '@/store/enums/StoreEnums'
import store from '@/store'
import { PaymentStatus } from '../../CommonEnum'

export default {
  name: 'bank-transfer-payout-modal',
  components: { Form, Field, ErrorDisplay },
  props: {
    payoutData: {
      type: Object,
      default: () => {
        return {
          payoutId: '',
          paymentCode: '',
          customerName: '',
          mt5Id: '',
          phoneNumber: '',
          email: '',
          amount: '',
          accountName: '',
          accountNumber: '',
          accountType: '',
          bankCode: '',
          bankName: '',
          bankBranch: '',
          bankCity: '',
          bankProvince: '',
          cplId: '',
          payoutStatus: '',
          reasonConfirmBankTransfer: '',
        }
      },
    },
  },
  data() {
    return {
      PaymentStatus,
      payoutUpdate: {
        payoutId: '',
        paymentCode: '',
        customerName: '',
        mt5Id: '',
        phoneNumber: '',
        email: '',
        amount: '',
        totalAmount: '',
        accountName: '',
        accountNumber: '',
        accountType: '',
        bankCode: '',
        bankName: '',
        bankBranch: '',
        bankCity: '',
        bankProvince: '',
        cplId: '',
        payoutStatus: '',
        reasonConfirmBankTransfer: '',
      },
      errorMessageRemark: '',
    }
  },
  watch: {
    payoutData: {
      handler(newVal) {
        this.payoutUpdate = newVal
      },
      immediate: true,
    },
  },
  setup(_, { emit }) {
    const updatePayoutModalRef = ref(null)

    const close = () => {
      hideModal(updatePayoutModalRef.value)
    }

    const currentUser = computed(() => {
      return store.getters.currentUser
    })

    return {
      updatePayoutModalRef,
      close,
      currentUser,
    }
  },
  methods: {
    async approve(e) {
      if (!this.payoutUpdate.reasonAdmin) {
        this.errorMessageRemark = 'Remark cannot be blank'
        return
      }
      e.preventDefault()
      store.commit(Mutations.SHOW_API_LOADING, true)
      this.close()
      if (
        this.payoutUpdate.payoutId &&
        this.payoutUpdate.cplId &&
        this.payoutUpdate.mt5Id
      ) {
        const dataInput = {
          payout_id: this.payoutUpdate.payoutId,
          cpl_id: this.payoutUpdate.cplId,
          mt5_login: this.payoutUpdate.mt5Id,
          remark: this.payoutUpdate.reasonConfirmBankTransfer,
          executor: this.currentUser.email,
        }
        const res = await MT5Service.confirmBankTransferPayout(dataInput)
        if (res && res.data.success) {
          this.$toastr.success(this.$t('Success'))
        } else {
          this.$toastr.error(res.data.message)
        }
        this.$emit('updated')
        this.$emit('refreshTable')
        store.commit(Mutations.SHOW_API_LOADING, false)
      }
    },
    async reject(e) {
      if (!this.payoutUpdate.reasonAdmin) {
        this.errorMessageRemark = 'Remark cannot be blank'
        return
      }
      e.preventDefault()
      store.commit(Mutations.SHOW_API_LOADING, true)
      this.close()
      if (
        this.payoutUpdate.payoutId &&
        this.payoutUpdate.cplId &&
        this.payoutUpdate.mt5Id
      ) {
        const dataInput = {
          payout_id: this.payoutUpdate.payoutId,
          cpl_id: this.payoutUpdate.cplId,
          mt5_login: this.payoutUpdate.mt5Id,
          remark: this.payoutUpdate.reasonConfirmBankTransfer,
          executor: this.currentUser.email,
        }
        const res = await MT5Service.rejectPayout(dataInput)
        if (res && res.data.success) {
          this.$toastr.success(this.$t('Success'))
        } else {
          this.$toastr.error(res.data.message)
        }
        this.$emit('updated')
        this.$emit('refreshTable')
        store.commit(Mutations.SHOW_API_LOADING, false)
      }
    },
  },
}
</script>
