<template>
  <div class="card">
    <div class="card-header border-0 pt-6 mb-10">
      <div class="card-title">
        {{ $t('menu.thresholdSetting') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <div class="row gy-5">
        <div class="row col-md-6">
          <Form ref="thresholdForm">
            <div class="row gy-5 g-xl-8 mb-5">
              <template v-for="(pairData, pair) in dataShow" :key="pairData">
                <h4 class="text-uppercase">{{ pair }}</h4>
                <div class="d-flex">
                  <div class="flex-stack mb-3 col-sm-6 mx-3">
                    <div class="me-5">
                      <label class="fs-6 fw-bold">{{
                        $t('obmSetting.min')
                      }}</label>
                    </div>
                    <div class="d-stack">
                      <Field
                        :name="`${pair}min`"
                        as="input"
                        v-model="pairData.min.value"
                        :rules="`required|isStringNumber|minMaxCustom:0,${pairData.max.value}`"
                        class="form-control"
                      >
                      </Field>
                      <ErrorMessage :name="`${pair}min`" class="text-danger" />
                    </div>
                  </div>
                  <div class="flex-stack mb-3 col-sm-6 mx-3">
                    <div class="me-5">
                      <label class="fs-6 fw-bold">{{
                        $t('obmSetting.max')
                      }}</label>
                    </div>
                    <div class="d-stack">
                      <Field
                        :name="`${pair}max`"
                        as="input"
                        v-model="pairData.max.value"
                        :rules="`required|isStringNumber|minMaxCustom:${pairData.min.value},100000000000`"
                        class="form-control"
                      >
                      </Field>
                      <ErrorMessage :name="`${pair}max`" class="text-danger" />
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
import { SettingOBMService } from '@/services/SettingOBMService'
import { defineComponent } from 'vue'
import Swal from 'sweetalert2'
import { ErrorMessage, Field, Form } from 'vee-validate'
import {
  ObmPairSettingItemDTO,
  PairThreshold,
  PairThresholdItem,
} from '@/models/setting-obm/GeneralOBM'
import { sortPairFn } from '@/core/helpers/util'

export default defineComponent({
  name: 'theshold-setting-obm',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('obmSetting.thresholdSetting', [
      'obmSetting.thresholdSetting',
    ])
    this.getOBMthresholdList()
  },
  components: { Form, Field, ErrorMessage },
  data() {
    return {
      isLoading: false,
      dataOrigin: JSON.stringify([]),
      dataShow: {} as PairThreshold,
    }
  },
  methods: {
    async confirmSaveSetting() {
      const form = await (this.$refs.thresholdForm as any).validate()
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
          this.saveSetting(this.convertData())
        }
      })
    },
    convertData() {
      const body = [] as ObmPairSettingItemDTO[]
      const parseOriginData = JSON.parse(this.dataOrigin)
      for (const pair in parseOriginData) {
        const dataPair: PairThresholdItem = parseOriginData[pair]
        if (
          dataPair.min.value != this.dataShow[pair].min.value ||
          dataPair.max.value != this.dataShow[pair].max.value
        ) {
          const [coin, currency] = pair.split('/')
          body.push({
            coin,
            currency,
            update_by: 'admin',
            notification_threshold: {
              min: this.dataShow[pair].min.value,
              max: this.dataShow[pair].max.value,
            },
          })
        }
      }
      return body
    },
    async saveSetting(body) {
      const dataRes = await SettingOBMService.patchPairOBMSetting(body)
      if (dataRes.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.error'))
        return
      }
      this.$toastr.success(this.$t('setting.success'))
      this.getOBMthresholdList()
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
          this.dataShow = JSON.parse(this.dataOrigin)
        }
      })
    },

    async getOBMthresholdList() {
      const thresholdData = await SettingOBMService.getObmThresholdList()
      if (thresholdData.status != HttpStatus.OK) {
        this.dataShow = {} as any
        this.dataOrigin = JSON.stringify({})
        return
      }
      const keySort = Object.keys(thresholdData.data?.data || []).sort(
        (a, b) => {
          const pair1 = a.split('/')
          const pair2 = b.split('/')
          return sortPairFn(pair1, pair2) as any
        },
      )
      const dataSort = {}
      for (const pair of keySort) {
        dataSort[pair] = thresholdData.data?.data[pair]
      }
      this.dataShow = dataSort
      this.dataOrigin = JSON.stringify(dataSort)
    },
  },
})
</script>
