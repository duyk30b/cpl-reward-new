<template>
  <div
    class="modal fade"
    id="kt_modal_decimals_setting_insert_modal"
    ref="addBalanceDecimalsModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_decimals_setting_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('highLow.insertsBalanceDecimals') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_add_pair_close"
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
        <form @submit="handleAddbalanceDecimals" class="m-6">
          <CustomInputText
            v-model="balanceDecimals.currency"
            label="Currency"
            textAlign="left"
            type="text"
            placeholder="true"
            :required="true"
            @keyup="isValidForm()"
          />
          <span v-if="errorMessage" class="text-danger">
            {{ errorMessage }}
          </span>
          <div class="text-center mt-4">
            <button
              type="submit"
              class="btn btn-primary text-uppercase mt-4 px-16 w"
            >
              {{ $t('add') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { hideModal } from '@/core/helpers/dom'
import CustomInputText from '@/components/form/CustomInputText.vue'

export default {
  name: 'insert-balance-decimals-modal',
  components: { CustomInputText },
  props: {
    balanceDecimalsData: {
      type: Object,
      default: () => {
        return {
          currency: '',
        }
      },
    },
  },
  data() {
    return {
      balanceDecimals: this.balanceDecimalsData,
      errorMessage: '',
    }
  },
  watch: {
    balanceDecimalsData: {
      handler(newVal) {
        this.balanceDecimals = newVal
      },
      immediate: true,
    },
  },
  methods: {
    isValidForm() {
      this.errorMessage = ''
      if (this.balanceDecimals.currency === '') {
        this.errorMessage = this.$t('highLow.valid.thisFieldIsRequired')
        return true
      }
      return false
    },
    async handleAddbalanceDecimals(e) {
      e.preventDefault()
      if (this.isValidForm()) {
        return
      }

      this.$emit('refreshForm')
      return this.close()
    },
  },
  setup(_, { emit }) {
    const router = useRouter()
    const addBalanceDecimalsModalRef = ref(null)

    const form = reactive({
      key: '',
      value: '',
    })

    const close = () => {
      hideModal(addBalanceDecimalsModalRef.value)
    }

    return {
      ...toRefs(form),
      addBalanceDecimalsModalRef,
      close,
    }
  },
}
</script>
