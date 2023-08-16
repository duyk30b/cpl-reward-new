<template>
  <div
    class="modal fade"
    id="kt_modal_payin_update_modal"
    ref="updatepayinModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_payin_update_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder text-primary">Approvement</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_payin_update_close"
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
                <span>Bitcastle Email: {{ payinUpdate.emailBitcastle }}</span>
                <span>MT5 ID: {{ payinUpdate.mt5Id }}</span>
              </div>
            </div>
            <div class="card">
              <div class="card-body">
                <div class="col-md-1 bg-info"></div>
                <div class="col-md-11">
                  <h5 class="card-title">Deposit Infomation</h5>
                  <span
                    >Amount:
                    {{
                      formatAmount(payinUpdate.amount) +
                      ' ' +
                      (payinUpdate.baseCurrency == 'JPY' ? '¥' : '$')
                    }}</span
                  >
                  <span
                    >Estimate Amount:
                    {{
                      formatAmount(payinUpdate.totalAmount) +
                      ' ' +
                      (payinUpdate.baseCurrency == 'JPY' ? '¥' : '$')
                    }}</span
                  >
                </div>
              </div>
            </div>
            <div>
              <p>
                Status:
                <span class="text-primary font-weight-bold">{{
                  payinUpdate.payinStatus
                }}</span>
              </p>
              <p>Payin Code: {{ payinUpdate.payinId }}</p>
            </div>
            <div>
              <Field
                v-model="payinUpdate.reasonAdmin"
                type="text"
                name="remark"
                v-slot="{ field, errorMessage }"
                :rules="`required`"
              >
                <div class="form-group">
                  <label>Remark</label>
                  <textarea
                    :disabled="payinUpdate.payinStatus == 'DONE'"
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
                  payinUpdate.payinStatus.toUpperCase() ==
                  PaymentStatus.PROCESSING
                "
                type="submit"
                @click="approve"
                class="btn btn-success"
                style="margin-right: 10px"
              >
                Approve
              </button>
              <button
                v-if="
                  payinUpdate.payinStatus.toUpperCase() ==
                  PaymentStatus.PROCESSING
                "
                type="submit"
                @click="reject"
                class="btn btn-danger"
              >
                Reject
              </button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
#kt_modal_payin_update_modal .card .card-body span {
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
import BigNumber from 'bignumber.js'

export default {
  name: 'update-payin-modal',
  components: { Form, Field, ErrorDisplay },
  props: {
    payinData: {
      type: Object,
      default: () => {
        return {
          payinId: '',
          mt5Id: '',
          amount: '',
          totalAmount: '',
          cplId: '',
          payinStatus: '',
          reasonAdmin: '',
          baseCurrency: '',
          quote: '',
          emailBitcastle: '',
        }
      },
    },
  },
  data() {
    return {
      PaymentStatus,
      payinUpdate: {
        payinId: '',
        mt5Id: '',
        amount: '',
        totalAmount: '',
        cplId: '',
        payinStatus: '',
        reasonAdmin: '',
        baseCurrency: '',
        quote: '',
        emailBitcastle: '',
      },
      errorMessageRemark: '',
    }
  },
  watch: {
    payinData: {
      handler(newVal) {
        this.payinUpdate = newVal
      },
      immediate: true,
    },
  },
  setup(_, { emit }) {
    const updatepayinModalRef = ref(null)

    const close = () => {
      hideModal(updatepayinModalRef.value)
    }

    const currentUser = computed(() => {
      return store.getters.currentUser
    })

    return {
      updatepayinModalRef,
      close,
      currentUser,
    }
  },
  methods: {
    async approve(e) {
      if (!this.payinUpdate.reasonAdmin) {
        this.errorMessageRemark = 'Remark cannot be blank'
        return
      }
      e.preventDefault()
      store.commit(Mutations.SHOW_API_LOADING, true)
      this.close()
      if (
        this.payinUpdate.payinId &&
        this.payinUpdate.cplId &&
        this.payinUpdate.mt5Id
      ) {
        const dataInput = {
          payout_id: this.payinUpdate.payinId,
          cpl_id: this.payinUpdate.cplId,
          mt5_login: this.payinUpdate.mt5Id,
          remark: this.payinUpdate.reasonAdmin,
          executor: this.currentUser.email,
        }
        const res = await MT5Service.approvePayin(dataInput)
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
      if (!this.payinUpdate.reasonAdmin) {
        this.errorMessageRemark = 'Remark cannot be blank'
        return
      }
      e.preventDefault()
      store.commit(Mutations.SHOW_API_LOADING, true)
      this.close()
      if (
        this.payinUpdate.payinId &&
        this.payinUpdate.cplId &&
        this.payinUpdate.mt5Id
      ) {
        const dataInput = {
          payout_id: this.payinUpdate.payinId,
          cpl_id: this.payinUpdate.cplId,
          mt5_login: this.payinUpdate.mt5Id,
          remark: this.payinUpdate.reasonAdmin,
          executor: this.currentUser.email,
        }
        const res = await MT5Service.rejectPayin(dataInput)
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
    formatAmount(amount) {
      return new BigNumber(amount).toFormat()
    },
  },
}
</script>
