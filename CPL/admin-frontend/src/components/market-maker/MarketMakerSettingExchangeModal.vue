<template>
  <BaseModal
    :title="modalTitle"
    :show="show"
    @close="close"
    :dialog-class="'trading-modal'"
  >
    <template v-slot:body>
      <Form @submit="submitForm" ref="tradingForm">
        <div class="row g-xl-8 mb-5">
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{
                  $t('marketMaker.pricePrecision')
                }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="price_precision"
                  as="select"
                  :disabled="isPairInternal"
                  :rules="`required`"
                  v-model="marketSettingProperty.price_precision"
                  class="form-control"
                >
                  <option
                    v-for="item of precisionList"
                    :value="item"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </Field>
                <ErrorMessage name="price_precision" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{
                  $t('marketMaker.volumePrecision')
                }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="volume_precision"
                  as="select"
                  :disabled="isPairInternal"
                  :rules="`required`"
                  v-model="marketSettingProperty.volume_precision"
                  class="form-control"
                >
                  <option
                    v-for="item of precisionList"
                    :value="item"
                    :key="item"
                  >
                    {{ item }}
                  </option>
                </Field>
                <ErrorMessage name="volume_precision" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{ $t('marketMaker.minAmount') }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="min_amount"
                  as="input"
                  :disabled="isPairInternal"
                  v-model="marketSettingProperty.min_amount"
                  :rules="`required|isStringNumber|minMaxCustom:0,${marketSettingProperty.max_amount}`"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="min_amount" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{ $t('marketMaker.maxAmount') }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="max_amount"
                  as="input"
                  v-model="marketSettingProperty.max_amount"
                  :rules="`required|isStringNumber|minMaxCustom:${marketSettingProperty.min_amount},100000000000`"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="max_amount" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{ $t('marketMaker.minTotal') }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="min_total"
                  as="input"
                  :disabled="isPairInternal"
                  v-model="marketSettingProperty.min_total"
                  rules="required|isStringNumber|minMaxCustom:0,100000000000"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="min_total" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{
                  $t('marketMaker.spreadPrice')
                }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="spread_price"
                  as="input"
                  v-model="marketSettingProperty.spread_price"
                  rules="required|isStringNumber|minMaxCustom:0,100000000000"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="spread_price" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{
                  $t('marketMaker.volumeScale')
                }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="volume_scale"
                  as="input"
                  v-model="marketSettingProperty.volume_scale"
                  rules="required|isStringNumber|minMaxCustom:0,100000000000"
                  class="form-control"
                >
                </Field>
                <ErrorMessage name="volume_scale" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{
                  $t('marketMaker.orderCountPackage')
                }}</label>
              </div>
              <div class="col-sm-8">
                <Field
                  name="order_count_package"
                  as="select"
                  :rules="`required`"
                  v-model="marketSettingProperty.order_count_package"
                  class="form-control"
                >
                  <option
                    v-for="item of orderPackageList"
                    :value="item.key"
                    :key="item.key"
                  >
                    {{ item.lable }}
                  </option>
                </Field>
                <ErrorMessage name="order_count_package" class="text-danger" />
              </div>
            </div>
          </div>
          <div class="flex-stack mb-3">
            <div class="d-flex">
              <div
                class="col-sm-4 px-5 d-flex justify-content-end align-items-center"
              >
                <label class="fw-bold">{{ $t('marketMaker.onOff') }}</label>
              </div>
              <div
                class="col-sm-8 form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="warning_threshold_enable"
                  type="checkbox"
                  :checked="marketSettingProperty.active_flag"
                  @click="
                    (event) => {
                      marketSettingProperty.active_flag =
                        !marketSettingProperty.active_flag
                    }
                  "
                />
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
import CONFIG from '@/config'
import { plainToInstance } from 'class-transformer'
import Swal from 'sweetalert2'
import { MarketMakerConfigSetting } from '@/models/market-maker/DataPoint'
import { MarketMakerService } from '@/services/MarketMakerService'
import { HttpStatus } from '@/core/variables/common.enum'

export default defineComponent({
  name: 'market-maker-setting-exchange-modal',
  components: { BaseModal, Form, Field, ErrorMessage },
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    isNew: {
      type: Boolean,
      default: false,
    },
    exchangePair: {
      default: {
        pair: '',
        exchange: '',
      },
    },
  },
  data() {
    return {
      marketSettingProperty: {} as MarketMakerConfigSetting,
      precisionList: CONFIG.EX_PRECISION_LIST,
      orderPackageList: [
        {
          key: '1',
          lable: 'Pack 1 (0~36 orders/h)',
        },
        {
          key: '2',
          lable: 'Pack 2 (36~60 orders/h)',
        },
        {
          key: '3',
          lable: 'Pack 3 (48~84 orders/h)',
        },
        {
          key: '4',
          lable: 'Pack 4 (71~108 orders/h)',
        },
        {
          key: '5',
          lable: 'Pack 5 (84~120 orders/h)',
        },
        {
          key: '6',
          lable: 'Pack 6 (108~144 orders/h)',
        },
        {
          key: '7',
          lable: 'Pack 7 (168~216 orders/h)',
        },
        {
          key: '8',
          lable: 'Pack 8 (180~240 orders/h)',
        },
      ],
      editTrading: plainToInstance(PairItem, {
        ...this.trading,
        precisions: [],
      }),
    }
  },
  computed: {
    isPairInternal() {
      const [coin] = this.exchangePair.pair.split('/')
      const [prefix, token] = coin.split('_')
      if (!prefix || !token) return true
      return false
    },
    exCoinCurrency() {
      const [coin, currency] = this.exchangePair.pair.split('/')

      const exchange = this.exchangePair.exchange

      return {
        exchange,
        coin,
        currency,
      }
    },
    modalTitle() {
      return 'marketMaker.editExchangeSetting'
    },
  },
  async mounted() {
    await this.getSettingMarketMaker()
  },
  methods: {
    close() {
      this.$emit('close')
    },
    async getSettingMarketMaker() {
      const { coin, currency, exchange } = this.exCoinCurrency
      const dataRes = await MarketMakerService.getSettingV2({
        coin,
        currency,
        exchange,
      })
      if (dataRes.status != HttpStatus.OK) {
        this.marketSettingProperty = {} as MarketMakerConfigSetting
        this.$toastr.error(dataRes.data['message'])
        return
      }

      this.marketSettingProperty = dataRes.data?.configure || {}
    },
    async submitForm() {
      const form = await (this.$refs.tradingForm as any).validate()
      if (!form.valid) {
        this.$toastr.error(this.$t('setting.invalidForm'))
        return
      }

      Swal.fire({
        text: 'Save data change!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Warning: Confirm save Market Maker config!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-default',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const dataRes = await MarketMakerService.putSettingV2({
            ...this.exCoinCurrency,
            configure: this.marketSettingProperty,
          })
          if (dataRes.status != HttpStatus.OK) {
            this.$toastr.error(dataRes.data['message'])
            return
          }
          this.$toastr.success('Update setting success!')
          this.$emit('updated')
          this.$emit('close')
        }
      })
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
</style>
1
