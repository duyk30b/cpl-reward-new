<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.balanceMonitor') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <div class="row gy-5">
        <div class="col-md-4">
          <div class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3">
              <label class="fs-6 fw-bold">{{
                $t('obmSetting.exchange')
              }}</label>
            </div>
            <select
              name="pair"
              v-model="exchangeSelected"
              @change="getDataExchange()"
              class="form-control"
            >
              <option v-for="item of exchangeList" :key="item" :value="item">
                {{ `${item.toUpperCase()}` }}
              </option>
            </select>
          </div>
        </div>
        <div class="row col-md-8">
          <Form ref="balanceForm">
            <div class="row gy-5 g-xl-8 mb-5">
              <template v-for="tokenData in dataShow.balances" :key="tokenData">
                <h4 class="text-uppercase">{{ tokenData.token }}</h4>
                <div class="d-flex">
                  <div class="flex-stack mb-3 col-sm-3 mx-3">
                    <div class="me-5">
                      <label class="fs-6 fw-bold">{{
                        $t('obmSetting.alert')
                      }}</label>
                    </div>
                    <div class="d-stack">
                      <Field
                        :name="`${tokenData.token}alert`"
                        as="input"
                        v-model="tokenData.alert"
                        :rules="`required|isStringNumber|minMaxCustom:0,100000000000`"
                        class="form-control"
                      >
                      </Field>
                      <ErrorMessage
                        :name="`${tokenData.token}alert`"
                        class="text-danger"
                      />
                    </div>
                  </div>
                  <div class="flex-stack mb-3 col-sm-3 mx-3">
                    <div class="me-5">
                      <label class="fs-6 fw-bold">{{
                        $t('obmSetting.stop')
                      }}</label>
                    </div>
                    <div class="d-stack">
                      <Field
                        :name="`${tokenData.token}stop`"
                        as="input"
                        v-model="tokenData.stop"
                        :rules="`required|isStringNumber|minMaxCustom:0,100000000000`"
                        class="form-control"
                      >
                      </Field>
                      <ErrorMessage
                        :name="`${tokenData.token}stop`"
                        class="text-danger"
                      />
                    </div>
                  </div>

                  <div class="flex-stack mb-3 col-sm-3 mx-3">
                    <div class="me-5">
                      <label class="fs-6 fw-bold">{{
                        $t('obmSetting.adjustBalancePercent')
                      }}</label>
                    </div>
                    <div class="d-stack">
                      <Field
                        :name="`${tokenData.token}adjust_balance_percent`"
                        as="input"
                        v-model="tokenData.adjustBalancePercent"
                        :rules="`required|isStringNumber|minMaxCustom:0,100`"
                        class="form-control"
                      >
                      </Field>
                      <ErrorMessage
                        :name="`${tokenData.token}adjust_balance_percent`"
                        class="text-danger"
                      />
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </Form>
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
import { ObmExchangeSettingItemDTO } from '@/models/setting-obm/GeneralOBM'
import { SettingOBMService } from '@/services/SettingOBMService'
import { defineComponent } from 'vue'
import Swal from 'sweetalert2'
import { ErrorMessage, Field, Form } from 'vee-validate'

export default defineComponent({
  name: 'balance-setting-obm',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('obmSetting.balanceMonitor', [
      'obmSetting.balanceMonitor',
    ])
    this.getOBMExchangeList()
  },
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      isLoading: false,
      dataOrigin: JSON.stringify([]),
      exchangeSelected: '',
      dataShow: {} as ObmExchangeSettingItemDTO,
      exchangeList: [] as string[],
    }
  },
  methods: {
    getDataExchange() {
      const data = JSON.parse(this.dataOrigin)
      this.dataShow = data.find((item) => {
        return item.exchange == this.exchangeSelected
      }) as ObmExchangeSettingItemDTO
    },
    async confirmSaveSetting() {
      const form = await (this.$refs.balanceForm as any).validate()
      if (!form.valid) {
        return
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
          this.saveSetting()
        }
      })
    },
    async saveSetting() {
      const dataRes = await SettingOBMService.saveExchangeSetting([
        { ...this.dataShow, ...{ update_by: 'admin' } },
      ])
      if (dataRes.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.error'))
        return
      }
      this.$toastr.success(this.$t('setting.success'))
      this.getOBMExchangeList()
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
          this.getDataExchange()
        }
      })
    },

    async getOBMExchangeList() {
      const exchangeData = await SettingOBMService.getObmExchangeList()
      if (exchangeData.status != HttpStatus.OK) {
        this.exchangeList = []
        this.exchangeSelected = ''
        this.dataShow = {} as ObmExchangeSettingItemDTO
        this.dataOrigin = JSON.stringify([])
        return
      }
      this.exchangeList = (exchangeData.data?.data || []).map((item) => {
        return item.exchange
      })
      if (!this.exchangeSelected)
        this.exchangeSelected = this.exchangeList[0] || ''
      this.dataShow = exchangeData.data?.data.find((item) => {
        return item.exchange == this.exchangeSelected
      }) as ObmExchangeSettingItemDTO
      this.dataShow.balances?.sort((a, b) => {
        return b.token < a.token ? 1 : -1
      })
      this.dataOrigin = JSON.stringify(exchangeData.data?.data)
    },
  },
})
</script>
