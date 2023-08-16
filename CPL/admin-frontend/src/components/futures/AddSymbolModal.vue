<template>
  <BaseModal
    :title="$t('futures.setting.addSymbol')"
    :show="show"
    @close="close"
  >
    <template v-slot:body>
      <form ref="translateForm" @submit="saveSymbol">
        <div class="form-group row">
          <div class="col-lg-12">
            <label for="key" class="form-label required">
              {{ $t('futures.setting.coin') }}
            </label>
            <v-select
              :options="[]"
              v-model="settingData.coin"
              option-value="key"
              option-label="value"
              :can-deselect="false"
              @change="changeCoin"
              searchable
              :class="{
                'input-future-setting-fail': validateResult.coin !== '',
              }"
              :remote="true"
              :sourceFunction="getCoinList"
            >
            </v-select>
            <span style="color: red" v-if="validateResult.coin !== ''">{{
              validateResult.coin
            }}</span>
          </div>
        </div>

        <div class="form-group row">
          <div class="col-lg-12">
            <label for="key" class="form-label required">
              {{ $t('futures.setting.currency') }}
            </label>
            <v-select
              :options="currenciesData"
              v-model="settingData.currency"
              option-value="key"
              option-label="value"
              :can-deselect="false"
              @change="changeCurrency"
              searchable
              :class="{
                'input-future-setting-fail': validateResult.currency !== '',
              }"
            >
            </v-select>
            <span style="color: red" v-if="validateResult.currency !== ''">{{
              validateResult.currency
            }}</span>
          </div>
        </div>
      </form>
    </template>
    <template v-slot:footer>
      <button
        class="btn btn-primary"
        @click="saveSymbol"
        :data-kt-indicator="loading ? 'on' : ''"
        :disabled="loading"
      >
        {{ $t('save') }}
      </button>
    </template>
  </BaseModal>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import _ from 'lodash'
import { FutureService } from '@/services/FutureService'
import CONFIG from '@/config'
import { plainToInstance } from 'class-transformer'
import { GetListCoinName } from '@/models/setting-exchange/CoinSetting'
import { HttpStatus, SORT_TYPE } from '@/core/variables/common.enum'
import { SettingExchangeService } from '@/services/SettingExchangeService'

export default defineComponent({
  name: 'add-symbol-modal',
  components: { BaseModal },
  props: {
    show: Boolean,
  },
  beforeMount() {
    localStorage.removeItem('future_setting_coin')
    localStorage.removeItem('future_setting_currency')
  },
  data() {
    return {
      currenciesData: CONFIG.CURRENCY_LIST.sort().map((cur) => ({
        key: cur,
        value: cur.toUpperCase(),
      })),
      settingData: {
        coin: '',
        currency: '',
      },
      loading: false,
      validateResult: {
        coin: '',
        currency: '',
      },
      coinsData: [] as any[],
    }
  },
  methods: {
    async getCoinList(coin) {
      const instance = plainToInstance(
        GetListCoinName,
        {
          sort_type: SORT_TYPE.ASC,
          per_page: 10,
          coin,
        },
        { exposeDefaultValues: true },
      )
      const coinData = await SettingExchangeService.getListCoinName(instance)
      if (coinData.status !== HttpStatus.OK) {
        this.$toastr.error(
          this.$t((coinData?.data as unknown as any)?.message) ||
            'Something went wrong',
        )
        return
      }
      const coinList = coinData.data?.data?.map((coin) => {
        return {
          key: `${coin}`,
          value: `${coin.toUpperCase()}`,
        }
      })

      this.coinsData = _.sortBy(coinList, [
        function (o) {
          return o.key
        },
      ])
      return this.coinsData
    },
    close() {
      this.$emit('close')
    },
    changeCoin(currentValue) {
      for (let key in this.coinsData) {
        const coin = this.coinsData[key]
        if (coin.key === currentValue) this.settingData.coin = coin.key
      }
    },
    changeCurrency(currentValue) {
      for (let key in this.currenciesData) {
        const currency = this.currenciesData[key]
        if (currency.key === currentValue)
          this.settingData.currency = currency.key
      }
    },
    async saveSymbol(e) {
      e.preventDefault()
      this.loading = true
      if (
        this.settingData.coin.toString().trim() === '' ||
        this.settingData.currency.toString().trim() === ''
      ) {
        if (this.settingData.coin === '')
          this.validateResult.coin = this.$t('futures.setting.validate.coin')
        if (this.settingData.currency === '')
          this.validateResult.currency = this.$t(
            'futures.setting.validate.currency',
          )

        this.loading = false
        return this.$toastr.error(this.$t('futures.setting.createSymbolFailed'))
      }

      const setting = await FutureService.getSingleSetting(
        this.settingData.coin.toString(),
        this.settingData.currency.toString(),
      )
      if (setting !== null) {
        this.loading = false
        return this.$toastr.error(
          this.$t('futures.setting.createDuplicateSymbol'),
        )
      }

      localStorage.setItem('future_setting_coin', this.settingData.coin)
      localStorage.setItem('future_setting_currency', this.settingData.currency)
      this.resetValidateResult()
      this.loading = false
      this.close()

      this.$router.push({ name: 'futures.setting.add' })
    },
    resetValidateResult() {
      this.validateResult = this.settingData = {
        coin: '',
        currency: '',
      }
    },
  },
})
</script>

<style lang="scss">
.input-future-setting-fail {
  border-color: red;
}
</style>
