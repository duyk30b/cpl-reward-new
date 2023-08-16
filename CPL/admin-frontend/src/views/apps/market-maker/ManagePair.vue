<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('marketMaker.pair') }}
      </div>
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div class="d-flex justify-content-end">
          <button
            type="button"
            class="btn btn-primary"
            @click="openAddPairModal"
          >
            <span class="svg-icon svg-icon-2">
              <inline-svg src="media/icons/duotune/arrows/arr075.svg" />
            </span>
            Add new pair
          </button>
        </div>
        <!--end::Toolbar-->
      </div>
    </div>
    <div class="card-body category-table pt-0 table-responsive">
      <table class="table align-middle fs-6 gy-5 common-table table-bordered">
        <tr>
          <th class="text-center" colspan="1"><b>Pair</b></th>

          <th
            v-for="item of exchangeList"
            :key="`${item.exchange}`"
            class="text-center text-uppercase"
            colspan="2"
          >
            <b>{{ item.exchange }}</b>
          </th>
          <th class="text-center" colspan="1"></th>
        </tr>
        <tr>
          <th class="text-center"></th>
          <template
            v-for="item of exchangeList"
            :key="`switch_${item.exchange}`"
          >
            <th class="text-center"></th>
            <th class="text-center"><b>Status</b></th>
          </template>
          <th class="text-center"></th>
        </tr>
        <tr v-for="(item, index) of settingList" :key="index">
          <template v-for="(el, idx) of item" :key="el">
            <td
              v-if="el.type == 'pair'"
              :key="idx"
              class="text-center text-uppercase"
            >
              <b>{{ el.value }}</b>
            </td>
            <td v-else-if="el.type == 'switchOrder'" class="text-center">
              <label
                v-if="el.status != statusNotMap"
                class="form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="warning_threshold_enable"
                  type="checkbox"
                  :checked="el.status"
                  disabled="true"
                />
              </label>
              <span v-else>N/A</span>
            </td>
            <td
              v-else-if="el.type == 'statusExchange'"
              class="text-center"
              :style="colorExchangeStatus(el.value, index, idx)"
            >
              {{ statusExchange[el.value] }}
            </td>
          </template>

          <td class="text-center">
            <button class="btn mx-2 btn-danger" @click="deletePair(item)">
              <i class="fa fa-trash-alt p-0"></i>
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
  <AddMarketMakerPair
    v-if="showAddPair"
    :pairs="pairList"
    :show="showAddPair"
    @updated="getSystemTarget"
    @close="closeAddPairModal"
  />
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { HttpStatus } from '@/core/variables/common.enum'
import { MarketMakerService } from '@/services/MarketMakerService'
import AddMarketMakerPair from '@/components/market-maker/AddMarketMakerPair.vue'
import Swal from 'sweetalert2'
import { defineComponent } from 'vue'
import {
  UpdateMakerMakerSettings,
  MarketMakerSettingItemV2,
} from '@/models/market-maker/DataPoint'

const STATUS_NOT_MAP = 6
const ACTIVE_STATUS = 1
const INACTIVE_STATUS = 0
const PAIR_BLOCK = 2
const ORDER_BLOCK = 3

const STATUS_EXCHANGE = {
  0: 'Unknown',
  1: 'Active',
  2: 'Maintain',
  3: 'Loss Connection',
  4: 'Insufficient Balance',
  5: 'Authenticate Error',
}

export default defineComponent({
  name: 'system-target-setting-pair',
  components: {
    AddMarketMakerPair,
  },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('marketMaker.pair', ['marketMaker.settings'])
    this.getSystemTarget()
  },
  data() {
    return {
      isLoading: false,
      exchangeList: [] as any,
      settingList: [] as any,
      settingListOrigin: [] as any,
      pairList: [] as string[],
      statusExchange: STATUS_EXCHANGE,
      statusNotMap: STATUS_NOT_MAP,
      orderPrevious: null,
      isActiveAllPair: false,
      activeStatus: ACTIVE_STATUS,
      inActiveStatus: INACTIVE_STATUS,
      pairBlock: PAIR_BLOCK,
      orderBlock: ORDER_BLOCK,
      user: {} as any,
      showEdit: false,
      showAddPair: false,
      currentEx: {} as any,
    }
  },
  methods: {
    async editExchangePair(param) {
      this.currentEx = param
      this.showEdit = true
    },
    openAddPairModal() {
      this.showAddPair = true
    },
    closeAddPairModal() {
      this.showAddPair = false
    },
    async getSystemTarget() {
      const pairData = await MarketMakerService.getSystemTarget({})

      if (pairData.status != HttpStatus.OK) {
        this.exchangeList = []
        this.settingList = []
        this.settingListOrigin = []
        return
      }
      const data = this.convertData(pairData.data.data)
      this.pairList = Object.keys(pairData.data.data)
      this.exchangeList = data.exchangeList
      this.settingList = data.orderList
      this.settingListOrigin = JSON.parse(JSON.stringify(data.orderList))
      this.togglePair()
      this.togglePairAll(this.pairBlock - 1)
      this.exchangeList.forEach((_el, i) => {
        this.toggleOrderAll(i * this.orderBlock + this.pairBlock)
      })
    },
    async deletePair(pairDetail) {
      const pairInfo = pairDetail.find((i) => i.type === 'pair')
      if (!pairInfo) return
      const pair = pairInfo.value

      Swal.fire({
        text: 'Delete pair!',
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Ok, I want delete pair ${pair.toUpperCase()}!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-default',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const [coin, currency] = pair.split('/')
          const pairDelete = await MarketMakerService.deleteMarketMakerPair({
            coin: coin.toLowerCase(),
            currency: currency.toLowerCase(),
          })
          if (pairDelete.status != HttpStatus.OK) {
            this.$toastr.error('Delete pair error!')
            return
          }
          this.$toastr.success('Delete pair success!')
          await this.getSystemTarget()
        }
      })
    },
    togglePair() {
      for (const item of this.settingList) {
        let check = this.inActiveStatus
        for (let i = this.pairBlock; i < item.length; i += this.orderBlock) {
          const element = item[i]
          if (element.status == this.activeStatus) {
            check = this.activeStatus
            break
          }
        }
        item[this.pairBlock - 1].value = check
      }
    },
    checkActivePrimary(pairIndex, columnIndex) {
      const orderValue = this.settingList[pairIndex][columnIndex].value
      for (
        let i = this.pairBlock + this.orderBlock - 1;
        i < this.settingList[pairIndex].length;
        i += this.orderBlock
      ) {
        const orderItemValue = this.settingList[pairIndex][i].value
        const orderStatus = this.settingList[pairIndex][i - 1].value
        if (
          i != columnIndex &&
          orderItemValue &&
          orderStatus == this.activeStatus &&
          +orderItemValue < +orderValue
        ) {
          return {
            // color: "darkgrey",
          }
        }
      }
      return {
        color: 'green',
        'font-weight': 500,
      }
    },
    colorExchangeStatus(status, index, idx) {
      switch (+status) {
        case 1:
          return this.checkActivePrimary(index, idx + 1)
        case 2:
          return {
            color: 'lightgrey',
          }
        case 3:
        case 4:
        case 5:
        case 7:
          return {
            color: 'red',
          }
        default:
          break
      }
    },
    togglePairAll(idx) {
      this.isActiveAllPair = false
      for (const item of this.settingList) {
        if (item[idx].value === this.activeStatus) {
          this.isActiveAllPair = true
          break
        }
      }
    },

    toggleOrderAll(idx) {
      this.exchangeList[
        (idx - this.pairBlock) / this.orderBlock
      ].orderActiveAll = false
      for (const item of this.settingList) {
        if (item[idx].status == this.activeStatus) {
          this.exchangeList[
            (idx - this.pairBlock) / this.orderBlock
          ].orderActiveAll = true
          break
        }
      }
    },
    sortPairFn([coin1, currency1]: string[], [coin2, currency2]: string[]) {
      if (currency1 < currency2) {
        return -1
      } else if (currency1 > currency2) {
        return 1
      } else {
        if (coin1 < coin2) {
          return -1
        } else if (coin1 > coin2) {
          return 1
        }
      }
    },
    convertData(data) {
      const exchangeList = [] as any
      const orderList = [] as any

      const pairList = Object.keys(data)
      pairList.sort((a, b) => {
        const pair1 = a.split('/')
        const pair2 = b.split('/')
        return this.sortPairFn(pair1, pair2) as number
      })
      pairList.forEach((item, i) => {
        let orderItem = [] as any
        const detailOrder = data[item]
        orderItem.push({
          // pair column
          type: 'pair',
          value: item,
        })
        orderItem.push({
          type: 'switchPair', // pair status
          value: 2,
        })

        if (i > 0) {
          const sortDetailPair: any[] = []
          exchangeList.forEach((ex) => {
            const existExPairConfig = detailOrder.data.find(
              (i) => i.exchange === ex.exchange,
            )

            if (existExPairConfig) {
              sortDetailPair.push(existExPairConfig)
            } else {
              sortDetailPair.push({
                exchange: ex.exchange,
                status: 0,
              })
            }
          })
          detailOrder.data = sortDetailPair
        }

        detailOrder.data.forEach((ele) => {
          if (i == 0) {
            exchangeList.push({
              // exchange header
              exchange: ele.exchange,
              orderActiveAll: false,
            })
          }

          orderItem.push({
            type: 'switchOrder', // order status
            status: ele.active_flag,
          })
          orderItem.push({
            type: 'statusExchange', // exchange status
            value: ele.status,
          })
          orderItem.push({
            type: 'exchangeDetail',
            value: {
              pair: item,
              exchange: ele.exchange,
            },
          })
        })
        orderList.push(orderItem)
      })

      return {
        exchangeList,
        orderList,
      }
    },
    toggleActivePair(pairIndex, columnIndex, value) {
      for (
        let idx = columnIndex + 1;
        idx < this.settingList[pairIndex].length;
        idx += this.orderBlock
      ) {
        const activeOrderToggle = this.settingList[pairIndex][idx]
        const activeOrderText = this.settingList[pairIndex][idx + 1]
        if (
          activeOrderToggle.status == this.activeStatus ||
          activeOrderToggle.status == this.inActiveStatus
        ) {
          activeOrderToggle.status =
            value == this.activeStatus ? this.activeStatus : this.inActiveStatus
          activeOrderText.value =
            value == this.activeStatus ? this.activeStatus : this.inActiveStatus
        }
      }
      this.togglePairAll(this.pairBlock - 1)
      this.exchangeList.forEach((_el, i) => {
        this.toggleOrderAll(i * this.orderBlock + this.pairBlock)
      })
    },
    toggleOrderItem(pairIndex, columnIndex, value) {
      this.settingList[pairIndex][columnIndex].status = value
      this.settingList[pairIndex][columnIndex + 1].value = value
      this.toggleOrderAll(columnIndex)
      this.togglePair()
      this.togglePairAll(this.pairBlock - 1)
    },
    changeOrderItem(pairIndex, columnIndex, value) {
      for (
        let idx = this.pairBlock + this.orderBlock - 1;
        idx < this.settingList[pairIndex].length;
        idx += this.orderBlock
      ) {
        const el = this.settingList[pairIndex][idx]
        if (el.value == value && idx != columnIndex) {
          el.value = this.orderPrevious
          break
        }
      }
      this.orderPrevious = value
    },
    changeStatusAllPair(status) {
      this.settingList.forEach((item) => {
        item[1].value = status ? this.activeStatus : this.inActiveStatus
      })
      this.settingList.forEach((item, idx) => {
        this.toggleActivePair(
          idx,
          1,
          item[1].value == this.activeStatus
            ? this.activeStatus
            : this.inActiveStatus,
        )
      })
    },
    toggleAllOrderInExchange(idx, status) {
      this.settingList.forEach((item, i) => {
        let position = item[idx * this.orderBlock + this.pairBlock].status
        if (position == this.inActiveStatus || position == this.activeStatus) {
          position = this.exchangeList[idx].orderActiveAll
            ? this.activeStatus
            : this.inActiveStatus
          this.toggleOrderItem(
            i,
            idx * this.orderBlock + this.inActiveStatus,
            status ? this.activeStatus : this.inActiveStatus,
          )
        }
      })
    },
    resetData() {
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
          await this.getSystemTarget()
        }
      })
    },
    confirmUpdate() {
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
          this.convertDataSave()
        }
      })
    },
    convertDataSave() {
      const settingBody: MarketMakerSettingItemV2[] = []
      this.settingList.forEach((item, i) => {
        const indexStatusPair = 1

        const pair = this.settingList[i][indexStatusPair - 1].value
        const [coin, currency] = pair.split('/')
        this.exchangeList.forEach((el, j) => {
          const indexOrderCheck = 2
          const positon = indexOrderCheck + j * this.orderBlock
          let isChange = false
          const setting: MarketMakerSettingItemV2 = {
            coin,
            currency,
            exchange: el.exchange,
          }
          if (
            item[positon].status != this.settingListOrigin[i][positon].status
          ) {
            isChange = true
            setting.configure = {
              active_flag: item[positon].status,
            }
          }

          if (isChange) {
            settingBody.push(setting)
          }
        })
      })
      this.saveOrder({
        data: settingBody,
        name: 'update_market_maker_settings',
      })
    },
    async saveOrder(body: UpdateMakerMakerSettings) {
      if (!body?.data?.length) {
        this.$toastr.error('No data change!')
        return
      }
      const updateRs = await MarketMakerService.updateMarketMakerSettings(body)
      if (updateRs.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.saveObmSettingError'))
        return
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
      await this.getSystemTarget()
    },
    refreshTable() {
      this.getSystemTarget()
    },
    closeEditModal() {
      this.showEdit = false
    },
  },
})
</script>
<style lang="scss" scoped>
.form-check.form-check-custom {
  justify-content: center;
}
.custom-select {
  border-width: 1px;
}
</style>
