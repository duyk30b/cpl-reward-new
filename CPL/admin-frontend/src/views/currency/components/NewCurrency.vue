<template>
  <div class="card" id="register-currency">
    <div class="card-body pt-5">
      <div v-show="step === REGISTER_SCREEN_STEPS.COIN_INFORMATION">
        <coin-information
          @next-step="step = REGISTER_SCREEN_STEPS.WITHDRAW_INFORMATION"
        />
      </div>

      <div v-show="step === REGISTER_SCREEN_STEPS.WITHDRAW_INFORMATION">
        <withdrawal-information
          @pre-step="step = REGISTER_SCREEN_STEPS.COIN_INFORMATION"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import CoinInformation from '@/views/currency/components/steps/CoinInformation.vue'
import WithdrawalInformation from '@/views/currency/components/steps/WithdrawalInformation.vue'

import {
  REGISTER_SCREEN_STEPS,
  CURRENCY_TYPE,
} from '@/views/currency/variables/currency.const'

export default defineComponent({
  name: 'NewCurrency',
  components: {
    CoinInformation,
    WithdrawalInformation,
  },
  props: {
    isERCBEP20: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      REGISTER_SCREEN_STEPS,
      CURRENCY_TYPE,
      step: REGISTER_SCREEN_STEPS.COIN_INFORMATION,
      params: {
        // coinSettings
        type: '',
        contract_address: '',
        coin: '',
        coin_name: '',
        icon: '',
        env: '',
        decimals: null,
        required_confirmations: 100,
        transaction_explorer: '',
        transaction_path: '',

        // withdrawSettings
        on_deposit: false,
        on_withdrawal: false,
        minimum_withdrawal: null,
        fee: null,
        withdrawal_limit: null,
        time_reset: null,
        withdrawal_threshold: null,
        price: null,
      },
    }
  },
  mounted() {
    setCurrentPageBreadcrumbs(
      this.isERCBEP20 ? 'menu.registerNewEB20' : 'menu.registerNewCurrency',
      ['currency'],
    )
  },
  created() {
    this.params.type = !this.isERCBEP20 ? CURRENCY_TYPE.NOT_WALLET : ''
  },
  provide() {
    const params = {}
    Object.defineProperty(params, 'params', {
      enumerable: true,
      get: () => {
        return this.params || {}
      },
      set: (val) => (this.params = { ...val }),
    })
    return { params, isERCBEP20: this.isERCBEP20 }
  },
})
</script>

<style lang="scss" scoped>
@import '@/views/currency/scss/register_currency.scss';
</style>
