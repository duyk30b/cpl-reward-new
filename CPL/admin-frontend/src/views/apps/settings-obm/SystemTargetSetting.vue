<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.systemTargetSetting') }}
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <table class="table align-middle fs-6 gy-5 common-table table-bordered">
        <tr>
          <th class="text-center" colspan="2"><b>Pair</b></th>

          <th
            v-for="item of exchangeList"
            :key="`${item.exchange}`"
            class="text-center text-uppercase"
            colspan="3"
          >
            <b>{{ item.exchange }}</b>
          </th>
        </tr>
        <tr>
          <th class="text-center"><b>Quickly turn ON/OFF all</b></th>
          <th class="text-center">
            <label
              class="form-check form-switch form-check-custom form-check-solid"
            >
              <input
                class="form-check-input"
                name="warning_threshold_enable"
                type="checkbox"
                :checked="isActiveAllPair"
                @input="isActiveAllPair = $event.target?.['checked']"
                @click="changeStatusAllPair($event.target?.['checked'])"
              />
            </label>
          </th>
          <template
            v-for="(item, index) of exchangeList"
            :key="`switch_${item.exchange}`"
          >
            <th class="text-center">
              <label
                class="form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="warning_threshold_enable"
                  type="checkbox"
                  :checked="item.orderActiveAll"
                  @input="item.orderActiveAll = $event.target?.['checked']"
                  @click="
                    toggleAllOrderInExchange(index, $event.target?.['checked'])
                  "
                />
              </label>
            </th>
            <th class="text-center"><b>Current Status</b></th>
            <th class="text-center"><b>Order</b></th>
          </template>
        </tr>
        <tr v-for="(item, index) of orderList" :key="index">
          <template v-for="(el, idx) of item" :key="el">
            <td
              v-if="el.type == 'pair'"
              :key="idx"
              class="text-center text-uppercase"
            >
              <b>{{ el.value }}</b>
            </td>
            <td
              v-else-if="el.type == 'switchPair'"
              :key="el"
              class="text-center"
            >
              <label
                class="form-check form-switch form-check-custom form-check-solid"
              >
                <input
                  class="form-check-input"
                  name="warning_threshold_enable"
                  type="checkbox"
                  :checked="el.value == activeStatus"
                  @change="
                    toggleActivePair(
                      index,
                      idx,
                      (el.value =
                        el.value == activeStatus
                          ? inActiveStatus
                          : activeStatus),
                    )
                  "
                />
              </label>
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
                  :checked="getActiveOrder(el.status)"
                  :disabled="
                    el.status != inActiveStatus && el.status != activeStatus
                  "
                  @click="
                    toggleOrderItem(
                      index,
                      idx,
                      el.status == activeStatus ? inActiveStatus : activeStatus,
                    )
                  "
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
            <td v-else-if="el.type == 'selectOrder'" class="text-center">
              <template v-if="el.status != statusNotMap">
                <select
                  v-model="el.value"
                  class="form-control custom-select text-center"
                  @focus="orderPrevious = el.value"
                  @change="changeOrderItem(index, idx, el.value)"
                >
                  <option v-for="opt of el.options" :key="opt" :value="opt">
                    {{ opt }}
                  </option>
                </select>
              </template>
              <span v-else>N/A</span>
            </td>
          </template>
        </tr>
      </table>
      <div class="d-flex justify-content-between">
        <div></div>
        <div>
          <button @click="resetData()" class="btn btn-danger me-5">
            {{ $t('setting.clear') }}
          </button>
          <button @click="confirmUpdate()" class="btn btn-primary">
            {{ $t('setting.save') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { HttpStatus } from '@/core/variables/common.enum'
import { ObmPairSettingItemDTO } from '@/models/setting-obm/GeneralOBM'
import { SettingOBMService } from '@/services/SettingOBMService'
import Swal from 'sweetalert2'
import { defineComponent } from 'vue'

const STATUS_NOT_MAP = 6
const ACTIVE_STATUS = 1
const INACTIVE_STATUS = 2
const PAIR_BLOCK = 2
const ORDER_BLOCK = 3

const STATUS_EXCHANGE = {
  1: 'Active',
  2: 'Inactive',
  3: 'Maintain',
  4: 'Loss Connection',
  5: 'Insufficient Balance',
  6: 'N/A',
  7: 'Authenticate Error',
}

export default defineComponent({
  name: 'system-target-setting-obm',
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('obmSetting.systemTarget', ['obmSetting.setting'])
    this.getSystemTarget()
  },
  data() {
    return {
      isLoading: false,
      exchangeList: [] as any,
      orderList: [] as any,
      orderListOrigin: [] as any,
      statusExchange: STATUS_EXCHANGE,
      statusNotMap: STATUS_NOT_MAP,
      orderPrevious: null,
      isActiveAllPair: false,
      activeStatus: ACTIVE_STATUS,
      inActiveStatus: INACTIVE_STATUS,
      pairBlock: PAIR_BLOCK,
      orderBlock: ORDER_BLOCK,
      user: {} as any,
    }
  },
  methods: {
    async getSystemTarget() {
      const pairData = await SettingOBMService.getSystemTarget()
      if (pairData.status != HttpStatus.OK) {
        this.exchangeList = []
        this.orderList = []
        this.orderListOrigin = []
        return
      }
      const data = this.convertData(pairData.data.data)
      this.exchangeList = data.exchangeList
      this.orderList = data.orderList
      this.orderListOrigin = JSON.parse(JSON.stringify(data.orderList))
      this.togglePair()
      this.togglePairAll(this.pairBlock - 1)
      this.exchangeList.forEach((_el, i) => {
        this.toggleOrderAll(i * this.orderBlock + this.pairBlock)
      })
    },
    togglePair() {
      for (const item of this.orderList) {
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
      const orderValue = this.orderList[pairIndex][columnIndex].value
      for (
        let i = this.pairBlock + this.orderBlock - 1;
        i < this.orderList[pairIndex].length;
        i += this.orderBlock
      ) {
        const orderItemValue = this.orderList[pairIndex][i].value
        const orderStatus = this.orderList[pairIndex][i - 1].value
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
      for (const item of this.orderList) {
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
      for (const item of this.orderList) {
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
        const options = [] as any
        let option = 1

        detailOrder.data.forEach((ele) => {
          if (i == 0) {
            exchangeList.push({
              // exchange header
              exchange: ele.exchange,
              orderActiveAll: false,
            })
          }
          // if (ele.status != this.statusNotMap) {
          options.push(option) // list option order
          option++
          // }
          orderItem.push({
            type: 'switchOrder', // order status
            status: ele.status,
          })
          orderItem.push({
            type: 'statusExchange', // exchange status
            value: ele.status,
          })
          orderItem.push({
            type: 'selectOrder', // select order
            value: ele.order,
            options: options,
            status: ele.status,
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
        idx < this.orderList[pairIndex].length;
        idx += this.orderBlock
      ) {
        const activeOrderToggle = this.orderList[pairIndex][idx]
        const activeOrderText = this.orderList[pairIndex][idx + 1]
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
      this.orderList[pairIndex][columnIndex].status = value
      this.orderList[pairIndex][columnIndex + 1].value = value
      this.toggleOrderAll(columnIndex)
      this.togglePair()
      this.togglePairAll(this.pairBlock - 1)
    },
    changeOrderItem(pairIndex, columnIndex, value) {
      for (
        let idx = this.pairBlock + this.orderBlock - 1;
        idx < this.orderList[pairIndex].length;
        idx += this.orderBlock
      ) {
        const el = this.orderList[pairIndex][idx]
        if (el.value == value && idx != columnIndex) {
          el.value = this.orderPrevious
          break
        }
      }
      this.orderPrevious = value
    },
    getActiveOrder(status) {
      return status == 1
    },
    changeStatusAllPair(status) {
      this.orderList.forEach((item) => {
        item[1].value = status ? this.activeStatus : this.inActiveStatus
      })
      this.orderList.forEach((item, idx) => {
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
      this.orderList.forEach((item, i) => {
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
      const orderBody = [] as any
      this.orderList.forEach((item, i) => {
        const indexStatusPair = 1
        let coin = ''
        let currency = ''
        const pair = this.orderListOrigin[i][indexStatusPair - 1].value
        ;[coin, currency] = pair.split('/')
        this.exchangeList.forEach((el, j) => {
          const indexOrderCheck = 2
          const positon = indexOrderCheck + j * this.orderBlock
          let isChange = false
          const order: ObmPairSettingItemDTO = {
            coin,
            currency,
            exchange: el.exchange,
            update_by: 'admin',
          }
          if (item[positon].status != this.orderListOrigin[i][positon].status) {
            isChange = true
            order.status = +item[positon].status
          }
          if (
            item[positon + this.pairBlock].value !=
            this.orderListOrigin[i][positon + this.pairBlock].value
          ) {
            isChange = true
            order.exchange_priority = +item[positon + this.pairBlock].value
          }
          if (isChange) {
            orderBody.push(order)
          }
        })
      })
      this.saveOrder(orderBody)
    },
    async saveOrder(body) {
      if (body.length == 0) {
        this.$toastr.error('No data change!')
        return
      }
      const pairData = await SettingOBMService.patchPairOBMSetting(body)
      if (pairData.status != HttpStatus.OK) {
        this.$toastr.error(this.$t('setting.saveObmSettingError'))
        return
      }
      this.$toastr.success(this.$t('setting.saveCategorySuccess'))
      await this.getSystemTarget()
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
