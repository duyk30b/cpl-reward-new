<template>
  <BaseModal
    title="Recovery Detail"
    :show="show"
    @close="close"
    :dialog-class="'recovery-detail-modal'"
  >
    <template v-slot:body>
      <div class="row gy-5 g-xl-8">
        <div class="col-md-12">
          <div class="d-flex flex-stack mb-10">
            <div class="col-md-6">
              <div class="d-flex">
                <h4>Profit:</h4>
                &nbsp;
                <h4
                  :class="{
                    'text-success': +counterOrigin.profit_all >= 0,
                    'text-danger': +counterOrigin.profit_all < 0,
                  }"
                >
                  {{ formatNumber(counterOrigin.profit_all) }}
                </h4>
                &nbsp;
                <h4>{{ counterOrigin.currency?.toUpperCase() }}</h4>
              </div>
              <div class="d-flex">
                <h4>Filled Profit:</h4>
                &nbsp;
                <h4
                  :class="{
                    'text-success': +counterOrigin.profit_actual >= 0,
                    'text-danger': +counterOrigin.profit_actual < 0,
                  }"
                >
                  {{ formatNumber(counterOrigin.profit_actual) }}
                </h4>
                &nbsp;
                <h4>{{ counterOrigin.currency?.toUpperCase() }}</h4>
              </div>
              <div class="d-flex">
                <h4>Unfilled Profit:</h4>
                &nbsp;
                <h4
                  :class="{
                    'text-success': +counterOrigin.profit_virtual >= 0,
                    'text-danger': +counterOrigin.profit_virtual < 0,
                  }"
                >
                  {{ formatNumber(counterOrigin.profit_virtual) }}
                </h4>
                &nbsp;
                <h4>{{ counterOrigin.currency?.toUpperCase() }}</h4>
              </div>
            </div>
            <div class="col-md-6 d-flex justify-content-between">
              <div class="d-flex">
                <h4>Rate:</h4>
                &nbsp;
                <h4
                  :class="{
                    'text-success': +counterOrigin.profit_percent >= 0,
                    'text-danger': +counterOrigin.profit_percent < 0,
                  }"
                >
                  {{ counterOrigin.profit_percent?.toFixed(2) }}
                </h4>
                &nbsp;
                <h4>%</h4>
              </div>
              <h4>
                Status:
                {{
                  recoveryDetail?.status?.toUpperCase() ||
                  counterOrigin.status?.toUpperCase()
                }}
              </h4>
            </div>
          </div>
          <div class="d-flex mb-10">
            <div class="table-responsive">
              <table class="table table-row-dashed">
                <thead>
                  <tr>
                    <th class="item"><b>Key</b></th>
                    <th class="item"><b>Recovery</b></th>
                    <th
                      v-for="(item, index) in counterDetail"
                      :key="item.id"
                      class="item"
                    >
                      <b>{{ `Counter ${index + 1}` }}</b>
                    </th>
                  </tr>
                </thead>
                <tbody class="fw-bold text-gray-600">
                  <tr class="odd">
                    <th>id</th>
                    <td>{{ recoveryDetail?.id }}</td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.id }}
                    </td>
                  </tr>
                  <tr>
                    <th>Counter Order ID</th>
                    <td></td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.receive_id }}
                    </td>
                  </tr>
                  <tr>
                    <th>Counter Target ID</th>
                    <td></td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.send_id }}
                    </td>
                  </tr>
                  <tr>
                    <th>Target Recovery ID</th>
                    <td>{{ recoveryDetail?.receive_id }}</td>
                    <td v-for="item of counterDetail" :key="item.id"></td>
                  </tr>
                  <tr>
                    <th>Target Matched Price</th>
                    <td>{{ formatNumber(recoveryDetail?.actual_price) }}</td>
                    <td v-for="item of counterDetail" :key="item.id"></td>
                  </tr>
                  <tr>
                    <th>Matched Price</th>
                    <td></td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ formatNumber(item.actual_price) }}
                    </td>
                  </tr>
                  <tr>
                    <th>Target Matched Volume</th>
                    <td>{{ formatNumber(recoveryDetail?.actual_volume) }}</td>
                    <td v-for="item of counterDetail" :key="item.id"></td>
                  </tr>
                  <tr>
                    <th>Matched Volume</th>
                    <td></td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ formatNumber(item.actual_volume) }}
                    </td>
                  </tr>
                  <tr>
                    <th>Order Type</th>
                    <td>{{ recoveryDetail?.order_type?.toUpperCase() }}</td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.order_type?.toUpperCase() }}
                    </td>
                  </tr>
                  <tr>
                    <th>Order Class</th>
                    <td>{{ recoveryDetail?.order_class?.toUpperCase() }}</td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.order_class?.toUpperCase() }}
                    </td>
                  </tr>
                  <tr>
                    <th>Input Setting</th>
                    <td>
                      <div
                        v-for="(
                          value, property
                        ) in recoveryDetail?.input_setting"
                        :key="value"
                      >
                        {{ property }}: {{ value }}
                      </div>
                    </td>
                    <td v-for="item of counterDetail" :key="item.id">
                      <div
                        v-for="(value, property) in item?.input_setting"
                        :key="value"
                      >
                        {{ property }}: {{ value }}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th>Status</th>
                    <td>{{ recoveryDetail?.status?.toUpperCase() }}</td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.status?.toUpperCase() }}
                    </td>
                  </tr>
                  <tr>
                    <th>Exchange</th>
                    <td>{{ recoveryDetail?.exchange?.toUpperCase() }}</td>
                    <td v-for="item of counterDetail" :key="item.id"></td>
                  </tr>
                  <tr>
                    <th>Coin</th>
                    <td>{{ recoveryDetail?.coin?.toUpperCase() }}</td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.coin?.toUpperCase() }}
                    </td>
                  </tr>
                  <tr>
                    <th>Currency</th>
                    <td>{{ recoveryDetail?.currency?.toUpperCase() }}</td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ item.currency?.toUpperCase() }}
                    </td>
                  </tr>
                  <tr>
                    <th>Send Time</th>
                    <td>
                      {{ formatDate(recoveryDetail?.send_time) }}
                    </td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ formatDate(item.send_time) }}
                    </td>
                  </tr>
                  <tr>
                    <th>Receive Time</th>
                    <td>
                      {{ formatDate(recoveryDetail?.receive_time) }}
                    </td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ formatDate(item.receive_time) }}
                    </td>
                  </tr>
                  <tr>
                    <th>Receive Time</th>
                    <td>
                      {{ formatDate(recoveryDetail?.complete_time) }}
                    </td>
                    <td v-for="item of counterDetail" :key="item.id">
                      {{ formatDate(item.complete_time) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseModal>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import BaseModal from '@/components/modals/BaseModal.vue'
import {
  CounterOrderItem,
  RecoveryOrderItem,
} from '@/models/monitor-obm/Counter'
import { MonitorOBMService } from '@/services/MonitorOBMService'
import { formatUTCDate } from '@/core/helpers/common.helper'
import { numberToString, toFixed } from '@/core/helpers/util'

export default defineComponent({
  name: 'recovery-detail-modal',
  components: { BaseModal },
  props: {
    counterId: {
      type: String,
      default: '',
    },
    recoveryId: {
      type: String,
      default: '',
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      counterOrigin: {} as CounterOrderItem,
      recoveryDetail: {} as RecoveryOrderItem,
      counterDetail: [] as CounterOrderItem[],
    }
  },

  async mounted() {
    this.getCounterOrderById()
    if (this.recoveryId) this.getRecoveryOrder()
  },
  methods: {
    async getCounterOrderById() {
      const counterOder = await MonitorOBMService.getCounterOrderById(
        this.counterId,
      )
      this.counterOrigin = counterOder
      this.recoveryDetail = counterOder.recovery_order
      if (!counterOder.recovery_order_id)
        this.counterDetail.push(this.counterOrigin)
    },
    async getRecoveryOrder() {
      const recoveryOrder = await MonitorOBMService.getRecoveryOrderById(
        this.recoveryId,
      )
      this.counterDetail = recoveryOrder.counter_order
    },
    close() {
      this.$emit('close')
    },
    formatDate(value) {
      if (!value) return ''
      return formatUTCDate(+value, 'YYYY-MM-DD HH:mm:ss')
    },
    formatNumber(value) {
      if (!value) return ''
      return numberToString(toFixed(value))
    },
  },
})
</script>
<style lang="scss">
.recovery-detail-modal {
  max-width: 1200px;
  .modal-content {
    width: 1200px;
  }
}
.item {
  min-width: 200px;
}
</style>
