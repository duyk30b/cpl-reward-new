<template>
  <div
    class="modal fade"
    id="kt_modal_setting_pair_insert_modal"
    ref="addPairModalRef"
    tabindex="-1"
    aria-hidden="true"
  >
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_add_pair_header">
          <!--begin::Modal title-->
          <h2 class="fw-bolder">{{ $t('highLow.insertPair') }}</h2>
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
        <form @submit="handleAddPair" class="m-6">
          <div class="">
            <!-- Pair -->
            <div class="">
              <label class="form-label">{{ $t('highLow.pair') }}:</label>
              <v-select
                :options="pairOptions"
                option-value="id"
                option-label="name"
                :placeholder="$t('highLow.pair')"
                v-model="pairInsert.pairId"
                :multiple="false"
                :can-deselect="true"
                :remote="false"
                :sourceFunction="false"
                :required="true"
              ></v-select>
              <p class="text-danger" v-show="errorMessage">
                {{ errorMessage }}
              </p>
            </div>
          </div>
          <div class="mt-8">
            <CustomInput
              v-model="pairInsert.decimalPart"
              suffix=""
              label="highLow.decimalPart"
              textAlign="left"
              type="number"
              placeholder="true"
              :required="true"
            />
          </div>
          <div class="mt-8">
            <CustomInput
              v-model="pairInsert.highlowSpread"
              suffix=""
              label="highLow.highLowSpread"
              textAlign="left"
              type="number"
              placeholder="true"
              :required="true"
            />
          </div>
          <div class="mt-8">
            <CustomInput
              v-model="pairInsert.turboSpread"
              suffix=""
              label="highLow.lightningSpread"
              name="pair"
              textAlign="left"
              type="number"
              placeholder="true"
              :required="true"
            />
          </div>
          <div class="mt-8">
            <CustomInput
              v-model="pairInsert.emergencyThreshold"
              suffix="highLow.usdt"
              label="highLow.tradeEmergencyStopThreshold"
              name="pair"
              textAlign="left"
              type="number"
              placeholder="true"
              :required="true"
            />
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
</template>
<script>
import { reactive, ref, toRefs } from 'vue'
import { useRouter } from 'vue-router'
import { hideModal } from '@/core/helpers/dom'
import CustomInput from '@/components/form/CustomInput.vue'
import { HighLowService } from '@/services/HighLowService'

export default {
  name: 'insert-pair-modal',
  components: { CustomInput },
  props: {
    pairData: {
      type: Object,
      default: () => {
        return {
          pairId: '',
          decimalPart: '',
          highlowSpread: '',
          turboSpread: '',
          emergencyThreshold: '',
        }
      },
    },
  },
  data() {
    return {
      pairInsert: this.pairData,
      errorMessage: '',
    }
  },
  watch: {
    pairData: {
      handler(newVal) {
        this.pairInsert = newVal
      },
      immediate: true,
    },
  },
  methods: {
    async handleAddPair(e) {
      e.preventDefault()
      this.errorMessage = ''

      if (this.pairInsert.pairId == '') {
        this.errorMessage = 'The Pair field is required.'
        return this.$toastr.error(this.$t('faild'))
      }

      const res = await HighLowService.createPair(this.pairInsert)

      if (res && res.status == 200 && res.data == true) {
        this.$toastr.success(this.$t('success'))
        this.$emit('updated')
        return this.close()
      }
      return this.$toastr.error(
        this.$t('The Pair exists. Please select another pair.'),
      )
    },
  },
  setup(_, { emit }) {
    const router = useRouter()
    const addPairModalRef = ref(null)

    const form = reactive({
      pair: '',
      decimal: '',
      hlSpread: '',
      lightning: '',
      trading: '',
    })

    const pairOptions = ref([
      { id: '', name: 'all' },
      { id: 1, name: 'BTC/USD' },
      { id: 2, name: 'ETH/USD' },
      { id: 3, name: 'BCH/USD' },
      { id: 4, name: 'XRP/USD' },
      { id: 5, name: 'LTC/USD' },
    ])

    const close = () => {
      hideModal(addPairModalRef.value)
    }

    return {
      ...toRefs(form),
      pairOptions,
      addPairModalRef,
      close,
    }
  },
}
</script>
