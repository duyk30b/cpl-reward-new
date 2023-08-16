<template>
  <div
    class="modal fade"
    id="auto-withdraw-group-modal"
    ref="AutoWithdrawGroupModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <Form @submit="submitForm" ref="autoWithdrawGroupForm">
          <div class="modal-header">
            <h5 class="modal-title">{{ $t('autoWithdraw.popupTitle') }}</h5>

            <!--begin::Close-->
            <div
              class="btn btn-icon btn-sm btn-active-light-primary ms-2"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <i class="fas fa-times"></i>
            </div>
            <!--end::Close-->
          </div>

          <div class="modal-body">
            <div class="form-group">
              <label class="fw-bold">{{ $t('autoWithdraw.currency') }}</label>
              <div class="form-group">
                <Field
                  name="currency"
                  as="select"
                  v-model="currency"
                  class="form-select"
                  rules="required"
                >
                  <option
                    :value="currencyItem"
                    :key="currencyItem"
                    v-for="currencyItem in currencyList"
                  >
                    {{ currencyItem }}
                  </option>
                </Field>
                <ErrorMessage name="currency" class="text-danger" />
              </div>
            </div>

            <div class="form-group">
              <label class="fw-bold">{{ $t('autoWithdraw.groupName') }}</label>
              <Field
                name="group_name"
                as="input"
                v-model="group_name"
                class="form-control"
                rules="required"
              ></Field>
              <ErrorMessage name="group_name" class="text-danger" />
            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-primary"
              :data-kt-indicator="isLoading ? 'on' : ''"
              :disabled="isLoading"
              @click="submitForm"
            >
              <span class="indicator-label"> {{ $t('save') }} </span>
              <span class="indicator-progress">
                {{ $t('save') }}
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { hideModal } from '@/core/helpers/dom'
// import Swal from 'sweetalert2'
import { Form, Field, ErrorMessage } from 'vee-validate'
import { AutoWithdrawService } from '@/services/AutoWithdrawService'

export default defineComponent({
  name: 'AutoWithdrawGroupModal',
  components: { Form, Field, ErrorMessage },
  props: ['currencyList'],
  data() {
    return {
      currency: '',
      group_name: '',
      isLoading: false,
    }
  },
  methods: {
    async submitForm() {
      const autoWithdrawGroupForm = this.$refs.autoWithdrawGroupForm as any
      const form = await autoWithdrawGroupForm.validate()
      if (!form.valid) {
        return
      }
      try {
        this.isLoading = true
        const withdrawGroup = {
          name: this.group_name,
          currency: this.currency.toLowerCase(),
        }
        const result = await AutoWithdrawService.createAutoWithdrawGroup(
          withdrawGroup,
        )

        this.isLoading = false
        const autoWithdrawGroupId = result?.data?.data?.id ?? null
        if (!autoWithdrawGroupId) {
          // return Swal.fire({
          //   text: this.$t('autoWithdraw.addGroupFail'),
          //   icon: 'warning',
          //   buttonsStyling: false,
          //   confirmButtonText: 'OK',
          //   customClass: {
          //     confirmButton: 'btn btn-primary',
          //   },
          // }).then(async () => {
          //   autoWithdrawGroupForm.resetForm()
          //   this.closeModal()
          // })
          this.$toastr.error(this.$t('autoWithdraw.addGroupFail'))
          autoWithdrawGroupForm.resetForm()
          this.closeModal()

          return
        }

        this.$toastr.success(this.$t('autoWithdraw.addGroupSuccess'))
        autoWithdrawGroupForm.resetForm()
        this.beforeSave()

        // Swal.fire({
        //   text: this.$t('autoWithdraw.addGroupSuccess'),
        //   icon: 'success',
        //   buttonsStyling: false,
        //   confirmButtonText: 'OK',
        //   customClass: {
        //     confirmButton: 'btn btn-primary',
        //   },
        // }).then(async () => {
        //   autoWithdrawGroupForm.resetForm()
        //   this.beforeSave()
        // })
      } catch (err) {
        this.isLoading = false
      }
    },
    // isNotValid() {
    //   if (this.currency) {
    //     return false
    //   }

    //   return true
    // },
    // changeCurrency(value) {
    //   this.currency = value
    // },
  },
  setup(props, { emit }) {
    const AutoWithdrawGroupModalRef = ref(null)

    const closeModal = () => {
      hideModal(AutoWithdrawGroupModalRef.value)
    }

    const beforeSave = async () => {
      emit('addedAutoWithdrawGroup')
      hideModal(AutoWithdrawGroupModalRef.value)
    }

    return {
      AutoWithdrawGroupModalRef,
      beforeSave,
      closeModal,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/auto_withdraw/scss/auto_withdraw_group_modal';
</style>
