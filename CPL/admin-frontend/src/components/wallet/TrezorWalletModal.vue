<template>
  <div
    class="modal fade"
    id="kt_collector_trezor_modal"
    ref="collectorTrezorModal"
    tabindex="-1"
    aria-hidden="true"
    data-bs-backdrop="static"
  >
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="fw-bolder">
            {{
              $t('walletGeneral.collectTrezorTitle', {
                token: wallets[0]?.symbol?.toUpperCase(),
              })
            }}
          </h2>
          <div
            @click="closeModal"
            :disabled="loading"
            class="btn btn-icon btn-sm btn-active-icon-primary"
          >
            <span class="svg-icon svg-icon-1">
              <inline-svg src="media/icons/duotune/arrows/arr061.svg" />
            </span>
          </div>
        </div>
        <div class="p-5 modal-body">
          <div class="row mb-4">
            <div class="col-4 d-flex align-items-center fw-bold">
              {{ $t('from') }} :
            </div>
            <div class="col-6">
              <p class="mb-0" v-for="wallet in wallets" :key="wallet.id">
                {{ wallet.address }}
              </p>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-4 d-flex align-items-center fw-bold">
              {{ $t('amount') }} :
            </div>
            <div class="col-6">
              {{ totalBalance }} {{ wallets[0]?.symbol?.toUpperCase() }}
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-4 d-flex align-items-center fw-bold">
              {{ $t('walletGeneral.receiverAddress') }} :
            </div>
            <div class="col-6">
              {{ receiver?.address }}
            </div>
          </div>
        </div>
        <div class="mt-4 modal-footer justify-content-center">
          <button
            class="btn btn-secondary me-4"
            @click="closeModal"
            :disabled="loading"
          >
            {{ $t('cancel') }}
          </button>
          <button
            class="btn btn-primary"
            @click="submitCollect"
            :disabled="loading"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
            {{ $t('confirm') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { hideModal, showModal } from '@/core/helpers/dom'
import BigNumber from 'bignumber.js'
import {
  CollectorAddress,
  TrezorWallet,
} from '@/models/trezor-wallet/TrezorWallet'
import {
  collectBtcFromAddresses,
  collectFromEthereumAddress,
  collectXrpFromAddress,
  SUPPORTED_MULTIPLE_ADDRESS,
} from '@/core/helpers/trezor-connector'
import { CoinItem } from '@/models/setting-exchange/CoinSetting'
import { WalletSettingService } from '@/services/WalletSettingService'

export default defineComponent({
  props: {
    wallets: {
      type: Array as PropType<Array<TrezorWallet>>,
      default: [] as TrezorWallet[],
    },
    receiver: {
      type: CollectorAddress,
      default: null,
    },
    coins: {
      type: Array as PropType<Array<CoinItem>>,
      default: [] as CoinItem[],
    },
  },
  data() {
    return {
      loading: false,
    }
  },
  computed: {
    totalBalance() {
      const balance = this.wallets.reduce(
        (cur, next) => cur.plus(next.balance),
        new BigNumber(0),
      )

      return balance.toString()
    },
  },
  methods: {
    showModal() {
      showModal(this.$refs.collectorTrezorModal as HTMLElement)
      this.$emit('show')
    },
    closeModal(success?: boolean) {
      hideModal(this.$refs.collectorTrezorModal as HTMLElement)
      this.$emit('close', success)
    },
    async submitCollect() {
      const symbol = this.coins.find(
        (coin) => coin.coin === this.wallets[0].symbol,
      )

      if (!symbol) {
        this.$toastr.error(this.$t('walletGeneral.invalidSymbol'))
        return
      }

      const network = symbol.networks[0].env ?? 'testnet'

      try {
        this.loading = true
        if (SUPPORTED_MULTIPLE_ADDRESS.includes(this.wallets[0].symbol)) {
          const response = await collectBtcFromAddresses(
            this.wallets,
            network,
            this.receiver.address,
            this.receiver.feeLimit,
          )

          if (!response.success) {
            this.$toastr.error(this.$t('walletGeneral.failedCollectTrezor'))
            this.loading = false
            return
          }

          //  response.payload.txid
          await this.onSuccessCollect(response.payload.txid)
          return
        }

        if (this.wallets[0].symbol === 'xrp') {
          const response = await collectXrpFromAddress(
            this.wallets[0],
            this.receiver.address,
            this.receiver.feeLimit,
            symbol.networks[0] as any,
          )

          if (response.result.engine_result_code !== 0) {
            this.$toastr.error(this.$t('walletGeneral.failedCollectTrezor'))
            this.loading = false
            return
          }

          // response.result?.tx_json?.hash
          await this.onSuccessCollect(response.result.tx_json?.hash)
          return
        }

        const response = await collectFromEthereumAddress(
          this.wallets[0],
          this.receiver.address,
          this.receiver.feeLimit,
          this.receiver.feePrice,
          symbol.networks[0] as any,
        )

        // response.hash
        await this.onSuccessCollect(response.hash)
      } catch (e: any) {
        console.log(e)
        this.$toastr.error(
          e?.message ?? this.$t('walletGeneral.failedCollectTrezor'),
        )
        this.loading = false
      }
    },
    async onSuccessCollect(hash: string) {
      await WalletSettingService.createTrezorTransaction({
        trezor_ids: this.wallets.map((wallet) => wallet.id),
        symbol: this.wallets[0].symbol,
        chain_code: this.wallets[0].chainCode,
        hash: hash,
      })

      this.$toastr.success(this.$t('walletGeneral.succeedCollectTrezor'))
      this.closeModal(true)
      this.loading = false
    },
  },
})
</script>
<style scoped>
.fs-small {
  font-size: 0.75rem;
}
</style>
