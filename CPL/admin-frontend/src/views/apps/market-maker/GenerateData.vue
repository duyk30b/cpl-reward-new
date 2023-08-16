<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('marketMaker.importData') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <div class="row gy-5">
        <div class="col-md-4">
          <div class="d-flex flex-stack mb-10">
            <div class="me-5 col-md-3 text-center">
              <label class="fs-6 fw-bold">{{ $t('marketMaker.pair') }}</label>
            </div>
            <select
              name="pair"
              v-model="pair"
              class="form-control"
              @change="selectedFilter()"
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
                <button
                  class="btn btn-primary mx-2"
                  :disabled="isLoading || !file"
                  @click="previewFile"
                >
                  Preview
                </button>
              </div>
              <div>{{ file?.name }}</div>
              <input
                id="file-upload"
                class="col-md-8"
                type="file"
                @change="uploadFile"
                ref="file"
                accept=".csv"
              />
            </div>
            <div class="col-md-4 d-flex justify-content-end">
              <button
                class="btn btn-primary"
                :disabled="isLoading || !file"
                @click="submitFile"
              >
                Import
              </button>
            </div>
          </div>
        </div>
      </div>
      <apexchart
        class="statistics-widget-3-chart card-rounded-bottom"
        :options="chartOptions"
        :series="series"
        :height="height"
        type="area"
      ></apexchart>
      <div class="d-flex justify-content-end">
        <a
          v-if="currentPage != 0"
          @click="previousView()"
          class="btn btn-bg-light btn-active-color-primary mx-2"
        >
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/arrows/arr063.svg" />
          </span>
          Previous day
        </a>
        <a
          @click="resetView()"
          class="btn btn-bg-light btn-active-color-primary mx-2"
        >
          Today
        </a>
        <a
          @click="nextView()"
          class="btn btn-bg-light btn-active-color-primary mx-2"
        >
          Next day
          <span class="svg-icon svg-icon-2">
            <inline-svg src="media/icons/duotune/arrows/arr064.svg" />
          </span>
        </a>
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
import { DataPointItem, DataPointParams } from '@/models/market-maker/DataPoint'
import moment from 'moment'
import { CHART_OPITIONS, SERIES } from './DataPointConst'
import Swal from 'sweetalert2'

export default defineComponent({
  name: 'market-maker-import-data',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('marketMaker.importData', ['menu.marketMaker'])
    this.initPairSelected()
    this.getDataPoint()
    this.reader.addEventListener('loadend', (res) => {
      this.dataRaw = res.target?.result
    })
  },
  data() {
    return {
      // eslint-disable-next-line vue/no-reserved-keys
      $refs: {} as HTMLFormElement,
      reader: new FileReader(),
      height: 500,
      series: SERIES,
      chartOptions: CHART_OPITIONS,
      isLoading: false,
      version: '',
      pair: '',
      pairList: [] as { key: string; name: string }[],
      file: null as any,
      dataPoint: [] as DataPointItem[],
      dataPreview: [] as DataPointItem[],
      preDataPreview: [] as DataPointItem[],
      currentTime: new Date(),
      currentPage: 0,
      dataRaw: null as any,
    }
  },
  methods: {
    selectedFilter() {
      this.currentPage = 0
      this.resetData()
      this.getDataPoint()
    },
    resetData() {
      this.$refs.file.value = []
      this.preDataPreview = []
      this.dataPreview = []
      this.file = null
      this.dataRaw = null
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
    async getDataPoint() {
      const dataRes = await MarketMakerService.getDataPoints(
        this.getURLParams(),
        CONFIG.DISABLE_DATA_POINT_V1 ? 'v2' : '',
      )
      if (dataRes.status != HttpStatus.OK) {
        this.dataPoint = []
        this.$toastr.error(dataRes.data['message'])
        return
      }
      this.version = dataRes.data.version
      this.dataPoint = (dataRes.data?.data_point || []).map((item) => {
        return {
          ...item,
          start_time: `${item.start_time}000`,
          end_time: `${item.end_time}000`,
        }
      })
      this.previewFile()
    },
    uploadFile() {
      this.file = this.$refs.file['files'][0]
      this.reader.readAsText(this.file)
      this.preDataPreview = []
      this.dataPreview = []
    },
    convertDataFromCSV(dataBuffer) {
      this.preDataPreview = []
      const dataOrigin = MarketMakerService.toArrayBuffer(
        (dataBuffer as ArrayBuffer) || '',
      )
      const data = MarketMakerService.removeRecordEmpty(dataOrigin)
      let previousPoint: DataPointItem = {} as DataPointItem
      let currentPoint: DataPointItem = {} as DataPointItem
      for (let i = 1; i < data.length; i++) {
        if (data[i].length != 2) {
          this.$toastr.error(`record ${i + 1} wrong format`)
          return false
        }
        if (!MarketMakerService.validateRecord(data[i])) {
          this.$toastr.error(`record ${i + 1} invalid`)
          return false
        }
        const [timePoint, valuePoint] = data[i]
        previousPoint = Object.assign({}, currentPoint)
        currentPoint = {
          start_time: previousPoint.end_time,
          end_time: moment(timePoint, 'YYYY/MM/DD HH:mm:ss')
            .utc(true)
            .format('x')
            .toString(),
          start_price: previousPoint.end_price,
          end_price: valuePoint,
        }
        if (i > 1) {
          if (!this.isValidDataPoint(currentPoint, i)) {
            this.resetData()
            return false
          }
          this.preDataPreview.push(currentPoint)
        }
      }
      return true
    },
    previewFile() {
      if (!this.convertDataFromCSV(this.dataRaw)) {
        this.resetData()
        return
      }
      this.dataPreview = this.preDataPreview
      const params = this.getURLParams()
      const dataPreviewFilter = this.dataPreview.filter((item) => {
        return (
          (item.start_time >= params.start_time &&
            item.start_time <= params.end_time) ||
          (item.end_time >= params.start_time &&
            item.end_time <= params.end_time)
        )
      })
      this.convertDataChart(
        dataPreviewFilter,
        this.dataPoint,
        params.start_time,
        params.end_time,
      )
    },
    isValidDataPoint(dataPoint: DataPointItem, i: number): boolean {
      const timeFiveMinute = 5 * 60 * 1000
      if (
        !dataPoint.start_price ||
        !dataPoint.start_time ||
        !dataPoint.end_price ||
        !dataPoint.end_time
      )
        return false
      if (
        Number(dataPoint.end_time) - Number(dataPoint.start_time) <
        5 * 60 * 1000 // 5p
      ) {
        this.$toastr.error(
          `It must be at least 5 mins between the data point ${i} and the data point ${
            i + 1
          }`,
        )
        return false
      }
      if (
        Number(dataPoint.end_time) % timeFiveMinute != 0 ||
        Number(dataPoint.start_time) % timeFiveMinute != 0
      ) {
        this.$toastr.error(
          `The data point ${i + 1} must be divisible by 5 mins `,
        )
        return false
      }
      if (
        Number(dataPoint.end_time) - Number(dataPoint.start_time) >
        8 * 60 * 60 * 1000 // 8h
      ) {
        this.$toastr.error(
          `It must be less than 8 hour between the data point ${i} and the data point ${
            i + 1
          } `,
        )
        return false
      }
      return true
    },
    async submitFile() {
      Swal.fire({
        text: 'Are you sure that you want to import this CSV file? It will overwrite the current one.',
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
          await this.uploadDataPointV2(formData)
          if (!CONFIG.DISABLE_DATA_POINT_V1)
            await this.uploadDataPointV1(formData)
          this.isLoading = false
          this.resetData()
          this.getDataPoint()
        }
      })
    },
    async uploadDataPointV1(formData) {
      const dataRes = await MarketMakerService.uploadFile(
        this.getURLParams(),
        formData,
      )
      if (dataRes.status != HttpStatus.OK) {
        this.$toastr.error(`v1: ${dataRes.data['message']}`)
        return
      }
      this.$toastr.success('v1 success!')
    },
    async uploadDataPointV2(formData) {
      const dataRes = await MarketMakerService.uploadFile(
        this.getURLParams(),
        formData,
        'v2',
      )
      if (dataRes.status != HttpStatus.OK) {
        this.$toastr.error(`v2: ${dataRes.data['message']}`)
        return
      }
      this.$toastr.success('v2 success!')
    },
    getURLParams(): DataPointParams {
      const [coin, currency] = this.pair.split('-')
      const result = {
        coin,
        currency,
      }
      const params = this.$route.query
      if (params?.coin) result.coin = String(params.coin)
      if (params?.currency) result.currency = String(params.currency)

      const curentDate = new Date(this.currentTime.getTime())

      const initTime = curentDate.setDate(
        curentDate.getDate() + this.currentPage,
      )

      const start_time = new Date(initTime).getTime()
      const end_time = new Date(start_time).setHours(
        new Date(start_time).getHours() + 24,
      )
      // get data 24h
      return {
        coin: result.coin,
        currency: result.currency,
        start_time: start_time.toString(),
        end_time: end_time.toString(),
      }
    },
    convertDataChart(
      dataPreviewPoints: DataPointItem[],
      dataCurrentPoints: DataPointItem[],
      start_request,
      end_request,
    ) {
      this.series = []
      const mapDataPoints: {
        [key: string]: { preview?: string | null; current?: string | null }
      } = {}
      // get first data point preview
      if (dataPreviewPoints.length > 0) {
        const firstItem = dataPreviewPoints[0]
        mapDataPoints[firstItem.start_time] = { preview: firstItem.start_price }
      }
      for (const item of dataPreviewPoints) {
        mapDataPoints[item.end_time] = { preview: item.end_price }
      }
      // get first data point current
      if (dataCurrentPoints.length > 0) {
        const firstItem = dataCurrentPoints[0]
        mapDataPoints[firstItem.start_time] = {
          ...mapDataPoints[firstItem.start_time],
          current: firstItem.start_price,
        }
      }
      for (const item of dataCurrentPoints) {
        mapDataPoints[item.end_time] = {
          ...mapDataPoints[item.end_time],
          current: item.end_price,
        }
      }
      // end
      const dataPreview: Array<any> = []
      const dataCurrent: Array<any> = []
      const category: number[] = []
      let [prePreview, preCurrent]: Array<string | null> = [null, null]
      const keyPoint = Object.keys(mapDataPoints).sort() // get time point
      for (const point of keyPoint) {
        let [currentNew, currentOld]: Array<string | null> = [null, null]
        // convert time to local time

        category.push(Number(point))
        // handler data preview
        currentNew = mapDataPoints[point].preview
          ? (mapDataPoints[point].preview as string)
          : prePreview
        dataPreview.push(currentNew)
        prePreview = currentNew
        // handler data current
        currentOld = mapDataPoints[point].current
          ? (mapDataPoints[point].current as string)
          : preCurrent
        dataCurrent.push(currentOld)
        preCurrent = currentOld
      }
      // apply in chart
      const start_chart_time = keyPoint[0] ? keyPoint[0] : start_request
      const end_chart_time = keyPoint[keyPoint.length - 1]
        ? keyPoint[keyPoint.length - 1]
        : end_request
      this.chartOptions = {
        ...this.chartOptions,
        ...{
          title: {
            ...this.chartOptions.title,
            text: `Data trend price setting (Imported at: ${
              this.version
                ? moment(Number(this.version)).format('YYYY-MM-DD HH:mm')
                : ''
            })`,
          },
        },
        ...{
          xaxis: {
            ...this.chartOptions.xaxis,
            title: {
              ...this.chartOptions.xaxis.title,
              text: `Timestamp(${moment(Number(start_chart_time)).format(
                'YYYY-MM-DD HH:mm',
              )} to ${moment(Number(end_chart_time)).format(
                'YYYY-MM-DD HH:mm',
              )})`,
            },
            categories: category,
          },
        },
      }
      this.series.push({ name: 'Current', data: dataCurrent })
      if (dataPreviewPoints.length > 0)
        this.series.push({ name: 'Preview', data: dataPreview })
    },
    previousView() {
      if (this.currentPage > 0) this.currentPage--
      this.getDataPoint()
    },
    resetView() {
      this.currentPage = 0
      this.currentTime = new Date()
      this.getDataPoint()
    },
    nextView() {
      this.currentPage++
      this.getDataPoint()
    },
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
