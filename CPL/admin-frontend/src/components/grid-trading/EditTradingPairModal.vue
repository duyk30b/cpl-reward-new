<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'trading-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="tradingForm">
        <div class="row gy-5 g-xl-8">
          <h4 class="mb-10 text-uppercase">{{ $t('setting.pairInfo') }}</h4>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="pair_select" class="fs-6 fw-bold">{{
                  $t('setting.pair')
                }}</label>
              </div>
              <div class="col-sm-12 col-md-8">
                <Field
                  name="pair_select"
                  type="text"
                  as="input"
                  rules="required"
                  v-model="pair"
                  class="form-control hide-input"
                />
                <v-select
                  :options="pairListOptions"
                  option-value="value"
                  option-label="name"
                  placeholder="Choose a pair"
                  v-model="pair"
                  searchable
                  :can-deselect="false"
                  @change="choosePair()"
                  :disabled="!isNew"
                ></v-select>
                <ErrorMessage name="pair_select" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label class="fs-6 fw-bold">
                  {{ $t('gridTrading.status') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8 d-flex flex-stack">
                <label
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                  <input
                    class="form-check-input w-50px"
                    name="status"
                    type="checkbox"
                    id="status"
                    v-model="editTrading.status"
                    :true-value="1"
                    :false-value="0"
                  />
                </label>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="minGrid" class="form-label">
                  {{ $t('gridTrading.minGrid') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8">
                <Field
                  name="minGrid"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber`"
                  v-model="editTrading.minGrid"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <ErrorMessage name="minGrid" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="maxGrid" class="form-label">
                  {{ $t('gridTrading.maxGrid') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8">
                <Field
                  name="maxGrid"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber`"
                  v-model="editTrading.maxGrid"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <ErrorMessage name="maxGrid" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="thresholdLowerPrice" class="form-label">
                  {{ $t('gridTrading.thresholdLowerPrice') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8 position-relative">
                <Field
                  name="thresholdLowerPrice"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber`"
                  v-model="editTrading.thresholdLowerPrice"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <span class="fixed-icon-percentage">%</span>
                <ErrorMessage name="thresholdLowerPrice" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="thresholdHigherPrice" class="form-label">
                  {{ $t('gridTrading.thresholdHigherPrice') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8 position-relative">
                <Field
                  name="thresholdHigherPrice"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber`"
                  v-model="editTrading.thresholdHigherPrice"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <span class="fixed-icon-percentage">%</span>
                <ErrorMessage name="thresholdHigherPrice" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="profitSharing" class="form-label">
                  {{ $t('gridTrading.profitSharing') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8 position-relative">
                <Field
                  name="profitSharing"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber`"
                  v-model="editTrading.profitSharing"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <span class="fixed-icon-percentage">%</span>
                <ErrorMessage name="profitSharing" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6">
            <div class="row mb-10">
              <div class="col-sm-12 col-md-4 d-flex flex-stack">
                <label for="adjustCoefficient" class="form-label">
                  {{ $t('gridTrading.adjustCoefficient') }}
                </label>
              </div>
              <div class="col-sm-12 col-md-8 position-relative">
                <Field
                  name="adjustCoefficient"
                  type="text"
                  as="input"
                  :rules="`required|isStringNumber|positiveNumber`"
                  v-model="editTrading.adjustCoefficient"
                  class="form-control"
                  v-on:keypress="isDigit($event)"
                />
                <span class="fixed-icon-percentage">%</span>
                <ErrorMessage name="adjustCoefficient" class="text-danger" />
              </div>
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
import { Form, Field, ErrorMessage } from 'vee-validate'
import { PairItem } from '@/models/setting-exchange/TradingPair'
import { SettingExchangeService } from '@/services/SettingExchangeService'
import { divNumberString, mulNumberString } from '@/core/helpers/util'
import { plainToInstance } from 'class-transformer'
import _, { maxBy } from 'lodash'
import { GetListCoinName } from '@/models/setting-exchange/CoinSetting'
import {
  HttpStatus,
  PAIR_STATUS,
  SORT_TYPE,
} from '@/core/variables/common.enum'
import {
  BaseGridTradingItemDto,
  TradingPairItemDto,
} from '@/models/spot-grid-trading/trading-pair-item.dto'
import { SpotGridTradingSettingService } from '@/services/SpotGridTradingSettingService'

export default defineComponent({
  name: 'edit-trading-pair-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    trading: {
      type: Object,
      default: new TradingPairItemDto(),
    },
    show: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    listTradingPair: {
      type: Array,
      default: () => {
        return [] as TradingPairItemDto[]
      },
    },
  },
  data() {
    return {
      pairList: [] as PairItem[],
      pair: '',
      NUMBER_PERCENT: '100',
      editTrading: this.isNew
        ? plainToInstance(TradingPairItemDto, {
            status: PAIR_STATUS.INACTIVE,
            profit_sharing: null,
            max_grid: null,
            min_grid: null,
            threshold_higher_price: null,
            threshold_lower_price: null,
            index: null,
            coin: '',
            currency: '',
            adjust_coefficient: null,
          })
        : (_.cloneDeep(this.trading) as TradingPairItemDto),
    }
  },
  computed: {
    modalTitle() {
      return this.isNew ? 'gridTrading.titleAdd' : 'gridTrading.titleEdit'
    },
    pairListOptions() {
      return this.pairList.map((item) => ({
        name: `${item.coin.toUpperCase()}/${item.currency.toUpperCase()}`,
        value: `${item.coin}/${item.currency}`,
      }))
    },
  },
  async mounted() {
    if (this.isNew) {
      this.pair = ''
    } else {
      this.editTrading = _.cloneDeep(this.trading) as TradingPairItemDto
      this.pair = `${this.editTrading.coin.toUpperCase()}/${this.editTrading.currency.toUpperCase()}`
    }
    this.convertDecimalToPercent()

    const [response, exchangePairs] = await Promise.all([
      SpotGridTradingSettingService.getAllPairNameOfGrid(),
      this.getPairList(),
    ])
    const ignoreListPair = response.data.data

    this.pairList = exchangePairs.filter((pair) => {
      if (
        ignoreListPair.some(
          (o) => o.coin === pair.coin && o.currency === pair.currency,
        )
      ) {
        return false
      }
      return true
    })
  },
  methods: {
    convertDecimalToPercent() {
      if (this.editTrading.thresholdHigherPrice) {
        this.editTrading.thresholdHigherPrice = mulNumberString(
          this.editTrading.thresholdHigherPrice,
          this.NUMBER_PERCENT,
        )
      }
      if (this.editTrading.thresholdLowerPrice) {
        this.editTrading.thresholdLowerPrice = mulNumberString(
          this.editTrading.thresholdLowerPrice,
          this.NUMBER_PERCENT,
        )
      }
      if (this.editTrading.profitSharing) {
        this.editTrading.profitSharing = mulNumberString(
          this.editTrading.profitSharing,
          this.NUMBER_PERCENT,
        )
      }
      if (this.editTrading.adjustCoefficient) {
        this.editTrading.adjustCoefficient = mulNumberString(
          this.editTrading.adjustCoefficient,
          this.NUMBER_PERCENT,
        )
      }
    },
    handleFeeCurrency(coin?: string) {
      const options: Array<{ value: string; name: string }> = []
      if (!coin) return
      options.push({
        value: coin,
        name: coin?.toUpperCase(),
      })
      return options
    },
    isDigit(e) {
      let char = String.fromCharCode(e.keyCode) // Get the character
      if (/^[0-9.]+$/.test(char)) return true
      // Match with regex
      else e.preventDefault() // If not match, don't add to input text
    },

    choosePair() {
      const [coin, currency] = this.pair.split('/')
      this.editTrading = { ...this.editTrading, ...{ coin, currency } }
    },
    async getPairList() {
      const pairData = await SettingExchangeService.getPairList({})
      if (!pairData) return []
      return pairData.data['data']
    },
    async getAllPairNameOfGrid() {
      const pairData = await SettingExchangeService.getPairList({})
      if (!pairData) return []
      return pairData.data['data']
    },
    async getCoinList() {
      const instance = plainToInstance(
        GetListCoinName,
        {
          sort_type: SORT_TYPE.ASC,
          per_page: 1000,
        },
        { exposeDefaultValues: true },
      )
      const coinData = await SettingExchangeService.getListCoinName(instance)
      if (!coinData) return []
      return coinData.data['data']
    },
    close() {
      this.$emit('close')
    },
    async submitForm() {
      const form = await (this.$refs.tradingForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }

      this.updatePair()
    },
    async updatePair() {
      let method = 'patchTradingPair'
      const setting = new BaseGridTradingItemDto()
      setting.coin = this.editTrading.coin
      setting.currency = this.editTrading.currency
      setting.index = this.editTrading.index
      setting.thresholdLowerPrice = this.editTrading.thresholdLowerPrice
      setting.thresholdHigherPrice = this.editTrading.thresholdHigherPrice
      setting.status = this.editTrading.status
      setting.profitSharing = divNumberString(
        this.editTrading.profitSharing,
        this.NUMBER_PERCENT,
      )
      setting.thresholdHigherPrice = divNumberString(
        this.editTrading.thresholdHigherPrice,
        this.NUMBER_PERCENT,
      )
      setting.thresholdLowerPrice = divNumberString(
        this.editTrading.thresholdLowerPrice,
        this.NUMBER_PERCENT,
      )
      setting.adjustCoefficient = divNumberString(
        this.editTrading.adjustCoefficient,
        this.NUMBER_PERCENT,
      )
      setting.minGrid = this.editTrading.minGrid
      setting.maxGrid = this.editTrading.maxGrid
      if (this.isNew) {
        method = 'createTradingPair'
        const [coin, currency] = this.pair.split('/')
        if (!coin || !currency) {
          this.$toastr.error(this.$t('gridTrading.savePairFail'))
          return
        }
        setting.coin = this.editTrading.coin
        setting.currency = this.editTrading.currency

        setting.index = this.listTradingPair?.length
          ? (maxBy(this.listTradingPair, 'index') as TradingPairItemDto)
              ?.index + 1
          : this.listTradingPair?.length || 0
      }

      const result = await SpotGridTradingSettingService[method](setting)
      if (result.status !== HttpStatus.OK) {
        this.$toastr.error(this.$t('gridTrading.savePairFail'))
        return
      }
      this.$toastr.success(this.$t('gridTrading.savePairSuccess'))
      this.close()
      this.$emit('updated')
    },
  },
})
</script>

<style lang="scss">
.disable-field {
  position: relative;
  a {
    position: absolute;
    right: 0;
    top: -60%;
    color: #009ef7 !important;
    text-transform: capitalize;
    font-weight: bold;
    &:hover {
      cursor: pointer;
      text-decoration: underline !important;
    }
  }
}
.trading-modal {
  max-width: 1200px;
  .modal-content {
    width: 1200px;
  }
}
.remove-pre {
  color: #555;
  margin-left: 5px;
  cursor: pointer;
}
.obm-pre {
  background-color: rgb(218, 144, 144);
}
.fixed-icon-percentage {
  position: absolute;
  right: 5%;
}
.input {
  padding-right: 10%;
}
.hide-input {
  display: none;
}
.fixed-icon-percentage {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
1
