<template>
  <div class="tab-pane" id="transger-balance-tab">
    <div class="row mb-4">
      <div class="text-dark fw-bolder fs-5">
        {{ transferModel.balance_type_from }} {{ $t('availableBalance') }}:
        {{ formatCurrencyAmount(balance, transferModel.currency) }}
        {{ transferModel.currency }}
      </div>
    </div>
    <div class="row mb-4 d-flex align-items-center">
      <div class="col-2 text-dark fw-bolder fs-5">
        {{ $t('transferBalance.transfer') }}:
      </div>
      <div class="col-4">
        <select
          class="form-control form-control-sm"
          v-model="transferModel.currency"
        >
          <option v-for="item in transferList" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>

    <div class="row mb-4 d-flex align-items-center">
      <div class="col-2 text-dark fw-bolder fs-5">
        {{ $t('transferBalance.from') }}:
      </div>
      <div class="col-4">
        <select
          class="form-control form-control-sm"
          v-model="transferModel.balance_type_from"
          @change="onChange(true)"
        >
          <option v-for="item in fromToList" :value="item" :key="item">
            {{ item }}
          </option>
        </select>
      </div>
    </div>

    <div class="row mb-4 d-flex align-items-center">
      <div class="col-2 text-dark fw-bolder fs-5">
        {{ $t('transferBalance.to') }}:
      </div>
      <div class="col-4">
        <select
          class="form-control form-control-sm"
          v-model="transferModel.balance_type_to"
          @change="onChange(false)"
        >
          <option
            v-for="currency in fromToList"
            :value="currency"
            :key="currency"
          >
            {{ currency }}
          </option>
        </select>
      </div>
    </div>

    <div class="row mb-4 d-flex align-items-center">
      <div class="col-2 text-dark fw-bolder fs-5">{{ $t('amount') }}:</div>
      <div class="col-4">
        <imask-input
          v-model:value="transferModel.amount"
          :mask="/^\d*\.?\d*$/"
          placeholder=""
          class="form-control"
        />
      </div>
    </div>

    <el-button type="primary" @click="onSave" class="mx-auto d-block">
      {{ $t('save') }}
    </el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { UserBalanceService } from '@/services/UserBalanceService'
import { HttpStatus } from '@/core/variables/common.enum'
import { ElMessageBox } from 'element-plus'
import { IMaskComponent } from 'vue-imask'
import { BALANCE_TYPE } from '@/enums/balance.enum'
import { formatCurrencyAmount } from '@/core/helpers/util'

export default defineComponent({
  components: {
    'imask-input': IMaskComponent,
  },
  data: () => {
    return {
      transferList: ['USDT', 'BCast'],
      fromToList: ['EXCHANGE', 'HIGH&LOW', 'FUTURES'],
      transferModel: {
        currency: 'USDT',
        balance_type_from: 'EXCHANGE',
        balance_type_to: 'HIGH&LOW',
        amount: '',
      },
      exchangeBalance: [],
      boBalance: [],
      futuresBalance: [],
    }
  },
  computed: {
    userId() {
      return this.$route.params.id
    },
    balance() {
      let balanceByType = []
      if (
        this.transferModel.balance_type_from ===
        BALANCE_TYPE[BALANCE_TYPE.EXCHANGE]
      ) {
        balanceByType = [...this.exchangeBalance]
      } else if (this.transferModel.balance_type_from === 'HIGH&LOW') {
        balanceByType = [...this.boBalance]
      } else if (
        this.transferModel.balance_type_from ===
        BALANCE_TYPE[BALANCE_TYPE.FUTURES]
      ) {
        balanceByType = [...this.futuresBalance]
      }

      if (balanceByType.length === 0) {
        return '0'
      }

      const result: any = balanceByType.find(
        (item: any) =>
          item.currency === this.transferModel.currency.toLowerCase(),
      )
      return (result && result.available_balance) || '0'
    },
  },
  mounted() {
    this.getBalance()
  },
  watch: {
    userId: function () {
      this.getBalance()
    },
  },
  methods: {
    formatCurrencyAmount,
    getBalance() {
      UserBalanceService.getListBalance(this.userId).then((res) => {
        if (res && res.status == HttpStatus.OK) {
          try {
            this.exchangeBalance = res.data.data.items.EXCHANGE
            this.boBalance = res.data.data.items.BO
            this.futuresBalance = res.data.data.items.FUTURES
          } catch {
            this.exchangeBalance = []
            this.boBalance = []
            this.futuresBalance = []
          }
        }
      })
    },
    onChange(isFrom) {
      if (isFrom) {
        if (this.transferModel.balance_type_from === 'EXCHANGE') {
          this.transferModel.balance_type_to = 'HIGH&LOW'
        } else {
          this.transferModel.balance_type_to = 'EXCHANGE'
        }
      } else {
        if (this.transferModel.balance_type_to === 'EXCHANGE') {
          this.transferModel.balance_type_from = 'HIGH&LOW'
        } else {
          this.transferModel.balance_type_from = 'EXCHANGE'
        }
      }
    },
    onSave() {
      if (!+this.transferModel.amount) {
        this.$toastr.error(this.$t(`userBalance.error.amountRequired`))
        return
      }
      if (+this.transferModel.amount > +this.balance) {
        this.$toastr.error(this.$t(`userBalance.error.notEnoughBalance`))
        return
      }
      ElMessageBox.confirm(this.$t(`userBalance.message.confirmTransfer`)).then(
        () => {
          const param = {
            ...this.transferModel,
            user_id: this.userId,
          }
          if (param.balance_type_from == 'HIGH&LOW')
            param.balance_type_from = 'BO'
          if (param.balance_type_to == 'HIGH&LOW') param.balance_type_to = 'BO'
          UserBalanceService.transferBalance(param)
            .then((res) => {
              if (res.status === HttpStatus.OK) {
                this.$toastr.success(this.$t('success'))
                this.transferModel.amount = ''
                this.getBalance()
                return
              }
              if (res.data.message.includes('INSUFFICIENT_BALANCE')) {
                this.$toastr.error('userBalance.error.INSUFFICIENT_BALANCE')
                return
              }
              this.$toastr.error(this.$t(res.data.message))
            })
            .catch(() => {
              this.$toastr.error(this.$t('error'))
            })
        },
      )
    },
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
