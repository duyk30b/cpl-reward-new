<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('marketMaker.importOrderbook') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <div class="row gy-5">
        <div class="col-md-4">
          <div class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3">
              <label class="fs-6 fw-bold">{{ $t('marketMaker.pair') }}</label>
            </div>
            <select
              name="pair"
              v-model="pair"
              class="form-control"
              :disabled="isLoading || dataImportOrder.inProcess"
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
          <div class="d-flex flex-stack mb-10 row">
            <div class="col-md-8">
              <div class="col-sm-12">
                <label for="file-upload" class="custom-file-upload">
                  <span
                    class="svg-icon svg-icon-2 svg-icon-2x svg-icon-primary"
                  >
                    <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
                  </span>
                  Choose file
                </label>
              </div>
              <div>{{ file?.name }}</div>
              <input
                id="file-upload"
                class="col-md-8"
                type="file"
                :disabled="isLoading || dataImportOrder.inProcess"
                @change="uploadFile"
                ref="file"
                accept=".csv"
              />
            </div>
            <div class="col-md-4 d-flex justify-content-end">
              <button
                class="btn btn-primary"
                :disabled="
                  isLoading ||
                  $refs.file?.['files']?.length == 0 ||
                  dataImportOrder.inProcess
                "
                @click="submitFile"
              >
                {{ $t('marketMaker.importOrder') }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="row gy-5">
        <div class="col-md-6">
          <h4>Buy</h4>
          <div class="d-flex flex-stack mb-10 row">
            <div class="d-flex flex-column w-100 mt-12">
              <span class="text-dark me-2 fw-bolder pb-3 text-end">
                {{ $t('marketMaker.createProcess') }}({{
                  dataImportOrder.createdBuyPercent
                }})%
              </span>

              <div class="progress h-5px w-100">
                <div
                  class="bg-success progress-bar"
                  role="progressbar"
                  :style="`width: ${dataImportOrder.createdBuyPercent}%`"
                  :aria-valuenow="dataImportOrder.createdBuyPercent"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <div class="d-flex flex-column w-100 mt-12">
              <span class="text-dark me-2 fw-bolder pb-3 text-end">
                {{ $t('marketMaker.cancelProcess') }} ({{
                  dataImportOrder.canceledBuyPercent
                }})%
              </span>

              <div class="progress h-5px w-100">
                <div
                  class="bg-danger progress-bar"
                  role="progressbar"
                  :style="`width: ${dataImportOrder.canceledBuyPercent}%`"
                  :aria-valuenow="dataImportOrder.canceledBuyPercent"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
          <div class="row gy-5">
            <div class="col-md-6">
              <h4>{{ $t('marketMaker.createOrderDetail') }}</h4>
              <div
                v-for="item of dataImportOrder?.createdBuyOrders"
                :key="item"
                class="rounded bg-light-success"
              >
                {{ item.key }}-{{ item.status }}
              </div>
            </div>
            <div class="col-md-6">
              <h4>{{ $t('marketMaker.cancelOrderDetail') }}</h4>
              <div
                v-for="item of dataImportOrder?.canceledBuyOrders"
                :key="item"
                class="rounded bg-light-success"
              >
                {{ item.key }}-{{ item.status }}
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-6">
          <h4>Sell</h4>
          <div class="d-flex flex-stack mb-10 row">
            <div class="d-flex flex-column w-100 mt-12">
              <span class="text-dark me-2 fw-bolder pb-3 text-end">
                {{ $t('marketMaker.createProcess') }}({{
                  dataImportOrder.createdSellPercent
                }})%
              </span>

              <div class="progress h-5px w-100">
                <div
                  class="bg-success progress-bar"
                  role="progressbar"
                  :style="`width: ${dataImportOrder.createdSellPercent}%`"
                  :aria-valuenow="dataImportOrder.createdSellPercent"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
            <div class="d-flex flex-column w-100 mt-12">
              <span class="text-dark me-2 fw-bolder pb-3 text-end">
                {{ $t('marketMaker.cancelProcess') }} ({{
                  dataImportOrder.canceledSellPercent
                }})%
              </span>

              <div class="progress h-5px w-100">
                <div
                  class="bg-danger progress-bar"
                  role="progressbar"
                  :style="`width: ${dataImportOrder.canceledSellPercent}%`"
                  :aria-valuenow="dataImportOrder.canceledSellPercent"
                  aria-valuemin="0"
                  aria-valuemax="100"
                ></div>
              </div>
            </div>
          </div>
          <div class="row gy-5">
            <div class="col-md-6">
              <h4>{{ $t('marketMaker.createOrderDetail') }}</h4>
              <div
                v-for="item of dataImportOrder?.createdSellOrders"
                :key="item"
                class="rounded bg-light-danger"
              >
                {{ item.key }}-{{ item.status }}
              </div>
            </div>
            <div class="col-md-6">
              <h4>{{ $t('marketMaker.cancelOrderDetail') }}</h4>
              <div
                v-for="item of dataImportOrder?.canceledSellOrders"
                :key="item"
                class="rounded bg-light-danger"
              >
                {{ item.key }}-{{ item.status }}
              </div>
            </div>
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
import CONFIG from '@/config'
import Swal from 'sweetalert2'
import {
  OrderPairProcess,
  PairInfoMarketMaker,
} from '@/models/market-maker/DataPoint'

export default defineComponent({
  name: 'market-maker-import-order',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('marketMaker.importOrderbook', [
      'menu.marketMaker',
    ])
    this.initPairSelected()
  },
  data() {
    return {
      // eslint-disable-next-line vue/no-reserved-keys
      $refs: {} as HTMLFormElement,
      isLoading: false,
      pair: '',
      pairList: [] as { key: string; name: string }[],
      file: {} as File,
      intervalOrderProcess: {} as any,
      dataImportOrder: {} as OrderPairProcess,
    }
  },
  methods: {
    selectedPair() {
      this.$refs.file.value = []
      this.file = {} as File
      this.dataImportOrder = {} as OrderPairProcess
    },
    initIntervalProcess() {
      this.intervalOrderProcess = setInterval(() => {
        this.getOrderProcess()
      }, 1000)
    },
    async getOrderProcess() {
      const dataRes = await MarketMakerService.getImportOrderProcess(
        this.getURLParams(),
      )
      if (dataRes.status != HttpStatus.OK) {
        this.$toastr.error(dataRes.data['message'])
        return
      }
      this.dataImportOrder = dataRes.data
    },
    clearIntervalProcess() {
      clearInterval(this.intervalOrderProcess)
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
    uploadFile() {
      this.file = this.$refs.file['files'][0]
    },

    async submitFile() {
      Swal.fire({
        text: 'Are you sure that you want to import this CSV file?',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-primary',
          cancelButton: 'btn btn-default',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.isLoading = true
          const formData = new FormData()
          formData.append('file', this.file)
          this.initIntervalProcess()
          const dataRes = await MarketMakerService.uploadOrderFile(
            this.getURLParams(),
            formData,
          )
          this.isLoading = false
          this.$refs.file.value = []
          this.file = {} as File
          this.clearIntervalProcess()
          if (dataRes.status != HttpStatus.OK) {
            this.$toastr.error(dataRes.data?.['message'] || 'serve error!')
            return
          }
          this.getOrderProcess()
          this.$toastr.success('Success!')
        }
      })
    },
    getURLParams(): PairInfoMarketMaker {
      const [coin, currency] = this.pair.split('-')
      const result = {
        coin,
        currency,
      }
      const params = this.$route.query
      if (params?.coin) result.coin = String(params.coin)
      if (params?.currency) result.currency = String(params.currency)

      return {
        coin: result.coin,
        currency: result.currency,
      }
    },
  },
  beforeUnmount() {
    this.clearIntervalProcess()
  },
})
</script>
<style lang="scss" scoped>
input[type='file'] {
  display: none;
}
.custom-file-upload {
  border: 1px solid #ccc;
  display: inline-block;
  border-radius: 10px;
  padding: 6px 12px;
  cursor: pointer;
}
</style>
