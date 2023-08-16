<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.generalSetting') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <ul
        class="nav nav-stretch nav-line-tabs fw-bold border-bottom mb-10"
        role="tablist"
      >
        <li class="nav-item" v-for="tab of tabs" :key="tab.id">
          <a
            class="nav-link text-uppercase"
            :class="{ active: tab.id == currentTab }"
            data-bs-toggle="tab"
            href="javascript:void(0)"
            @click="chooseTab(tab)"
            role="tab"
          >
            {{ $t(`obmSetting.${tab.name}`) }}
          </a>
        </li>
      </ul>
      <div class="row gy-5">
        <div class="col-md-4">
          <div class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3">
              <label class="fs-6 fw-bold">{{
                $t('obmSetting.selectType')
              }}</label>
            </div>
            <select name="type" v-model="typeUpdate" class="form-control">
              <option value="pair">
                {{ $t('obmSetting.pair') }}
              </option>
              <option value="exchange">
                {{ $t('obmSetting.exchange') }}
              </option>
            </select>
          </div>
          <div v-if="typeUpdate == 'pair'" class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3">
              <label class="fs-6 fw-bold">{{ $t('obmSetting.pair') }}</label>
            </div>
            <select name="pair" v-model="pairSelected" class="form-control">
              <option v-for="pair of pairList" :key="pair" :value="pair">
                {{
                  `${pair.coin.toUpperCase()}/${pair.currency.toUpperCase()}`
                }}
              </option>
            </select>
          </div>
          <div v-if="typeUpdate == 'exchange'" class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3">
              <label class="fs-6 fw-bold">{{
                $t('obmSetting.exchange')
              }}</label>
            </div>
            <select name="pair" v-model="exchangeSelected" class="form-control">
              <option
                v-for="exchange of exchangeList"
                :key="exchange"
                :value="exchange"
              >
                {{ `${exchange.toUpperCase()}` }}
              </option>
            </select>
          </div>
        </div>
        <div class="row col-md-8">
          <div
            v-for="(pairData, pair) in pairDataShow"
            :key="pair"
            class="pair-data-block"
          >
            <template v-if="!isLoading">
              <div class="d-flex p-5">
                <div
                  v-if="pairData.open && typeUpdate == 'exchange'"
                  @click="pairData.open = false"
                  class="me-3 d-flex"
                >
                  <h4 class="text-uppercase">{{ pair }}</h4>
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="/media/icons/duotune/arrows/arr072.svg" />
                  </span>
                </div>
                <div
                  v-if="!pairData.open && typeUpdate == 'exchange'"
                  @click="pairData.open = true"
                  class="me-3 d-flex"
                >
                  <h4 class="text-uppercase">{{ pair }}</h4>
                  <span class="svg-icon svg-icon-3">
                    <inline-svg src="/media/icons/duotune/arrows/arr073.svg" />
                  </span>
                </div>
              </div>
              <div
                v-if="pairData.open || typeUpdate == 'pair'"
                class="component"
              >
                <component
                  class="p-10"
                  :pair="pair"
                  :is="component"
                  :data="pairData"
                  ref="bot"
                />
              </div>
            </template>
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <div></div>
          <div>
            <button class="btn btn-danger me-5" @click="clearData()">
              {{ $t('setting.clear') }}
            </button>
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
import { HttpStatus } from '@/core/variables/common.enum'
import {
  ObmPairSettingItemDTO,
  PairOBMDataParam,
  PropertyShow,
} from '@/models/setting-obm/GeneralOBM'
import { SettingOBMService } from '@/services/SettingOBMService'
import { defineComponent } from 'vue'
import BotA from '@/components/obm-setting/SettingBotA.vue'
import BotP from '@/components/obm-setting/SettingBotP.vue'
import Crawler from '@/components/obm-setting/SettingCrawler.vue'
import MergeOrderbook from '@/components/obm-setting/SettingMergeOrderbook.vue'
import Swal from 'sweetalert2'
import { sortPairFn } from '@/core/helpers/util'

const COMPONENT_MAP = {
  bot_a: 'BotA',
  bot_p: 'BotP',
  crawler: 'Crawler',
  merge_orderbook: 'MergeOrderbook',
}

export default defineComponent({
  name: 'general-setting-obm',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('obmSetting.general', ['obmSetting.setting'])
    await this.getOBMExchangeList()
    await this.getOBMPairList()
  },
  components: { BotA, BotP, Crawler, MergeOrderbook },
  data() {
    return {
      isLoading: false,
      component: 'BotA',
      dataOrigin: {} as PropertyShow,
      pairDataShow: {} as PropertyShow,
      currentTab: 'bot_a',
      tabs: [
        {
          id: 'bot_a',
          name: 'botA',
        },
        {
          id: 'bot_p',
          name: 'botP',
        },
        {
          id: 'crawler',
          name: 'crawler',
        },
        {
          id: 'merge_orderbook',
          name: 'mergeOrderbook',
        },
      ],
      typeUpdate: 'pair',
      pairSelected: {
        coin: '',
        currency: '',
      },
      pairList: [] as { coin: string; currency: string }[],
      exchangeSelected: 'binance',
      exchangeList: [] as string[],
    }
  },
  computed: {
    getFieldChange(): string {
      return `${this.currentTab}/${this.typeUpdate}/${this.pairSelected.coin}/${this.pairSelected.currency}/${this.exchangeSelected}`
    },
    getParamsPair(): PairOBMDataParam {
      return this.typeUpdate == 'pair'
        ? {
            module: this.currentTab,
            exchange: this.exchangeSelected,
            coin: this.pairSelected.coin,
            currency: this.pairSelected.currency,
          }
        : {
            module: this.currentTab,
            exchange: this.exchangeSelected,
          }
    },
  },
  watch: {
    getFieldChange: {
      handler: function () {
        this.getOBMPairData()
      },
    },
  },
  methods: {
    async confirmSaveSetting() {
      const form = await (this.$refs.bot as any)
      for (const item of form) {
        if (!(await item.checkForm())) {
          return
        }
      }
      Swal.fire({
        text: 'Save data change!',
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
          this.saveSetting(this.getDataChange())
        }
      })
    },
    async saveSetting(body) {
      if (body.length == 0) {
        this.$toastr.error('No data change!')
        return
      }
      const dataRes = await SettingOBMService.patchPairOBMSetting(body)
      if (dataRes.status != HttpStatus.OK) {
        this.$toastr.error(
          `${dataRes.data?.message} , ${JSON.stringify(dataRes.data?.errors)}`,
        )
        return
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
      this.getOBMPairData()
    },
    getDataChange() {
      const body = {} as { [key: string]: ObmPairSettingItemDTO }
      for (const pair in this.dataOrigin) {
        const dataPair = this.dataOrigin[pair]
        for (const property in dataPair) {
          if (dataPair[property] != this.pairDataShow[pair][property]) {
            // eslint-disable-next-line no-prototype-builtins
            if (!body.hasOwnProperty(pair)) {
              const [coin, currency] = pair.split('/')
              body[pair] = {
                coin,
                currency,
                update_by: 'admin',
              }
              // eslint-disable-next-line no-prototype-builtins
              if (!body[pair].hasOwnProperty(this.currentTab)) {
                body[pair][this.currentTab] = {}
              }
              if (this.typeUpdate != 'pair')
                body[pair]['exchange'] = this.exchangeSelected
            }
            body[pair][this.currentTab][property] =
              this.pairDataShow[pair][property]
          }
        }
      }
      return Object.values(body)
    },
    clearData() {
      Swal.fire({
        text: 'Clear data change!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok, I want reset data!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.getOBMPairData()
        }
      })
    },
    async getOBMPairList() {
      const pairData = await SettingOBMService.getObmPairList()
      if (pairData.status != HttpStatus.OK) {
        this.pairList = []
        this.pairSelected = {
          coin: '',
          currency: '',
        }
        return
      }
      this.pairList = pairData.data?.data?.map((item) => {
        return {
          coin: item.coin,
          currency: item.currency,
        }
      })
      this.pairList.sort((a, b) => {
        const pair1 = [a.coin, a.currency]
        const pair2 = [b.coin, b.currency]
        return sortPairFn(pair1, pair2) as any
      })
      if (this.pairList.length > 0) this.pairSelected = this.pairList[0]
    },
    async getOBMExchangeList() {
      const exchangeData = await SettingOBMService.getObmExchangeList()
      if (exchangeData.status != HttpStatus.OK) {
        this.exchangeList = []
        this.exchangeSelected = ''
        return
      }
      this.exchangeList = exchangeData.data?.data?.map((item) => {
        return item.exchange
      })
      if (this.exchangeList.length > 0) {
        this.exchangeSelected =
          this.exchangeList.find((item) => {
            return item == 'binance'
          }) || this.exchangeList[0]
      }
    },
    async getOBMPairData() {
      this.isLoading = true
      const pairData = await SettingOBMService.getObmPairData(
        this.getParamsPair,
      )
      if (pairData.status != HttpStatus.OK) {
        this.resetData({})
        return
      }
      this.resetData(pairData.data?.data)
    },
    resetData(data) {
      const keySort = Object.keys(data).sort((a, b) => {
        const pair1 = a.split('/')
        const pair2 = b.split('/')
        return sortPairFn(pair1, pair2) as any
      })
      const dataSort = {}
      for (const pair of keySort) {
        dataSort[pair] = data[pair]
      }

      this.pairDataShow = dataSort
      this.dataOrigin = JSON.parse(JSON.stringify(dataSort))
      this.isLoading = false
    },
    chooseTab(tab) {
      this.currentTab = tab.id
      this.component = COMPONENT_MAP[this.currentTab]
    },
  },
})
</script>
