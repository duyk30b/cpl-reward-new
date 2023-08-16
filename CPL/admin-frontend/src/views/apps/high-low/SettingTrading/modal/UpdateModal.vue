<template>
  <div
    class="modal fade"
    :id="idModal"
    ref="updatePairModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_update_pair_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('highLow.updatePair') }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            id="kt_modal_update_pair_close"
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
          <form @submit="save">
            <div class="">
              <label class="form-label">{{ $t('highLow.pair') }}:</label>
              <v-select
                :options="pairOptions"
                option-value="id"
                option-label="name"
                :placeholder="$t('highLow.pair')"
                v-model="pairUpdate.pairId"
                :multiple="false"
                :can-deselect="false"
                :remote="false"
                :sourceFunction="false"
                :disabled="true"
                :required="true"
              ></v-select>
            </div>
            <div class="mt-8">
              <CustomInput
                v-model="pairUpdate.decimalPart"
                suffix=""
                label="highLow.decimalPart"
                textAlign="left"
                type="number"
              />
            </div>
            <div class="mt-8">
              <CustomInput
                v-model="pairUpdate.highlowSpread"
                suffix=""
                label="highLow.highLowSpread"
                textAlign="left"
                type="number"
                maxLength="10"
                isPositive="true"
              />
            </div>
            <div class="mt-8">
              <CustomInput
                v-model="pairUpdate.turboSpread"
                suffix=""
                label="highLow.lightningSpread"
                textAlign="left"
                type="number"
                maxLength="10"
                isPositive="true"
              />
            </div>
            <div class="mt-8">
              <CustomInput
                v-model="pairUpdate.emergencyThreshold"
                suffix="highLow.usdt"
                label="highLow.tradeEmergencyStopThreshold"
                name="pair"
                textAlign="left"
                type="number"
                maxLength="9"
                isPositive="true"
              />
              <p
                class="text-danger"
                v-show="errorMessageTradeEmergencyStopThreshold"
              >
                {{ errorMessageTradeEmergencyStopThreshold }}
              </p>
            </div>

            <div class="text-center mt-4">
              <button
                type="submit"
                class="btn btn-primary text-uppercase mt-4 px-16 w"
              >
                {{ $t('submit') }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import { hideModal } from '@/core/helpers/dom'
import CustomInput from '@/components/form/CustomInput.vue'
import { HighLowService } from '@/services/HighLowService'

export default {
  name: 'update-pair-modal',
  components: { CustomInput },
  props: {
    pairData: {
      type: Object,
      default: () => {
        return {
          id: '',
          pairId: '',
          decimalPart: '',
          highlowSpread: '',
          turboSpread: '',
          emergencyThreshold: '',
          createdAt: '',
          updatedAt: '',
        }
      },
    },
    id: {
      type: String,
      default: () => '',
    },
  },
  data() {
    return {
      pairUpdate: {
        id: '',
        pairId: '',
        decimalPart: '',
        highlowSpread: '',
        turboSpread: '',
        emergencyThreshold: '',
        createdAt: '',
        updatedAt: '',
      },
      oldPairUpdate: {
        id: '',
        pairId: '',
        decimalPart: '',
        highlowSpread: '',
        turboSpread: '',
        emergencyThreshold: '',
        createdAt: '',
        updatedAt: '',
      },
      errorMessageTradeEmergencyStopThreshold: '',
      idModal: '',
    }
  },
  watch: {
    pairData: {
      handler(newVal) {
        this.pairUpdate = newVal
        this.pairUpdate.id = +this.pairUpdate.id
        this.pairUpdate.pairId = +this.pairUpdate.pairId
      },
      immediate: true,
    },
    id: {
      handler(newVal) {
        this.idModal = newVal
      },
      immediate: true,
    },
  },
  methods: {
    async save(e) {
      e.preventDefault()
      this.errorMessageTradeEmergencyStopThreshold = ''

      if (this.pairUpdate.emergencyThreshold == 0) {
        this.errorMessageTradeEmergencyStopThreshold =
          'The Trading Emergency Stop Threshold must be greater than 0'
        return
      }

      this.pairUpdate.emergencyThreshold =
        this.pairUpdate.emergencyThreshold.replace(/[,]/g, '')

      if (this.pairUpdate.id) {
        const res = await HighLowService.updatePair(this.pairUpdate)

        if (res && res.status == 200 && res.data == true) {
          this.$toastr.success(this.$t('success'))
          this.$emit('updated')
          this.$emit('refreshTable')
          return this.close()
        }
        return this.$toastr.error(this.$t('faild'))
      }
    },
  },
  setup(_, { emit }) {
    const updatePairModalRef = ref(null)

    const pairOptions = ref([
      { id: '', name: 'all' },
      { id: 1, name: 'BTC/USD' },
      { id: 2, name: 'ETH/USD' },
      { id: 3, name: 'BCH/USD' },
      { id: 4, name: 'XRP/USD' },
      { id: 5, name: 'LTC/USD' },
      { id: 6, name: 'EUR/USD' },
      { id: 7, name: 'USD/JPY' },
    ])

    const close = () => {
      hideModal(updatePairModalRef.value)
    }

    return {
      updatePairModalRef,
      close,
      pairOptions,
    }
  },
}
</script>
