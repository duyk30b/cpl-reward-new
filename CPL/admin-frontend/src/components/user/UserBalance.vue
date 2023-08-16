<template>
  <div class="tab-pane mt-5" id="user-balance-tab">
    <el-tabs v-model="selectTab" tab-position="left" class="demo-tabs">
      <el-tab-pane :label="$t('userBalance.total')" name="total"> </el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.exchangeBalance')"
        name="exchange"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.highlowBalance')"
        name="highlow"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.rewardBalance')"
        name="reward"
      ></el-tab-pane>
      <el-tab-pane
        :label="$t('userBalance.futureBalance')"
        name="future"
      ></el-tab-pane>
      <div class="table-wrapper pl-8">
        <div class="table-responsive mb-4">
          <table
            :class="[loading && 'overlay overlay-block']"
            class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
            id="kt_customers_table"
            role="grid"
          >
            <thead>
              <tr
                class="text-start text-gray-400 fw-bolder fs-7 text-uppercase gs-0"
                role="row"
                v-if="columns && columns.length"
              >
                <template v-for="(cell, i) in columns" :key="i">
                  <th
                    :class="[cell.class, 'min-w-125px']"
                    tabindex="0"
                    rowspan="1"
                    colspan="1"
                  >
                    {{ $t(cell.title) }}
                  </th>
                </template>
              </tr>
            </thead>
            <tbody class="fw-bold text-gray-600">
              <template v-if="selectData && selectData.length">
                <template v-for="(item, i) in selectData" :key="i">
                  <tr class="odd">
                    <template v-for="(cell, i) in columns" :key="i">
                      <td
                        v-if="
                          cell.key === 'actual_balance' ||
                          cell.key === 'available_balance'
                        "
                        :class="[cell.class]"
                      >
                        <slot :name="`cell-${cell.key}`" :row="item">
                          {{ formatNumberString(item[cell.key]) }}
                        </slot>
                      </td>
                      <td v-else-if="cell.key === 'currency'">
                        <slot :name="`cell-${cell.key}`" :row="item">
                          {{ item[cell.key].toUpperCase() }}
                        </slot>
                      </td>
                      <td v-else-if="cell.key === ''">
                        <slot :name="`cell-${cell.key}`" :row="item">
                          <button
                            class="btn btn-sm btn-primary mr-2 mx-auto d-block"
                            v-if="checkPermission(Permission.BALANCE_ADD)"
                            @click="openEdit(item)"
                          >
                            {{ $t('edit') }}
                          </button>
                        </slot>
                      </td>
                    </template>
                  </tr>
                </template>
              </template>
              <template>
                <tr class="odd">
                  <td colspan="7" class="dataTables_empty">No data found</td>
                </tr>
              </template>
            </tbody>
            <div
              v-if="loading"
              class="overlay-layer card-rounded bg-dark bg-opacity-5"
            >
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          </table>
        </div>
        <div
          v-if="loading"
          class="d-flex align-items-center justify-content-center loading-wrapper"
        >
          <div class="loading-area">
            <slot name="loading">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">{{ $t('loading') }}</span>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </el-tabs>

    <el-dialog
      v-model="dialogVisible"
      title="User Balance Edit"
      width="30%"
      :before-close="handleClose"
    >
      <div class="content-update-balance">
        <div class="row mb-4 w-100">
          <div class="col-1"></div>
          <div class="col-11 text-dark fw-bolder fs-5">
            {{ $t('service') }}
          </div>
          <div class="col-1"></div>
          <div class="col-11">
            <el-select v-model="itemUpdate.balance_type" filterable>
              <el-option
                v-for="item in editBalanceTypes"
                :value="item.id"
                :key="item.id"
                :label="item.name"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div class="content-update-balance">
        <div class="row mb-4 w-100">
          <div class="col-1"></div>
          <div class="col-11 text-dark fw-bolder fs-5">
            {{ $t('currency') }}
          </div>
          <div class="col-1"></div>
          <div class="col-11">
            <el-select v-model="itemUpdate.currency" filterable>
              <el-option
                v-for="currency in listCoin"
                :value="currency.toLowerCase()"
                :label="currency"
                :key="currency"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="row mb-4 w-100">
          <div class="col-1"></div>
          <div class="col-11 text-dark fw-bolder fs-5">
            {{ $t('userBalance.balanceChange') }}
          </div>
          <div
            class="col-1 d-flex align-items-center justify-content-end pr-0 text-primary fw-bolder fs-5"
          >
            +
          </div>
          <div class="col-11">
            <imask-input
              v-model:value="itemUpdate.amount"
              :mask="/^-?\d*\.?\d*$/"
              placeholder=""
              class="form-control"
            />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="onSave" class="mx-auto d-block">
          {{ $t('save') }}
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserBalanceService } from '@/services/UserBalanceService'
import { IColumnConfig } from '@/components/datatable/Datatable.vue'
import { HttpStatus } from '@/core/variables/common.enum'
import { ElMessageBox } from 'element-plus'
import { IMaskComponent } from 'vue-imask'
import { Actions } from '@/store/enums/StoreEnums'
import { balanceTypeOption, formatNumberString } from '@/core/helpers/util'
import { checkPermission } from '@/core/helpers/common.helper'
import { Permission } from '@/core/variables/common.enum'
import { BALANCE_TYPE } from '@/enums/balance.enum'

const balanceTypes = balanceTypeOption()
const CASHBACK = 'CASHBACK'

export default defineComponent({
  components: {
    'imask-input': IMaskComponent,
  },
  data: () => {
    return {
      selectTab: 'total',
      selectData: [] as any[],
      dataItems: {
        total: [],
        items: {
          EXCHANGE: [] as any,
          UNKNOWN: [] as any,
          BO: [] as any,
          CASHBACK: [] as any,
          REWARD: [] as any,
          FUTURES: [] as any,
        },
      },
      loading: false,
      columns: [
        {
          key: 'currency',
          title: 'currency',
          class: 'td-w-350px text-uppercase',
        },
        {
          key: 'actual_balance',
          title: 'actualBalance',
          class: 'td-w-350px',
        },
        {
          key: 'available_balance',
          title: 'availableBalance',
          class: 'td-w-350px',
        },
        {
          key: '',
          title: '',
          class: 'td-w-100px',
        },
      ] as IColumnConfig[],
      dialogVisible: false,
      itemUpdate: {
        balance_type: '',
        currency: '',
        amount: '',
      },
      Permission,
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    userAdmin() {
      return this.$store.getters.currentUser
    },
    listCoin() {
      return this.$store.getters.listCoin
    },
    editBalanceTypes() {
      if (this.itemUpdate.currency === 'bcast') {
        return balanceTypes.filter(
          (item) => item.id !== BALANCE_TYPE[BALANCE_TYPE.CASHBACK],
        )
      }
      if (this.itemUpdate.currency === 'usdt') {
        return balanceTypes
      }
      return balanceTypes.filter(
        (item) =>
          item.id !== BALANCE_TYPE[BALANCE_TYPE.CASHBACK] &&
          item.id !== BALANCE_TYPE[BALANCE_TYPE.BO],
      )
    },
  },
  mounted() {
    this.getData()
    if (!this.listCoin.length) {
      this.$store.dispatch(Actions.FETCH_LIST_COIN)
    }
  },
  watch: {
    userId: function (value) {
      if (!value) return
      this.getData()
    },
    selectTab: function () {
      this.updateSelectData()
    },
    'itemUpdate.currency': function (value) {
      if (
        this.itemUpdate.balance_type === BALANCE_TYPE[BALANCE_TYPE.BO] &&
        value !== 'usdt' &&
        value !== 'bcast'
      ) {
        this.itemUpdate.balance_type = BALANCE_TYPE[BALANCE_TYPE.EXCHANGE]
        return
      }
      if (
        this.itemUpdate.balance_type === BALANCE_TYPE[BALANCE_TYPE.CASHBACK] &&
        value !== 'usdt'
      ) {
        this.itemUpdate.balance_type = BALANCE_TYPE[BALANCE_TYPE.EXCHANGE]
        return
      }
    },
  },
  methods: {
    getData() {
      UserBalanceService.getListBalance(this.userId).then((res) => {
        if (res && res.status == HttpStatus.OK) {
          this.dataItems = res.data.data
          this.updateSelectData()
        }
      })
    },
    updateSelectData() {
      if (!this.dataItems) return
      let cashbackData: any
      switch (this.selectTab) {
        case 'total':
          this.selectData = this.dataItems.total.sort(
            (a: any, b: any) => b.actual_balance - a.actual_balance,
          )
          break
        case 'exchange':
          this.selectData = this.dataItems.items.EXCHANGE.sort(
            (a: any, b: any) => b.actual_balance - a.actual_balance,
          )
          break
        case 'reward':
          this.selectData = this.dataItems.items.REWARD.sort(
            (a: any, b: any) => b.actual_balance - a.actual_balance,
          )
          break
        case 'highlow':
          cashbackData = JSON.parse(
            JSON.stringify(this.dataItems.items.CASHBACK),
          )
          cashbackData = [
            ...cashbackData.find((i: any) => i.currency === 'usdt'),
          ]
          this.selectData = [
            ...cashbackData.map((item: any) => {
              item.currency = CASHBACK
              return item
            }),
            ...this.dataItems.items.BO,
          ]
          break
        case 'future':
          this.selectData = this.dataItems.items.FUTURES.sort(
            (a: any, b: any) => b.actual_balance - a.actual_balance,
          )
          break
      }
    },
    openEdit(item) {
      let defaultBalanceType = ''
      switch (this.selectTab) {
        case 'reward':
          defaultBalanceType = BALANCE_TYPE[BALANCE_TYPE.REWARD]
          break
        case 'highlow':
          if (item.currency === CASHBACK) {
            defaultBalanceType = BALANCE_TYPE[BALANCE_TYPE.CASHBACK]
            break
          }
          defaultBalanceType = BALANCE_TYPE[BALANCE_TYPE.BO]
          break
        case 'total':
        case 'exchange':
        default:
          defaultBalanceType = BALANCE_TYPE[BALANCE_TYPE.EXCHANGE]
          break
      }
      this.itemUpdate.balance_type = defaultBalanceType
      this.itemUpdate.currency =
        item.currency === CASHBACK ? 'usdt' : item.currency
      this.dialogVisible = true
    },
    onSave() {
      if (
        !this.itemUpdate.amount ||
        !this.itemUpdate.amount.trim() ||
        this.itemUpdate.amount.trim() == '0'
      ) {
        this.$toastr.error(this.$t(`userBalance.error.balanceChangeRequired`))
        return
      }
      ElMessageBox.confirm(this.$t('userBalance.message.confirmUpdate')).then(
        () => {
          const param = {
            ...this.itemUpdate,
            admin_id: this.userAdmin.id,
            user_id: this.userId,
          }
          UserBalanceService.updateUserBalance(param).then((res) => {
            if (res.status === HttpStatus.OK) {
              this.$toastr.success(this.$t('success'))
              this.handleClose()
              this.getData()
              return
            }
            if (res.data.message.includes('INSUFFICIENT_BALANCE')) {
              this.$toastr.error(
                this.$t('userBalance.error.INSUFFICIENT_BALANCE'),
              )
              return
            }
            this.$toastr.error(res.data.message)
          })
        },
      )
    },
    handleClose() {
      this.dialogVisible = false
      this.itemUpdate.amount = ''
    },
    formatNumberString,
    checkPermission,
  },
})
</script>

<style lang="scss" scoped>
.td-w-100px {
  width: 100px;
}
.pl-8 {
  padding-left: 2rem;
}
.pr-0 {
  padding-right: 0;
}
</style>
