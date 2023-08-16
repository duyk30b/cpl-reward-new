<template>
  <div class="card">
    <div class="card-header border-0 pt-6">
      <div class="card-title">
        {{ $t('menu.futuresSetting.setting') }}
      </div>

      <div class="card-toolbar">
        <button class="btn btn-primary text-uppercase" @click="addSymbol()">
          {{ $t('futures.setting.addSymbol') }}
        </button>
      </div>
    </div>
    <div class="card-body category-table pt-0">
      <table class="table align-middle fs-6 gy-5 common-table table-bordered">
        <tr>
          <th class="text-center" colspan="2"><b>Pair</b></th>

          <th class="text-center text-uppercase" colspan="2">
            <b>{{ $t('futures.setting.binance') }}</b>
          </th>
        </tr>
        <tr>
          <th class="text-center">
            <b>{{ $t('futures.setting.quicklyTurnAll') }}</b>
          </th>
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
          <th class="text-center">
            <b>{{ $t('futures.setting.currentStatus') }}</b>
          </th>
          <th class="text-center">
            <b>{{ $t('action') }}</b>
          </th>
        </tr>
        <tr v-for="(item, index) of settingList" :key="index">
          <td :key="index" class="text-center text-uppercase">
            <b>{{ item.coin }}/{{ item.currency }}</b>
          </td>
          <td :key="index" class="text-center">
            <label
              class="form-check form-switch form-check-custom form-check-solid"
            >
              <input
                class="form-check-input"
                name="warning_threshold_enable"
                type="checkbox"
                :checked="item.status === activeStatus"
                @change="toggleActivePair(index, item.status)"
              />
            </label>
          </td>
          <td class="text-center" :style="colorFutureStatus(item.status)">
            {{ statusFuture[item.status] }}
          </td>
          <td class="text-center">
            <router-link
              class="btn btn-primary me-5"
              :to="{
                name: 'futures.setting.detail',
                params: { coin: item.coin, currency: item.currency },
              }"
            >
              {{ $t('futures.setting.update') }}
            </router-link>
            <button
              @click="deleteSetting(item.coin, item.currency)"
              class="btn btn-danger"
            >
              {{ $t('futures.setting.delete') }}
            </button>
          </td>
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

    <AddSymbolModal
      @updated="getSettings"
      @close="closeAddSymbolModal"
      v-if="showAddSymbol"
      :show="showAddSymbol"
    ></AddSymbolModal>
  </div>
</template>

<script lang="ts">
import { setCurrentPageBreadcrumbs } from '@/core/helpers/breadcrumb'
import { setPageFliud } from '@/core/helpers/common.helper'
import { HttpStatus } from '@/core/variables/common.enum'
import Swal from 'sweetalert2'
import { defineComponent } from 'vue'
import { FutureService } from '@/services/FutureService'
import AddSymbolModal from '@/components/futures/AddSymbolModal.vue'

const ACTIVE_STATUS = 1
const INACTIVE_STATUS = 2

const STATUS_FUTURE = {
  1: 'Active',
  2: 'Inactive',
}

export default defineComponent({
  name: 'futures-setting',
  components: { AddSymbolModal },
  async mounted() {
    setPageFliud()
    setCurrentPageBreadcrumbs('menu.futuresSetting.setting', [
      'menu.futures.title',
    ])
    this.getSettings().then()
  },
  data() {
    return {
      isLoading: false,
      settingList: [] as any,
      statusFuture: STATUS_FUTURE,
      isActiveAllPair: false,
      activeStatus: ACTIVE_STATUS,
      inActiveStatus: INACTIVE_STATUS,
      showAddSymbol: false,
    }
  },
  methods: {
    /**
     * New functions
     */
    deleteSetting(coin: string, currency: string) {
      Swal.fire({
        text: `Delete pair ${coin}/${currency}`,
        icon: 'warning',
        buttonsStyling: false,
        confirmButtonText: `Delete!`,
        showCancelButton: true,
        customClass: {
          confirmButton: 'btn btn-danger',
          cancelButton: 'btn btn-primary',
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          await FutureService.deleteSetting(coin, currency)
          this.$toastr.success(this.$t('futures.setting.deletePairSuccess'))
          this.getSettings().then()
        }
      })
    },
    closeAddSymbolModal() {
      this.showAddSymbol = false
    },
    addSymbol() {
      this.showAddSymbol = true
    },

    async getSettings() {
      const settings = await FutureService.getSettings({})
      if (settings.status != HttpStatus.OK) {
        this.settingList = []
        return
      }
      this.settingList = settings.data
      this.togglePairAll()
    },
    colorFutureStatus(status) {
      switch (+status) {
        case 1:
          return {
            color: 'green',
            'font-weight': 500,
          }
        case 2:
          return {
            color: 'lightgrey',
          }
        default:
          break
      }
    },
    togglePairAll() {
      this.isActiveAllPair = false
      for (const item of this.settingList) {
        if (item.status === this.activeStatus) {
          this.isActiveAllPair = true
          break
        }
      }
    },
    toggleActivePair(pairIndex, value) {
      console.log(pairIndex, value)
      this.settingList[pairIndex].status =
        value === this.activeStatus ? this.inActiveStatus : this.activeStatus
      if (this.settingList[pairIndex].status === this.inActiveStatus) {
        let inactiveCheck = true
        this.settingList.map((setting) => {
          if (setting.status === this.activeStatus) inactiveCheck = false
          return setting
        })
        if (inactiveCheck) this.isActiveAllPair = false
        return
      }

      if (this.settingList[pairIndex].status === this.activeStatus) {
        this.isActiveAllPair = true
        return
      }
    },
    changeStatusAllPair(status) {
      this.settingList.forEach((item) => {
        item.status = status ? this.activeStatus : this.inActiveStatus
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
      }).then((result) => {
        if (result.isConfirmed) {
          this.getSettings().then()
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
      }).then((result) => {
        if (result.isConfirmed) {
          this.updateStatusPairs().then()
        }
      })
    },
    async updateStatusPairs() {
      const statusList = {} as Record<string, string>
      this.settingList.forEach((item) => {
        statusList[
          `${item.coin.toLowerCase()}.${item.currency.toLowerCase()}`
        ] = item.status
      })
      const result = await FutureService.updateStatusPairs({
        status_pairs: statusList,
      })
      if (result.data.updated > 0) {
        this.$toastr.success(
          this.$t('futures.setting.updateStatusAllPairsSuccess'),
        )
      } else {
        this.$toastr.error(
          this.$t('futures.setting.updateStatusAllPairsFailed'),
        )
      }
      this.getSettings().then()
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
