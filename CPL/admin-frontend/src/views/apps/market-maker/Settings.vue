<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('marketMaker.settings') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <div class="row my-5">
        <div class="col-md-4">
          <div class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3">
              <label class="fs-6 fw-bold">{{ $t('marketMaker.pair') }}</label>
            </div>
            <select
              name="pair"
              v-model="pair"
              class="form-control"
              @change="selectedPair()"
            >
              <option
                v-for="item of pairList"
                :key="item.key"
                :value="item.key"
              >
                {{ `${item.name.toUpperCase()}` }}
              </option>
            </select>
          </div>
        </div>
        <div class="col-md-8">
          <Form ref="mmSettings">
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
                      v-model="marketSetitngProperty.price_precision"
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
                      v-model="marketSetitngProperty.volume_precision"
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
                    <label class="fw-bold">{{
                      $t('marketMaker.minAmount')
                    }}</label>
                  </div>
                  <div class="col-sm-8">
                    <Field
                      name="min_amount"
                      as="input"
                      :disabled="isPairInternal"
                      v-model="marketSetitngProperty.min_amount"
                      :rules="`required|isStringNumber|minMaxCustom:0,${marketSetitngProperty.max_amount}`"
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
                    <label class="fw-bold">{{
                      $t('marketMaker.maxAmount')
                    }}</label>
                  </div>
                  <div class="col-sm-8">
                    <Field
                      name="max_amount"
                      as="input"
                      v-model="marketSetitngProperty.max_amount"
                      :rules="`required|isStringNumber|minMaxCustom:${marketSetitngProperty.min_amount},100000000000`"
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
                    <label class="fw-bold">{{
                      $t('marketMaker.minTotal')
                    }}</label>
                  </div>
                  <div class="col-sm-8">
                    <Field
                      name="min_total"
                      as="input"
                      :disabled="isPairInternal"
                      v-model="marketSetitngProperty.min_total"
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
                      v-model="marketSetitngProperty.spread_price"
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
                      v-model="marketSetitngProperty.volume_scale"
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
                      v-model="marketSetitngProperty.order_count_package"
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
                    <ErrorMessage
                      name="order_count_package"
                      class="text-danger"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
        <div class="d-flex justify-content-between">
          <div></div>
          <div>
            <button class="btn btn-primary" @click="confirmSaveSetting()">
              {{ $t('setting.save') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { defineComponent } from 'vue'
import { MarketMakerService } from '@/services/MarketMakerService'
import { HttpStatus } from '@/core/variables/common.enum'
import { MarketMakerConfigSetting } from '@/models/market-maker/DataPoint'
import { ErrorMessage, Field, Form } from 'vee-validate'
import Swal from 'sweetalert2'
import CONFIG from '@/config'

export default defineComponent({
  name: 'market-maker-import-data',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('marketMaker.settings', ['marketMaker.settings'])
    this.initPairSelected()
    this.getSettingMarketMaker()
  },
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      isLoading: false,
      pair: 'twin-usdt',
      pairList: [
        {
          key: 'twin-usdt',
          name: 'TWIN/USDT',
        },
      ],
      marketSetitngProperty: {} as MarketMakerConfigSetting,
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
    }
  },
  computed: {
    isPairInternal() {
      const [coin, currency] = this.pair.split('-')
      const [prefix, token] = coin.split('_')
      if (!prefix || !token) return true
      return false
    },
  },
  methods: {
    selectedPair() {
      this.getSettingMarketMaker()
    },
    initPairSelected() {
      const pairConfig =
        CONFIG.MARKET_MAKER_PAIR_LIST?.length > 0
          ? CONFIG.MARKET_MAKER_PAIR_LIST
          : []
      this.pairList = pairConfig.map((item) => {
        const [coin, currency] = item.split('/')
        return {
          key: `${coin.toLowerCase()}-${currency.toLowerCase()}`,
          name: item.toUpperCase(),
        }
      })
      this.pair = this.pairList[0].key
    },
    async getSettingMarketMaker() {
      const { coin, currency } = this.getURLParams()
      const dataRes = await MarketMakerService.getSettings({
        coin,
        currency,
      })
      if (dataRes.status != HttpStatus.OK) {
        this.marketSetitngProperty = {} as MarketMakerConfigSetting
        this.$toastr.error(dataRes.data['message'])
        return
      }

      this.marketSetitngProperty = dataRes.data?.configure || {}
    },
    getURLParams() {
      const [coin, currency] = this.pair.split('-')
      const result = {
        coin,
        currency,
      }
      const params = this.$route.query
      if (params?.coin) result.coin = String(params.coin)
      if (params?.currency) result.currency = String(params.currency)
      return result
    },
    async confirmSaveSetting() {
      const form = await (this.$refs.mmSettings as any).validate()
      if (!form.valid) {
        return false
      }
      Swal.fire({
        text: 'Save settings!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok, I want save data!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-default',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const { coin, currency } = this.getURLParams()
          const dataRes = await MarketMakerService.putSettings({
            coin,
            currency,
            configure: this.marketSetitngProperty,
          })
          if (dataRes.status != HttpStatus.OK) {
            this.$toastr.error(dataRes.data['message'])
            return
          }
          this.$toastr.success('Update setting success!')
          this.getSettingMarketMaker()
        }
      })
    },
  },
})
</script>
