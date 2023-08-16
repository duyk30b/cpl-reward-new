<template>
  <div
    class="modal fade"
    id="down-currency-modal"
    ref="downCurrencyModalRef"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            {{ $t('currencyScreen.downCurrencyModal.title') }}
          </h5>

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
            <label class="fw-bold">{{ $t('currencyScreen.coin') }}</label>
            <el-select
              class="form-select-solid"
              placeholder="Select coin"
              v-model="coinSelected"
              clearable
              filterable
              @change="changeCoin"
            >
              <el-option
                v-for="coin in listCoin"
                :value="coin"
                :key="coin"
                :label="coin"
              >
                {{ coin }}
              </el-option>
            </el-select>
          </div>

          <div class="form-group">
            <label class="fw-bold">{{ $t('currencyScreen.coinName') }}</label>
            <el-input type="text" placeholder="Token Name" disabled />
          </div>

          <div>
            <span class="token-type">TYPE: ERC20</span>
          </div>
          <div>
            <span class="token-notice"
              >* {{ $t('currencyScreen.downCurrencyModal.notice') }}</span
            >
          </div>
        </div>

        <div class="modal-footer">
          <button
            class="btn btn-primary"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            {{ $t('cancel') }}
          </button>

          <button
            type="button"
            class="btn btn-primary"
            :data-kt-indicator="isLoading ? 'on' : ''"
            :disabled="isLoading || !coinSelected"
            @click="downCurrency"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { hideModal } from '@/core/helpers/dom'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'DownCurrencyModal',
  props: [],

  data() {
    return {
      token: null,
      coinSelected: null,
      listCoin: [],
      isLoading: false,
    }
  },
  methods: {
    async submitForm() {
      // TODO: check withdraw pending
      this.closeModal()
      return Swal.fire({
        text: 'Successfully down currency',
        icon: 'success',
        buttonsStyling: false,
        confirmButtonText: 'Down Currency History',
        customClass: {
          confirmButton: 'btn btn-primary',
        },
      }).then(async () => {
        // TODO:
      })
    },

    async checkWithdrawPending() {
      // TODO: check withdraw pending
      // return Swal.fire({
      //   icon: 'warning',
      //   text: `Withdraw approve pending of this Currency still exist.
      //   Do you want to down Currency?`,
      //   showCancelButton: true,
      //   confirmButtonText: this.$t('yes'),
      //   cancelButtonText: this.$t('no'),
      // }).then(async () => {
      //
      // })
    },

    async changeCoin() {
      // TODO:
    },
    async getListCoin() {
      // TODO: get list coin
      this.listCoin = []
    },
    async downCurrency() {
      // TODO: down currency
      this.isLoading = true
    },
  },
  setup() {
    const downCurrencyModalRef = ref(null)

    const closeModal = () => {
      hideModal(downCurrencyModalRef.value)
    }

    return {
      downCurrencyModalRef,
      closeModal,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/down_currency_modal.scss';
</style>
