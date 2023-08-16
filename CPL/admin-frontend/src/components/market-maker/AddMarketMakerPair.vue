<template>
  <BaseModal
    :title="'Add pair MM'"
    :show="show"
    @close="close"
    :dialog-class="'add-pair-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="addPairForm">
        <div class="row gy-5 g-xl-8">
          <div class="col-md-12">
            <div class="mb-10">
              <label for="coin" class="form-label"> Pair </label>
              <select name="coin" v-model="pair" class="form-control">
                <option
                  v-for="item of pairList"
                  :key="`${item.coin}/${item.currency}`"
                  :value="`${item.coin}/${item.currency}`"
                >
                  {{
                    `${item.coin.toUpperCase()}/${item.currency.toUpperCase()}`
                  }}
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
import { MarketMakerService } from '@/services/MarketMakerService'
import { plainToInstance } from 'class-transformer'
import { MarketMakerPair } from '@/models/market-maker/DataPoint'
import { SettingExchangeService } from '@/services/SettingExchangeService'

export default defineComponent({
  name: 'add-market-maker-pair-modal',
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
      pair: 'btc/usdt',
      pairList: [] as any[],
    }
  },
  async mounted() {
    await this.getPairList()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getPairList() {
      const pairData = await SettingExchangeService.getPairList({})

      if (pairData.status != HttpStatus.OK) {
        this.pairList = []
        return
      }

      this.pairList = pairData?.data?.data || []

      if (this.pairList?.length) {
        this.pairList.filter((i) => {
          const { coin, currency } = i

          const exist = this.pairs.find(
            (p) => p.toLowerCase() === `${coin}/${currency}`,
          )

          return !exist
        })
      }
    },
    async submitForm() {
      if (!this.pair) {
        this.$toastr.error('Pair required!')
        return
      }
      if (
        this.pairs.find((item) => item.toLowerCase() == this.pair.toLowerCase())
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
          const [coin, currency] = this.pair.split('/')
          const result = await MarketMakerService.addMarketMakerPair(
            plainToInstance(MarketMakerPair, { coin, currency }),
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
