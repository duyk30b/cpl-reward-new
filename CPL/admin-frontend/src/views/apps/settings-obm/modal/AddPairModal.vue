<template>
  <BaseModal
    :title="'Add pair OBM'"
    :show="show"
    @close="close"
    :dialog-class="'add-pair-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="addPairForm">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-12">
            <div class="mb-10">
              <label for="coin" class="form-label"> Coin </label>
              <select name="coin" v-model="pair.coin" class="form-control">
                <option
                  v-for="item of pairList"
                  :key="item.token"
                  :value="item.token"
                >
                  {{ `${item.token.toUpperCase()}` }}
                </option>
              </select>
            </div>
            <div class="mb-10">
              <label for="currency" class="form-label"> Currency </label>
              <select
                name="currency"
                v-model="pair.currency"
                class="form-control"
              >
                <option
                  v-for="item of pairList"
                  :key="item.token"
                  :value="item.token"
                >
                  {{ `${item.token.toUpperCase()}` }}
                </option>
              </select>
            </div>
            <div class="mb-10">
              <label for="exchange" class="form-label"> Exchange </label>
              <select
                name="exchange"
                v-model="pair.exchange"
                class="form-control"
              >
                <option
                  v-for="item of exchangeList"
                  :key="item.exchange"
                  :value="item.exchange"
                >
                  {{ `${item.exchange.toUpperCase()}` }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </Form>
    </template>
    <template v-slot:footer>
      <button class="btn btn-primary" @click="submitForm">
        {{ $t('setting.save') }}
      </button>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import { Form } from 'vee-validate'
import Swal from 'sweetalert2'
import { HttpStatus } from '@/core/variables/common.enum'
import { SettingOBMService } from '@/services/SettingOBMService'
import { plainToInstance } from 'class-transformer'
import {
  BalanceSetting,
  ObmExchangeSettingItemDTO,
  ObmPairSettingItemDTO,
} from '@/models/setting-obm/GeneralOBM'

export default defineComponent({
  name: 'add-pair-modal',
  components: { BaseModal, Form },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    pairs: {
      default: () => [] as Array<string>,
    },
  },
  data() {
    return {
      pair: {
        coin: 'btc',
        currency: 'usdt',
        exchange: 'binance',
        update_by: 'admin',
      },
      exchangeList: [] as ObmExchangeSettingItemDTO[],
      pairList: [] as BalanceSetting[],
    }
  },
  async mounted() {
    await this.getExchange()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getExchange() {
      const result = await SettingOBMService.getObmExchangeList()
      if (result.status != HttpStatus.OK) {
        this.$toastr.error('create pair error!')
        this.exchangeList = []
        this.pairList = []
        return
      }
      this.exchangeList = result.data.data
      this.pairList =
        this.exchangeList.find((item) => item.exchange == this.pair.exchange)
          ?.balances || []
    },
    async submitForm() {
      if (!this.pair.coin || !this.pair.currency) {
        this.$toastr.error('Coin and currency required!')
        return
      }
      if (
        this.pairs.find(
          (item) =>
            item.toLowerCase() ==
            `${this.pair.coin}/${this.pair.currency}`.toLowerCase(),
        )
      ) {
        this.$toastr.error('Pair is exist!')
        return
      }
      Swal.fire({
        icon: 'warning',
        buttonsStyling: false,
        text: `Do you want to add pair?`,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const result = await SettingOBMService.patchPairOBMSetting(
            plainToInstance(ObmPairSettingItemDTO, [this.pair]),
          )
          if (result.status != HttpStatus.OK) {
            this.$toastr.error('create pair error!')
            return
          }
          this.$toastr.success('create pair success!')
          this.$emit('updated')
          this.$emit('close')
        }
      })
    },
  },
})
</script>
